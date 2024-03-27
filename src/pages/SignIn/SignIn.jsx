import { Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import './SignIn.css'
import logo from '../../assets/Group 154.webp'
import Input from '../../components/Input/Input'
import Button from '../../components/Button/Button'
import Checkbox from '@mui/material/Checkbox';
import userIcon from "../../assets/002-user.svg";
import lockIcon from "../../assets/001-forgot.svg";
import { executeApi } from '../../utils/WithAuth';
import { variables } from '../../utils/config'
import { useDispatch, useSelector } from 'react-redux'
import PopupAlert from '../../components/PopupAlert/PopupAlert'
import { login } from '../redux/features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import { setForgetPasswordTrue } from '../redux/features/session/sessionslice'
import { updateCart } from '../redux/features/cart/cartslice'
import { v4 } from 'uuid'

const SignIn = () => {

  let baseUrl = useSelector((state) => state.baseURL);
  const [showPopup, setShowPopup] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const dispatch = useDispatch();
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [message, setMessage] = useState("");
  const [severty, setSeverty] = useState("");
  const navigate = useNavigate();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      // Call your function here
      reqSignin();
    }
  };


  const reqSignin = () => {
    if (username == "" || pass == "") {
      setSeverty("error");
      setMessage("Email and Password is required to SignIn !");
      setShowPopup(true);
    }
    else {
      setLoadingState(true);
      executeApi(baseUrl + variables.signin.url, { userEmail: username, password: pass }, variables.signin.method, null, dispatch)
        .then(data => {
          setSeverty(data.success ? "success" : "error");
          setMessage(data.message);
          setLoadingState(false);
          setShowPopup(true);
          if (data.success) {
            console.log("success");
            executeApi(baseUrl + variables.getCart.url, {}, variables.getCart.method, data.data.token, dispatch)
              .then((data) => {
                var finalObject = data.data.map((item) => {
                  let jsonData = item;
                  let dataArray = jsonData.shadecodelist.split('OBJEND');
                  dataArray.pop();
                  // Map the array elements back into objects
                  let parsedArray = dataArray.map(item => {
                    let [shadeCode, shadeDesc] = item.split('BTWOBJ');
                    return { shadeCode, shadeDesc };
                  });
                  return {
                    "LottypeCode": { label: jsonData.lottypecode.split("BTWOBJ")[0], value: jsonData.lottypecode.split("BTWOBJ")[1], HsCode: jsonData.lottypecode.split("BTWOBJ")[2] },
                    "shade": parsedArray,
                    "ShadeCode": { label: jsonData.shadecode.split("BTWOBJ")[0], value: jsonData.shadecode.split("BTWOBJ")[1] },
                    "yardage": jsonData.yardagelist.split("BTWOBJ"),
                    "selectedYardage": { label: jsonData.yardage.split("BTWOBJ")[0], value: jsonData.yardage.split("BTWOBJ")[1], HsCode: jsonData.yardage.split("BTWOBJ")[2] },
                    "OrderQty": jsonData.qty,
                    "price": 0,
                    "uuid": v4()
                  }
                });

                dispatch(updateCart(finalObject))
              })
              .catch((err) => {
                console.log(err)
              })
            dispatch(login(data.data));
          }
        })
        .catch(error => {
          console.error('Error:', error);
          setSeverty("error");
          setMessage(error.message);
          setShowPopup(true);
          setLoadingState(false)
        });
    }

  }

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const openForgetDialogue = () => {
    dispatch(setForgetPasswordTrue())
  }

  return (
    <>
      <Grid container className='signInPage' >
        <Grid container item md={8} sm={8} xs={12} >
          <Grid item md={1} sm={1} xs={0.25} ></Grid>
          <Grid item container md={11} sm={11} xs={11.5} >
            <Grid item onClick={() => navigate("/")} md={12} className='signInLogoSection' >
              <img src={logo} height='60px' />
            </Grid>
            <Grid item container md={12} xs={12} className='signInSectionFoam'>
              <Typography variant='h4' >
                Welcome to Candle Thread.
              </Typography>
              <Grid item container md={12} >
                <Grid item md={7} sm={9} xs={10.5} className='custom-input-container' >
                  <Input onKeyPress={handleKeyPress} type="email" value={username} setValue={setUsername} placeholder="Email Address" />
                  <span className="custom-icon">
                    <img src={userIcon} alt="icon" />
                  </span>
                </Grid>
                <Grid item md={5} ></Grid>
                <Grid item md={7} sm={9} xs={10.5} className='custom-input-container' >
                  <Input onKeyPress={handleKeyPress} type="password" placeholder="Password" value={pass} setValue={setPass} />
                  <span className="custom-icon">
                    <img src={lockIcon} alt="icon" />
                  </span>
                </Grid>
                <Grid item md={5} ></Grid>
                <Grid container item md={7} sm={10} xs={12} >
                  <Grid item md={6} sm={6} xs={screenWidth > 320 ? 6 : 12} >
                    <Typography variant='body2' ><Checkbox {...label} defaultChecked />Remember me</Typography>
                  </Grid>
                  <Grid item md={6} sm={6} xs={screenWidth > 320 ? 6 : 12} style={{ textAlign: "right", display: "flex", cursor: "pointer", justifyContent: screenWidth > 320 ? "flex-end" : "flex-start", paddingRight: "0%", alignItems: "center", alignContent: "center", paddingLeft: "10px" }} >
                    <Typography variant='body2' onClick={() => openForgetDialogue()} >Forgot Password?</Typography>
                  </Grid>
                </Grid>
                <Grid item md={5} xs={0} ></Grid>

                <Grid item md={5} sm={9} xs={12} >
                  <Button onClick={reqSignin}  buttonName={"Sign In"} loadingState={loadingState} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={12} className='signInSectionExisted'  >
              <Typography variant='body1'>I don't have an account! <b onClick={() => navigate("/signup")} style={{ textDecoration: "underline", cursor: "pointer" }} >Sign up</b></Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid container item md={4} sm={4} sx={{ display: { xs: 'none', sm: 'block' } }} className='signInPageBack flex' ></Grid>
      </Grid>
      <PopupAlert open={showPopup} message={message} severty={severty} onClose={handleClosePopup} />
    </>
  )
}

export default SignIn