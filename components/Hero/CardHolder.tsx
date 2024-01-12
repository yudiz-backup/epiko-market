import React from 'react'
import HeroCard from './HeroCard'

const CardHolder = ({ cardData }) => {
  //   console.log('cardDataaaaa', cardData)
  //   const data = Data.filter((x) => x.id < 5)
  //   const cardDataArr = cardData.slice(0, 3).map
  return (
    // <div className='relative'>
    //     <div className='absolute top-10 left-10 z-20'>
    //         <HeroCard data={data[3]} />
    //     </div>
    //     <div className='absolute top-24 left-24 z-10'>
    //         <HeroCard data={data[2]} />
    //     </div>
    //     <div className='absolute top-36 left-36'>
    //         <HeroCard data={data[1]} />
    //     </div>
    // </div>
    <div className="relative h-full w-full">
      <div className="absolute bottom-20 right-20 z-20">
        <HeroCard data={cardData[0]} />
      </div>
      <div className="absolute bottom-10 right-10 z-10">
        <HeroCard data={cardData[1]} />
      </div>
      <div className="absolute bottom-0 right-0">
        <HeroCard data={cardData[2]} />
      </div>
    </div>
  )
}

export default CardHolder
