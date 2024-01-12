import React, { Fragment, useRef, useState } from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
import Data from '../data'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import Select from 'react-select'
import Card2 from './Card2'
import { BsChevronDown, BsCheck2 } from 'react-icons/bs'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { Listbox, Transition } from '@headlessui/react'
// import required modules
import { Pagination } from 'swiper'

const timeframeoptions = [
  { value: 'today', label: 'Today' },
  { value: '1day', label: '1 Day' },
  { value: '7days', label: '7 Days' },
  { value: '30days', label: '30 Days' },
]
const TopBuyerSwiper = (props: any) => {
  const [timeframe, setTimeframe] = useState(timeframeoptions[0])
  const [timeframeDropdown, setTimeframeDropdown] = useState(false)

  return (
    <>
      <div className="flex flex-col items-start justify-between gap-6 py-10 md:flex-row md:items-end">
        <div className="flex items-center text-eGreen">
          <div className="flex h-9 w-9 items-start justify-end">
            <img src="/assets/icons/double_arrow.svg" alt="" />
          </div>
          <h2 className="text-2xl font-bold">{props.name}</h2>
        </div>
        <div className="flex w-full flex-col md:w-60">
          <label
            htmlFor="days"
            className="py-2 text-xs font-bold uppercase text-gray-400"
          >
            timeframe
          </label>

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
                    className="absolute mt-1 max-h-60 w-full overflow-auto bg-white py-1 text-xs shadow-lg focus:outline-none"
                    onClick={() => setTimeframeDropdown(false)}
                  >
                    {timeframeoptions.map((person, personIdx) => (
                      <Listbox.Option
                        key={personIdx}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-4 pr-4 ${
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
      <Swiper
        loop={true}
        className="mySwiper h-[210px]"
        slidesPerView={2}
        spaceBetween={14}
        breakpoints={{
          // when window width is >= 640px
          300: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          640: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          // when window width is >= 768px
          768: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
          // when window width is >= 1024px
          1024: {
            slidesPerView: 6,
            spaceBetween: 10,
          },
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num, index) => (
          <SwiperSlide
            key={index}
            className="my-2 flex h-[200px] items-start justify-center"
          >
            <Card2 />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}

export default TopBuyerSwiper
