import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import '../App.css';

import {
    useAccount,
    useConnect,
} from 'wagmi'

function LoginPrompt() {
    const { connect, connectors, isLoading, pendingConnector } = useConnect()

    return (
        <Box
            id="login-box"
            component="form"
            sx={{
            '& > :not(style)': { m: 1, width: '100%' },
            }}
            noValidate
            autoComplete="off"
        >
            {connectors.map((connector) => (
                <div>
                    <Button
                        className="button-custom"
                        variant="contained"
                        disabled={!connector.ready}
                        key={connector.id}
                        onClick={() => connect({ connector })}
                    >
                    Login with {connector.name}
                    {!connector.ready && ' (unsupported)'}
                    { isLoading &&
                        connector.id === pendingConnector?.id &&
                        ' (Connecting)' }
                    </Button>
                </div>
            ))}
        </Box>
    )
}

export default LoginPrompt;