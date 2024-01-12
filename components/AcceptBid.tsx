import React, {useState} from 'react'
import { GrClose } from 'react-icons/gr'
import Success from './Details/Status/Success';

const AcceptBid = (props:any) => {
    const {closeBid} = props;

    // const [next, setNext] = useState(false);

    // const gotoNextSteps = () => {
    //     setNext(true);
    // }

  return (
    <div className={` fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-70 z-50 flex justify-center items-center`}>
        <div className='bg-gray-100 w-[500px] h-auto px-7'>
            <div className=' w-full flex justify-between items-center pt-7 pb-5'>
                <h2 className='uppercase text-eGreen font-bold text-xl'>accept bid</h2>
                <div className='bg-gray-200 rounded-full p-1 cursor-pointer' onClick={closeBid}>
                    <GrClose />
                </div>
            </div>
            <div className='flex gap-2'>
                <Success />
                <p className='w-5/6'>You are about to accept a bid for Epiko from Chris</p>
            </div>
            <div className='py-5 text-left font-black text-3xl border-b-2 border-gray-200'>
              1.46 ETH for 1 edition
            </div>
            <div className='py-4 border-b-2 border-gray-200'>
              <div className='flex justify-between items-center w-full pb-2'>
                <p className='text-gray-500'>Service fee</p>
                <p className='font-bold'>0 ETH</p>
              </div>
              <div className='flex justify-between items-center w-full'>
                <p className='text-gray-500'>Total bid amount</p>
                <p className='font-bold'>1.46 ETH</p>
              </div>
            </div>
            <div className=' flex flex-col gap-2 justify-center items-center py-8'>
                <div className='w-72 flex justify-center items-center shadow-place-bid-btn gradient-btn'>
                    Accept Bid
                </div>
                <div className='w-72 flex justify-center items-center normal-btn'>
                    Cancel
                </div>
            </div>
        </div>
    </div>
  )
}

export default AcceptBid