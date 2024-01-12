import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { BsArrowRight } from 'react-icons/bs'
import axios from 'axios'
import { useStateValue } from '../context/context'
import actionTypes from '../context/action-types'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import url from '../data'
import {
  FaDiscord,
  FaFacebookF,
  FaInstagramSquare,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa'
import { MdExpandMore } from 'react-icons/md'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'

const Footer = () => {
  const [{ profile }, dispatch] = useStateValue()
  const token = localStorage.getItem('auth_pass')
  const [subscribeEmail, setSubscribeEmail] = useState('')
  const [expandedMarketPlace, setExpandedMarketPlace] = useState('panel1')
  const [expandedInfo, setExpandedInfo] = useState('panel1')
  const [cookies, setCookies] = useState(localStorage.getItem('cookies') && false)

  const acceptCookies = () => {
    localStorage.setItem('cookies', true)
    setCookies(true)
    toast.success("Thank you for enabling cookies!", {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }
  // localStorage.removeItem('cookies')

  const handleChangeMarket = (panel) => (event, newExpanded) => {
    setExpandedMarketPlace(newExpanded ? panel : false)
  }
  const handleChangeInfo = (panel) => (event, newExpanded) => {
    setExpandedInfo(newExpanded ? panel : false)
  }

  useEffect(() => {
    token !== undefined &&
      axios
        .get(`${url}/user/profile`, {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          dispatch({
            type: actionTypes.SET_PROFILE,
            payload: response?.data?.data[0],
          })
        })
        .catch((err) => {
          console.clear()
        })
  }, [token])

  const subscribeNewsletter = (e) => {
    e.preventDefault()
    if (token) {
      axios
        .post(
          `${url}/user/addNewsLetterEmails`,
          {
            sName: profile?.sUserName,
            sEmail: subscribeEmail,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .then((response) => {
          console.log(response, subscribeEmail)
          toast.success('Email Subscribed Successfully', {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })
        })
        .catch((error) => {
          console.log(error)
          error?.message === 'Request failed with status code 409' &&
            toast.warn('Email Already Subscribed', {
              position: 'top-center',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })
        })
    }

    setSubscribeEmail('')
  }
  return (
    <footer className="tk-dystopian bg-eGreen">
      <div className="contain flex flex-col text-xs text-white">
        <div className="flex flex-col border-b-[1px] border-gray-300 py-7 lg:flex-row">
          <div className="mb-2 flex w-full flex-col gap-5 border-b-[0.5px] border-gray-400 pb-6 lg:mb-0 lg:w-1/3 lg:border-0">
            <div className="flex flex-col">
              <img
                src="/assets/logos/logo_white.svg"
                className="w-32 object-contain"
                alt=""
              />
            </div>
            <span className="w-full leading-loose lg:w-2/3 lg:pb-0">
              NFT is the brainchild of a diverse and talented group of people
              from both worlds of art and finance
            </span>
            <div className="flex items-center justify-between gap-8 py-4 md:justify-start">
              <FaFacebookF className=" cursor-pointer text-lg text-gray-400 transition delay-150 ease-in-out hover:text-white" />
              <FaTwitter className=" cursor-pointer text-lg text-gray-400 transition delay-150 ease-in-out hover:text-white" />
              <FaYoutube className=" cursor-pointer text-lg text-gray-400 transition delay-150 ease-in-out hover:text-white" />
              <FaInstagramSquare className=" cursor-pointer text-lg text-gray-400 transition delay-150 ease-in-out hover:text-white" />
              <FaDiscord className=" cursor-pointer text-lg text-gray-400 transition delay-150 ease-in-out hover:text-white" />
            </div>
          </div>
          <div className=" mb-2 hidden w-full gap-5 border-b-[1px] border-white pb-5 lg:mb-0 lg:flex  lg:w-1/3 lg:border-0 lg:pb-0">
            <div className=" flex w-1/2 flex-col items-start justify-start gap-2">
              <h2 className=" mb-2 text-lg text-eBlue">MARKETPLACE</h2>
              <Link href="/discover">All NFTs</Link>
              <Link href="/discover/art">Art</Link>
              <Link href="/discover/animation">Animation</Link>
              <Link href="/discover/game">Games</Link>
              <Link href="/discover/music">Music</Link>
              <Link href="/discover/videos">Videos</Link>
              <Link href="/discover/memes">Memes</Link>
            </div>
            <div className=" flex w-1/2 flex-col items-start justify-start gap-2">
              <h2 className=" mb-2 text-lg text-eBlue">INFO</h2>
              <span>Profile</span>
              <span>My Collection</span>
              <span>Support</span>
              <span>Demo</span>
            </div>
          </div>

          <div className="block border-b border-gray-400 pb-2 lg:hidden">
            <Accordion
              expanded={expandedMarketPlace === 'panel1'}
              onChange={handleChangeMarket('panel1')}
              className="text-sm"
              sx={{
                boxShadow: 'none',
                background: 'transparent',
                paddingY: '4px',
              }}
            >
              <AccordionSummary
                expandIcon={<MdExpandMore className="text-xl text-[#38DEFF]" />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className="text-base font-bold text-[#38DEFF]">
                  MARKETPLACE
                </Typography>
              </AccordionSummary>
              <AccordionDetails className="flex flex-col items-start gap-4">
                <p className="cursor-pointer text-sm font-normal text-gray-300  transition delay-150 ease-in-out hover:text-white">
                  All NFTs
                </p>
                <p className="cursor-pointer text-sm font-normal text-gray-300  transition delay-150 ease-in-out hover:text-white">
                  Art
                </p>
                <p className="cursor-pointer text-sm font-normal text-gray-300  transition delay-150 ease-in-out hover:text-white">
                  Photography
                </p>
                <p className="cursor-pointer text-sm font-normal text-gray-300  transition delay-150 ease-in-out hover:text-white">
                  Games
                </p>
                <p className="cursor-pointer text-sm font-normal text-gray-300  transition delay-150 ease-in-out hover:text-white">
                  Music
                </p>
                <p className="cursor-pointer text-sm font-normal text-gray-300  transition delay-150 ease-in-out hover:text-white">
                  Utility
                </p>
                <p className="cursor-pointer text-sm font-normal text-gray-300  transition delay-150 ease-in-out hover:text-white">
                  Collectibles
                </p>
                <p className="cursor-pointer text-sm font-normal text-gray-300  transition delay-150 ease-in-out hover:text-white">
                  Domain
                </p>
              </AccordionDetails>
            </Accordion>
          </div>
          <div className=" block border-b border-gray-400 pb-2 lg:hidden">
            <Accordion
              expanded={expandedInfo === 'panel1'}
              onChange={handleChangeInfo('panel1')}
              className="text-sm"
              sx={{
                boxShadow: 'none',
                background: 'transparent',
                paddingY: '4px',
              }}
            >
              <AccordionSummary
                expandIcon={<MdExpandMore className="text-xl text-[#38DEFF]" />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className="text-base font-bold text-[#38DEFF]">
                  INFO
                </Typography>
              </AccordionSummary>
              <AccordionDetails className="flex flex-col items-start gap-4">
                <p className="cursor-pointer text-sm font-normal text-gray-300  transition delay-150 ease-in-out hover:text-white">
                  Profile
                </p>
                <p className="cursor-pointer text-sm font-normal text-gray-300  transition delay-150 ease-in-out hover:text-white">
                  My Collection
                </p>
                <p className="cursor-pointer text-sm font-normal text-gray-300  transition delay-150 ease-in-out hover:text-white">
                  Support
                </p>
                <p className="cursor-pointer text-sm font-normal text-gray-300  transition delay-150 ease-in-out hover:text-white">
                  Epiko Regal
                </p>
              </AccordionDetails>
            </Accordion>
          </div>
          <div className=" flex w-full flex-col gap-2 pt-6 lg:w-1/3 lg:pt-0">
            <h2 className="mb-2 text-lg text-eBlue">
              SUBSCRIBE TO OUR NEWSLETTER
            </h2>
            <span className=" mb-2 w-3/4">
              Subscribe our newsletter to get more free design course and
              resource
            </span>
            <form className=" flex w-full items-center  overflow-hidden border-[1px] border-gray-400 bg-transparent hover:border-gray-200 md:w-96 lg:w-80">
              <input
                className=" h-full w-full bg-transparent pl-3 text-xs focus:outline-none"
                type="email"
                placeholder="Enter your email"
                value={subscribeEmail}
                onChange={(e) => setSubscribeEmail(e.target.value)}
              ></input>
              <button
                className="m-[2px] flex h-10 w-36 cursor-pointer items-center justify-center gap-2 gradient-btn py-3 px-6"
                onClick={subscribeNewsletter}
              >
                <span className=" text-sm">Submit</span>
                <BsArrowRight className=" text-sm" />
              </button>
            </form>
          </div>
        </div>
        <div className="flex w-full items-center justify-center pt-5 lg:justify-between">
          <div>
            <span>Copyright © 2022 UI8 LLC. All rights reserved</span>
          </div>
          {
            cookies ? null :
            (<div className="hidden items-center justify-center gap-5 lg:flex">
              <span>We use cookies for better service.</span>
              <span className=" cursor-pointer text-eBlue" onClick={acceptCookies}>Accept</span>
            </div>)
          }
        </div>
      </div>
    </footer>
  )
}

export default Footer
