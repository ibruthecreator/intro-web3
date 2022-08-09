import React from 'react';
import { ethers } from 'ethers';
import { useSendTransaction, usePrepareSendTransaction } from 'wagmi'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import '../App.css';

function SendTransaction() {
    const [address, setAddress] = React.useState('');
    const [value, setValue] = React.useState(0.0);

    const { config } = usePrepareSendTransaction({
        request: { to: address, value: ethers.utils.parseEther(String(value)) },
    })
    const { data, isLoading, isSuccess, sendTransaction } = useSendTransaction(config)

    const didChangeValue = (value: string) => {
        if(value.trim() == '') {
            setValue(0.0)
        } else {
            const float = parseFloat(value)
            if(float == NaN) {
                setValue(0.0)
            } else {
                setValue(float)
            }
        }
    }

    return (
        <Box
            id="send-transaction-box"
            component="form"
            sx={{
            '& > :not(style)': { width: '100%' },
            }}
            noValidate
            autoComplete="off"
        >
            <h3>Send Ethereum</h3>
            <TextField id="outlined-basic" label="Value (ETH)" variant="outlined" onChange={e => didChangeValue(e.target.value)} /><br />
            <TextField id="outlined-basic" label="Ethereum Address" variant="outlined" onChange={e => setAddress(e.target.value)} /><br />
            <LoadingButton className="loading-button-custom" loading={isLoading} loadingIndicator="Check Wallet" disabled={!sendTransaction} variant="contained" onClick={() => sendTransaction?.()}>Send</LoadingButton>
        </Box>
    )
}

export default SendTransaction;