import { Typography } from '@mui/material'
import React from 'react'
import './productCard.css'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const ProductCard = () => {
  return (
    <div className='prodCardMain' >
      <div className='prodCardImage'  ></div>
      <div className='prodCardContent' >
        <div>

          <Typography variant='h6' >EMBROIDERY</Typography>
          <Typography variant='h4' >EMBROIDERY</Typography>
          <Typography variant='p' >Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy.</Typography>
        </div>
        <div className='prodCardButtonSection' >
          <button className='prodCardButtonSectionOrderButton' >Order Now</button>
          <button className='prodCardButtonSectionRoundButton' > <ArrowForwardIcon /> </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard