import { Grid, Typography } from '@mui/material'
import React from 'react'
import './DeliveryDuration.css'

const DeliveryDuration = ({label, selected, setSeleted, code}) => {
    return (
        <Grid item md={3} sm={12} xs={12} onClick={() => setSeleted(code)} >
            <div className={selected == code ? "DeliveryDurationMain flex selectedBorder" : "DeliveryDurationMain flex"} >
                <Typography variant='h6' >{label}</Typography>
            </div>
        </Grid>
    )
}

export default DeliveryDuration