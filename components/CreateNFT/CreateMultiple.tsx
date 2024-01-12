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
import {
  abiMarket,
  abiOmiToken,
  abiERC721,
  abiERC1155,
  nftErc1155ContractAddress,
  nftErc721ContractAddress,
  marketContractAddress,
  omiTokenContractAddress,
} from '../../blockchain/market'
import { TextField } from '@mui/material'
import { DateTimePicker } from '@mui/lab'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { BsChevronDown, BsCheck2 } from 'react-icons/bs'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { Listbox, Transition } from '@headlessui/react'
import url from '../../data'
import { useStateValue } from '../../context/context'
import { GrClose } from 'react-icons/gr'

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

const CreateMultiple = () => {
  const router = useRouter()
  const { account, library: web3 } = useWeb3React()
  const id: any = localStorage.getItem('auth_pass')
  const [nftImage, setNftImage] = useState()
  // const [auctionStartDate, setAuctionStartDate] = useState()
  const [auctionEndDate, setAuctionEndDate] = useState()
  const [previewPrice, setPreviewPrice] = useState(0)
  const [previewName, setPreviewName] = useState('nft')
  const [uri, setUri] = useState()
  const [isLoading, setIsLoading] = useState(false)

  const [contract, setContract] = useState()
  const [ERC1155contract, setERC1155contract] = useState()
  const [category, setCategory] = useState(categoriesArr[0])
  const [currency, setCurrency] = useState(currencyArr[0])
  const [categoryDropdown, setCategoryDropdown] = useState(false)
  const [currencyDropdown, setCurrencyDropdown] = useState(false)
  const [{ profile }, dispatch] = useStateValue()

  // let contract: any;
  // let ERC1155contract: any;

  let isAuction: boolean
  let salePrice: string
  let nftToken: number | null
  let nftID: any
  let numberOfCollectables: number
  const token = localStorage.getItem('auth_pass')
  const shortenedId =
    token?.slice(0, 9) + ' ... ' + token?.slice(token.length - 5)


  useEffect(() => {
    if (typeof web3 !== 'undefined') {
      const contract = new web3.eth.Contract(abiMarket, marketContractAddress)
      const ERC1155contract = new web3.eth.Contract(
        abiERC1155,
        nftErc1155ContractAddress
      )
      setContract(contract)
      setERC1155contract(ERC1155contract)
      console.log('Contract : ', contract)
      console.log('ERC1155contract : ', ERC1155contract)
    }
  }, [web3])

  const initialValues = {
    nftImage: '',
    category: '',
    nftName: '',
    description: '',
    royalty: '',
    quantity: '',
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
      reader.readAsDataURL(e.target.files[0])
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

  const mint = async (amount, royaltyFraction, uri, isERC721) => {
    try {
      //amount have to be converted into wei
      // let amountInWei = web3.utils.toWei(amount);
      const txEstimateGas = await contract.methods
        .mint(amount, royaltyFraction, uri, false)
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
        .mint(amount, royaltyFraction, uri, false)
        .send({
          from: account,
          gas: txEstimateGas,
        })
        .once('transactionHash', (data) => {
          console.log('submitFunds=', data)
          let sTransactionHash = data.transactionHash
          console.log('Transaction id==', sTransactionHash)
          // alert("Your transaction has been initiated successfully.");
          toast.info('Your NFT minting initiated.')
        })
        .on('receipt', async (receipt) => {
          // alert("Your transaction has been done successfully.");
          toast.success('Your NFT minted successfully.')
          console.log('mint receipt==', receipt)
          console.log('nft int token ==', receipt.events[0].raw.topics[3])
          const nftHexToken = receipt.events?.Mint?.raw?.topics?.[1]
          console.log(nftHexToken)
          nftToken = parseInt(nftHexToken, 16)
          console.log('nft hex token ==', nftToken)
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
      let amount = numberOfCollectables
      let tokenId = nftToken
      let basePrice = web3.utils.toWei(salePrice)
      // let startTime = auctionStartDate
      let endTime = auctionEndDate
      console.log('amount: ', amount)
      console.log('tokenId: ', tokenId)
      console.log('basePrice: ', basePrice)
      // console.log('startTime: ', startTime)
      console.log('endTime: ', endTime)

      await ERC1155contract.methods
        .setApprovalForAll(marketContractAddress, tokenId)
        .send({ from: account })

      const txEstimateGas = await contract.methods
        .createAuction(
          nftErc1155ContractAddress,
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
          nftErc1155ContractAddress,
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

  const sellitem = async () => {
    let amount = numberOfCollectables
    let tokenId = nftToken
    let basePrice = web3.utils.toWei(salePrice)
    console.log('amount: ', amount)
    console.log('tokenId: ', tokenId)
    console.log('basePrice: ', basePrice)
    console.log('ERC1155contract: ', ERC1155contract)
    console.log('account---: ', account)

    await ERC1155contract.methods
      .setApprovalForAll(marketContractAddress, true)
      .send({
        from: account,
      })

    try {
      const txEstimateGas = await contract.methods
        .sellitem(nftErc1155ContractAddress, tokenId, amount, basePrice)
        .estimateGas({
          from: account,
        })
        .catch((error) => {
          console.log('error==', error)
          //   alert('An error occured')
          toast.error('An error occured')
          return
        })

      contract.methods
        .sellitem(nftErc1155ContractAddress, tokenId, amount, basePrice)
        .send({
          from: account,
          gas: txEstimateGas,
        })
        .once('transactionHash', (data) => {
          console.log('submitFunds=', data)
          let sTransactionHash = data.transactionHash
          console.log('Transaction id==', sTransactionHash)
          //   alert('Your transaction has been initiated successfully.')
          toast.success('Your sale creation in-progress.')
        })
        .on('receipt', (receipt) => {
          console.log('receipt==', receipt)
          //   alert('Your transaction has been done successfully.')
          toast.success('Your NFT is on sale!')
        })
        .catch((err) => {
          console.log(err)
          console.log('error=', err)
          //   alert('An error occured')
          toast.error('An error occured')
        })
    } catch (err) {
      console.log('error=', err)
      //   alert('An error occured')
      toast.error('An error occured')
    }
  }

  const onSubmit = (values: any) => {
    console.log('Form data: ', values)
    salePrice = String(values.price)
    numberOfCollectables = values.quantity
    if (values.sale == 'Auction') isAuction = true
    else isAuction = false
    postNFTDetails(values)
  }

  const postNFTDetails = async (values: any) => {
    console.log('Token in Post func: ', id)

    if (
      values.nftImage === '' ||
      values.nftName === '' ||
      values.description === '' ||
      values.royalty === '' ||
      values.sale === '' ||
      values.price === '' ||
      values.quantity === ''
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
      formData.append('eNftType', 'collection')
      formData.append('nQuantity', values.quantity)
      console.log('Values in Post func: ', values)
      console.log('formData in Post func: ', formData)
      if (
        id != null ||
        values.nftImage !== '' ||
        values.nftName !== '' ||
        values.description !== '' ||
        values.royalty !== '' ||
        values.sale !== '' ||
        values.price !== '' ||
        values.quantity !== ''
      ) {
        console.log('Inside POST -------------')
        const headers = {
          Authorization: id,
        }
        setIsLoading(true)
        let response
        let data
        await axios
          .post(`${url}/nft/create`, formData, {
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
          const uri = `https://ipfs.io/ipfs/${data?.sHash}`
          setUri(uri)
          console.log('URI: ', uri)
          await mint(values.quantity, values.royalty, uri, false)
        }
      }
    }
  }

  // const validationSchema = Yup.object({
  //     name: Yup.string(),
  //     portfolio: Yup.string(),
  //     twitter: Yup.string(),
  //     bio: Yup.string(),
  // })

  return (
    <div>
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
            <p className="p-2 pb-4 text-center text-xs text-gray-500">
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
            onClick={() => router.push('/single')}
            className="normal-btn flex w-52 items-center justify-center gap-2 text-sm"
          >
            <BsArrowLeft />
            Switch to Single
          </div>
          <div className="py-5">
            <div className="flex items-center text-eGreen">
              <div className="mb-1 flex h-9 w-9 items-start justify-end">
                <img src="/assets/icons/double_arrow.svg" alt="" />
              </div>
              <h2 className="text-2xl font-bold">
                Create Multiple Collectible
              </h2>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="shadow-hero-card flex-1 px-3 py-5">
              <Formik
                initialValues={initialValues}
                // validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {(props) => (
                  <Form>
                    <div className=" mb-8 flex w-full flex-col items-start gap-3">
                      <h3 className="font-bold">Upload NFT Image:</h3>
                      <div className="relative flex h-52 w-full flex-col items-center justify-center text-xs text-gray-400">
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
                          className="hidden bg-ePinkX px-7 py-2 text-xs text-white"
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
                          className="h-10 border-[1px] border-gray-300 p-2 text-xs"
                          {...props.getFieldProps('category')}
                        >
                          <option value="Art">Art</option>
                          <option value="Animation">Animation</option>
                          <option value="Games">Games</option>
                          <option value="Music">Music</option>
                          <option value="Videos">Videos</option>
                          <option value="Memes">Memes</option>
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
                                  className="absolute mt-1 max-h-60 w-full overflow-auto bg-white py-1 text-xs shadow-lg focus:outline-none"
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
                      <div className="flex w-full flex-col">
                        <label
                          htmlFor="royalty"
                          className="py-2 text-[0.7rem] font-bold uppercase text-gray-400"
                        >
                          Number of Collectables
                        </label>
                        <Field
                          className=" h-10 bg-gray-100 p-2 text-xs font-bold"
                          type="text"
                          name="quantity"
                          id="quantity"
                          placeholder="Enter the number of collectables you want to create"
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
                      <h3 className="text-left text-sm font-bold">
                        Select Sale Type{' '}
                      </h3>
                      <div className="flex flex-col gap-2">
                        <div
                          id="form-box"
                          className="flex items-center justify-start gap-20"
                        >
                          <label>
                            <Field type="radio" name="sale" value="Auction" />
                            <div className="circle"></div>
                            <span className="text-xs text-gray-800">
                              Auction
                            </span>
                          </label>
                          <label>
                            <Field
                              type="radio"
                              name="sale"
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
                          <div className="w-1/2">
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
                      <button type="submit" className="h-10 w-1/2">
                        <span className="gradient-btn flex w-full items-center justify-center text-sm">
                          Publish Now
                        </span>
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
              {/* <Toaster /> */}
            </div>
            <div className="hidden lg:block">
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

export default CreateMultiple
