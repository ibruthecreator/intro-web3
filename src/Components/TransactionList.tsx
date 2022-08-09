import React, { Component } from 'react';
import '../App.css';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

interface Transaction {
    blockNumber:       string;
    timeStamp:         string;
    hash:              string;
    nonce:             string;
    blockHash:         string;
    transactionIndex:  string;
    from:              string;
    to:                string;
    value:             string;
    gas:               string;
    gasPrice:          string;
    isError:           string;
    txreceipt_status:  string;
    input:             string;
    contractAddress:   string;
    cumulativeGasUsed: string;
    gasUsed:           string;
    confirmations:     string;
    methodId:          string;
    functionName:      string;
}

interface FetchTransactionResponse {
    status:  string;
    message: string;
    result:  Transaction[];
}  

function TransactionList() {

    const { isConnected, address } = useAccount()
    const [transactions, setTransactions] = React.useState<Transaction[] | undefined>(undefined);
    
    React.useEffect(() => {
        fetch(`https://api-rinkeby.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=J7WC2IRU6KQSX5861PKBX732YUDW7R2IV8`)
            .then(res => res.json())
            .then(res => res as FetchTransactionResponse)
            .then(res => {
                const results = res.result.map(transaction => {
                    transaction.value = ethers.utils.formatEther(transaction.value);
                    return transaction;
                });
                res.result = results;
                return res;
            })
            .then(res => {
                setTransactions(res.result);
            })
    }, [isConnected, address]);

    const transactionURL = (hash: string) => {
        return "https://rinkeby.etherscan.io/tx/" + hash
    }

    return (
        <div id="transaction-list">
            <h3>Recent Transactions</h3>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Hash</TableCell>
                        <TableCell>From</TableCell>
                        <TableCell>To</TableCell>
                        <TableCell>Value</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {transactions?.map(transaction =>
                        <TableRow
                        key={transaction.nonce}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell component="th" scope="row">
                        <a href={transactionURL(transaction.hash)} target="_blank">
                            {transaction.hash}
                        </a>
                        </TableCell>
                        <TableCell>{transaction.from}</TableCell>
                        <TableCell>{transaction.to}</TableCell>
                        <TableCell>{transaction.value} { ethers.constants.EtherSymbol }</TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}


export default TransactionList;