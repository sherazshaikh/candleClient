import React from 'react'
import './button.css'
import { CircularProgress } from '@mui/material'

const Button = ({ onClick, loadingState = false, buttonName }) => {
  return (
    <button className='submitButton' style={loadingState ? { background: "none" } : {}} disabled={loadingState} onClick={() => onClick()} >{
      loadingState ? <CircularProgress style={{ color: "#e46e39", width: "20px", height: "20px" }} /> : buttonName
    }</button>
  )
}

export default Button