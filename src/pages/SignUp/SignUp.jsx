import { Grid, Typography } from '@mui/material'
import React, { useState } from 'react'
import logo from '../../assets/Group 154.webp'
import Input from '../../components/Input/Input'
import Button from '../../components/Button/Button'
import './SignUp.css'
import Box from '@mui/material/Box';
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { executeApi } from '../../utils/WithAuth'
import { useDispatch, useSelector } from 'react-redux'
import { variables } from '../../utils/config'
import PopupAlert from '../../components/PopupAlert/PopupAlert'
import { useNavigate } from 'react-router-dom'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import SignupSuccessCard from '../../components/Card/SignupSuccessCard'
import * as EmailValidator from 'email-validator';


const steps = [
  {
    label: 'We Started',
    year: "1975"
  },
  {
    label: 'A New Beginning',
    description:
      "In '1980s the company opened a second facility. The facility added different processes such as Doubling, Twisting and Braiding. This was also the start of our venture into sewing threads with primary focus being coton thread.",

    year: "1980"
  },
  {
    label: 'More Services',
    year: "1990"
  },
  {
    label: 'Opening New Doors',
    year: "2003"
  }
];


const SignUp = () => {
  const [loadingState, setLoadingState] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  let baseUrl = useSelector((state) => state.baseURL);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [severty, setSeverty] = useState("");
  const dispatch = useDispatch()

  const [userInfo, setUserInfo] = useState({
    UserId: "",
    UserEmail: "",
    UserPassword: "",
    FirstName: "",
    LastName: "",
    CompanyName: "",
    PhoneNumber: "",
    NoOfMachines: "",
    Address: "",
    Cnic: "",
    Ntn: "",
    Strn: ""
  });

  const handleSSNChange = (event) => {
    const value = event.replace(/\D/g, '').slice(0, 13); // Keep only digits and limit length
    setUserInfo({ ...userInfo, Strn: value }); // Apply the mask
  };

  const handleCNICChange = (event) => {

    const value = event.replace(/^[0-9]{5}-[0-9]{7}-[0-9]$/).slice(0,13); // Keep only digits and limit length
    setUserInfo({ ...userInfo, Cnic: value }); // Apply the mask
  };

  const handleNTNChange = (event) => {
    const value = event.slice(0, 9); // Keep only digits and limit length
    let inputValue = event;

    // Remove non-numeric characters
    inputValue = inputValue.replace(/[^a-zA-Z0-9]/g, '');

    if(inputValue.length > 1){
      let inputValue1 = inputValue.slice(1, inputValue.length).replaceAll(/\D/g, '')
      inputValue = inputValue[0] + inputValue1
    }

    // Apply custom mask (xxxxxxx-x)
    if (inputValue.length <= 7) {
      setUserInfo({ ...userInfo, Ntn: inputValue }); // Apply the mask
      // setValue(inputValue);
    } else if (inputValue.length === 8 && !inputValue.includes('-')) {
      // Insert hyphen after the seventh character
      setUserInfo({ ...userInfo, Ntn: inputValue.slice(0, 7) + '-' + inputValue.slice(7) }); // Apply the mask
      // setValue();
    } else if (inputValue.length === 8) {
      setUserInfo({ ...userInfo, Ntn: inputValue.slice(0, 7) }); // Apply the mask

    }
  };

  const completeSignup = () => {
    console.log(userInfo);
    setLoadingState(true);
    if (!userInfo.UserEmail || !userInfo.Address || !userInfo.FirstName || !userInfo.LastName || !userInfo.PhoneNumber || !userInfo.UserEmail || !userInfo.PhoneNumber || !userInfo.CompanyName || !userInfo.UserPassword) {
      setSeverty("error");
      setMessage("Please fill all the required fields!");
      setShowPopup(true);
      setLoadingState(false)
    }
    else {

      if (!EmailValidator.validate(userInfo.UserEmail)) {
        console.log("API call if");
        setSeverty("error");
        setMessage("Please enter a valid email address!");
        setShowPopup(true);
        setLoadingState(false)
      } else if (userInfo.Cnic.length != 13 && userInfo.Cnic.length > 0) {
        setSeverty("error");
        setMessage("CNIC length must be 13 digits!");
        setShowPopup(true);
        setLoadingState(false)
      } else if (userInfo.Ntn.length != 9 && userInfo.Ntn.length > 0  ) {
        setSeverty("error");
        setMessage("NTN length must be 9 digits!");
        setShowPopup(true);
        setLoadingState(false)
      } else if (userInfo.Strn.length != 13 && userInfo.Strn.length > 0 ) {
        setSeverty("error");
        setMessage("STRN length must be 13 digits!");
        setShowPopup(true);
        setLoadingState(false)
      } 
      else if (userInfo.PhoneNumber.length != 12){
        setSeverty("error");
        setMessage("Phone Number length must be 11 digits!");
        setShowPopup(true);
        setLoadingState(false)  
      }
      else {
        console.log("API call");
        executeApi(baseUrl + variables.signup.url, userInfo, variables.signup.method, null, dispatch)
          .then(data => {
            console.log('API response:', data.success == 'true');
            setSeverty(data.success ? "success" : "error");
            setMessage(data.message);
            setLoadingState(false);
            if (data.success) {
              setShowSuccess(true)
            }
            setShowPopup(true);
          })
          .catch(error => {
            console.error('Error:', error.message);
            setSeverty("error");
            setMessage(error.message);
            setShowPopup(true);
            setLoadingState(false)
          });
      }
    }
  }

  const handleFirstName = (event) =>{
    setUserInfo({ ...userInfo, FirstName: event.replaceAll(/[^a-zA-Z]/gi, '')})
  }

  const handleLastName = (event) =>{
    setUserInfo({ ...userInfo, LastName: event.replaceAll(/[^a-zA-Z]/gi, '')})
  }

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      {
        !showSuccess ?

          (<Grid container className='signUpPage' >
            <Grid container item md={7.5} sm={12} xs={12} >
              <Grid item md={2} sm={1} xs={1} ></Grid>
              <Grid item container md={10} sm={11} xs={11} >
                <Grid item xs={12} className='signUpLogoSection' >
                  <img onClick={() => navigate("/")} src={logo} alt='Candle logo' height='60px' />
                </Grid>
                <Grid item container xs={12} className='signUpSectionFoam'>
                  <Typography variant='h4' >
                    Let’s begin our partnership. Signup!
                  </Typography>
                  <Grid item container md={12} sm={12} xs={12} columnSpacing={1} >
                    <Grid item md={5} sm={5.5} xs={10} >
                      <Input value={userInfo.FirstName} setValue={handleFirstName} type="text" placeholder="First Name" />
                    </Grid>
                    <Grid item md={5} sm={5.5} xs={10} >
                      <Input value={userInfo.LastName} setValue={handleLastName} type="text" placeholder="Last Name" />
                    </Grid>
                    <Grid item md={5} sm={5.5} xs={10} >
                      <Input value={userInfo.CompanyName} type="text" setValue={(e) => setUserInfo({ ...userInfo, CompanyName: e })} placeholder="Company Name" />
                    </Grid>
                    <Grid item md={5} sm={5.5} xs={10} sx={{ marginTop: { xs: "5px" }, marginBottom: { xs: "5px" } }} className="flex"  >
                      {/* <Input value={userInfo.PhoneNumber} setValue={(e) => setUserInfo({ ...userInfo, PhoneNumber: e })} type="number" placeholder="Phone No" /> */}
                      <PhoneInput
                        inputStyle={{ width: "98%", border: "none", fontSize: "15px" }}
                        buttonStyle={{ border: "none" }}
                        searchStyle={{ boxShadow: "0 3px 6px 0 rgba(0, 0, 0, 0.04)" }}
                        country={'pk'}
                        // searchStyle={}
                        disableDropdown={true}
                        countryCodeEditable={false}
                        onlyCountries={['pk']}
                        value={userInfo.PhoneNumber}
                        onChange={phone => {
                          console.log(phone);
                          setUserInfo({ ...userInfo, PhoneNumber: phone })}}
                      />
                    </Grid>
                    <Grid item md={5} sm={5.5} xs={10} >
                      <Input value={userInfo.UserEmail} type="email" setValue={(e) => setUserInfo({ ...userInfo, UserEmail: e })} placeholder="Email Address" />
                    </Grid>
                    <Grid item md={5} sm={5.5} xs={10} >
                      <Input value={userInfo.NoOfMachines} setValue={(e) => setUserInfo({ ...userInfo, NoOfMachines: e })} type="number" placeholder="No of Machines" />
                    </Grid>
                    <Grid item md={5} sm={5.5} xs={10} >
                      <Input value={userInfo.Address} setValue={(e) => setUserInfo({ ...userInfo, Address: e })} type="text" placeholder="Address" />
                    </Grid>
                    <Grid item md={5} sm={5.5} xs={10} >
                      <Input value={userInfo.Cnic} setValue={handleCNICChange} type="text" placeholder="CNIC#" />
                    </Grid>
                    <Grid item md={5} sm={5.5} xs={10} >
                      <Input value={userInfo.Ntn} type="text" setValue={handleNTNChange} placeholder="NTN" />
                    </Grid>
                    <Grid item md={5} sm={5.5} xs={10} >
                      <Input type="text" value={userInfo.Strn} setValue={handleSSNChange} placeholder="STRN" />
                    </Grid>
                    <Grid item md={9.5} sm={10.4} xs={9} >
                      <Input value={userInfo.UserPassword} type="password" className='width100' setValue={(e) => setUserInfo({ ...userInfo, UserPassword: e })} placeholder="Password" />
                    </Grid>
                    <Grid item md={5} xs={5} >
                      <Button buttonName={"SignUp"} loadingState={loadingState} onClick={completeSignup} />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} className='signUpSectionExisted'  >
                  <Typography variant='body1'>I already have an account! <b onClick={() => navigate("/signin")} style={{ textDecoration: "underline", cursor: "pointer" }} >Sign in</b></Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid container item md={4.5} sm={4.5} sx={{ display: { md: "flex", sm: 'none', xs: 'none' } }} className='signUpPageBack flex' >
              <Box sx={{ maxWidth: '75%', height: "100vh" }} className="flex" >
                <Timeline sx={{
                  [`& .${timelineItemClasses.root}:before`]: {
                    flex: 0,
                    padding: 0,
                  }
                }} >
                  {
                    steps.map((item) => (
                      <TimelineItem>
                        <TimelineSeparator>
                          <TimelineConnector />
                          <TimelineDot />
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                          <Typography variant='h6' color={'white'} >{item.label}</Typography>
                          <Typography variant='h4' color={'#e46e39'} >{item?.year}</Typography>
                          <Typography variant='p' color={'white'} >{item?.description}</Typography>
                        </TimelineContent>
                      </TimelineItem>
                    ))
                  }

                </Timeline>
              </Box>
            </Grid>
            <PopupAlert open={showPopup} message={message} severty={severty} onClose={handleClosePopup} />
          </Grid>) :
          (<SignupSuccessCard />)}
    </>
  )
}

export default SignUp