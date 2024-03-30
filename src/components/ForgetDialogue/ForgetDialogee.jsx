// ForgetDialogee


import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { setForgetPasswordFalse, setForgetPasswordTrue, setResetPasswordFalse, setResetPasswordTrue } from '../../pages/redux/features/session/sessionslice';
import Input from '../Input/Input';
import { executeApi } from '../../utils/WithAuth';
import { variables } from '../../utils/config';
import PopupAlert from '../PopupAlert/PopupAlert';


export default function ForgetDialogee() {
  const { forgetPassword } = useSelector(state => state.sessionExpired)
  let { baseURL, auth: { token, user } } = useSelector((state) => state);
  const [buttonDis, setButtonDis] = React.useState(false)
  const [email, setEmail] = React.useState("");
  const [newPass, setNewPass] = React.useState("");
  const [cnic, setCNIC] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [severty, setSeverty] = React.useState("");
  const [showPopup, setShowPopup] = React.useState(false);

  const theme = useTheme();
  const dispatch = useDispatch();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleCloseD = () => {
    setEmail("");
    setNewPass("");
    setCNIC("");
    dispatch(setForgetPasswordFalse())

  }

  const handleClose = () => {
    if(cnic?.length !== 13){
      setSeverty("error");
      setMessage("CNIC length must be 13 digits!");
      console.log("length,", cnic?.length)
      setShowPopup(true);
      // setButtonDis(false)
      return null
    }
    setButtonDis(true);
    if (!newPass || !email || !cnic) {
      setSeverty("error");
      setMessage("Please fill all the fields!");
      setShowPopup(true);
      setButtonDis(false)
    } else {
      executeApi(baseURL + variables.ForgetPassword.url + `?userEmail=${email}&newPassword=${newPass}&cnic=${cnic}`, {}, variables.ForgetPassword.method, token, dispatch)
        .then((data) => {
          if (data.success) {
            setSeverty("success");
            setMessage(data.message);
            dispatch(setForgetPasswordFalse())
            setShowPopup(true);
            setButtonDis(false)
            setEmail("");
            setNewPass("");
            setCNIC("");

          } else {
            setSeverty("error");
            setMessage(data.message);
            setShowPopup(true);
            setButtonDis(false)
            setEmail("");
            setNewPass("");
            setCNIC("");

          }
        })
        .catch((error) => console.log(error.message));
      dispatch(setForgetPasswordTrue());
    }
  };

  const handleCNICChange = (event) => {

    const value = event.replace(/\D/g, '').slice(0, 13); // Keep only digits and limit length
    setCNIC(value); // Apply the mask
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setEmail("");
    setNewPass("");
    setCNIC("");
  };

  return (
    <React.Fragment>
      <Dialog
        fullScreen={fullScreen}
        open={forgetPassword}
        aria-labelledby="responsive-dialog-title"
      >

        <DialogTitle id="responsive-dialog-title">
          {"Fill the required details for a Password Reset!"}
        </DialogTitle>
        <DialogContent>
          <Input  placeholder="CNIC" setValue={handleCNICChange} value={cnic} />
          <Input type="text" placeholder="Email" setValue={setEmail} value={email} />
          <Input placeholder="New Password" type="password" setValue={setNewPass} value={newPass} />
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={handleCloseD} style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#e46e39", textAlign: "center", border: "1px solid #e46e39" }} >
            Close
          </Button>
          <Button variant='contained' onClick={handleClose} disabled={buttonDis} style={{ color: "#fff", backgroundColor: "#e46e39" }} autoFocus>
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>
      <PopupAlert open={showPopup} message={message} severty={severty} onClose={handleClosePopup} />

    </React.Fragment>
  );
}