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
    >
      {data &&
        data?.length > 0 ?
        data?.map((el: any) => <SwiperSlide key={el?._id}><img src={el?.fileURL} alt="" /></SwiperSlide>): <SwiperSlide> No images found!</SwiperSlide>}
    </Swiper>
  );
};

export default CustomSwiper;
