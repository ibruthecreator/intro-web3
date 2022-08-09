import {
    useAccount
} from 'wagmi';

import LoginPrompt from './LoginPrompt';
import TransactionList from './TransactionList';
import Header from './Header';
import SendTransaction from './SendTransaction';
import SafeList from './SafeList'
import { Grid } from '@mui/material';

function Home() {
    const { address, isConnected } = useAccount()
    
    if (!isConnected) {
        return (
            <LoginPrompt />
        );
    }

    return (
        <div>
            <Header />
            <Grid container spacing={2}>
                <Grid item md={6}>
                    <SendTransaction />
                </Grid>
                <Grid item md={6}>
                    <SafeList />
                </Grid>
            </Grid>
            <TransactionList />
        </div> 
    )
}

export default Home;