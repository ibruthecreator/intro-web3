import * as React from 'react';
import '../App.css'
import { useAccount } from 'wagmi';
import { FormControl } from '@mui/material';
import { useSafe } from '../Services/Safe';
import { InputAdornment, InputLabel, IconButton, Alert, Input, Modal, Button, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function CreateSafe() {
    const { address } = useAccount()
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const { createSafe } = useSafe();
    const [addresses, setAddresses] = React.useState<string[]>([]);
    const [threshold, setThreshold] = React.useState(1);
    const [error, setError] = React.useState<string | undefined>(undefined);
    const [txHash, setTxHash] = React.useState<string | undefined>(undefined);

    const handleCreateSafe = () => {
        setError(undefined)
        setTxHash(undefined)
        
        createSafe(addresses, threshold, (txHash?: string, creationError?: string) => {
            if(creationError) {
                setError(creationError)
                return
            }

            if(txHash) {
                setTxHash(txHash)
            }
        })
    }

    React.useEffect(() => {
        if(address) {
            setAddresses([address])
            setThreshold(1)
        }
    }, [address])

    const handleAddressChange = (value: string, index: number) => {
        let items = [...addresses];
        items[index] = value;
        setAddresses(items)
    }

    const handleThresholdChange = (value: string) => {
        const number = parseInt(value)
        setThreshold(number)
    }

    const addAddress = () => {
        let items = [...addresses];
        items.push('')
        setAddresses(items)
    }

    const removeAddress = (index: number) => {
        let items = [...addresses];
        items.splice(index, 1);
        setAddresses(items)
    }

    const ownerLabel = (index: number) => {
        return "Owner #" + index;
    }

    const transactionURL = (hash: string) => {
        return "https://rinkeby.etherscan.io/tx/" + hash
    }

    return (
        <div>
        <Button fullWidth className="loading-button-custom" id="create-safe-button" onClick={handleOpen}>Create New Safe</Button>
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={style}>
                <FormControl fullWidth>
                    <h2>Create Gnosis Safe</h2>
                    {
                        addresses.map((addressVal, index) => 
                            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                                <InputLabel htmlFor="standard-adornment-password">{ownerLabel(index + 1)}</InputLabel>
                                <Input 
                                    disabled={index == 0} 
                                    className="owner-text-field" 
                                    id="outlined-basic" 
                                    value={addressVal} 
                                    onChange={(e) => handleAddressChange(e.target.value, index)}  
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton disabled={index==0} onClick={() => removeAddress(index)}> 
                                                <CloseIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                        )
                    }

                    <Button id="add-owner-button" onClick={addAddress}>Add Owner</Button>
                    <FormControl>
                        <p className="form-label-custom">Threshold</p>
                        <input id="outline-basic-input" placeholder="Threshold" type="number" min="1" step="1" max={addresses.length} value={threshold} onChange={(e) => handleThresholdChange(e.target.value) }></input>
                    </FormControl>
                    { error &&
                        <Alert className="safe-creation-alert" severity="error">{error}</Alert>
                    }
                    { txHash &&
                        <Alert className="safe-creation-alert" severity="success">Creation of Gnosis safe successful.<br />Transaction hash: <a href={transactionURL(txHash)} target="_blank">{txHash}</a></Alert>
                    }
                    <Button className="loading-button-custom" variant="contained" onClick={handleCreateSafe}>Create</Button>
                </FormControl>
                
            </Box>
        </Modal>
        </div>
    );
}

export default CreateSafe;