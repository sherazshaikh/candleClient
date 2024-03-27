import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ReviewCard from '../ReviewCard/ReviewCard';
// import './VerticalCarousel.css'; // Import custom CSS file for styling

class VerticalCarousel extends React.Component {
  render() {
    const settings = {
      // dots: true,
      infinite: true,
      vertical: true,
      verticalSwiping: true,
      slidesToShow: 2,
      slidesToScroll: 1,
    };

    return (
      <div style={{ height: "100%", width: "100%" }}>
        <Slider {...settings}>
          <div >
            <div style={{ display: "flex", flexDirection: "row", width: "100%" }} className='flex' >
              <div style={{ width: "50%" }} className='flex' > <ReviewCard /> </div>
              <div style={{ width: "50%",marginTop: "-350px" }} className='flex' ><ReviewCard /></div>
            </div>
          </div>
          <div >
            <div style={{ display: "flex", flexDirection: "row", width: "100%" }} className='flex' >
              <div style={{ width: "50%" }} className='flex' > <ReviewCard /> </div>
              <div style={{ width: "50%",marginTop: "-350px" }} className='flex' ><ReviewCard /></div>
            </div>
          </div>
          <div >
            <div style={{ display: "flex", flexDirection: "row", width: "100%" }} className='flex' >
              <div style={{ width: "50%" }} className='flex' > <ReviewCard /> </div>
              <div style={{ width: "50%",marginTop: "-350px" }} className='flex' ><ReviewCard /></div>
            </div>
          </div>
          <div >
            <div style={{ display: "flex", flexDirection: "row", width: "100%" }} className='flex' >
              <div style={{ width: "50%" }} className='flex' > <ReviewCard /> </div>
              <div style={{ width: "50%",marginTop: "-350px" }} className='flex' ><ReviewCard /></div>
            </div>
          </div>
          
          
        </Slider>
      </div>
    );
  }
}

export default VerticalCarousel;
