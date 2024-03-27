import { Grid, Typography } from '@mui/material'
import React from 'react'
import "./paymentAddress.css"

const PaymentMethod = ({label,selected,setSeleted}) => {
    return (
        <Grid item md={3} sm={6} xs={6} onClick={() => setSeleted(label)}  >
            <div className={selected == label ? "paymentAddressMain flex selectedBorder" : "paymentAddressMain flex"} >
                <Typography variant='h5'>{label}</Typography>
            </div>
        </Grid>
    )
}

export default PaymentMethod