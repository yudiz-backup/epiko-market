import React, { useEffect, useState, Fragment } from 'react'
import { IoCloseOutline } from 'react-icons/io5'
import Data from '../data'
import Card from '../Card'
import SliderCustom from './SliderCustom'
import { useStateValue } from '../../context/context'
import axios from 'axios'
import Select from 'react-select'
import actionTypes from '../../context/action-types'
import { BsChevronDown, BsCheck2 } from 'react-icons/bs'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { Listbox, Transition } from '@headlessui/react'
import url from '../../data'
import Link from 'next/link'
import { useRouter } from 'next/router'

const sort = [
  { value: 'Recently Added', label: 'Recently Added' },
  { value: 'Price Low to High', label: 'Price Low to High' },
]

const likeSort = [
  { value: 'Price High to Low', label: 'Highest Price' },
  { value: 'Price Low to High', label: 'Lowest Price' },
]

const likes = [
  { value: 'Most Likes', label: 'Most Likes' },
  { value: 'Least Likes', label: 'Least Likes' },
]
const currency = [
  { value: 'Eth', label: 'Ethereum' },
  { value: 'OMI', label: 'OMI' },
]

const Discover = ({ categoryName }) => {
  const [num, setNum] = useState(0)
  // const [sorting, setSorting] = useState('')
  // const [category, setCategory] = useState('')
  const [likeSorting, setLikeSorting] = useState(likes[0])
  const [chain, setChain] = useState(currency[0])
  const [sorting, setSorting] = useState(sort[0])
  const [dropdownClicked, setDropdownClicked] = useState(false)
  const [priceDropdown, setPriceDropdown] = useState(false)
  const [likesDropdown, setLikesDropdown] = useState(false)
  const [currencyDropdown, setCurrencyDropdown] = useState(false)
  const router = useRouter()
  const { query } = useRouter()

  // to capitalize first letter of category
  const capitalize = (s) => (s && s[0].toUpperCase() + s.slice(1)) || ''

  console.log('sorting--', sorting)
  console.log('category--', capitalize(categoryName))

  const [{ onSaleNft, createdNft }, dispatch] = useStateValue()
  const [length, setLength] = useState(10)
  useEffect(() => {
    axios
      .post(`${url}/nft/nftListing`, {
        length: length,
        start: 0,
        sTextsearch: query?.search,
        sCategory: capitalize(categoryName),
        sSortingType: sorting?.value || likeSorting?.value,
        sSellingType: '',
      })
      .then((response) => {
        dispatch({
          type: actionTypes.SET_NFT_CREATED_BY_USER,
          payload: response?.data?.data?.data,
        })
      })
  }, [categoryName, sorting, length, query?.search])

  return (
    <div className="contain pt-40">
      <h1 className="tk-dystopian w-full text-left text-3xl font-black text-eGreen lg:text-5xl">
        Discover Exclusive Digital Assets
      </h1>

      <div className="mb-10 mt-10 flex w-full items-center justify-between">
        <div className="z-10 w-full lg:w-44">
          <Listbox value={sorting} onChange={setSorting}>
            <div className="relative mt-1">
              <Listbox.Button
                className={
                  dropdownClicked
                    ? 'focused-border relative w-full cursor-pointer border border-blue-300 bg-white py-3 pl-3  pr-10 text-left text-xs'
                    : `focused-border relative w-full cursor-pointer border border-gray-200 bg-white py-3 pl-3  pr-10 text-left text-xs`
                }
                onClick={() => setDropdownClicked(!dropdownClicked)}
              >
                <span className="block truncate">{sorting.value}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                    {dropdownClicked ? (
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
                afterLeave={() => setDropdownClicked(false)}
              >
                <Listbox.Options
                  className="absolute mt-1 max-h-60 w-full overflow-auto bg-white py-1 text-xs shadow-lg focus:outline-none"
                  onClick={() => setDropdownClicked(false)}
                >
                  {sort.map((person, personIdx) => (
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

        <div className="holder tk-dystopian hidden w-auto cursor-pointer items-center justify-around gap-7 font-bold lg:flex">
          <Link href={`/discover`}>
            <span className={`${categoryName == 'all' && 'item2'} item1`}>
              All NFTs
            </span>
          </Link>
          <Link href={`/discover/art`}>
            <span className={`${categoryName == 'art' && 'item2'} item1`}>
              Art
            </span>
          </Link>
          <Link href={`/discover/animation`}>
            <span
              className={`${categoryName == 'animation' && 'item2'} item1`}
            >
              Animation
            </span>
          </Link>
          <Link href={`/discover/music`}>
            <span className={`${categoryName == 'music' && 'item2'} item1`}>
              Music
            </span>
          </Link>
          <Link href={`/discover/games`}>
            <span className={`${categoryName == 'games' && 'item2'} item1`}>
              Games
            </span>
          </Link>
          <Link href={`/discover/videos`}>
            <span
              className={`${categoryName == 'videos' && 'item2'} item1`}
            >
              Videos
            </span>
          </Link>
          <Link href={`/discover/memes`}>
            <span
              className={`${categoryName == 'memes' && 'item2'} item1`}
            >
              Memes
            </span>
          </Link>
        </div>
        <div className="w-20">
          {
            categoryName != 'all' ? 
            <div
              className="hidden h-8 w-20 cursor-pointer font-bold items-center justify-center gap-1 rounded-full bg-eAquaDark text-sm text-white lg:flex"
              onClick={() => {
                router.push('/discover')
              }}
            >
              Clear <IoCloseOutline className='text-lg' />
            </div>
            :
            null
          }
        </div>
      </div>

      <div className="mb-16 grid grid-cols-1 gap-10 bg-gray-100 p-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div className="flex w-full flex-col gap-2">
          <label
            htmlFor="days"
            className="text-xs font-bold uppercase text-gray-400"
          >
            Price
          </label>
          <div className="z-10 w-full ">
            <Listbox value={sorting} onChange={setSorting}>
              <div className="relative mt-1">
                <Listbox.Button
                  className={
                    priceDropdown
                      ? 'focused-border relative w-full cursor-pointer border border-blue-300 bg-white py-3 pl-3  pr-10 text-left text-xs'
                      : `focused-border relative w-full cursor-pointer border border-gray-200 bg-white py-3 pl-3  pr-10 text-left text-xs`
                  }
                  onClick={() => setPriceDropdown(!priceDropdown)}
                >
                  <span className="block truncate">{sorting.value}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                      {priceDropdown ? (
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
                  afterLeave={() => setPriceDropdown(false)}
                >
                  <Listbox.Options
                    className="absolute mt-1 max-h-60 w-full overflow-auto bg-white py-1 text-xs shadow-lg focus:outline-none"
                    onClick={() => setPriceDropdown(false)}
                  >
                    {likeSort.map((person, personIdx) => (
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
        <div className="flex w-full flex-col  gap-2">
          <label
            htmlFor="days"
            className="text-xs font-bold uppercase text-gray-400"
          >
            Likes
          </label>
          <div className="z-10 w-full ">
            <Listbox value={likeSorting} onChange={setLikeSorting}>
              <div className="relative mt-1">
                <Listbox.Button
                  className={
                    likesDropdown
                      ? 'focused-border relative w-full cursor-pointer border border-blue-300 bg-white py-3 pl-3  pr-10 text-left text-xs'
                      : `focused-border relative w-full cursor-pointer border border-gray-200 bg-white py-3 pl-3  pr-10 text-left text-xs`
                  }
                  onClick={() => setLikesDropdown(!likesDropdown)}
                >
                  <span className="block truncate">{likeSorting.value}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                      {likesDropdown ? (
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
                  afterLeave={() => setLikesDropdown(false)}
                >
                  <Listbox.Options
                    className="absolute mt-1 max-h-60 w-full overflow-auto bg-white py-1 text-xs shadow-lg focus:outline-none"
                    onClick={() => setLikesDropdown(false)}
                  >
                    {likes.map((person, personIdx) => (
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
        <div className="flex w-full flex-col gap-2">
          <label
            htmlFor="days"
            className="text-xs font-bold uppercase text-gray-400"
          >
            chain
          </label>
          <div className="z-10 w-full">
            <Listbox value={chain} onChange={setChain}>
              <div className="relative mt-1">
                <Listbox.Button
                  className={
                    priceDropdown
                      ? 'focused-border relative w-full cursor-pointer border border-blue-300 bg-white py-3 pl-3  pr-10 text-left text-xs'
                      : `focused-border relative w-full cursor-pointer border border-gray-200 bg-white py-3 pl-3  pr-10 text-left text-xs`
                  }
                  onClick={() => setPriceDropdown(!priceDropdown)}
                >
                  <span className="block truncate">{chain.value}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                      {priceDropdown ? (
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
                  afterLeave={() => setPriceDropdown(false)}
                >
                  <Listbox.Options
                    className="absolute mt-1 max-h-60 w-full overflow-auto bg-white py-1 text-xs shadow-lg focus:outline-none"
                    onClick={() => setPriceDropdown(false)}
                  >
                    {currency.map((person, personIdx) => (
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
        <div className="flex w-full flex-col  gap-2">
          <label
            htmlFor="days"
            className="z-10 text-xs font-bold uppercase text-gray-400"
          >
            Price range
          </label>
          <SliderCustom />
          <div className="z-10 flex items-center justify-between text-xs font-bold">
            <span>0.01 USD</span>
            <span>10 USD+</span>
          </div>
        </div>
      </div>

      {createdNft === 0 ? (
        <div className="flex w-full flex-col items-center gap-4 pb-14">
          <img src="/assets/img/notfoundsearch.svg" className="w-96" />
          <h3 className="text-center text-xl font-semibold">
            Sorry, we couldn’t find any results for this category.
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 justify-start gap-4 pb-10 sm:grid-cols-2 lg:grid-cols-4">
          {createdNft?.map((data: any, index) => (
            <div className="pb-10" key={index}>
              <Card data={data} />
            </div>
          ))}
        </div>
      )}
      <div className="horizontal-slider block pb-10 lg:hidden ">
        <div className="slider-container">
          {createdNft === 0 ? (
            <div className="w-full">
              <h3 className="text-center text-lg font-semibold uppercase">
                OOPS! No NFT Found
              </h3>
            </div>
          ) : (
            createdNft?.map((data: any, index) => (
              <div className="pb-10" key={index}>
                <Card data={data} />
              </div>
            ))
          )}
        </div>
      </div>
      {createdNft === 0 ? null : (
        <div className="flex w-full items-center justify-center py-5">
          <div
            onClick={() => setLength(length + 10)}
            className="normal-btn px-5 text-sm font-bold flex justify-center items-center"
          >
            Load more
          </div>
        </div>
      )}
    </div>
  )
}

export default Discover
