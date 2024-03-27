import React from 'react'
import "./shippingAddress.css"
import { Grid, Typography } from '@mui/material'
const ShippingAddress = () => {
    return (
        <Grid item md={3} sm={12} xs={12} >
            <div className="shippingAddressMain flex" >
                <Typography variant='h6'>Pick Up</Typography>
            </div>
        </Grid>
    )
}

export default ShippingAddress