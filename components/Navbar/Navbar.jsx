import Link from 'next/link'
import React, { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import {
  BsArrowUpRight,
  BsBellFill,
  BsChevronRight,
  BsQuestionCircle,
  BsBagFill,
} from 'react-icons/bs'
import { GrNotification } from 'react-icons/gr'
import { BiWallet } from 'react-icons/bi'
import { FiSearch } from 'react-icons/fi'
import {
  FaDiscord,
  FaFacebookF,
  FaInstagramSquare,
  FaTwitter,
  FaUserAlt,
  FaYoutube,
} from 'react-icons/fa'
import { HiMenuAlt1 } from 'react-icons/hi'
import { GrClose } from 'react-icons/gr'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import Dropdown from './Dropdown'
import ConnectToWallet from '../ConnectToWallet'
import Notifications from './Notifications'
import Data from './data'
import Web3 from 'web3'
import {
  abi,
  abiMarket,
  contractAddress,
  marketContractAddress,
} from '../../blockchain/market'
import { injected } from '../../blockchain/connectors'
import { useWeb3React } from '@web3-react/core'
import axios from 'axios'
import actionTypes from '../../context/action-types'
import { useStateValue } from '../../context/context'
import { HiOutlineMenuAlt1 } from 'react-icons/hi'
import { motion, AnimatePresence } from 'framer-motion'
import url from '../../data'

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState(false)
  const [contract, setContract] = useState()
  const [walletBalance, setWalletBalance] = useState()
  const [showConnect, setShowConnect] = useState(false)
  const [notifications, setNotifications] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [data, setData] = useState()
  const [lengthOfNotifications, setLengthOfNotifications] = useState(0)
  const [openNavbar, setOpenNavbar] = useState(false)

  // let length = Data.filter(data=>data.id<1).length
  const router = useRouter()
  const {
      active,
      account,
      library: web3,
      connector,
      activate,
      deactivate,
    } = useWeb3React()

  const variants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: '-100%' },
  }

  // useEffect(() => {
  //   const data = Data.filter((data) => data.id < 4)
  //   setData(data)
  //   setLengthOfNotifications(data.length)
  // }, [])

  useEffect(async () => {
    if (typeof window.ethereum !== 'undefined' && typeof web3 !== 'undefined') {
      const contract = new web3.eth.Contract(abiMarket, marketContractAddress)
      console.log('Contract : ', contract)
      setContract(contract)
    }
  }, [web3])

  useEffect(async () => {
    console.log('Active status : ', active)
    if (active && web3 != null) {
      console.log('Wallet Address: ', account)
      const walletBalanceInWei = await web3.eth.getBalance(account)
      const walletBalanceInEth =
        Math.round(Web3.utils.fromWei(walletBalanceInWei) * 1000) / 1000
      setWalletBalance(walletBalanceInEth)
      dispatch({
        type: actionTypes.SET_BALANCE,
        payload: walletBalanceInEth,
      })
      console.log('Wallet Balance: ', walletBalanceInEth)
      console.log('connector : ', connector)
      console.log('library : ', web3)
    } else if (!active) {
      console.log('Logged out !!')
    }
    // return () => {
    //   localStorage.removeItem("auth_pass");
    // }
  }, [active, web3])

  async function connect() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await activate(injected)
        console.log('inside connect function------------')
        signUser()
      } catch (e) {
        console.log(e)
      }
    }
  }

  async function disconnect() {
    try {
      deactivate(injected)
      console.log('inside disconnect')
      // localStorage.removeItem('auth_pass')
    } catch (ex) {
      console.log(ex)
    }
  }

  const signUser = async () => {
    const sMessage =
      `Celo NFT uses this cryptographic signature in place of a password, verifying that you are the owner of this Ethereum address - ` +
      new Date().getTime()
    console.log(sMessage)
    const web3 = new Web3(window.ethereum)
    console.log('web3 object: ', web3)
    const accounts = await web3.eth.requestAccounts()
    const account = accounts[0]
    console.log('walletAddress: ', account)
    // login api
    const signature = await web3.eth.personal.sign(sMessage, account)

    console.log('Signature: ', signature)

    axios
      .post(`${url}/auth/signin`, {
        sWalletAddress: account,
        sMessage: sMessage,
        sSignature: signature,
      })
      .then(function (response) {
        console.log('Token: ', response.data.data.token)
        localStorage.setItem('auth_pass', response.data.data.token)
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  const [{ activity, profile }, dispatch] = useStateValue()

  useEffect(() => {
    const token = localStorage.getItem('auth_pass')
    if (token !== undefined) {
      axios
        .get(`${url}/user/activity`, {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          dispatch({
            type: actionTypes.SET_ACTIVITY,
            payload: response?.data?.data?.data,
          })
        })
        .catch((error) => {
          console.clear()
        })
    }
  }, [])

  return (
    <>
      <header className="fixed z-50 hidden h-32 w-full justify-center bg-[#FFF8F0] shadow-lg lg:flex">
        <div className="contain flex">
          <div className="mr-8 flex justify-center xl:mr-10">
            <div
              onClick={() => router.push('/')}
              className="flex h-full w-40 cursor-pointer items-center justify-center"
            >
              <img src="/assets/logos/logo_full.png" className="w-40" alt="" />
            </div>
          </div>
          <nav className="tk-dystopian text-md mx-5 mr-10 flex items-center justify-center gap-10 text-gray-500">
            <div className="flex h-12 w-full items-center justify-center gap-10 border-l-[3px] border-gray-300 px-5 xl:px-10">
              <div
                onClick={() => router.push('/discover')}
                className=" cursor-pointer font-bold"
              >
                Discover
              </div>
              <div className=" cursor-pointer font-bold">FAQs</div>
            </div>
          </nav>
          <div
            className="flex flex-1 items-center justify-between"
            onSubmit={(e) => {
              e.preventDefault()
              router.push(`/discover?search=${searchTerm}`)
            }}
          >
            <form className=" flex h-10 w-80 items-center overflow-hidden border border-gray-200 bg-white p-2">
              <input
                className="tk-dystopian mx-2 w-full bg-transparent text-xs font-bold focus:outline-none"
                type="text"
                placeholder="Search items, collections and creators"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              ></input>
              <button type="submit" className="cursor-pointer p-1 px-2">
                <Link href={`/discover?search=${searchTerm}`}>
                  <FiSearch />
                </Link>
              </button>
            </form>
            <div className="tk-dystopian">
              {active ? (
                <div className="flex items-center justify-between gap-3">
                  <div
                    className="relative"
                    onClick={() => setNotifications(!notifications)}
                  >
                    {/* <BsBellFill className="text-2xl text-gray-800" /> */}
                    <img
                      src="/assets/img/notificationicon.svg"
                      className="w-7"
                      alt=""
                    />
                    {activity?.length > 0 ? (
                      <div className="absolute -top-2 -right-1 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF383F] text-[8px] text-white">
                        {activity?.length}
                      </div>
                    ) : null}
                    {notifications ? <Notifications data={activity} /> : null}
                  </div>

                  <div
                    onClick={() => setOpenDropdown(!openDropdown)}
                    className=" relative border border-gray-400 bg-white"
                  >
                    <div className=" flex h-10 w-52 cursor-pointer  items-center justify-between gap-2 p-2">
                      <img
                        src={profile?.sProfilePicUrl}
                        // profile?.sProfilePicUrl
                        className="h-7 w-7 object-cover"
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null // prevents looping
                          currentTarget.src = '/assets/img/profile.png'
                        }}
                      />
                      <div className="flex w-40 flex-col gap-0 overflow-hidden text-ellipsis whitespace-nowrap">
                        <p className="text-xs font-medium text-eGreen ">
                          {account}
                        </p>
                        <span className="text-xs text-eGreen">
                          {walletBalance ? walletBalance : 0} ETH
                        </span>
                      </div>
                      {openDropdown ? (
                        <FiChevronUp className="text-xl" />
                      ) : (
                        <FiChevronDown className="text-xl" />
                      )}
                    </div>
                    <div className="">
                      {openDropdown ? <Dropdown logout={disconnect} /> : null}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setShowConnect(true)}
                  className="shadow-button green-btn flex h-10 w-48 cursor-pointer items-center justify-center gap-2"
                >
                  <BiWallet className=" text-xl" />
                  <span className=" text-sm">Connect Wallet</span>
                </div>
              )}
            </div>
            {showConnect ? (
              <ConnectToWallet
                closeWallet={() => setShowConnect(false)}
                login={connect}
              />
            ) : null}
          </div>
        </div>
      </header>
      <header className="shadow-navbar fixed z-50 block w-full bg-[#FFF8F0] lg:hidden">
        <div className="contain z-10 flex items-center justify-between">
          <div
            onClick={() => router.push('/')}
            className="mr-10 cursor-pointer"
          >
            <img src="/assets/logos/logo_mini.png" className="w-14" alt="" />
          </div>
          {openNavbar ? (
            <div>
              <GrClose
                className="cursor-pointer text-2xl"
                onClick={() => setOpenNavbar(false)}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-5">
              <div
                className="relative"
                onClick={() => setNotifications(!notifications)}
              >
                <img
                  src="/assets/img/notificationmobileicon.svg"
                  className="w-7"
                  alt=""
                />
                {activity?.length > 0 ? (
                  <div className="absolute -top-2 -right-1 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[8px] text-white">
                    {activity?.length}
                  </div>
                ) : null}
                {notifications ? <Notifications data={activity} /> : null}
              </div>
              <div className="flex items-center justify-center">
                <div className="bg-grad flex items-center justify-center p-2">
                  <FaUserAlt className="text-lg text-white" />
                </div>
              </div>
              <div>
                <HiMenuAlt1
                  onClick={() => setOpenNavbar(true)}
                  className="cursor-pointer text-3xl"
                />
              </div>
            </div>
          )}
        </div>
      </header>
      <div className="block lg:hidden">
        {openNavbar ? (
          <motion.div
            initial={{ opacity: 0, y: '-100vh' }}
            animate={{ opacity: 1, y: '0' }}
            className="contain fixed top-0 z-40 h-screen w-screen overflow-y-scroll bg-white pt-20"
          >
            <div className="contain flex h-full w-full flex-col items-center justify-between">
              <div className="w-full max-w-[400px]">
                <form
                  className="my-8 flex w-full max-w-[400px] items-center overflow-hidden border-[1px] border-gray-500 bg-white py-3 px-3"
                  onSubmit={(e) => {
                    e.preventDefault()
                    router.push(`/discover?search=${searchTerm}`)
                  }}
                >
                  <input
                    className=" mx-2 w-full bg-transparent text-sm font-thin focus:outline-none"
                    type="text"
                    placeholder="Search items, collections and creators"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  ></input>
                  <button
                    type="submit"
                    className="mr-1 cursor-pointer p-1 px-2"
                  >
                    <Link href={`/discover?search=${searchTerm}`}>
                      <FiSearch className="text-xl text-gray-600" />
                    </Link>
                  </button>
                </form>
                <div>
                  <div className=" flex max-w-[400px] items-center justify-between border-b-2 border-gray-200 py-4">
                    <Link href="/discover">
                      <div className="flex cursor-pointer items-center justify-center gap-5">
                        <div className="flex h-10 w-10 items-center justify-center bg-eBlue">
                          <BsArrowUpRight className="text-xl text-white" />
                        </div>
                        <span className="text-xl font-black">Discover</span>
                      </div>
                    </Link>
                    <div className="flex items-center justify-center">
                      <BsChevronRight />
                    </div>
                  </div>
                  <div className=" flex max-w-[400px] items-center justify-between border-b-2 border-gray-200 py-4">
                    <div className="flex items-center justify-center gap-5">
                      <div className="flex h-10 w-10 items-center justify-center bg-eBlue">
                        <BsQuestionCircle className="text-xl text-white" />
                      </div>
                      <span className="text-xl font-black">FAQs</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <BsChevronRight />
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    {active ? (
                      <div
                        onClick={() => setOpenDropdown(!openDropdown)}
                        className=" relative mt-4 flex h-14 w-full  justify-between border border-black bg-white"
                      >
                        <div className=" flex w-full cursor-pointer items-center  justify-between gap-2 px-4 py-5">
                          <div className="flex items-center gap-2">
                            <img
                              src={profile?.sProfilePicUrl}
                              className="h-7 w-7 rounded-full object-cover"
                              onError={({ currentTarget }) => {
                                currentTarget.onerror = null // prevents looping
                                currentTarget.src =
                                  '/assets/img/upload_photo.png'
                              }}
                            />
                            <div className="flex w-40 flex-col gap-0 overflow-hidden text-ellipsis whitespace-nowrap">
                              <p className="text-xs font-medium text-eGreen ">
                                {account}
                              </p>
                              <span className="text-xs text-eGreen">
                                {walletBalance ? walletBalance : null} ETH
                              </span>
                            </div>
                          </div>
                          {openDropdown ? (
                            <FiChevronUp className="text-xl" />
                          ) : (
                            <FiChevronDown className="text-xl" />
                          )}
                        </div>
                        <div className="absolute left-0 top-3 w-full">
                          {openDropdown ? (
                            <Dropdown logout={disconnect} />
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="flex w-full max-w-[400px] flex-col gap-5">
                {active ? null : (
                  <div
                    onClick={() => setShowConnect(true)}
                    className="shadow-button flex h-14 w-full max-w-[400px] cursor-pointer items-center justify-center gap-2 bg-eGreen text-white"
                  >
                    <BiWallet className=" text-2xl" />
                    <span className="text-lg">Connect Wallet</span>
                  </div>
                )}
                <div className="flex h-14 w-full items-center justify-between">
                  <FaFacebookF className=" text-2xl text-gray-400" />
                  <FaTwitter className=" text-2xl text-gray-400" />
                  <FaYoutube className=" text-2xl text-gray-400" />
                  <FaInstagramSquare className=" text-2xl text-gray-400" />
                  <FaDiscord className=" text-2xl text-gray-400" />
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
        {showConnect ? (
          <ConnectToWallet
            closeWallet={() => setShowConnect(false)}
            login={connect}
          />
        ) : null}
      </div>
    </>
  )
}

export default Navbar
