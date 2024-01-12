import React, { Component } from 'react'
import Slider from 'react-slick'
import Data from './data'
import { BsArrowLeft } from 'react-icons/bs'
import { BsArrowRight } from 'react-icons/bs'
import { useStateValue } from '../context/context'
import SliderCard from './SliderCard'
import Card from './Card'

function NextArrow(props) {
  const { className, style, onClick } = props
  return (
    <BsArrowRight
      className="absolute -top-20 right-0 z-10 block h-10 w-10 cursor-pointer bg-[#c0f0f8] p-2 text-xl font-light text-black"
      style={{ ...style }}
      size="35px"
      onClick={onClick}
    />
  )
}

function PrevArrow(props) {
  const { className, style, onClick } = props
  return (
    <BsArrowLeft
      className="absolute -top-20 right-16 z-10 block h-10 w-10 cursor-pointer p-2 text-xl text-black"
      style={{ ...style }}
      size="35px"
      onClick={onClick}
    />
  )
}

export default class ItemSlider extends Component {
  render() {
    const cardData = this.props.createdNft
    const settings = {
      className: 'center',
      infinite: true,
      centerMode: true,
      centerPadding: '-20px',
      slidesToShow: 4,
      swipeToSlide: true,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 4000,
      arrows: true,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
      afterChange: function (index) {
        console.log(`Slider Changed to: ${index + 1}`)
      },
    }
    return (
      <div className="contain tk-dystopian relative overflow-visible">
        <div className="py-10">
          <div className="flex items-center  text-eGreen">
            <div className="mb-1 flex h-9 w-9 items-start justify-end">
              <img src="/assets/icons/double_arrow.svg" alt="" />
            </div>
            <h2 className="text-2xl font-bold">Discover</h2>
          </div>
        </div>
        <div className="hidden lg:block">
          <Slider {...settings} className="">
            {cardData?.map((data, index) => {
              return <SliderCard key={index} data={data} />
            })}
          </Slider>
        </div>
        <div className="horizontal-slider block lg:hidden">
          <div className="grid w-full grid-cols-1  items-center gap-6 md:grid-cols-2">
            {cardData?.map((data, index) => {
              return <Card key={index} data={data} />
            })}
          </div>
        </div>
      </div>
    )
  }
}
