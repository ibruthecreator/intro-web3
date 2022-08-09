import React, { useEffect } from 'react';
import { ethers } from 'ethers';
import EthersAdapter from '@gnosis.pm/safe-ethers-lib';
import Safe, { SafeFactory, SafeAccountConfig, RemoveOwnerTxParams } from '@gnosis.pm/safe-core-sdk'
import { useAccount, useSigner } from 'wagmi';

interface SafeTransactionSafesListResponse {
    safes:  string[];
}  

function useSafe() {
    const { data: signer } = useSigner()
    const { address } = useAccount()

    const [ethAdapter, setEthAdapter] = React.useState<EthersAdapter>()
    const [safeSdk, setSafeSdk] = React.useState<Safe>()
    const [safeOwners, setSafeOwners] = React.useState<string[]>([])
    const [safeAddresses, setSafeAddresses] = React.useState<string[]>([])

    useEffect(() => {
        if(signer) {
            const ethAdapter = new EthersAdapter({
                ethers,
                signer: signer
            })
            setEthAdapter(ethAdapter)
        }
    }, [signer])

    useEffect(() => {
        if(address) {
            fetch(`https://safe-transaction.rinkeby.gnosis.io/api/v1/owners/${address}/safes/`)
                .then(res => res.json())
                .then(res => res as SafeTransactionSafesListResponse)
                .then(res => {
                    setSafeAddresses(res.safes);
                    console.log("safes:" + res.safes)
                })
        }
    }, [address])

    useEffect(() => {
        // declare the data fetching function
        const fetchOwners = async () => {
            if(safeSdk) {
                const owners = await safeSdk.getOwners();
                return owners;
            }
        }

        fetchOwners()
            .then(res => {
                if(res) {
                    setSafeOwners(res)
                }
            })
    }, [safeSdk])

    const createSafe = async (owners: string[], threshold: number, callback: (txHash?: string, error?: string) => void) => {
        if(signer) {
            const ethAdapter = new EthersAdapter({
                ethers,
                signer: signer
            })

            const safeFactory = await SafeFactory.create({ ethAdapter })

            const safeAccountConfig: SafeAccountConfig = {
                owners: owners,
                threshold: threshold,
            }

            try {
                const safe = await safeFactory.deploySafe({ safeAccountConfig: safeAccountConfig, callback: (txHash: string) => {
                    callback(txHash, undefined)
                }})
                setSafeSdk(safe)
                return safe
            } catch(e) {
                callback(undefined, (e as Error).message)
            }
        }
    }

    // Method called to "set" the safe that we are editing or working with before proceeding with any other transactions
    const setSafe = async (safeAddress: string) => {
        if(ethAdapter) {
            const safeSdk = await Safe.create({ ethAdapter, safeAddress })
            setSafeSdk(safeSdk)
        }
    }

    const removeOwner = async (ownerAddress: string) => {
        if(safeSdk) {
            const params: RemoveOwnerTxParams = {
                ownerAddress
            }
            const safeTransaction = await safeSdk.getRemoveOwnerTx(params)
            const txResponse = await safeSdk.executeTransaction(safeTransaction)
            await txResponse.transactionResponse?.wait()
        } else {
            console.log("You must set the safe you are working with by using the `useSafe(safeAddress: string)` hook")
        }
    }

    return { safeSdk, setSafe, removeOwner, safeOwners, createSafe, safeAddresses }
}

export { useSafe };