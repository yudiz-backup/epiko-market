import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// export const checkMetamask = async () => {
// 	if (window.ethereum) {
// 		const web3 = new Web3(window.ethereum);
// 		setWeb3(web3)
// 		window.ethereum.enable();
// 		return true;
// 	}
// 	return false;
// }

// import Web3 from 'web3'
// import { abi, abi_demo, contractAddress, token_contract } from './market'
import axios from 'axios'
import {
  abiMarket,
  abiOmiToken,
  abiERC721,
  abiERC1155,
  nftErc1155ContractAddress,
  nftErc721ContractAddress,
  marketContractAddress,
  omiTokenContractAddress,
} from './market'
import url from '../data'

const Web3 = require('web3')
// const web3 = new Web3(window.ethereum)

//checking current running network
export function checkRunningNetwork() {
  try {
    window.web3.eth.net.getId(function (err, data) {
      if (err) throw err
      console.log(data)
      //console.log(data);
      // if (data != 97) {
      // 	confirm("Please connect to the Binance smart chain network");
      // }
    })
  } catch (err) {
    console.log(err)
  }
}

//fetching accounts
export const fetchAccount = () => {
  const web3 = new Web3(window.ethereum)
  web3.eth.getAccounts(async function (err, accounts) {
    if (err != null) {
      toast.error('Error')
      return
    }
    if (accounts.length == 0) {
      toast.warn('No account found')
      return
    }
    //console.log(accounts);
    await setAccountAddress(accounts[0])
    const balanceInWei = await web3.eth.getBalance(accounts[0])
    const balanceInEther = await web3.utils.fromWei(balanceInWei, ether)
    setBalance(balanceInEther)
    console.log('Account: ' + accountAddress)
    console.log('Balance: ' + balanceInEther)
    web3.eth.defaultAccount = accountAddress
  })
}

/*
  Smart contract method's start from here.
  Note : In this code, parameter's are static and used just for 
  understanding purposes, change it accordingly.
  *** Variable account is assigned to the current selected account from the wallet.
  */
//mint token

export const mint = async (amount, nftId, royaltyFraction, uri, isERC721) => {
  const token = localStorage.getItem('auth_pass')
  try {
    const web3 = new Web3(window.ethereum)
    const contract = new web3.eth.Contract(abi, contractAddress)
    const demo_contract = new web3.eth.Contract(abi_demo, token_contract)
    const account = await new web3.eth.getAccounts()
    //amount have to be converted into wei
    // let amountInWei = web3.utils.toWei(amount)
    const txEstimateGas = await contract.methods
      .mint(amount, royaltyFraction, uri, isERC721)
      .estimateGas({
        from: account[0],
      })
      .catch((error) => {
        console.log('error==', error)
        toast.error('An error occured')
        return
      })

    contract.methods
      .mint(amount, royaltyFraction, uri, isERC721)
      .send({
        from: account[0],
        gas: txEstimateGas,
      })
      .once('transactionHash', (data) => {
        console.log('submitFunds=', data)
        let sTransactionHash = data.transactionHash
        console.log('Transaction id==', sTransactionHash)
        toast.success('Your transaction has been initiated successfully.')
      })
      .on('receipt', async (receipt) => {
        console.log('receipt==', receipt.events?.[0]?.raw?.topics?.[3])
        const hexToken = receipt.events?.[0]?.raw?.topics?.[3]
        const intToken = parseInt(hexToken, 16)

        console.log(intToken)

        console.log('nftId -----', nftId)
        await axios
          .put(
            'http://13.41.53.212:3000/api/v1/nft/update',
            {
              nftId: nftId,
              uid: intToken,
            },
            {
              headers: {
                Authorization: token,
              },
            }
          )
          .then((response) => console.log(response))
        toast.success('Your transaction has been done successfully.')
      })
      .catch((err) => {
        console.log(err)
        console.log('error=', err)
        toast.error('An error occured')
      })
  } catch (err) {
    console.log('error=', err)
    toast.error('An error occured')
  }
}

//sell item
export const sellitem = async () => {
  try {
    let amount = web3.utils.toWei('100', 'ether')
    let tokenId = 5
    let price = web3.utils.toWei('0.2', 'ether')

    await nftErc721Contract.methods.approve(contract, tokenId).send({
      from: account,
    })

    const txEstimateGas = await contract.methods
      .sellitem(tokenId, amount, uri, price)
      .estimateGas({
        from: account,
      })
      .catch((error) => {
        console.log('error==', error)
        toast.error('An error occured')
        return
      })

    contract.methods
      .sellitem(tokenId, amount, uri, price)
      .send({
        from: account,
        gas: txEstimateGas,
      })
      .once('transactionHash', (data) => {
        console.log('submitFunds=', data)
        let sTransactionHash = data.transactionHash
        console.log('Transaction id==', sTransactionHash)
        toast.success('Your sale creation in-progress.')
      })
      .on('receipt', (receipt) => {
        console.log('receipt==', receipt)
        toast.success('Your NFT is on sale.')
      })
      .catch((err) => {
        console.log(err)
        console.log('error=', err)
        toast.error('An error occured')
      })
  } catch (err) {
    console.log('error=', err)
    toast.error('An error occured')
  }
}

//buyItem

export const buyItem = async (
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
        toast.error(error.message)
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
          })
          .then((err) => console.log('error from change owner', err))
      })
      .catch((err) => {
        console.log(err)
        console.log('error=', err)
        toast.error('An error occured')
      })
  } catch (err) {
    console.log('error=', err)
    toast.error('An error occured')
  }
}

//create auction
export const createAuction = async () => {
  try {
    let amount = web3.utils.toWei('100', 'ether')
    let tokenId = 5
    let basePrice = web3.utils.toWei('0.5', 'ether')
    let startTime = Date.now()
    let endTime = Date.now() + 500

    await nftErc721Contract.methods.approve(contract, tokenId).send({
      from: account,
    })

    const txEstimateGas = await contract.methods
      .createAuction(tokenId, amount, basePrice, startTime, endTime)
      .estimateGas({
        from: account,
      })
      .catch((error) => {
        console.log('error==', error)
        toast.error('An error occured')
        return
      })

    contract.methods
      .createAuction(tokenId, amount, basePrice, startTime, endTime)
      .send({
        from: account,
        gas: txEstimateGas,
      })
      .once('transactionHash', (data) => {
        console.log('submitFunds=', data)
        let sTransactionHash = data.transactionHash
        console.log('Transaction id==', sTransactionHash)
        toast.success('Your Auction creation initiated.')
      })
      .on('receipt', (receipt) => {
        console.log('receipt==', receipt)
        toast.success('Your Auction created successfully.')
      })
      .catch((err) => {
        console.log(err)
        console.log('error=', err)
        toast.error('An error occured')
      })
  } catch (err) {
    console.log('error=', err)
    toast.error('An error occured')
  }
}

//cancelAuction
export const cancelAuction = async (tokenId, account) => {
  const web3 = new Web3(window.ethereum)
  const contract = new web3.eth.Contract(abiMarket, marketContractAddress)
  try {
    // let tokenId = 5
    const txEstimateGas = await contract.methods
      .cancelAuction(tokenId)
      .estimateGas({
        from: account,
      })
      .catch((error) => {
        console.log('error==', error)
        toast.error('An error occured')
        return
      })

    contract.methods
      .cancelAuction(tokenId)
      .send({
        from: account,
        gas: txEstimateGas,
      })
      .once('transactionHash', (data) => {
        console.log('submitFunds=', data)
        let sTransactionHash = data.transactionHash
        console.log('Transaction id==', sTransactionHash)
        toast.info('Your transaction has been initiated successfully.')
      })
      .on('receipt', (receipt) => {
        console.log('receipt==', receipt)
        toast.success('Your transaction has been done successfully.')
      })
      .catch((err) => {
        console.log(err)
        console.log('error=', err)
        toast.error('An error occured')
      })
  } catch (err) {
    console.log('error=', err)
    toast.error('An error occured')
  }
}

//bid
export const placebid = async (
  nftContractAddress,
  _price,
  tokenId,
  nftData
) => {
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
        toast.error('An error occured')
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
          })
          .catch((error) => {
            console.log(error)
          })
      })
      .catch((err) => {
        console.log(err)
        console.log('error=', err)
        toast.error('An error occured')
      })
  } catch (err) {
    console.log('error=', err)
    toast.error('An error occured')
  }
}

//approve Bid
export const approvebid = async () => {
  try {
    let bidderAddress = '0x2Cb354B9CcBe02B2c27dB399537bF3C1325aAF14'
    let tokenId = 5

    const txEstimateGas = await contract.methods
      .approvebid(tokenId, bidderAddress)
      .estimateGas({
        from: account,
      })
      .catch((error) => {
        console.log('error==', error)
        toast.error('An error occured')
        return
      })

    contract.methods
      .approvebid(tokenId, bidderAddress)
      .send({
        from: account,
        gas: txEstimateGas,
      })
      .once('transactionHash', (data) => {
        console.log('submitFunds=', data)
        let sTransactionHash = data.transactionHash
        console.log('Transaction id==', sTransactionHash)
        toast.info('Bid approval initiated.')
      })
      .on('receipt', (receipt) => {
        console.log('receipt==', receipt)
        toast.success('Bid approved successfully!')
      })
      .catch((err) => {
        console.log(err)
        console.log('error=', err)
        toast.error('An error occured')
      })
  } catch (err) {
    console.log('error=', err)
    toast.error('An error occured')
  }
}

//cancel sell only by admin
export const cancelSell = async (address, tokenId, account) => {
  const web3 = new Web3(window.ethereum)
  const contract = new web3.eth.Contract(abiMarket, marketContractAddress)
  try {
    const txEstimateGas = await contract.methods
      .cancelSell(address, tokenId)
      .estimateGas({
        from: account,
      })
      .catch((error) => {
        console.log('error==', error)
        toast('An error occured')
        return
      })

    contract.methods
      .cancelSell(address, tokenId)
      .send({
        from: account,
        gas: txEstimateGas,
      })
      .once('transactionHash', (data) => {
        console.log('submitFunds=', data)
        let sTransactionHash = data.transactionHash
        console.log('Transaction id==', sTransactionHash)
        toast('Your transaction has been initiated successfully.')
      })
      .on('receipt', (receipt) => {
        console.log('receipt==', receipt)
        toast('Your transaction has been done successfully.')
      })
      .catch((err) => {
        console.log(err)
        console.log('error=', err)
        toast('An error occured')
      })
  } catch (err) {
    console.log('error=', err)
    toast('An error occured')
  }
}

//cancelBid
export const cancelBid = async (tokenId) => {
  try {
    // let tokenId = 5
    const web3 = new Web3(window.ethereum)
    const contract = new web3.eth.Contract(abiMarket, marketContractAddress)

    const txEstimateGas = await contract.methods
      .cancelBid(tokenId)
      .estimateGas({
        from: account,
      })
      .catch((error) => {
        console.log('error==', error)
        toast('An error occured')
        return
      })

    contract.methods
      .cancelBid(tokenId)
      .send({
        from: account,
        gas: txEstimateGas,
      })
      .once('transactionHash', (data) => {
        console.log('submitFunds=', data)
        let sTransactionHash = data.transactionHash
        console.log('Transaction id==', sTransactionHash)
        toast('Your transaction has been initiated successfully.')
      })
      .on('receipt', (receipt) => {
        console.log('receipt==', receipt)
        toast('Your transaction has been done successfully.')
      })
      .catch((err) => {
        console.log(err)
        console.log('error=', err)
        toast('An error occured')
      })
  } catch (err) {
    console.log('error=', err)
    toast('An error occured')
  }
}

//burn token only by admin
export const burn = async () => {
  try {
    let tokenId = 5
    const txEstimateGas = await contract.methods
      .burn(tokenId)
      .estimateGas({
        from: account,
        gas: txEstimateGas,
      })
      .catch((error) => {
        console.log('error==', error)
        toast('An error occured')
        return
      })

    contract.methods
      .burn(tokenId)
      .send({
        from: account,
      })
      .once('transactionHash', (data) => {
        console.log('submitFunds=', data)
        let sTransactionHash = data.transactionHash
        console.log('Transaction id==', sTransactionHash)
        toast('Your transaction has been initiated successfully.')
      })
      .on('receipt', (receipt) => {
        console.log('receipt==', receipt)
        toast('Your transaction has been done successfully.')
      })
      .catch((err) => {
        console.log(err)
        console.log('error=', err)
        toast('An error occured')
      })
  } catch (err) {
    console.log('error=', err)
    toast('An error occured')
  }
}

//transfer token
export const transfer = async () => {
  try {
    let receiver = '0x2Cb354B9CcBe02B2c27dB399537bF3C1325aAF14'
    let tokenId = 5
    let amount = 1 //here amount is quantity of nft
    // let amount = web3.utils.toWei("100", "ether");
    const txEstimateGas = await contract.methods
      .transfer(account, receiver, tokenId, amount)
      .estimateGas({
        from: account,
        gas: txEstimateGas,
      })
      .catch((error) => {
        console.log('error==', error)
        toast('An error occured')
        return
      })

    contract.methods
      .transfer(account, receiver, tokenId, amount)
      .send({
        from: account,
      })
      .once('transactionHash', (data) => {
        console.log('submitFunds=', data)
        let sTransactionHash = data.transactionHash
        console.log('Transaction id==', sTransactionHash)
        toast('Your transaction has been initiated successfully.')
      })
      .on('receipt', (receipt) => {
        console.log('receipt==', receipt)
        toast('Your transaction has been done successfully.')
      })
      .catch((err) => {
        console.log(err)
        console.log('error=', err)
        toast('An error occured')
      })
  } catch (err) {
    console.log('error=', err)
    toast('An error occured')
  }
}

//sell tax
export const setSellTax = async () => {
  try {
    //TODO: percentage should be dynamic
    let percentage = 250 // 2.5 %
    const txEstimateGas = await contract.methods
      .setSellTax(percentage)
      .estimateGas({
        from: account,
        gas: txEstimateGas,
      })
      .catch((error) => {
        console.log('error==', error)
        toast('An error occured')
        return
      })

    contract.methods
      .setSellTax(percentage)
      .send({
        from: account,
      })
      .once('transactionHash', (data) => {
        console.log('submitFunds=', data)
        let sTransactionHash = data.transactionHash
        console.log('Transaction id==', sTransactionHash)
        toast('Your transaction has been initiated successfully.')
      })
      .on('receipt', (receipt) => {
        console.log('receipt==', receipt)
        toast('Your transaction has been done successfully.')
      })
      .catch((err) => {
        console.log(err)
        console.log('error=', err)
        toast('An error occured')
      })
  } catch (err) {
    console.log('error=', err)
    toast('An error occured')
  }
}

//set buy tax
export const setbuyTax = async () => {
  try {
    //TODO: percentage should be dynamic
    let percentage = 250 // 2.5 %
    const txEstimateGas = await contract.methods
      .setbuyTax(percentage)
      .estimateGas({
        from: account,
        gas: txEstimateGas,
      })
      .catch((error) => {
        console.log('error==', error)
        toast('An error occured')
        return
      })

    contract.methods
      .setbuyTax(percentage)
      .send({
        from: account,
      })
      .once('transactionHash', (data) => {
        console.log('submitFunds=', data)
        let sTransactionHash = data.transactionHash
        console.log('Transaction id==', sTransactionHash)
        toast('Your transaction has been initiated successfully.')
      })
      .on('receipt', (receipt) => {
        console.log('receipt==', receipt)
        toast('Your transaction has been done successfully.')
      })
      .catch((err) => {
        console.log(err)
        console.log('error=', err)
        toast('An error occured')
      })
  } catch (err) {
    console.log('error=', err)
    toast('An error occured')
  }
}

export const ownerOfERC721 = async (tokenId) => {
  const web3 = new Web3(window.ethereum)
  const account = await new web3.eth.getAccounts()
  const nftErc721Contract = new web3.eth.Contract(
    abiERC721,
    nftErc721ContractAddress
  )

  console.log('nftErc721Contract', nftErc721Contract)

  try {
    await nftErc721Contract.methods
      .ownerOf(tokenId)
      .call()
      .then((response) => {
        console.log('ownerofResponse', response)
      })
      .catch((err) => {
        console.log('error=', err)
      })
  } catch (err) {
    console.log('error=', err)
  }
}

export const ownerOfERC1155 = async (tokenId) => {
  const web3 = new Web3(window.ethereum)
  const account = await new web3.eth.getAccounts()
  const nftErc1155Contract = new web3.eth.Contract(
    abiERC1155,
    nftErc1155ContractAddress
  )

  console.log('nftErc1155Contract', nftErc1155Contract)

  try {
    await nftErc11Contract.methods
      .balanceOf(tokenId)
      .call({
        from: account[0],
      })
      .then((response) => {
        console.log('ownerofResponse', response)
      })
      .catch((err) => {
        console.log('error=', err)
      })
  } catch (err) {
    console.log('error=', err)
  }
}

//check bidder list
export const checkbidderList = async () => {
  try {
    let tokenId = 5
    const txEstimateGas = await contract.methods
      .checkbidderList(tokenId)
      .estimateGas({
        from: account,
        gas: txEstimateGas,
      })
      .catch((error) => {
        console.log('error==', error)
        toast('An error occured')
        return
      })

    contract.methods
      .checkbidderList(tokenId)
      .send({
        from: account,
      })
      .once('transactionHash', (data) => {
        console.log('submitFunds=', data)
        let sTransactionHash = data.transactionHash
        console.log('Transaction id==', sTransactionHash)
        toast('Your transaction has been initiated successfully.')
      })
      .on('receipt', (receipt) => {
        console.log('receipt==', receipt)
        toast('Your transaction has been done successfully.')
      })
      .catch((err) => {
        console.log(err)
        console.log('error=', err)
        toast('An error occured')
      })
  } catch (err) {
    console.log('error=', err)
    toast('An error occured')
  }
}

// listOfItemOnMarket
export const listOfItemOnMarket = async () => {
  try {
    let tokenId = 5
    const txEstimateGas = await contract.methods
      .listOfItemOnMarket(tokenId)
      .estimateGas({
        from: account,
        gas: txEstimateGas,
      })
      .catch((error) => {
        console.log('error==', error)
        toast('An error occured')
        return
      })

    contract.methods
      .listOfItemOnMarket(tokenId)
      .send({
        from: account,
      })
      .once('transactionHash', (data) => {
        console.log('submitFunds=', data)
        let sTransactionHash = data.transactionHash
        console.log('Transaction id==', sTransactionHash)
        toast('Your transaction has been initiated successfully.')
      })
      .on('receipt', (receipt) => {
        console.log('receipt==', receipt)
      })
      .catch((err) => {
        console.log(err)
        console.log('error=', err)
        toast('An error occured')
      })
  } catch (err) {
    console.log('error=', err)
    toast('An error occured')
  }
}

// end
