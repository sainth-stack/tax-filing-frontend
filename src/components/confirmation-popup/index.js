import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const ConfirmationPopup = ({ openDialog, handleConfirmAssign, handleClose, title, desc }) => {
    return (
        <Dialog open={openDialog} onClose={handleClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <p>{desc}</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleConfirmAssign} color="primary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmationPopup