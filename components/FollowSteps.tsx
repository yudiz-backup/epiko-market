import React, {useState} from 'react'
import { GrClose } from 'react-icons/gr'
import DoneBtn from './Details/Buttons/DoneBtn';
import FailBtn from './Details/Buttons/FailBtn';
import StartBtn from './Details/Buttons/StartBtn';
import Failed from './Details/Status/Failed';
import Pending from './Details/Status/Pending';
import Success from './Details/Status/Success';

const FollowSteps = (props:any) => {
    const {closeBid} = props;

    const [convert, setConvert] = useState(true);
    const [approve, setApprove] = useState(false);
    const [signature, setSignature] = useState(false);
    
    const convertPass = () => {
        setConvert(true);
    }
    const approvePass = () => {
        setApprove(true);
    }
    const signaturePass = () => {
        setSignature(true);
    }



  return (
    <div className={` fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-70 z-50 flex justify-center items-center`}>
        <div className='bg-gray-100 w-[450px] h-auto px-7'>
            <div className=' w-full flex justify-between items-center pt-7 pb-5'>
                <h2 className='uppercase text-eGreen font-bold text-xl'>Place a bid</h2>
                <div className='bg-gray-200 rounded-full p-1 cursor-pointer' onClick={closeBid}>
                    <GrClose />
                </div>
            </div>
            <div className='flex flex-col'>
                <div className='flex gap-5 border-b-2 border-gray-200 py-5'>
                    <div className='flex gap-3 items-center justify-start w-2/3 pl-2'>
                        {convert ? <Success /> : <Pending />}
                        <div className='w-2/3 flex flex-col gap-1 justify-start items-center'>
                            <h3 className='font-bold '>Upload files & Mint token</h3>
                            <span className='text-xs text-[#9A9A9A]'>Call contract method</span>
                        </div>
                    </div>
                    <div className='flex justify-center items-center w-1/3'>
                        {convert ? <DoneBtn /> : <StartBtn pass={convertPass} />}
                    </div>
                </div>
                <div className='flex gap-5 border-b-2 border-gray-200 py-5'>
                    <div className='flex gap-3 items-center justify-start w-2/3 pl-2'>
                        {approve ? <Success /> : <Pending />}
                        <div className='w-2/3 flex flex-col gap-1 justify-start items-start'>
                            <h3 className='font-bold '>Sign sell order</h3>
                            <span className='text-xs text-[#9A9A9A]'>Sign sell order using your wallet</span>
                        </div>
                    </div>
                    <div className='flex justify-center items-center w-1/3'>
                        {approve ? <DoneBtn /> : <StartBtn pass={approvePass} />}
                    </div>
                </div>
                <div className='flex gap-5 border-b-2 border-gray-200 py-5'>
                    <div className='flex gap-3 items-center justify-start w-2/3 pl-2'>
                        {signature ? <Failed /> : <Pending />}
                        <div className='w-2/3 flex flex-col gap-1 justify-start items-start'>
                            <h3 className='font-bold '>Sign lock order</h3>
                            <span className='text-xs text-[#9A9A9A]'>Sign lock order using your wallet</span>
                        </div>
                    </div>
                    <div className='flex justify-center items-center w-1/3'>
                        {signature ? <FailBtn /> : <StartBtn pass={signaturePass} />}
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default FollowSteps