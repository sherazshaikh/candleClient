import { Grid, Typography } from '@mui/material'
import React from 'react';
import './footer.css'
import logo from '../../assets/Group 154.webp'
import facebooklogo from '../../assets/001-facebook.webp'
import skypelogo from '../../assets/003-skype.webp'
import twitterlogo from '../../assets/002-linkedin.webp'
import EmailIcon from '@mui/icons-material/Email';
import CallIcon from '@mui/icons-material/Call';

const Footer = () => {
  return (
    <>
      <Grid container item md={10} sm={11} xs={11} sx={{display:{xs:"block",sm:"flex"}}} className='footerSectionMain flex' >
        <Grid item md={4} sm={4} xs={5} sx={{ marginTop: { xs: "10px", sm: "0px" },marginLeft: { xs: "10px", sm: "0px" },marginBottom: { xs: "10px", sm: "0px" }, alignItems:{xs:"center", sm:"flex-start"} }} style={{ display: "flex", flexDirection: "column"}} >
          <img src={logo}  />
          <div style={{ width: "140px", justifyContent: "space-evenly", marginTop: "25px" }} className='flex' >
            <img src={facebooklogo} height='20px' style={{ opacity: '0.8' }} />
            <img src={twitterlogo} height='20px' style={{ opacity: '0.8' }} />
            <img src={skypelogo} height='20px' style={{ opacity: '0.8' }} />
          </div>
        </Grid>
        <Grid item md={2.6} sm={2} xs={12} style={{ height: "70%" }} >
          {/* <Typography variant='h6'><b>Products</b></Typography>
          <br />
          <Typography color='#161715' className='footerMenuButton' variant='body2' >Viscose Rayon</Typography>
          <Typography variant='body2' className='footerMenuButton' >Polyester</Typography>
          <Typography variant='body2' className='footerMenuButton' >Home Embroidery Bundles</Typography> */}
        </Grid>
        <Grid item md={2.6} sm={2} xs={12} style={{ height: "70%" }} >
          {/* <Typography variant='h6'><b>Policies</b></Typography>
          <br />
          <Typography variant='body2' className='footerMenuButton' >About Us</Typography>
          <Typography variant='body2' className='footerMenuButton'>Blog</Typography>
          <Typography variant='body2' className='footerMenuButton'>Contact</Typography>
          <Typography variant='body2' className='footerMenuButton'>Terms of Use</Typography>
          <Typography variant='body2' className='footerMenuButton'>Privacy Policy</Typography>
          <Typography variant='body2' className='footerMenuButton'>Cancellation Policy</Typography> */}
        </Grid>
        <Grid item md={2.7} sm={4} xs={12} style={{ height: "70%" }} >
          <Typography variant='h6'><b>Contact</b></Typography>
          <br />
          <Typography variant='body2' className='footerMenuButton'>Showroom 4, Plot, E-2 Estate Ave, Metroville Sindh Industrial Trading Estate, Karachi, Sindh</Typography>
          <br />
          <Typography className='footerMenuButton ' style={{ display: "flex", alignItems: "center" }} variant='body2'><EmailIcon />&nbsp; info@candle-thread.com</Typography>
          <Typography variant='body2' className='footerMenuButton' style={{ display: "flex", alignItems: "center" }} ><CallIcon />&nbsp; +92 123123123</Typography>
        </Grid>
      </Grid>
      <Grid container item md={10} sm={11} xs={11} className='footerSectionEnd'  >
        <Typography variant='body2' >Copyright © {new Date().getFullYear()} Candle. All rights reserved.</Typography>
      </Grid>
    </>
  )
}

export default Footer