import React from 'react'
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';

const PopupAlert = ({ open, message, onClose, severty }) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={2000}
            onClose={onClose}
        >
            <Alert severity={severty}>{message}</Alert>
        </Snackbar>
    )
}

export default PopupAlert