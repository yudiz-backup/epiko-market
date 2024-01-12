import React, { useRef, useState } from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
import Data from '../data'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'

// import required modules
import { Pagination } from 'swiper'
import HeroCard from './HeroCard'

const CardSwiper = ({ cardData }) => {
  return (
    <>
      <Swiper
        pagination={true}
        loop={true}
        modules={[Pagination]}
        className="mySwiper h-[450px]"
        // pagination={{
        //     clickable: true,
        //     bulletClass: `swiper-pagination-bullet`
        //  }}
      >
        {cardData.map((x, index) => (
          <SwiperSlide key={index}>
            <HeroCard data={x} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}

export default CardSwiper
