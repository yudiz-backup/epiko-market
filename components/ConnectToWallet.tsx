import React from 'react'
import { GrClose } from 'react-icons/gr'

const ConnectToWallet = (props:any) => {
    const {closeWallet, login} = props;

    const connectWallet = () => {
        login();
        closeWallet();
    }

  return (
    <div className=' fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-70 z-50 flex justify-center items-center'>
        <div className='bg-gray-100 w-[500px] h-72 px-5'>
            <div className=' w-full flex justify-between items-center py-7 px-2'>
                <h2 className='uppercase text-eGreen font-bold text-xl'>Connect your wallet</h2>
                <div className='bg-gray-200 rounded-full p-1 cursor-pointer' onClick={closeWallet}>
                    <GrClose />
                </div>
            </div>
            <div className='text-center text-sm'>
                <p>Connect with one of available wallet providers or create a new wallet. <span className='text-[#EE8FFF] font-semibold cursor-pointer'>What is wallet?</span></p>
            </div>
            <div className='h-20 flex justify-center items-center py-5'>
                <div onClick={connectWallet} className='w-60 py-2 flex gap-2 justify-center items-center text-sm bg-gray-200 border border-gray-300 cursor-pointer hover:bg-white hover:border-0 meta-mask-shadow-button'>
                    <img src='/assets/icons/meta-mask.png' className='w-8 h-8' />
                    <span className='font-semibold'>Metamask Wallet</span>
                </div>
            </div>
            <div className='text-center text-sm'>
                <p>We do not own private keys and cannot access your funds without your confirmation</p>
            </div>
        </div>
    </div>
  )
}

export default ConnectToWallet