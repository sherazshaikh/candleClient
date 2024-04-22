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
import { setResetPasswordFalse, setResetPasswordTrue } from '../../pages/redux/features/session/sessionslice';
import Input from '../Input/Input';
import { FormControl, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import { executeApi } from '../../utils/WithAuth';
import { variables } from '../../utils/config';
import PopupAlert from '../PopupAlert/PopupAlert';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      // width: "30%",
    },
  },
};


function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}


export default function ResponsiveDialog() {
  const { resetPassword } = useSelector(state => state.sessionExpired)
  const [names, setName] = React.useState([]);
  let { baseURL, auth: { token, user } } = useSelector((state) => state);
  const [buttonDis, setButtonDis] = React.useState(false)
  const [personName, setPersonName] = React.useState([user?.userEmail]);
  const [newPass, setNewPass] = React.useState("");
  const [CPass, setCPass] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [severty, setSeverty] = React.useState("");
  const [showPopup, setShowPopup] = React.useState(false);

  const theme = useTheme();
  const dispatch = useDispatch();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClose = () => {
    setButtonDis(true);
    if (newPass !== CPass) {
      setSeverty("error");
      setMessage("New Password & Confirm Password must be same!");
      setShowPopup(true);
      setButtonDis(false)
    } else {
      executeApi(baseURL + variables.ResetPassword.url + `?userEmail=${personName[0]}&newPassword=${newPass}`, {}, variables.ResetPassword.method, token, dispatch)
        .then((data) => {
          if (data.success) {
            setSeverty("success");
            setMessage(data.message);
            dispatch(setResetPasswordFalse())
            setShowPopup(true);
            setButtonDis(false)

          } else {
            setSeverty("error");
            setMessage(data.message);
            setShowPopup(true);
            setButtonDis(false)

          }
        })
        .catch((error) => console.log(error.message));
      dispatch(setResetPasswordTrue());
    }
  };

  const handleCloseD = () => {
    dispatch(setResetPasswordFalse())
  }

  React.useEffect(() => {
    console.log(personName);
  }, [personName])

  const getAllNames = () => {
    executeApi(baseURL + variables.GetAllUsers.url, {}, variables.GetAllUsers.method, token, dispatch)
      .then((data) => setName(data.data.map((item) => item.userEmail)))
      .catch((error) => console.log(error.message));

  }

  React.useEffect(() => {
    if (token && user?.isAdmin) {
      console.log('user', token, user.isAdmin)
      getAllNames();
    } else {
      setName([user?.userEmail])
      setPersonName([user?.userEmail])

    }
    setCPass('')
    setNewPass('')
  }, [])

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <React.Fragment>
      <Dialog
        fullScreen={fullScreen}
        open={resetPassword}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >

        <DialogTitle id="responsive-dialog-title">
          {"Wanted to create a new password?"}
        </DialogTitle>
        <DialogContent>
          <FormControl sx={{ m: 1, width: "95%" }}>
            <InputLabel id="demo-multiple-name-label">Email</InputLabel>
            <Select
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              value={personName[0]}
              disabled={!user?.isAdmin}
              onChange={handleChange}
              input={<OutlinedInput label="Name" />}
              MenuProps={MenuProps}
            >
              {names.map((name) => (
                <MenuItem
                  key={name}
                  value={name}
                  style={getStyles(name, personName, theme)}
                >
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Input type="password" placeholder="New Password" setValue={setNewPass} value={newPass} />
          <Input placeholder="Confirm New Password" type="password" setValue={setCPass} value={CPass} />
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={handleCloseD} style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#e46e39", textAlign: "center", border: "1px solid #e46e39" }} >
            Close
          </Button>
          <Button variant='contained' onClick={handleClose} disabled={buttonDis} style={{ color: "#fff", backgroundColor: "#e46e39" }} autoFocus>
            Update Password
          </Button>
        </DialogActions>
      </Dialog>
      <PopupAlert open={showPopup} message={message} severty={severty} onClose={handleClosePopup} />

    </React.Fragment>
  );
}