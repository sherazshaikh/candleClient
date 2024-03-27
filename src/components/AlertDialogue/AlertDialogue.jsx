import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useDispatch, useSelector } from 'react-redux';
import { setSessionFlase } from '../../pages/redux/features/session/sessionslice';
import { logout } from '../../pages/redux/features/auth/authSlice';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide() {
    const {sessionExpired} = useSelector((state) => state.sessionExpired)
  const dispatch = useDispatch();


  const handleClose = () => {
    dispatch(setSessionFlase());
    dispatch(logout());
  };

  return (
    <React.Fragment>
      <Dialog
        open={sessionExpired}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Session Expired !"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Your Session is expired! Kindly loggedIn again to continue.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Click Here to LOGIn</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}