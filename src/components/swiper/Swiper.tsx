import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";

const CustomSwiper = ({
  spaceBetween = 50,
  slidesPerView = 1,
  onSlideChange,
  onSwiper,
  data = [],
}: any) => {
  return (
    <Swiper
      spaceBetween={spaceBetween}
      slidesPerView={slidesPerView}
      onSlideChange={() => console.log("slide change")}
      onSwiper={(swiper) => console.log(swiper)}
      style={{height:"100%",background:"transparent"}}
      navigation
      
    >
      {data &&
        data?.length > 0 ?
        data?.map((el: any) => <SwiperSlide key={el?._id}><img onClick={(e)=>e.stopPropagation()} style={{height:"100%",width:"100%",objectFit:"contain"}} src={el?.fileURL} alt="images" /></SwiperSlide>): <SwiperSlide> No images found!</SwiperSlide>}
    </Swiper>
  );
};

export default CustomSwiper;
