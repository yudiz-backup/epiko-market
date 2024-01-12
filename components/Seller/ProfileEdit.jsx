import React, { useEffect, useState } from 'react'
import { BiGlobe } from 'react-icons/bi'
import { BsArrowLeft } from 'react-icons/bs'
import { useRouter } from 'next/router'
import Data from '../data'
import axios from 'axios'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import url from "../../data";


const ProfileEdit = () => {
  const router = useRouter()
  const token = localStorage.getItem('auth_pass')
  const shortenedId =
    token?.slice(0, 9) + ' ... ' + token?.slice(token.length - 5)

  const [isLoading, setIsLoading] = useState(true)
  const [profileImage, setProfileImage] = useState(
    '/assets/img/upload_photo.png'
  )
  const [coverImage, setCoverImage] = useState('/assets/img/upload_cover.png')
  const profileImgHandler = (e) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.readyState === 2) {
        setProfileImage(reader.result)
      }
    }
    try {
      reader.readAsDataURL(e.target.files[0])
    } catch (e) {
      console.log(e)
    }
  }
  const coverImgHandler = (e) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.readyState === 2) {
        setCoverImage(reader.result)
      }
    }
    reader.readAsDataURL(e.target.files[0])
  }

  const [userDetails, setUserDetails] = useState({
    name: '',
    portfolio: '',
    twitter: '',
    bio: '',
    pImage: '',
    cImage: '',
    email: '',
  })

  const validationSchema = Yup.object({
    name: Yup.string(),
    portfolio: Yup.string(),
    twitter: Yup.string(),
    bio: Yup.string(),
  })

  useEffect(() => {
    const getUserDetails = async () => {
      console.log('Token in Profile Edit: ', token)
      if (token != null) {
        console.log('Inside getUserDetails -------------')
        const response = await axios.get(`${url}/user/profile`, {
          headers: { Authorization: token },
        })
        console.log('getUserDetails API response: ', response.data.data[0])
        const data = response.data.data[0]
        setUserDetails({
          name: data.sUserName,
          portfolio: data.sPortfolioUrl,
          bio: data.sBio,
          twitter: data.sTwitterHandle,
          pImage: data.sProfilePicUrl,
          cImage: data.sCoverPicUrl,
          email: data.sEmail,
        })
        setIsLoading(false)
      }
    }
    getUserDetails()
    console.log('User Details: ', userDetails)
  }, [])

  if (isLoading) {
    return <h2>Loading...</h2>
  }

  return (
    <div>
      <div className="hidden h-96 w-full pt-10 lg:flex">
        <img
          src={userDetails?.cImage}
          className=" h-full w-full object-cover"
          alt=""
          onError={({ currentTarget }) => {
            currentTarget.onerror = null // prevents looping
            currentTarget.src = '/assets/img/bg_cover.png'
          }}
        />
      </div>
      <div className="contain flex gap-10">
        <div className="hidden h-[500px] w-1/4 -translate-y-1/3 overflow-hidden bg-white p-8 shadow-xl lg:block">
          <img
            className="mx-auto h-52 w-full object-cover"
            src={userDetails.pImage}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null // prevents looping
              currentTarget.src = '/assets/img/upload_photo.png'
            }}
            alt=""
          />
          <div className="flex flex-col items-center justify-start py-6">
            <h3 className="text-xl font-bold">{userDetails.name}</h3>
            <h4 className="pb-3 text-xs font-semibold">{shortenedId}</h4>
            <p className="mb-2 h-24 overflow-clip p-2 pb-4 text-center text-xs text-gray-500">
              {'" ' + userDetails.bio + ' "'}
            </p>
            <div className="flex items-center justify-center gap-1 text-xs">
              <BiGlobe /> {userDetails.portfolio}
            </div>
          </div>
        </div>
        <div className="h-auto w-full pt-28 lg:w-3/4 lg:pt-5">
          <div className="pt-5">
            <div className="flex items-center text-eGreen">
              <div className="flex h-9 w-9 items-start justify-end">
                <img src="/assets/icons/double_arrow.svg" alt="" />
              </div>
              <h2 className="text-2xl font-bold">Edit Profile</h2>
            </div>
            <p className="py-5 text-left text-xs text-gray-600">
              You can set preferred display name, create your profile URL and
              manage other personal settings.
            </p>
          </div>

          <div className="mb-20 w-full flex-1 border border-gray-100 px-8 py-5 shadow-xl">
            <h3 className="pb-5 text-sm font-bold">Profile details</h3>
            <Formik
              initialValues={userDetails}
              // validationSchema={validationSchema}
              onSubmit={(values) => {
                console.log('===form values==', values)

                let formData = new FormData()
                formData.append('profile', values?.pImage)
                formData.append('cover', values?.cImage)
                formData.append('sUserName', values?.name)
                formData.append('sTwitterHandle', values?.twitter)
                formData.append('sPortfolioUrl', values?.portfolio)
                formData.append('sBio', values?.bio)
                formData.append('sEmail', values?.email)

                axios
                  .post(`${url}/user/update-profile`,
                    formData,
                    {
                      headers: {
                        Authorization: token,
                      },
                    }
                  )
                  .then(
                    (response) =>
                      response?.status === 200 && router.push('/profile')
                  )
              }}
            >
              {(props) => (
                <Form>
                  <div className="flex w-full flex-col py-5 lg:flex-row">
                    <div className="flex w-full flex-col items-center justify-center gap-3 border-b border-gray-200 pb-5 pt-3 lg:w-1/2 lg:border-b-0 lg:border-r lg:pb-0">
                      <img
                        src={profileImage}
                        className="h-[150px] w-[150px] object-cover"
                        alt=""
                      />
                      <input
                        className="hidden bg-ePinkX px-7 py-2 text-xs text-white"
                        type="file"
                        name="pImage"
                        id="pImage"
                        accept="image/*"
                        onChange={(e) => {
                          profileImgHandler(e)
                          props.setFieldValue('pImage', e.target.files[0])
                        }}
                      />
                      <label
                        htmlFor="pImage"
                        className="pink-btn px-7 text-sm flex justify-center items-center"
                      >
                        Select Photo
                      </label>
                      <p className="w-3/4 text-center text-xs text-gray-400">
                        Recommended Image size Min. 400x400 Compatible with
                        Gifs./ supports Gifs
                      </p>
                    </div>
                    <div className="flex w-full flex-col items-center justify-center gap-3 pt-3 lg:w-1/2">
                      <img
                        src={coverImage}
                        className="h-[150px] w-[250px] object-contain"
                        alt=""
                      />
                      <input
                        className="hidden bg-ePinkX px-7 py-2 text-xs text-white"
                        type="file"
                        name="cImage"
                        id="cImage"
                        accept="image/*"
                        onChange={(e) => {
                          coverImgHandler(e)
                          props.setFieldValue('cImage', e.target.files[0])
                        }}
                      />
                      <label
                        htmlFor="cImage"
                        className="pink-btn px-7 text-sm flex justify-center items-center"
                      >
                        Select Cover
                      </label>
                      <p className="w-3/4 text-center text-xs text-gray-400">
                        Recommended Image size Min. 840x400 Compatible with
                        Gifs./ supports Gifs
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full flex-col gap-10 py-5 lg:flex-row">
                    <div className="grid w-full grid-cols-1 gap-4 pt-3 md:grid-cols-2">
                      <div className="flex w-full flex-col">
                        <label
                          htmlFor="name"
                          className="py-2 text-xs font-bold uppercase text-gray-400"
                        >
                          user name
                        </label>
                        <input
                          className=" h-10 bg-gray-100 px-4 py-2 text-xs font-bold"
                          type="text"
                          id="name"
                          placeholder="Account Name"
                          {...props.getFieldProps('name')}
                        />
                      </div>

                      <div className="flex w-full flex-col">
                        <label
                          htmlFor="twitter"
                          className="py-2 text-xs font-bold uppercase text-gray-400"
                        >
                          Twitter username
                        </label>
                        <div className="flex w-full items-center justify-between bg-gray-100">
                          <p className=" px-2 text-xs text-ePinkX">@</p>
                          <input
                            className=" h-10 flex-grow bg-gray-100 p-2 text-xs font-bold"
                            type="text"
                            id="twitter"
                            placeholder=""
                            {...props.getFieldProps('twitter')}
                          />
                          <p className=" cursor-pointer px-2 text-xs text-ePinkX">
                            Verify account
                          </p>
                        </div>
                        <p className=" text-[10px] text-gray-400">
                          Link your Twitter account in order to get the
                          verification badge
                        </p>
                      </div>
                      <div className="flex w-full flex-col">
                        <label
                          htmlFor="portfolio"
                          className="py-2 text-xs font-bold uppercase text-gray-400"
                        >
                          personal site or portfolio
                        </label>
                        <input
                          className=" h-10 bg-gray-100 px-4 py-2 text-xs font-bold"
                          type="text"
                          id="portfolio"
                          placeholder="enter custom URL"
                          {...props.getFieldProps('portfolio')}
                        />
                      </div>
                      <div className="flex w-full flex-col">
                        <label
                          htmlFor="portfolio"
                          className="py-2 text-xs font-bold uppercase text-gray-400"
                        >
                          Email
                        </label>
                        <input
                          className=" h-10 bg-gray-100 px-4 py-2 text-xs font-bold"
                          type="email"
                          id="email"
                          placeholder="enter your email"
                          {...props.getFieldProps('email')}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full flex-col">
                    <label
                      htmlFor="bio"
                      className="py-2 text-xs font-bold uppercase text-gray-400"
                    >
                      Bio
                    </label>
                    <textarea
                      className=" h-32 bg-gray-100 px-4 py-4 text-xs font-bold"
                      id="bio"
                      placeholder="Tell about yourself in few words"
                      {...props.getFieldProps('bio')}
                    />
                  </div>
                  <div className="flex w-full items-center justify-between py-10">
                    <div className="flex w-32 gradient-btn items-center justify-center">
                      <button type="submit" className=" text-sm">
                          Submit
                      </button>
                    </div>
                    <div>
                      <span className="hidden text-xs font-bold">
                        Auto saving..
                      </span>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileEdit
