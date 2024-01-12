import React, { Fragment, useEffect, useState } from 'react'
import { BsFillTagFill } from 'react-icons/bs'
import History from './History'
import OtherDetails from './OtherDetails'
import Owner from './Owner'
import Bid from './Bid'
import PlaceBid from './PlaceBid'
import AcceptBid from '../AcceptBid'
import FollowSteps from '../FollowSteps'
import {
  // buyItem,
  mint,
  placebid,
  cancelSell,
  cancelAuction,
  cancelBid,
  ownerOfERC721,
} from '../../blockchain/web3'
import { GrClose } from 'react-icons/gr'
import { useWeb3React } from '@web3-react/core'
import {
  abiMarket,
  abiOmiToken,
  marketContractAddress,
  nftErc1155ContractAddress,
  nftErc721ContractAddress,
  omiTokenContractAddress,
} from '../../blockchain/market'
import axios from 'axios'
import Select from 'react-select'
import { Listbox, Transition } from '@headlessui/react'
import { BsChevronDown, BsCheck2 } from 'react-icons/bs'
import { FiChevronDown } from 'react-icons/fi'
import { motion } from 'framer-motion'
import url from '../../data'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Web3 from 'web3'
import { toast } from 'react-toastify'
import { useStateValue } from '../../context/context'
import { PuffLoader } from 'react-spinners'
import { LoadingButton } from '@mui/lab'

const authenticityArr = [
  { value: 'ipfs', label: 'View on IPFS' },
  { value: 'etherscan', label: 'View on Etherscan' },
]

// const currencyArr = [
//   { value: 'Eth', label: 'Ethereum' },
//   { value: 'OMI', label: 'OMI' },
// ]

const ItemDetails = ({ data, loader, setLoader }) => {
  const {
    active,
    account,
    library: web3,
    connector,
    activate,
    deactivate,
  } = useWeb3React()
  const [buyNftPopup, setBuyNftPopup] = useState(false)

  const [contract, setContract] = useState()
  // const [currency, setCurrency] = useState(currencyArr[0])
  const [menu, setMenu] = useState('History')
  const [bidPrice, setBidPrice] = useState()
  const [buyPrice, setBuyPrice] = useState()
  const [authenticity, setAuthenticity] = useState(authenticityArr[0])
  const [walletBalance, setWalletBalance] = useState()
  const [userBid, setUserBid] = useState()
  const [{ profile }, dispatch] = useStateValue()
  const [isLoading, setIsLoading] = useState(false)
  const [placeBid, setPlaceBid] = useState(false)

  console.log('pirofileeee', profile)

  const buyItem = async (
    nftAddress,
    amount,
    uid,
    actualPrice,
    userId,
    nftId
  ) => {
    const web3 = new Web3(window.ethereum)
    const contract = new web3.eth.Contract(abiMarket, marketContractAddress)
    const demo_contract = new web3.eth.Contract(
      abiOmiToken,
      omiTokenContractAddress
    )
    const account = await new web3.eth.getAccounts()
    const authToken = localStorage.getItem('auth_pass')
    console.log('authtokeennn', authToken)
    console.log('userId', userId)
    console.log('nftId', nftId)
    const totalAmount = amount * actualPrice
    const totalPerAmt = totalAmount + (totalAmount * 1.1) / 100

    console.log('totalPerAmt', totalPerAmt)

    console.log('uidddddd', uid)

    const tokenId = parseInt(uid)
    const binaryNum = totalPerAmt.toString()
    let weiAmount = web3.utils.toWei(binaryNum, 'ether')
    console.log('binaryNum', binaryNum)
    console.log('weiAmount', weiAmount)

    try {
      console.log(tokenId)
      // let tokenId = 'dLTuJ70Q'
      setIsLoading(true)
      await demo_contract.methods
        .approve(marketContractAddress, weiAmount)
        .send({ from: account[0] })

      const txEstimateGas = await contract.methods
        .buyItem(nftAddress, tokenId, amount)
        .estimateGas({
          from: account[0],
        })
        .catch((error) => {
          console.log('error==', error)
          toast.error(error?.message)
          return
        })

      console.log('contract.methods', contract.methods)

      contract.methods
        .buyItem(nftAddress, tokenId, amount)
        .send({
          from: account[0],
          gas: txEstimateGas,
        })
        .once('transactionHash', (data) => {
          console.log('submitFunds=', data)
          let sTransactionHash = data.transactionHash
          console.log('Transaction id==', sTransactionHash)
          toast.success('Your purchase initiated.')
        })
        .on('receipt', (receipt) => {
          console.log('receipt==', receipt)
          toast.success('Your purchase completed successfully.')
        })
        .then(() => {
          axios
            .post(
              `${url}/nft/change-owner`,
              {
                nftId: nftId,
                newOwner: userId,
              },
              {
                headers: {
                  Authorization: authToken,
                },
              }
            )
            .then((response) => {
              console.log('response from change owner', response)
              setBuyNftPopup(false)
            })
            .catch((err) => console.log('error from change owner', err))
        })
        .catch((err) => {
          console.log(err)
          console.log('error=', err)
          toast.error(err?.message)
        })
    } catch (err) {
      console.log('error=', err)
      toast.error(err?.message)
      setIsLoading(false)
    }

    setIsLoading(false)
  }

  const placebid = async (nftContractAddress, _price, tokenId, nftData) => {
    // console.log('abi', abi, contractAddress)
    console.log('LOGGGGG', nftData)
    const web3 = new Web3(window.ethereum)
    const contract = new web3.eth.Contract(abiMarket, marketContractAddress)
    // const ERC721contract = new web3.eth.Contract(
    //   abiERC721,
    //   nftErc721ContractAddress
    // )
    // console.log(abiMarket)
    const OMIContract = new web3.eth.Contract(
      abiOmiToken,
      omiTokenContractAddress
    )
    const account = await new web3.eth.getAccounts()
    console.log('contract', contract)
    // const tokenId = parseInt(uid)

    const token = localStorage.getItem('auth_pass')

    try {
      // console.log('contract', contract)
      setIsLoading(true)
      let price = Web3.utils.toWei(_price, 'ether')

      console.log('tokenId', tokenId)
      console.log('price', price)
      await OMIContract.methods
        .approve(marketContractAddress, price)
        .send({ from: account[0] })

      const txEstimateGas = await contract.methods
        .placeBid(nftContractAddress, tokenId, price)
        .estimateGas({
          from: account[0],
        })
        .catch((error) => {
          console.log('error==', error)
          toast.error(error?.message)
          return
        })

      contract.methods
        .placeBid(nftContractAddress, tokenId, price)
        .send({
          from: account[0],
          gas: txEstimateGas,
        })
        .once('transactionHash', (data) => {
          console.log('submitFunds=', data)
          let sTransactionHash = data.transactionHash
          console.log('Transaction id==', sTransactionHash)
          toast.warn('Placing your bid on the NFT initiated.')
        })
        .on('receipt', (receipt) => {
          console.log('receipt==', receipt)
          toast.success('Your bid has been placed successfully!')
        })
        .then((response) => {
          axios
            .post(
              `${url}/bid/create`,
              {
                eBidStatus: 'Bid',
                oRecipient: nftData?.oCurrentOwner?._id, // ID OF NFT OWNER
                oNFTId: nftData?._id, // ID OF NFT
                nBidPrice: price, // BID PRICE
                sTransactionHash: response?.transactionHash,
                nQuantity: nftData?.nQuantity,
                nTokenID: tokenId,
                sOwnerEmail: nftData?.oCurrentOwner?.sEmail,
              },
              {
                headers: {
                  Authorization: token,
                },
              }
            )
            .then((response) => {
              console.log('response of createbid', response)
              setPlaceBid(false)
            })
            .catch((error) => {
              console.log(error)
            })
        })
        .catch((err) => {
          console.log(err)
          console.log('error=', err)
          toast.error(error?.message)
        })
    } catch (err) {
      console.log('error=', err)
      toast.error(error?.message)
    }
  }

  const [historyData, setHistoryData] = useState([])
  const nftId = data?._id
  const shortenedNftId =
    nftId?.slice(0, 9) + ' ... ' + nftId?.slice(nftId.length - 5)
  const router = useRouter()
  const nftOwnerAddress = data?.oCurrentOwner?.sWalletAddress

  useEffect(() => {
    if (typeof web3 !== 'undefined') {
      const contract = new web3.eth.Contract(abiMarket, marketContractAddress)
      console.log('Contract : ', contract)
      setContract(contract)
    }
  }, [web3])

  useEffect(() => {
    data?.sHash === undefined ? setLoader(true) : setLoader(false)
  }, [data?.sHash])

  useEffect(async () => {
    console.log('Active status : ', active)
    if (active && web3 !== null) {
      console.log('Wallet Address: ', account)
      const walletBalanceInWei = await web3.eth.getBalance(account)
      const walletBalanceInEth =
        Math.round(Web3.utils.fromWei(walletBalanceInWei) * 1000) / 1000
      setWalletBalance(walletBalanceInEth)
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

  console.log('ITEM DETAILS', data)

  useEffect(() => {
    axios
      .post(`${url}/bid/history/${data?._id}`)
      .then((response) => {
        setHistoryData(response?.data?.data?.data)
        console.log('Bid history: ', response?.data?.data?.data)
      })
      .catch((error) => console.log(error))
  }, [data?._id])

  console.log('dataaa', data)

  const setBidding = async (contractAddress) => {
    await placebid(contractAddress, bidPrice, data?.uid, data)
      .then((response) => console.log('rrrrrrrr', response))
      .catch((error) => console.log(error))
  }
  const setBuying = (contractAddress, userId, nftId) => {
    console.log('buying in progress....')
    buyItem(
      contractAddress,
      buyPrice,
      data?.uid,
      data?.nBasePrice?.$numberDecimal,
      userId,
      nftId
    )
      .then((response) => console.log('BUYING RESPONSE', response))
      .catch((error) => console.log(error))
  }

  const closeBid = () => {
    setPlaceBid(false)
  }

  return loader ? (
    <div className="contain flex h-screen w-full flex-col items-center justify-center">
      <PuffLoader color="#EC8FFE" loading={loader} size={150} />
    </div>
  ) : (
    <div className="contain flex flex-col gap-10 pt-40 md:flex-row">
      <div className="w-full md:w-1/3 md:min-w-[350px]">
        <div className="shadow-img mb-6 h-auto w-full">
          <img src={`https://ipfs.io/ipfs/${data?.sHash}`} className="p-2" />
        </div>

        <div className="z-10 mb-3 w-full ">
          <Listbox value={authenticity} onChange={setAuthenticity}>
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full cursor-default  bg-eAqua py-7 pl-8   text-left  text-sm font-semibold focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300">
                <span className="block truncate">{authenticity.label}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-8">
                  <FiChevronDown aria-hidden="true" className="text-base" />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {authenticityArr.map((person, personIdx) => (
                    <Listbox.Option
                      key={personIdx}
                      className={({ active }) =>
                        `relative cursor-default select-none py-4 pl-8 pr-8 ${
                          active
                            ? 'bg-[#E6FBFF] text-gray-500'
                            : 'text-gray-700'
                        }`
                      }
                      value={person}
                    >
                      {({ selected }) => (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="flex items-center text-gray-600">
                              <img
                                src={`/assets/img/${person.value}.svg`}
                                className="w-5"
                              />
                            </span>
                            <span
                              className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {person.label}
                            </span>
                          </div>
                          <span className="absolute inset-y-0 right-0 flex items-center pr-8 text-gray-600">
                            <img src="/assets/img/share.svg" className="w-5" />
                          </span>
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
        {data?.eAuctionType === 'Auction' ? (
          <div className="flex w-full border-[1px] border-gray-200 p-2">
            <div className="w-1/2 border-r-[1px] pl-5 ">
              <span className=" text-xs text-gray-500">Highest bid</span>
              <h2 className="text-lg font-semibold text-eGreen">
                {web3?.utils?.fromWei(data?.nMaxBid.toString())} OMI
              </h2>
            </div>
            <div className="w-1/2 pl-5 ">
              <span className=" text-xs text-gray-500">Lowest bid</span>
              <h2 className="text-lg font-semibold text-eGreen">
                {web3?.utils?.fromWei(data?.nMinBid.toString())} OMI
              </h2>
            </div>
          </div>
        ) : null}
      </div>
      <div className="mt-5 w-full md:w-2/3">
        <div className="flex flex-col items-start justify-between gap-5 border-b-[1px] border-gray-300 pb-5">
          <h1 className=" text-4xl font-bold text-eGreen">{data?.sName}</h1>
          <div className="flex items-center justify-center gap-1 bg-ePink p-2 px-3 pr-5 text-sm font-bold text-eGreen">
            <BsFillTagFill />
            <h3>{data?.nRoyaltyPercentage}% of sales will go to the creator</h3>
          </div>
          <p className="text-sm">{data?.sNftdescription}</p>
        </div>
        <div className=" border-b-[1px] border-gray-300">
          <div className="pt-5">
            <span className="text-sm font-medium text-gray-500">Price</span>
            <div className="flex items-end justify-start gap-3">
              <p className="text-2xl font-medium uppercase">
                {`${data?.nBasePrice?.$numberDecimal} ${data?.ePriceType}`}
              </p>

              {/* <span className="text-sm font-medium text-gray-500">~ $1978</span> */}
            </div>
          </div>
          <div className="flex items-center justify-start gap-10 py-6">
            <Link href={`/user/${data?.oPostedBy?._id}`}>
              <div className="flex cursor-pointer items-center justify-center gap-1">
                <img
                  src={data?.oPostedBy?.sProfilePicUrl}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null // prevents looping
                    currentTarget.src = '/assets/img/upload_photo.png'
                  }}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="flex flex-col items-start justify-center gap-0">
                  <span className="text-xs text-gray-500">Creator</span>
                  <p className="text-sm font-medium">
                    {data?.oPostedBy?.sUserName}
                  </p>
                </div>
              </div>
            </Link>
            <div className="flex items-center justify-center gap-1">
              <img
                src="/assets/icons/collection.png"
                className="h-10 w-10 rounded-full"
              />
              <div className="flex flex-col items-start justify-center gap-0">
                <span className="text-xs text-gray-500">
                  Collection (
                  {data?.eNftType === 'collection' ? 'NFT1155' : 'NFT712'})
                </span>
                <p className="text-sm font-medium">{shortenedNftId}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <div className="">
            <ul className="flex cursor-pointer gap-7 font-medium text-gray-500">
              <li
                className={`${menu == 'History' && 'item2'} item1`}
                onClick={() => setMenu('History')}
              >
                History
              </li>
              <li
                className={`${menu == 'Bid' && 'item2'} item1`}
                onClick={() => setMenu('Bid')}
              >
                Bid
              </li>
              <li
                className={`${menu == 'Details' && 'item2'} item1`}
                onClick={() => setMenu('Details')}
              >
                Details
              </li>
              <li
                className={`${menu == 'Owner' && 'item2'} item1`}
                onClick={() => setMenu('Owner')}
              >
                Owner
              </li>
            </ul>
          </div>
          <div className=" h-auto">
            {menu == 'History' ? (
              <History data={historyData} />
            ) : menu == 'Bid' ? (
              <Bid data={historyData} />
            ) : menu == 'Details' ? (
              <OtherDetails details={data?.oPostedBy} />
            ) : menu == 'Owner' ? (
              <Owner details={data?.oCurrentOwner} />
            ) : null}
          </div>
        </div>
        {nftOwnerAddress == account ? (
          <div className="flex gap-5 py-10">
            {data?.eAuctionType == 'Fixed Sale' ? (
              <div
                onClick={async () => {
                  console.log('Cancel Sell function initiated', account)
                  await cancelSell(
                    data?.eNftType === 'collection'
                      ? nftErc1155ContractAddress
                      : nftErc721ContractAddress,
                    data?.uid,
                    account
                  )
                }}
                className="gradient-btn flex w-36 items-center justify-center"
              >
                <span className=" text-sm font-bold">Cancel Sale</span>
              </div>
            ) : (
              <div
                onClick={async () => {
                  console.log('Your NFT Auction cancelled successfully!')
                  await cancelAuction(data?.uid, account)
                }}
                className="green-btn flex w-36 items-center justify-center"
              >
                <span className=" text-sm font-bold">Cancel Auction</span>
              </div>
            )}
            {/* <img src='/assets/buttons/bid.png' className='w-40 h-auto cursor-pointer' /> */}
          </div>
        ) : (
          <div className="flex gap-5 py-10">
            {data?.eAuctionType == 'Fixed Sale' ? (
              <div
                onClick={() => setBuyNftPopup(true)}
                className="gradient-btn flex w-36 items-center justify-center"
              >
                <span className=" text-sm font-bold">Buy Now</span>
              </div>
            ) : (
              <>
                {userBid ? (
                  <div
                    onClick={async () => {
                      console.log('Cancel Bid initiated.....')
                      const contractAddress =
                        userBid[0]?.oNFT[0].eAuctionType == 'collection'
                          ? nftErc1155ContractAddress
                          : nftErc721ContractAddress
                      await cancelBid(contractAddress, userBid[0].oNFT[0].uid)
                    }}
                    className="green-btn flex w-36 items-center justify-center"
                  >
                    <span className=" text-sm font-bold">Cancel Bid</span>
                  </div>
                ) : (
                  <div
                    onClick={() => setPlaceBid(true)}
                    className="green-btn flex w-36 items-center justify-center"
                  >
                    <span className=" text-sm font-bold">Place a Bid</span>
                  </div>
                )}
              </>
            )}
            {/* <img src='/assets/buttons/bid.png' className='w-40 h-auto cursor-pointer' /> */}
          </div>
        )}
        {placeBid ? (
          <div
            className={`fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-black bg-opacity-70`}
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="h-auto w-[90%] bg-gray-100 px-7 sm:w-[400px]"
            >
              <div className=" flex w-full items-center justify-between pt-7 pb-5">
                <h2 className="text-xl font-bold uppercase text-eGreen">
                  Place a bid
                </h2>
                <div
                  className="cursor-pointer rounded-full bg-gray-200 p-3"
                  onClick={closeBid}
                >
                  <GrClose />
                </div>
              </div>
              <div className="flex flex-col items-start justify-center gap-1 pb-3 text-sm">
                <p className="text-xs text-[#9A9A9A]">
                  You are about to place a bid for
                </p>
                <p className="text-lg font-bold">{data?.sName}</p>
                <p className="text-sm text-black">
                  Limited Edition by{' '}
                  <span className="cursor-pointer font-semibold text-[#EE8FFF]">
                    Epiko
                  </span>
                </p>
              </div>
              <div className="flex h-auto w-full flex-col gap-2 border border-gray-300 p-4">
                <div className="flex items-center justify-between text-sm text-[#9A9A9A]">
                  <span>Your Bid</span>
                  {/* <span>Crypto Type</span> */}
                </div>
                <div className="flex items-center border border-gray-300 bg-white pr-4">
                  <div className="h-10 w-full overflow-hidden ">
                    <input
                      className="h-full w-full appearance-none px-3 text-xs  outline-none"
                      type="number"
                      placeholder="Enter price for one piece"
                      name="bid"
                      id="bid"
                      onChange={(e) => setBidPrice(e.target.value)}
                    />
                  </div>

                  {/* <div className="h-10 w-[40%]">
                    <select className="h-full w-full border-l border-gray-300 pl-2 outline-none">
                      <option value="omi">OMI</option>
                      <option value="eth">ETH</option>
                    </select>
                  </div> */}
                </div>
                <div className="flex items-center justify-between text-sm text-[#9A9A9A]">
                  <span>Your balance</span>
                  <span>{walletBalance} ETH</span>
                </div>
                <div className="flex items-center justify-between text-sm text-[#9A9A9A]">
                  <span>Your bidding balance</span>
                  <span>0</span>
                </div>
                <div className="flex items-center justify-between text-sm text-[#9A9A9A]">
                  <span>Service fee</span>
                  <span>0</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-black">
                  <span>Total bid amount</span>
                  <span>{bidPrice ? bidPrice : 0}</span>
                </div>
              </div>
              <div className="flex items-center justify-center py-6">
                {isLoading ? (
                  <LoadingButton
                    loading
                    variant="outlined"
                    className="shadow-place-bid-btn gradient-btn flex w-60 items-center justify-center"
                  >
                    Bidding in progress...
                  </LoadingButton>
                ) : (
                  <div
                    onClick={() =>
                      setBidding(
                        data?.eNftType === 'collection'
                          ? nftErc1155ContractAddress
                          : nftErc721ContractAddress
                      )
                    }
                    className="shadow-place-bid-btn gradient-btn flex w-60 items-center justify-center"
                  >
                    Place a Bid
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        ) : null}
        {buyNftPopup ? (
          <div
            className={`fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-black bg-opacity-70`}
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="h-auto w-[90%] bg-gray-100 px-7 sm:w-[400px]"
            >
              <div className=" flex w-full items-center justify-between pt-7 pb-5">
                <h2 className="text-xl font-bold uppercase text-eGreen">
                  Buy Item
                </h2>
                <div
                  className="cursor-pointer rounded-full bg-gray-200 p-3"
                  onClick={() => setBuyNftPopup(false)}
                >
                  <GrClose />
                </div>
              </div>
              <div className="flex flex-col items-start justify-center gap-1 pb-3 text-sm">
                <p className="text-xs text-[#9A9A9A]">
                  You are about to Buy a NFT for
                </p>
                <p className="text-lg font-bold">{data?.sName}</p>
                <p className="text-sm text-black">
                  Limited Edition by{' '}
                  <span className="cursor-pointer font-semibold text-[#EE8FFF]">
                    Epiko
                  </span>
                </p>
              </div>
              <div className="flex h-auto w-full flex-col gap-2 border border-gray-300 p-4">
                <div className="flex items-center justify-between text-sm text-[#9A9A9A]">
                  <span>Quantity</span>
                </div>
                <div className="flex border border-gray-300">
                  <div className="h-10 w-full border-r border-gray-300">
                    <input
                      className="h-full w-full px-3 text-sm"
                      type="number"
                      placeholder="Enter quantity"
                      name="bid"
                      id="bid"
                      onChange={(e) => setBuyPrice(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-[#9A9A9A]">
                  <span>Your balance</span>
                  <span>{walletBalance} ETH</span>
                </div>
                <div className="flex items-center justify-between text-sm text-[#9A9A9A]">
                  <span>Your buying balance</span>
                  <span>{walletBalance} ETH</span>
                </div>
                <div className="flex items-center justify-between text-sm text-[#9A9A9A]">
                  <span>Service fee</span>
                  <span>0</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-black">
                  <span>Total Buy amount</span>
                  <span>{buyPrice ? buyPrice : 0}</span>
                </div>
              </div>
              <div className="flex items-center justify-center py-6">
                {isLoading ? (
                  <LoadingButton
                    loading
                    variant="outlined"
                    className="shadow-place-bid-btn gradient-btn flex w-60 items-center justify-center"
                  >
                    Buying in progress...
                  </LoadingButton>
                ) : (
                  <div
                    onClick={() =>
                      setBuying(
                        data?.eNftType === 'collection'
                          ? nftErc1155ContractAddress
                          : nftErc721ContractAddress,
                        profile?._id,
                        data?._id
                      )
                    }
                    className="shadow-place-bid-btn gradient-btn flex w-60 items-center justify-center"
                  >
                    Buy Item
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        ) : null}
      </div>
      {/* <AcceptBid/> */}
      {/* <FollowSteps/> */}
    </div>
  )
}

export default ItemDetails
