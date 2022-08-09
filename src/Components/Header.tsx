import { useBalance } from 'wagmi'
import { ethers } from 'ethers';
import {
    useAccount,
    useConnect,
    useDisconnect,
    useEnsName,
} from 'wagmi'

function Header() {
    const { address, connector, isConnected } = useAccount()
    const { data: ensName } = useEnsName({ address })  
    const { disconnect } = useDisconnect()
    const { data } = useBalance({
        addressOrName: address,
    });

    if(connector && isConnected) {
        return (
            <div id="header">
                <div id="status-section">
                    <div id="status">
                        <h3>Connected to Ethereum Rinkeby Tesnet | {connector.name}</h3>
                        <h3 id="address">{ensName ? `${ensName} (${address})` : address}</h3>
                    </div>
                    <div id="actions">
                        <button id="disconnect" onClick={async () => { disconnect() }}>Disconnect</button>
                    </div>
                </div>
                <div id="balance-section">
                    { data?.formatted } { ethers.constants.EtherSymbol }
                </div>
            </div>
        );
    }

    return (
        <h3>Not logged in</h3>
    )
}

export default Header;