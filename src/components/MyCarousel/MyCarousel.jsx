import React from "react";
import Slider from "react-slick";
import ProductCard from "../ProductCard/ProductCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function MyCarousel() {
    var settings = {
        infinite: true,
        speed: 300,
        autoplay:true,
        slidesToShow: 2,
        slidesToScroll: 1,
        variableWidth:true,
        arrows:false
    };
    return (
        <div style={{width:"100%"}} >

            <Slider {...settings}  >
                <div > 
                    <ProductCard />
                </div>
                <div >
                    <ProductCard />
                </div>
                <div >
                    <ProductCard />
                </div>
            </Slider>
        </div>
    );
}
// export default MyCarousel;
