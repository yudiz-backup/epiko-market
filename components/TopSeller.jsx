import React, { Component, Fragment, useState } from 'react'
import Slider from 'react-slick'
import Card2 from './Card2'
import Data from './data'
import { BsArrowLeft } from 'react-icons/bs'
import { BsArrowRight } from 'react-icons/bs'
import { BsChevronDown, BsCheck2 } from 'react-icons/bs'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import Select from 'react-select'
import { Listbox, Transition } from '@headlessui/react'

const timeframeoptions = [
  { value: 'today', label: 'Today' },
  { value: '1day', label: '1 Day' },
  { value: '7days', label: '7 Days' },
  { value: '30days', label: '30 Days' },
]

function NextArrow(props) {
  const { className, style, onClick } = props
  return (
    <BsArrowRight
      className="absolute top-1/2 -right-32 z-10 block h-10 w-10 -translate-y-1/2 cursor-pointer bg-[#ffccfc] p-2 text-xl text-black"
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
      className="absolute top-1/2 -left-32 z-10 block h-10 w-10 -translate-y-1/2 cursor-pointer bg-[#ffccfc] p-2 text-xl text-black"
      style={{ ...style }}
      size="35px"
      onClick={onClick}
    />
  )
}

const TopSeller = (props) => {
  const [timeframe, setTimeframe] = useState(timeframeoptions[0])
  const [timeframeDropdown, setTimeframeDropdown] = useState(false)

  const settings = {
    className: 'center',
    infinite: true,
    centerMode: true,
    centerPadding: '-21px',
    slidesToShow: 6,
    swipeToSlide: true,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,

    afterChange: function (index) {
      console.log(
        `Slider Changed to: ${index + 1}, background: #222; color: #bada55`
      )
    },
  }

  return (
    <div className="top tk-dystopian">
      <div className="flex items-end justify-between py-10">
        <div className="flex items-center text-eGreen">
          <div className="flex h-9 w-9 items-start justify-end mb-1">
            <img src="/assets/icons/double_arrow.svg" alt="" />
          </div>
          <h2 className="text-2xl font-bold">{props.name}</h2>
        </div>
        <div className="flex w-60 flex-col">
          <label
            htmlFor="days"
            className="py-2 text-xs font-bold uppercase text-gray-400"
          >
            timeframe
          </label>
          {/* <Select
            options={timeframeoptions}
            placeholder="Select Timeline"
            className="z-10 text-xs"
            onChange={(e) => setTimeframe(e.value)}
          /> */}
          <div className="z-10 h-10 w-full">
            <Listbox
              value={timeframe}
              // {...props.getFieldProps('category')}
              onChange={setTimeframe}
            >
              <div className="relative">
                <Listbox.Button
                  className={
                    timeframeDropdown
                      ? 'focused-border relative w-full cursor-pointer border border-blue-300 bg-white py-3 pl-3  pr-10 text-left text-xs'
                      : `focused-border relative w-full cursor-pointer border border-gray-200 bg-white py-3 pl-3  pr-10 text-left text-xs`
                  }
                  onClick={() => setTimeframeDropdown(!timeframeDropdown)}
                >
                  <span className="block truncate">{timeframe.label}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                      {timeframeDropdown ? (
                        <FiChevronUp aria-hidden="true" />
                      ) : (
                        <FiChevronDown aria-hidden="true" />
                      )}
                    </div>
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  afterLeave={() => setTimeframeDropdown(false)}
                >
                  <Listbox.Options
                    className="absolute mt-1 max-h-60 w-full overflow-auto bg-white py-1 text-xs shadow-dropdown focus:outline-none"
                    onClick={() => setTimeframeDropdown(false)}
                  >
                    {timeframeoptions.map((person, personIdx) => (
                      <Listbox.Option
                        key={personIdx}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-4 pr-4 font-bold ${
                            active
                              ? 'bg-[#E6FBFF] text-gray-500'
                              : 'text-gray-700'
                          }`
                        }
                        value={person}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {person.label}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600">
                                <BsCheck2
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
        </div>
      </div>
      <Slider {...settings} className="overflow-visible">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num, index) => (
          <div key={index} className="my-2 h-[200px]">
            <Card2 />
          </div>
        ))}
      </Slider>
    </div>
    // <div className="contain relative overflow-visible">
    //   <div className='py-10'>
    //     <div className='flex items-center text-eGreen'>
    //       <div className='h-9 w-9 flex justify-end items-start'>
    //         <img src='/assets/icons/double_arrow.svg' alt='' />
    //       </div>
    //       <h2 className='text-2xl font-bold'>Discover</h2>
    //     </div>
    //   </div>
    //   <Slider {...settings} className="overflow-visible">
    //     {Data.map((data, index)=>{
    //       return (
    //         <div key={index} className="mx-1 h-[500px] overflow-visible" >
    //           <Card data={data} />
    //         </div>
    //       )
    //     })}
    //   </Slider>
    // </div>
  )
}

export default TopSeller
