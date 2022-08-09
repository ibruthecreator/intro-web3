import React from 'react';
import { FormControl, Box, Button, InputLabel, Input, InputAdornment, IconButton } from '@mui/material';
import { useSafe } from '../Services/Safe';
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

type EditSafeProps = {
    safeAddress: string
}

function EditSafe(props: EditSafeProps) {

    const ownerLabel = (index: number) => {
        return "Owner #" + index;
    }

    const { safeSdk, setSafe, removeOwner } = useSafe();
    const [safeOwners, setSafeOwners] = React.useState<string[]>([])

    React.useEffect(() => {
        // declare the data fetching function
        const fetchOwners = async () => {
            if(safeSdk) {
                await setSafe(props.safeAddress)
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
    })

    return (
        <Box sx={style}>
            <FormControl fullWidth>
                <h2>Create Gnosis Safe</h2>
                {
                    safeOwners.map((addressVal, index) => 
                        <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                            <InputLabel htmlFor="standard-adornment-password">{ownerLabel(index + 1)}</InputLabel>
                            <Input 
                                disabled
                                className="owner-text-field" 
                                id="outlined-basic" 
                                value={addressVal}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton disabled={index==0} onClick={() => removeOwner(addressVal)}> 
                                            <CloseIcon />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                    )
                }

                <Button id="add-owner-button">Add Owner</Button>
                <Button className="loading-button-custom" variant="contained">Create</Button>
            </FormControl>
            
        </Box>
    );
}

export default EditSafe;