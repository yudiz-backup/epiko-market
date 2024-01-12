import React, { useEffect, useState } from 'react'
import { BiGlobe } from 'react-icons/bi'
import { BsArrowLeft } from 'react-icons/bs'
import { useRouter } from 'next/router'
import Data from '../data'
import axios from 'axios'
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from 'yup';
import url from "../../data";


const ProfileEdit = () => {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState()

    const initialValues = {
        name: '',
        portfolio: '',
        twitter: '',
        bio: ''
    } 

    const onSubmit = (values: any)  => {
        console.log("Form data: ", values);  
    }

    const validationSchema = Yup.object({
        name: Yup.string(),
        portfolio: Yup.string(),
        twitter: Yup.string(),
        bio: Yup.string(),
    })

  const getUserDetails = async () => {
    const id :any =  localStorage.getItem("auth_pass");
    console.log("Token in Profile Edit: ", id);
    
    if(id != null) {
        console.log("Inside getUserDetails -------------");
        const response = await axios.get(`${url}/user/profile`, { headers: { Authorization: id } })
        console.log("getUserDetails API response: ", response.data.data[0]);
        setUserDetails(response.data.data[0])
    }
  }

  useEffect(() => {
    getUserDetails()
    console.log("User Details: ", userDetails);
    
  }, [])

  return (
    <div>
        <div className='w-full h-auto pt-10'>
            <img src="/assets/img/upload_cover.png" className='w-full h-80 object-cover object-bottom' alt="" />
        </div>
        <div className='contain flex gap-10'>
            <div className='w-1/4 h-[450px] p-8 shadow-profile bg-white -translate-y-1/3'>
                <img className='mx-auto w-full' src="/assets/img/upload_photo.png" alt="" />
                <div className='flex flex-col justify-start items-center py-6'>
                    <h3 className='font-bold text-xl'>Enrico Cole</h3>
                    <h4 className='text-xs font-semibold pb-3'>x8fhdifhd8hgg...hid</h4>
                    <p className='text-gray-500 text-xs p-2 pb-4 text-center'>A wholesome farm owner in Montana. Upcoming gallery solo show in Germany</p>
                    <div className='flex justify-center items-center gap-1'>
                        <BiGlobe /> https://www.net
                    </div>
                </div>
            </div>
            <div className='w-3/4 h-auto'>
                <div className='pt-5'>
                    <div className='flex items-center text-eGreen'>
                        <div className='h-9 w-9 flex justify-end items-start'>
                            <img src='/assets/icons/double_arrow.svg' alt='' />
                        </div>
                        <h2 className='text-2xl font-bold'>Edit Profile</h2>
                    </div>
                    <p className='text-left text-xs text-gray-600 py-5'>You can set preferred display name, create your profile URL and manage other personal settings.</p>
                </div>
        
                <div className='shadow-hero-card p-5 flex-1 mb-20'>
                    <h3 className='font-bold text-sm pb-5'>Profile details</h3>
                    <Formik 
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}
                    >
                        <Form>
                            <div className='w-full flex py-5'>
                                <div className='w-1/2 flex flex-col justify-center items-center gap-3 border-r border-gray-200 pt-3'>
                                    <img src="/assets/img/upload_photo.png" alt="" />
                                    <div className='px-7 py-2 bg-ePinkX text-white text-xs'>
                                        Upload Photo
                                    </div>
                                    <p className='text-xs text-gray-400 text-center w-3/4'>Recommended Image size Min. 400x400 Compatible with Gifs./ supports Gifs</p>
                                </div>
                                <div className='w-1/2 flex flex-col justify-center items-center gap-3 pt-3'>
                                    <img src="/assets/img/upload_cover.png" alt="" />
                                    <div className='px-7 py-2 bg-ePinkX text-white text-xs'>
                                        Upload Cover
                                    </div>
                                    <p className='text-xs text-gray-400 text-center w-3/4'>Recommended Image size Min. 840x400 Compatible with Gifs./ supports Gifs</p>
                                </div>
                            </div>

                            <div className='w-full flex gap-10 py-5'>
                                <div className='w-1/2 flex flex-col justify-start items-center gap-3 pt-3'>
                                    <div className="flex flex-col w-full">
                                        <label htmlFor="name" className="uppercase text-xs text-gray-400 font-bold py-2">user name</label>
                                        <Field 
                                            className=' h-10 p-2 bg-gray-100 text-xs font-bold' 
                                            type="text" 
                                            name="name" 
                                            id="name"
                                            placeholder='Account Name'
                                        />
                                        <ErrorMessage name="name" />
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <label htmlFor="portfolio" className="uppercase text-xs text-gray-400 font-bold py-2">personal site or portfolio</label>
                                        <Field 
                                            className=' h-10 p-2 bg-gray-100 text-xs font-bold' 
                                            type="text" 
                                            name="portfolio" 
                                            id="portfolio"
                                            placeholder='enter custom URL'
                                        />
                                        <ErrorMessage name="portfolio" />
                                    </div>
                                </div>
                                <div className='w-1/2 flex flex-col justify-start items-center gap-3 pt-3'>
                                    <div className="flex flex-col w-full">
                                        <label htmlFor="twitter" className="uppercase text-xs text-gray-400 font-bold py-2">Twitter username</label>
                                        <div className='flex w-full items-center justify-between bg-gray-100'>
                                            <p className=' text-ePinkX text-xs px-2'>@</p>
                                            <Field 
                                                className=' h-10 p-2 bg-gray-100 text-xs font-bold flex-grow' 
                                                type="text" 
                                                name="twitter" 
                                                id="twitter"
                                                placeholder=''
                                            />
                                            <ErrorMessage name="twitter" />
                                            <p className=' text-ePinkX text-xs px-2 cursor-pointer'>Verify account</p>
                                        </div>
                                        <p className=' text-[10px] text-gray-400'>Link your Twitter account in order to get the verification badge</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col w-full">
                                <label htmlFor="days" className="uppercase text-xs text-gray-400 font-bold py-2">Bio</label>
                                <Field 
                                    as='textarea' 
                                    className=' h-32 p-2 bg-gray-100 text-xs font-bold'  
                                    name="bio" 
                                    id="bio"
                                    placeholder='Tell about yourself in few words'
                                />
                                <ErrorMessage name="bio" />
                            </div>

                            <div className='py-10 w-full flex justify-between items-center'>
                                <div className='flex justify-center items-center w-32 h-10 bg-gradient-to-r from-[#38DEFF] via-[#EE8FFF] to-[#FFCF14] text-white cursor-pointer'>
                                    <button type='submit' className=' text-sm font-bold'>Update</button>
                                </div>
                                <div>
                                    <span className='text-xs font-bold'>Auto saving..</span>
                                </div>
                            </div>

                            {/* <div className='w-full flex py-5'>
                                <div className='w-1/2 flex flex-col justify-center items-center gap-3 border-r border-gray-200 pt-3'>
                                    <img src="/assets/img/upload_photo.png" alt="" />
                                    <input 
                                        type="file"
                                        name="pImage"
                                        onChange={(e) => {
                                            props.setFieldValue("pImage", e.target.files[0])
                                        }}
                                    >
                                        Upload Photo
                                    </input>
                                    <p className='text-xs text-gray-400 text-center w-3/4'>Recommended Image size Min. 400x400 Compatible with Gifs./ supports Gifs</p>
                                </div>
                                <div className='w-1/2 flex flex-col justify-center items-center gap-3 pt-3'>
                                    <img src="/assets/img/upload_cover.png" alt="" />
                                    <input 
                                        className='px-7 py-2 bg-ePinkX text-white text-xs'
                                        type="file"
                                        name="cImage"
                                        onChange={(e) => {
                                            props.setFieldValue("cImage", e.target.files[0])
                                        }}
                                    >
                                        Upload Cover
                                    </input>
                                    <p className='text-xs text-gray-400 text-center w-3/4'>Recommended Image size Min. 840x400 Compatible with Gifs./ supports Gifs</p>
                                </div>
                            </div>

                            <div className='w-full flex gap-10 py-5'>
                                <div className='w-1/2 flex flex-col justify-start items-center gap-3 pt-3'>
                                    <div className="flex flex-col w-full">
                                        <label htmlFor="name" className="uppercase text-xs text-gray-400 font-bold py-2">user name</label>
                                        <input 
                                            className=' h-10 p-2 bg-gray-100 text-xs font-bold' 
                                            type="text" 
                                            name="name" 
                                            id="name"
                                            placeholder='Account Name'
                                        />
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <label htmlFor="portfolio" className="uppercase text-xs text-gray-400 font-bold py-2">personal site or portfolio</label>
                                        <input 
                                            className=' h-10 p-2 bg-gray-100 text-xs font-bold' 
                                            type="text" 
                                            name="portfolio" 
                                            id="portfolio"
                                            placeholder='enter custom URL'
                                        />
                                    </div>
                                </div>
                                <div className='w-1/2 flex flex-col justify-start items-center gap-3 pt-3'>
                                    <div className="flex flex-col w-full">
                                        <label htmlFor="twitter" className="uppercase text-xs text-gray-400 font-bold py-2">Twitter username</label>
                                        <div className='flex w-full items-center justify-between bg-gray-100'>
                                            <p className=' text-ePinkX text-xs px-2'>@</p>
                                            <input 
                                                className=' h-10 p-2 bg-gray-100 text-xs font-bold flex-grow' 
                                                type="text" 
                                                name="twitter" 
                                                id="twitter"
                                                placeholder=''
                                            />
                                            <p className=' text-ePinkX text-xs px-2 cursor-pointer'>Verify account</p>
                                        </div>
                                        <p className=' text-[10px] text-gray-400'>Link your Twitter account in order to get the verification badge</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col w-full">
                                <label htmlFor="bio" className="uppercase text-xs text-gray-400 font-bold py-2">Bio</label>
                                {/* <input
                                    type='textarea'  
                                    className=' h-32 p-2 bg-gray-100 text-xs font-bold'  
                                    name="bio" 
                                    id="bio"
                                    placeholder='Tell about yourself in few words'
                                /> */}
                            </div>
                            <div className='py-10 w-full flex justify-between items-center'>
                                <div className='flex justify-center items-center w-32 h-10 bg-gradient-to-r from-[#38DEFF] via-[#EE8FFF] to-[#FFCF14] text-white cursor-pointer'>
                                    <button type='submit' className=' text-sm font-bold'>Update</button>
                                </div>
                                <div>
                                    <span className='text-xs font-bold'>Auto saving..</span>
                                </div>
                            </div> */}
                        </Form>
                    </Formik>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ProfileEdit