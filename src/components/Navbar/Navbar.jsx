import { Badge, Grid, List, ListItem, ListItemButton, ListItemText, SwipeableDrawer } from '@mui/material'
import React, { useEffect, useState } from 'react'
import './navbar.css';
import { useDispatch, useSelector } from 'react-redux'
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Logout from '@mui/icons-material/Logout';
import { logout } from '../../pages/redux/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import KeyIcon from '@mui/icons-material/Key';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import GradingIcon from '@mui/icons-material/Grading';
import { setResetPasswordTrue } from '../../pages/redux/features/session/sessionslice';
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { variables } from '../../utils/config';
import { executeApi } from '../../utils/WithAuth';
import { v4 } from 'uuid';
import { updateCart } from '../../pages/redux/features/cart/cartslice';
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

const Navbar = () => {

  const user = useSelector((state) => state.auth.isAuthenticated);
  const userData = useSelector((state) => state.auth.user);
  const userName = useSelector((state) => state.auth.user?.firstName);
  let { baseURL, auth: { token, } } = useSelector((state) => state);
  const [isOpen, setIsOpen] = useState(false)

  const count = useSelector((state) => state.cart.filter((item) => {
    if (!item?.LottypeCode?.label || !item.ShadeCode.label || !item.selectedYardage.label) {

    } else {
      return item
    }
  }))
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    navigate("/recentOrders")
    setAnchorEl(null);
  };

  const navigateToSignUp = () => {
    navigate("/signUp")
    // console.log("userData", userData)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null);
  }

  const logoutUser = () => {
    let newRows = [{
      "LottypeCode": { label: "", value: "", HsCode: "" },
      "shade": [],
      "ShadeCode": { label: "", value: "", HsCode: "" },
      "yardage": [],
      "selectedYardage": { label: "", value: "", HsCode: "" },
      "OrderQty": 12,
      "price": 0,
      "uuid": v4()
    }]
    dispatch(updateCart(newRows));
    dispatch(logout());
  }

  const handleRenew = () => {
    dispatch(setResetPasswordTrue());
  }





  return (
    <Grid item container className='navbarMain'  >
      <Grid item md={1} sm={0.5} xs={0} ></Grid>
      <Grid item md={1} sm={2} xs={4} style={{ cursor: "pointer" }} onClick={() => navigate("/")} className='navLogo' ></Grid>
      <Grid item md={3} sm={0.5} xs={user ? "2" : '3'} ></Grid>
      <Grid item xs={user ? "4" : '3'} sx={{ display: { xs: 'flex', sm: 'none' } }} className='flex'  >
        {
          user ?
            <>
              <Grid container item xs={12} className='flex' style={{ height: "100%" }} >
                <Grid item xs={12} className='flex' style={{ cursor: "pointer" }} >
                  <Typography variant='p' onClick={handleClick} className='flex' style={{ color: "black", height: "50px", width: "50px", textAlign: "center" }} >{userName.split(" ")[0]}{<ArrowDropDownIcon />}</Typography>
                </Grid>

                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleCloseMenu}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 42,
                        height: 42,
                        ml: -0.5,
                        mr: 1,
                      },
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={handleClose}>
                    <Avatar style={{ backgroundColor: "#e9520c" }} ><GradingIcon /></Avatar> My Orders
                  </MenuItem>
                  <MenuItem onClick={handleRenew}>
                    <Avatar style={{ backgroundColor: "#e9520c" }}><KeyIcon /> </Avatar> Reset Password
                  </MenuItem>
                  {
                    userData?.isAdmin &&
                    <MenuItem onClick={navigateToSignUp}>
                      <Avatar style={{ backgroundColor: "#e9520c" }}><AssignmentIndIcon /> </Avatar> Create User
                    </MenuItem>
                  }

                  <Divider />
                  <MenuItem onClick={logoutUser}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </Grid>
            </>
            :

            <span onClick={() => navigate("/signin")} className='navbarSigninMobile' >
              Sign In
            </span>
        }
      </Grid>
      <Grid item container sm={9} md={6} sx={{ display: { xs: 'none', sm: 'flex' } }} style={{ height: "100%" }} className='flex' >
        <Grid item md={1} sm={0} ></Grid>
        <Grid item onClick={() => navigate("/quickOrder/1")} md={4} sm={4} className='navbarButton' >
          <Typography variant='p'>Place an Order</Typography>
        </Grid>
        {
          user ?
            <>
              <Grid container item md={7} sm={7} className='flex' style={{ height: "100%" }} >
                <Grid item md={7} sm={6} className='flex' style={{ cursor: "pointer" }} >
                  <Typography variant='p' onClick={handleClick} className='flex' style={{ color: "black", height: "50px", width: "50px", textAlign: "center" }} >{userName.split(" ")[0]}{<ArrowDropDownIcon />}</Typography>
                </Grid>
                <Grid container item md={5} sm={6} className='flex' style={{ textAlign: "center", height: "35px", borderRadius: "5px", backgroundColor: "#e46e39" }} onClick={() => navigate(count.length > 0 ? "/quickOrder/2" : "/quickOrder/2")} >
                  <Grid item md={8} sm={8} className='flex' style={{ textAlign: "center", height: "100%", background: "rgba(255, 255, 255,0.4)", color: "white", cursor: "pointer" }} >
                    <ShoppingCartTwoToneIcon style={{ height: "20px" }} />&nbsp;&nbsp;<p>Cart</p>
                  </Grid>
                  <Grid item md={4} sm={4} style={{ height: "100%", color: "white" }} className='flex' >
                    <span>{count.length}</span>
                  </Grid>
                </Grid>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleCloseMenu}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 42,
                        height: 42,
                        ml: -0.5,
                        mr: 1,
                      },
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={handleClose}>
                    <Avatar style={{ backgroundColor: "#e9520c" }} ><GradingIcon /></Avatar> My Orders
                  </MenuItem>
                  <MenuItem onClick={handleRenew}>
                    <Avatar style={{ backgroundColor: "#e9520c" }}><KeyIcon /> </Avatar> Reset Password
                  </MenuItem>
                  {
                    userData?.isAdmin &&
                    <MenuItem onClick={navigateToSignUp}>
                      <Avatar style={{ backgroundColor: "#e9520c" }}><AssignmentIndIcon /> </Avatar> Create User
                    </MenuItem>
                  }
                  <Divider />
                  <MenuItem onClick={logoutUser}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </Grid>
            </>
            :
            <>
              <Grid item md={3} sm={3} style={{ display: "flex", justifyContent: "center" }} onClick={() => navigate("/signin")}  >
                <span className='navbarSignin' >
                  Sign In
                </span>
              </Grid>
              {/* <Grid item md={4} sm={4} style={{ display: "flex" }} onClick={() => navigate("/signUp")} >
                <span className='navbarSignin' >
                  Sign Up
                </span>
              </Grid> */}
            </>
        }
      </Grid>
      <Grid item md={1} xs={2} onClick={() => setIsOpen(true)} className='flex' sx={{ display: { xs: 'flex', sm: 'none' } }} > <MenuIcon style={{ fontSize: "35px" }} /> </Grid>
      <div container>
        <React.Fragment >
          <SwipeableDrawer
            anchor="right"
            open={isOpen}
            onClose={() => setIsOpen(false)}
          >
            <Box
              sx={{ width: 250, backgroundColor: "#f8f8f8", minHeight: "100vh" }}
              role="presentation"
            >
              <Grid item xs={7} style={{ cursor: "pointer", height: "78px", marginBottom: "5vh" }} onClick={() => navigate("/")} className='navLogo' ></Grid>
              {
                user ?
                  <Grid item container >
                    <Grid item xs={2} ></Grid>
                    <Grid item xs={10} onClick={() => navigate("/recentOrders")} className='MobileMenuButtons' >
                      <Typography variant='h6' >My Orders</Typography>
                    </Grid>
                    <Grid item xs={2} ></Grid>
                    <Grid item xs={10} className='MobileMenuButtons' onClick={() => navigate("/quickorder/1")} >
                      <Typography variant='h6' >Place an Order</Typography>
                    </Grid>
                    <Grid item xs={2} ></Grid>
                    <Grid item xs={10} className='MobileMenuButtons' onClick={handleRenew} >
                      <Typography variant='h6' >Reset Password</Typography>
                    </Grid>
                    {
                      userData?.isAdmin && <>
                        <Grid item xs={2} ></Grid>
                        <Grid item xs={10} className='MobileMenuButtons' onClick={navigateToSignUp} >
                          <Typography variant='h6' >Create User</Typography>
                        </Grid></>
                    }
                    <Grid item xs={2} ></Grid>
                    <Grid item xs={10} className='MobileMenuButtons' onClick={logoutUser} >
                      <Typography variant='h6' >Logout</Typography>
                    </Grid>
                    <Grid item xs={3} ></Grid>
                    <Grid container item md={6} sm={6} xs={6} className='flex' style={{ marginTop: "5vh", textAlign: "center", height: "35px", borderRadius: "5px", backgroundColor: "#e46e39" }} onClick={() => navigate(count.length > 0 ? "/quickOrder/2" : "/quickOrder/2")} >
                      <Grid item md={8} sm={8} xs={8} className='flex' style={{ textAlign: "center", height: "100%", background: "rgba(255, 255, 255,0.4)", color: "white", cursor: "pointer" }} >
                        <ShoppingCartTwoToneIcon style={{ height: "20px" }} />&nbsp;&nbsp;<p>Cart</p>
                      </Grid>
                      <Grid item md={4} sm={4} xs={4} style={{ height: "100%", color: "white" }} className='flex' >
                        <span>{count.length}</span>
                      </Grid>
                    </Grid>
                  </Grid>
                  :
                  <Grid item container >
                    <Grid item xs={2} ></Grid>
                    <Grid item xs={10} onClick={() => navigate("/signin")} className='MobileMenuButtons' >
                      <Typography variant='h6' >SignIn</Typography>
                    </Grid>
                    {/* <Grid item xs={2} ></Grid>
                    <Grid item xs={10} className='MobileMenuButtons' onClick={() => navigate("/signup")} >
                      <Typography variant='h6' >SignUp</Typography>
                    </Grid> */}

                  </Grid>
              }
            </Box>
          </SwipeableDrawer>
        </React.Fragment>

      </div>
    </Grid>
  )
}

export default Navbar