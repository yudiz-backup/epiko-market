import React, { useEffect } from 'react'
import Head from 'next/head'
import Navbar from '../components/Navbar/Navbar'

import Footer from '../components/Footer'
import SellerProfile from '../components/Seller/SellerProfile'
import withAuth from '../components/HOC/withAuth'
import { useStateValue } from '../context/context'
import axios from 'axios'
import actionTypes from '../context/action-types'
import UserProfile from '../components/Seller/UserProfile'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import url from "../data";

const discover = () => {
  const token = localStorage.getItem('auth_pass')
  const [{ profile }, dispatch] = useStateValue()
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
  }, [token])

  return (
    <>
      <Head>
        <title>Epiko NFT Marketplace</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="favicon.svg" />
      </Head>
      <Navbar />
      <UserProfile profile={profile} />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Footer />
    </>
  )
}

export default withAuth(discover)
