import React, { Fragment, useEffect, useState } from 'react'
import { BiGlobe } from 'react-icons/bi'
import { BsArrowLeft } from 'react-icons/bs'
import { useRouter } from 'next/router'
import PreviewCard from './PreviewCard'
import Data from '../data'
import axios from 'axios'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { useWeb3React } from '@web3-react/core'
// import { abi, contractAddress } from '../../blockchain/market'
import { TextField } from '@mui/material'
import { DateTimePicker } from '@mui/lab'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  abiERC721,
  nftErc721ContractAddress,
  abiMarket,
  marketContractAddress,
} from '../../blockchain/market'
import url from '../../data'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useStateValue } from '../../context/context'
import { BsChevronDown, BsCheck2 } from 'react-icons/bs'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { GrClose } from 'react-icons/gr'
import { Listbox, Transition } from '@headlessui/react'
import Web3 from 'web3'

const categoriesArr = [
  { value: 'Art', label: 'Art' },
  { value: 'Animation', label: 'Animation' },
  { value: 'Game', label: 'Game' },
  { value: 'Music', label: 'Music' },
  { value: 'Videos', label: 'Videos' },
  { value: 'Memes', label: 'Memes' },
]

const currencyArr = [
  { value: 'Eth', label: 'Ethereum' },
  { value: 'OMI', label: 'OMI' },
]

const CreateSingle = () => {
  const router = useRouter()
  const { account, library: web3 } = useWeb3React()
  const id: any = localStorage.getItem('auth_pass')
  const [contract, setContract] = useState()
  const [nftErc721Contract, setNftErc721Contract] = useState()
  const [nftImage, setNftImage] = useState()
  const [previewPrice, setPreviewPrice] = useState('0')
  const [previewName, setPreviewName] = useState('nft name')
  // const [auctionStartDate, setAuctionStartDate] = useState()
  const [auctionEndDate, setAuctionEndDate] = useState()
  const [isLoading, setIsLoading] = useState(false)

  const [category, setCategory] = useState(categoriesArr[0])
  const [currency, setCurrency] = useState(currencyArr[0])
  const [categoryDropdown, setCategoryDropdown] = useState(false)
  const [currencyDropdown, setCurrencyDropdown] = useState(false)

  const [{ profile }, dispatch] = useStateValue()

  // let nftErc721Contract: { methods: { approve: (arg0: undefined, arg1: number | null) => any } };

  let isAuction: boolean
  let salePrice: string
  let nftToken: number | null
  let nftID: any
  const token = localStorage.getItem('auth_pass')
  const shortenedId =
    token?.slice(0, 9) + ' ... ' + token?.slice(token.length - 5)

  useEffect(() => {
    if (typeof web3 !== 'undefined') {
      const contract = new web3.eth.Contract(abiMarket, marketContractAddress)
      const ERC721contract = new web3.eth.Contract(
        abiERC721,
        nftErc721ContractAddress
      )
      setNftErc721Contract(ERC721contract)
      console.log('Contract : ', contract)
      console.log('ERC721contract : ', ERC721contract)
      setContract(contract)
    }
  }, [web3])

  const mint = async (amount, royaltyFraction, uri, isERC721) => {
    try {
      //amount have to be converted into wei
      // let amountInWei = web3.utils.toWei(amount);
      setIsLoading(true)

      console.log('contractttttt', contract)
      const txEstimateGas = await contract.methods
        .mint(amount, royaltyFraction, uri, isERC721)
        .estimateGas({
          from: account,
        })
        .catch((error) => {
          console.log('error==', error)
          // alert("An error occured");
          toast.error('An error occured')
          return
        })

      contract.methods
        .mint(amount, royaltyFraction, uri, isERC721)
        .send({
          from: account,
          gas: txEstimateGas,
        })
        .once('transactionHash', (data) => {
          console.log('submitFunds=', data)
          let sTransactionHash = data.transactionHash
          console.log('Transaction id==', sTransactionHash)
          toast.info('Your NFT minting has been initiated.')
          // alert("Your transaction has been initiated successfully.");
        })
        .on('receipt', async (receipt) => {
          // alert("Your transaction has been done successfully.");
          toast.success('Your NFT minted successfully!')
          console.log('mint receipt==', receipt)
          console.log('nft hex token ==', receipt.events[0].raw.topics[3])
          const nftHexToken = receipt.events?.[0]?.raw?.topics?.[3]
          console.log('nftHexToken========', nftHexToken)

          nftToken = parseInt(nftHexToken, 16)
          console.log('nft int token ==', nftToken)
          console.log('nftId -----', nftID)
          const headers = {
            Authorization: id,
          }
          try {
            await axios
              .put(
                `${url}/nft/update`,
                {
                  nftId: nftID,
                  uid: nftToken,
                },
                { headers: headers }
              )
              .then((response) => {
                const data = response.data.data
                console.log('POST API response: ', data)
              })
          } catch (e) {
            console.log(e)
          }
          if (isAuction) await createAuction()
          else await sellitem()
        })
        .catch((err) => {
          console.log(err)
          console.log('error=', err)
          // alert("An error occured");
          toast.error('An error occured')
        })
    } catch (err) {
      console.log('error=', err)
      // alert("An error occured");
      toast.error('An error occured')
    }
  }

  const createAuction = async () => {
    try {
      setIsLoading(true)
      let amount = 1
      let tokenId = nftToken
      let basePrice = web3.utils.toWei(salePrice)
      // let startTime = auctionStartDate
      let endTime = auctionEndDate
      console.log('amount: ', amount)
      console.log('tokenId: ', tokenId)
      console.log('basePrice: ', basePrice)
      // console.log('startTime: ', startTime)
      console.log('endTime: ', endTime)

      const contract = new web3.eth.Contract(abiMarket, marketContractAddress)
      const nftErc721Contract = new web3.eth.Contract(
        abiERC721,
        nftErc721ContractAddress
      )

      await nftErc721Contract.methods
        .approve(marketContractAddress, tokenId)
        .send({ from: account })

      const txEstimateGas = await contract.methods
        .createAuction(
          nftErc721ContractAddress,
          tokenId,
          amount,
          basePrice,
          endTime
        )
        .estimateGas({
          from: account,
        })
        .catch((error) => {
          console.log('error==', error)
          // alert("An error occured");
          toast.error('An error occured')
          return
        })

      contract.methods
        .createAuction(
          nftErc721ContractAddress,
          tokenId,
          amount,
          basePrice,
          endTime
        )
        .send({
          from: account,
          gas: txEstimateGas,
        })
        .once('transactionHash', (data) => {
          console.log('submitFunds=', data)
          let sTransactionHash = data.transactionHash
          console.log('Transaction id==', sTransactionHash)
          // alert("Your transaction has been initiated successfully.");
          toast.info('Your Auction creation initiated.')
        })
        .on('receipt', (receipt) => {
          console.log('createAuction receipt== ', receipt)
          // alert("Your transaction has been done successfully.");
          toast.success('Your Auction created successfully!')
          // setAuctionStartDate(undefined)
          setAuctionEndDate(undefined)
        })
        .then((response) => router.push('/'))
        .catch((err) => {
          console.log(err)
          console.log('error=', err)
          // alert("An error occured");
          toast.error('An error occured')
        })
    } catch (err) {
      console.log('error=', err)
      // alert("An error occured");
      // toast.error("An error occured")
    }
  }

  const sellitem = async () => {
    let amount = 1
    let tokenId = nftToken
    const web3 = new Web3(window.ethereum)
    let price = web3.utils.toWei(salePrice)
    console.log('amount: ', amount)
    console.log('tokenId: ', tokenId)
    console.log('Price: ', price)
    console.log('nftErc721Contract: ', nftErc721Contract)
    const contract = new web3.eth.Contract(abiMarket, marketContractAddress)
    const erc721Contract = new web3.eth.Contract(
      abiERC721,
      nftErc721ContractAddress
    )
    console.log('account---: ', account)
    console.log('erc721Contract: ', erc721Contract)

    // nftErc721Contract &&
    //   (await nftErc721Contract.methods.approve(contract, tokenId))

    await erc721Contract.methods.approve(marketContractAddress, tokenId).send({
      from: account,
    })

    try {
      setIsLoading(true)
      const txEstimateGas = await contract.methods
        .sellitem(nftErc721ContractAddress, tokenId, amount, price)
        .estimateGas({
          from: account,
        })
        .catch((error) => {
          console.log('error==', error)
          // alert('An error occured')
          toast.error('An error occured')
          return
        })

      contract.methods
        .sellitem(nftErc721ContractAddress, tokenId, amount, price)
        .send({
          from: account,
          gas: txEstimateGas,
        })
        .once('transactionHash', (data) => {
          console.log('submitFunds=', data)
          let sTransactionHash = data.transactionHash
          console.log('Transaction id==', sTransactionHash)
          // alert('Your transaction has been initiated successfully.')
          toast.info('Your sale creation in-progress.')
        })
        .on('receipt', (receipt) => {
          console.log('receipt==', receipt)
          // alert('Your transaction has been done successfully.')
          toast.success('Your NFT is on sale!')
        })
        .then((response) => router.push('/'))
        .catch((err) => {
          console.log(err)
          console.log('error=', err)
          // alert('An error occured')
          toast.error('An error occured')
        })
    } catch (err) {
      console.log('error=', err)
      // alert('An error occured')
      toast.error('An error occured')
    }
    setIsLoading(true)
  }

  const initialValues = {
    nftImage: '',
    category: '',
    nftName: '',
    description: '',
    royalty: '',
    sale: '',
    price: '',
    currency: '',
  }

  const imageHandler = (e: any) => {
    try {
      const reader = new FileReader()
      reader.onload = () => {
        if (reader.readyState === 2) {
          setNftImage(reader.result)
        }
      }
      reader?.readAsDataURL(e.target.files[0])
    } catch (e) {
      console.log(e)
    }
  }
  // const validationSchema = Yup.object({
  //     name: Yup.string(),
  //     portfolio: Yup.string(),
  //     twitter: Yup.string(),
  //     bio: Yup.string(),
  // })

  const onSubmit = async (values: any) => {
    setIsLoading(true)
    console.log('Form data: ', values)
    // toast.success('Success!!!')
    salePrice = String(values.price)
    if (values.sale == 'Auction') isAuction = true
    else isAuction = false
    await postNFTDetails(values)
  }

  const postNFTDetails = async (values: any) => {
    console.log('Token in Post func: ', id)
    console.log('values from input', values)

    console.log('fileimageeee', values)

    if (
      values.nftImage === '' ||
      values.nftName === '' ||
      values.description === '' ||
      values.royalty === '' ||
      values.sale === '' ||
      values.price === ''
    ) {
      toast.error('please fill all the fields Correctlly!')
    } else {
      let formData = new FormData()
      formData.append('nftFile', values.nftImage)
      formData.append('sCategory', category.value)
      formData.append('sName', values.nftName)
      formData.append('sNftdescription', values.description)
      formData.append('nRoyaltyPercentage', values.royalty)
      formData.append('eAuctionType', values.sale)
      formData.append('nBasePrice', values.price)
      formData.append('ePriceType', currency.value)
      console.log('Values in Post func: ', values)
      console.log('formData in Post func: ', values)
      if (id != null) {
        console.log('Inside POST -------------')
        const headers = {
          Authorization: id,
        }
        setIsLoading(true)
        let response
        let data
        await axios
          .post('https://api.epiko.market/api/v1/nft/create', formData, {
            headers: headers,
          })
          .then((response) => {
            console.log('createresponse', response)
            if (response.data.message === 'NFT already exist! ') {
              toast.error(response.data.message)
              setIsLoading(false)
            } else {
              data = response?.data?.data
            }
          })

        console.log('POST API response: ', data)
        nftID = data?._id

        if (data) {
          const uri = `https://ipfs.io/ipfs/${data.sHash}`
          console.log('URI: ', uri)
          await mint(1, values.royalty, uri, true)
        }
      }
    }

    setIsLoading(false)
  }

  return (
    <div className="tk-dystopian">
      <div className="hidden h-[450px] w-full pt-10 lg:block">
        <img
          src={profile?.sCoverPicUrl}
          className=" h-full w-full object-cover"
          alt=""
          onError={({ currentTarget }) => {
            currentTarget.onerror = null // prevents looping
            currentTarget.src = '/assets/img/bg_cover.png'
          }}
        />
      </div>
      <div className="contain flex items-start gap-10">
        <div className="hidden w-1/4 -translate-y-1/3 flex-col items-center bg-white p-8 shadow-lg lg:flex">
          <img
            src={profile?.sProfilePicUrl}
            className="mx-auto h-52 w-full object-cover"
            alt=""
            onError={({ currentTarget }) => {
              currentTarget.onerror = null // prevents looping
              currentTarget.src = '/assets/img/bg_cover.png'
            }}
          />

          <div className="flex flex-col items-center justify-start py-6">
            <h3 className="text-xl font-bold">
              {profile?.sUserName ? profile?.sUserName : 'Your Name'}
            </h3>
            <h4 className="pb-3 text-xs font-semibold">{shortenedId}</h4>
            <p className="p-2 pb-4 text-center text-xs text-gray-400">
              {profile?.sBio ? profile?.sBio : 'Your Bio'}
            </p>
            <div className="flex items-center justify-center gap-1">
              <BiGlobe />{' '}
              {profile?.sPortfolioUrl
                ? profile?.sPortfolioUrl
                : 'Your website URL'}
            </div>
          </div>
        </div>
        <div className="h-auto w-full pt-32 lg:w-3/4 lg:pt-0">
          <div
            onClick={() => router.push('/multiple')}
            className="normal-btn flex w-52 items-center justify-center gap-2 text-sm"
          >
            <BsArrowLeft />
            Switch to Multiple
          </div>
          <div className="py-5">
            <div className="flex items-center text-eGreen">
              <div className="mb-1 flex h-9 w-9 items-start justify-end">
                <img src="/assets/icons/double_arrow.svg" alt="" />
              </div>
              <h2 className="text-2xl font-bold">Create NFT</h2>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-1 border border-gray-100 px-5 py-5 shadow-lg">
              <Formik
                initialValues={initialValues}
                // validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {(props) => (
                  <Form>
                    <div className="mb-8 flex w-full flex-col items-start gap-3">
                      <h3 className="font-bold">Upload NFT Image:</h3>
                      <div className="relative flex h-52 w-full flex-col items-center justify-center py-5 text-xs text-gray-400">
                        <img
                          src={nftImage}
                          className={`absolute h-full w-full ${
                            props.values.nftImage ? null : 'bg-gray-100'
                          } -z-10 object-contain`}
                          alt=""
                        />
                        {props.values.nftImage ? (
                          <div
                            className="absolute top-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-lg"
                            onClick={() => {
                              props.setFieldValue('nftImage', undefined)
                              setNftImage(undefined)
                            }}
                          >
                            <GrClose />
                          </div>
                        ) : null}
                        <input
                          className="hidden"
                          type="file"
                          name="nftImage"
                          id="nftImage"
                          accept="image/*"
                          onChange={(e) => {
                            imageHandler(e)
                            props.setFieldValue('nftImage', e.target.files[0])
                          }}
                        />
                        {props.values.nftImage ? null : (
                          <>
                            <p className="mb-5 w-3/4 text-center text-base text-gray-400">
                              PNG, GIF, WEBP, MP4 or MP3, Max 30mb
                            </p>
                            <label
                              htmlFor="nftImage"
                              className="pink-btn mb-3 flex w-auto items-center justify-center px-7 text-sm"
                            >
                              Select NFT Image
                            </label>
                          </>
                        )}
                      </div>

                      <div className="flex w-full flex-col">
                        <label
                          htmlFor="category"
                          className="py-2 text-[0.7rem] font-bold uppercase text-gray-400"
                        >
                          categories
                        </label>
                        {/* <Field
                          as="select"
                          id="category"
                          className="h-10 appearance-none border-[1px] border-gray-300 p-2 text-xs"
                          {...props.getFieldProps('category')}
                        >
                          <option value="Art" selected>
                            Art
                          </option>
                          <option value="Animation">Animation</option>
                          <option value="Games">Games</option>
                          <option value="Music">Music</option>
                          <option value="Videos">Videos</option>
                          <option value="Memes">Memes</option>
                          <option value="Memes">Others</option>
                        </Field> */}
                        <div className="z-10 w-full">
                          <Listbox
                            value={category}
                            // {...props.getFieldProps('category')}
                            onChange={setCategory}
                          >
                            <div className="relative mt-1">
                              <Listbox.Button
                                className={
                                  categoryDropdown
                                    ? 'focused-border relative w-full cursor-pointer border border-blue-300 bg-white py-3 pl-3  pr-10 text-left text-xs'
                                    : `focused-border relative w-full cursor-pointer border border-gray-200 bg-white py-3 pl-3  pr-10 text-left text-xs`
                                }
                                onClick={() =>
                                  setCategoryDropdown(!categoryDropdown)
                                }
                              >
                                <span className="block truncate">
                                  {category.value}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                                    {categoryDropdown ? (
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
                                afterLeave={() => setCategoryDropdown(false)}
                              >
                                <Listbox.Options
                                  className="shadow-dropdown absolute mt-1 max-h-60 w-full overflow-auto bg-white py-1 text-xs focus:outline-none"
                                  onClick={() => setCategoryDropdown(false)}
                                >
                                  {categoriesArr.map((person, personIdx) => (
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
                                              selected
                                                ? 'font-medium'
                                                : 'font-normal'
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

                    <div className="mb-8 flex flex-col items-start gap-3">
                      <h3 className="font-bold">Item Details</h3>
                      <div className="flex w-full flex-col">
                        <label
                          htmlFor="nftName"
                          className="py-2 text-[0.7rem] font-bold uppercase text-gray-400"
                        >
                          Item name
                        </label>
                        <Field
                          className=" h-10 bg-gray-100 p-2 text-xs font-bold"
                          type="text"
                          name="nftName"
                          id="nftName"
                          placeholder='eg."Crypto Heart"'
                          // value={previewName}
                          // onChange={(e) => setPreviewName(e.target.value)}
                        />
                      </div>
                      <div className="flex w-full flex-col">
                        <label
                          htmlFor="description"
                          className="py-2 text-[0.7rem] font-bold uppercase text-gray-400"
                        >
                          Item Description
                        </label>
                        <textarea
                          className=" h-32 bg-gray-100 p-2 text-xs font-bold"
                          id="description"
                          placeholder='eg."After purchasing you will be able to receive.."'
                          {...props.getFieldProps('description')}
                        />
                      </div>
                      <div className="flex w-full flex-col">
                        <label
                          htmlFor="royalty"
                          className="py-2 text-[0.7rem] font-bold uppercase text-gray-400"
                        >
                          Royalty
                        </label>
                        <Field
                          className=" h-10 bg-gray-100 p-2 text-xs font-bold"
                          type="text"
                          name="royalty"
                          id="royalty"
                          placeholder="Suggested: 10% 20% 30%"
                        />
                      </div>
                    </div>
                    {/* <div className='py-5'>
                            <div className='w-full flex justify-between items-center'>
                                <p className='text-sm font-bold'>Put on sale</p>
                                <input type="checkbox" name="" id="sale" />
                            </div>
                            <span className='text-left text-xs text-gray-400'>You’ll receive bids on this item</span>
                        </div> */}
                    <div className="mb-8 flex flex-col items-start justify-center gap-4">
                      {/* <div className='w-full flex justify-between items-center'>
                                    <p className='text-sm font-bold'>Instant sale price</p>
                                    <input type="checkbox" name="" id="sale" />
                            </div> */}
                      <h3 className="text-left font-bold">Select Sale Type </h3>
                      <div className="flex flex-col gap-2 ">
                        <div
                          id="form-box"
                          className="flex items-center justify-start gap-20"
                        >
                          <label>
                            <Field
                              type="radio"
                              name="sale"
                              id="sale"
                              value="Auction"
                            />
                            <div className="circle"></div>
                            <span className="text-xs text-gray-800">
                              Auction
                            </span>
                          </label>
                          <label>
                            <Field
                              type="radio"
                              name="sale"
                              id="sale"
                              value="Fixed Sale"
                            />
                            <div className="circle"></div>
                            <span className="text-xs text-gray-800">
                              Instant Sale
                            </span>
                          </label>
                        </div>
                      </div>
                      <span className="text-left text-[0.7rem] text-gray-400">
                        {props.values.sale === 'Auction'
                          ? 'Enter the base price for Auction'
                          : 'Enter the price for Instant sale'}
                      </span>
                      <div className="grid w-full grid-cols-1 items-center  gap-2 md:grid-cols-2">
                        <div className="h-10 w-full">
                          <Field
                            className="h-full w-full bg-gray-100 px-3 text-sm"
                            type="text"
                            placeholder="Enter price for one piece"
                            name="price"
                            id="price"
                            // value={previewPrice}
                            // onChange={(e) => setPreviewPrice(e.target.value)}
                          />
                        </div>
                        {/* <div className="custom-select w-1/2 border-2 border-gray-200">
                          <Field
                            as="select"
                            className="h-full w-full px-1 text-left"
                            id="currency"
                            name="currency"
                          >
                            <option value="OMI">OMI</option>
                            <option value="Eth">ETH</option>
                          </Field>
                        </div> */}
                        <div className="z-10 h-10 w-full">
                          <Listbox
                            value={currency}
                            // {...props.getFieldProps('category')}
                            onChange={setCurrency}
                          >
                            <div className="relative">
                              <Listbox.Button
                                className={
                                  currencyDropdown
                                    ? 'focused-border relative w-full cursor-pointer border border-blue-300 bg-white py-3 pl-3  pr-10 text-left text-xs'
                                    : `focused-border relative w-full cursor-pointer border border-gray-200 bg-white py-3 pl-3  pr-10 text-left text-xs`
                                }
                                onClick={() =>
                                  setCurrencyDropdown(!currencyDropdown)
                                }
                              >
                                <span className="block truncate">
                                  {currency.label}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                                    {currencyDropdown ? (
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
                                afterLeave={() => setCurrencyDropdown(false)}
                              >
                                <Listbox.Options
                                  className="absolute mt-1 max-h-60 w-full overflow-auto bg-white py-1 text-xs shadow-lg focus:outline-none"
                                  onClick={() => setCurrencyDropdown(false)}
                                >
                                  {currencyArr.map((person, personIdx) => (
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
                                              selected
                                                ? 'font-medium'
                                                : 'font-normal'
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
                      {props.values.sale === 'Auction' ? (
                        <div className="flex w-full gap-2 pt-2">
                          {/* <div className="w-1/2 pt-5">
                            <DateTimePicker
                              label="Auction Start Date"
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                              value={auctionStartDate}
                              onChange={(newValue) => {
                                const epochTime = new Date(newValue).getTime()
                                setAuctionStartDate(epochTime)
                                // props.setFieldValue('startDate', epochTime)
                              }}
                            />
                          </div> */}
                          <div className=" pt-5">
                            <DateTimePicker
                              label="Auction End Date"
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                              value={auctionEndDate}
                              onChange={(newValue) => {
                                const epochTime = new Date(newValue).getTime()
                                setAuctionEndDate(epochTime)
                                // props.setFieldValue('endDate', epochTime)
                              }}
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <div className="mb-8 flex w-full gap-5">
                      {/* <div className='flex justify-center items-center w-1/2 h-10 border-2 border-eGreen bg-white text-eGreen cursor-pointer'>
                                <span className=' text-sm font-bold'>Schedule</span>
                            </div> */}
                      {isLoading ? (
                        <LoadingButton
                          loading
                          variant="outlined"
                          className="h-10 w-1/2"
                        >
                          Publish Now
                        </LoadingButton>
                      ) : (
                        <button type="submit" className="h-10 w-1/2">
                          <span className="gradient-btn flex w-full items-center justify-center text-sm">
                            Publish Now
                          </span>
                        </button>
                      )}
                    </div>
                  </Form>
                )}
              </Formik>
              {/* <Toaster /> */}
            </div>
            <div className="hidden md:flex">
              {/* <PreviewCard data={Data[0]} /> */}
              <div className="shadow-hero-card h-auto w-72 bg-white p-2">
                <h3 className="py-3 text-left font-bold">Preview</h3>
                <img
                  src={nftImage}
                  className="cover h-80 w-full object-cover"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-start gap-2 py-2">
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={profile?.sProfilePicUrl}
                      alt=""
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null // prevents looping
                        currentTarget.src = '/assets/img/bg_cover.png'
                      }}
                    />
                    <div className="flex flex-col items-start justify-center gap-0">
                      <p className="text-sm font-bold">{previewName}</p>
                      <span className="text-xs text-gray-500">1 in Stock</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-0 px-1 ">
                    {/* <span className="text-xs text-gray-400">Auction</span> */}
                    <div className="flex items-center justify-center rounded border-2 border-green-500 px-1 text-xs text-green-500">
                      <span>{previewPrice} OMI</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateSingle
