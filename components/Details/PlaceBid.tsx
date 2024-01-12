import React, {useState} from 'react'
import { GrClose } from 'react-icons/gr'
import StepTwo from './StepTwo'
import StepOne from './StepOne';

const PlaceBid = (props:any) => {
    const {closeBid} = props;

    const [next, setNext] = useState(false);

    const gotoNextSteps = () => {
        setNext(true);
    }

  return (
    <div className={` fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-70 z-50 flex justify-center items-center`}>
        {
            next ? <StepTwo closeBid={closeBid} /> : <StepOne closeBid={closeBid} gotoNextSteps={gotoNextSteps} />
        }
    </div>
  )
}

export default PlaceBid;