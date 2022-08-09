import React from 'react';
import CreateSafe from './CreateSafe';
import { Box, Button, Modal } from '@mui/material';
import { useSafe } from '../Services/Safe';
import EditSafe from './EditSafe'

function SafeList() {
    const { setSafe, safeSdk, safeAddresses } = useSafe()
    const [modalOpen, setModalOpen] = React.useState(false)
    const [selectedSafe, setSelectedSafe] = React.useState('')

    const selectSafe = async (safeAddress: string) => {
        setSelectedSafe(safeAddress)
        setModalOpen(true)
    }

    return (
        <Box id="safe-list-box">
            <h3 >Gnosis Safes</h3>
            { safeAddresses.map(address => 
               <Button fullWidth sx={{ py: 1, px: 2, mb: 2 }} onClick={() => selectSafe(address)}>
                    <h3>rin:{address}</h3>
               </Button>
            )}

            <Modal
                open={modalOpen}
            >
                <EditSafe safeAddress={selectedSafe} />
            </Modal>
            <CreateSafe />
        </Box>
    )
}

export default SafeList;