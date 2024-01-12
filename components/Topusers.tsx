import React from 'react'
import Card2 from './Card2'
import Dropdown from './Listbox'
import TopBuyerSwiper from './TopBuyerSwiper'
import TopSellerSwiper from './TopSellerSwiper'
import TopSeller from './TopSeller'
import TopBuyer from './TopBuyer'

const Topusers = () => {
  return (
    <div className="mt-10 bg-eGray py-10">
      <div className="contain hidden lg:block">
        <TopSeller name="Top Sellers" />
        <TopBuyer name="Top Buyers" />
        {/* <div className='top pb-20'>
                <div className='py-10'>
                    <div className='flex items-center text-eGreen'>
                    <div className='h-9 w-9 flex justify-end items-start'>
                        <img src='/assets/icons/double_arrow.svg' alt='' />
                    </div>
                    <h2 className='text-2xl font-bold'>Top Sellers</h2>
                    </div>
                </div>
                <div className='flex justify-between'>
                    {
                        [1,2,3,4,5,6,7,8,9,10].filter(num=>num<7).map((num, index)=>(
                            <div key={index}>
                                <Card2 />
                            </div>
                        ))
                    }
        
                </div>
            </div> */}
        {/* <div className='bottom'>
                <div className='py-10'>
                    <div className='flex items-center text-eGreen'>
                    <div className='h-9 w-9 flex justify-end items-start'>
                        <img src='/assets/icons/double_arrow.svg' alt='' />
                    </div>
                    <h2 className='text-2xl font-bold'>Top Buyers</h2>
                    </div>
                </div>
                <div className='flex justify-between'>
                    <Card2 />
                    <Card2 />
                    <Card2 />
                    <Card2 />
                    <Card2 />
                    <Card2 />
                </div>
            </div> */}
      </div>
      <div className="contain block lg:hidden">
        <TopSellerSwiper name="Top Sellers" />
        <TopBuyerSwiper name="Top Buyers" />
      </div>
    </div>
  )
}

export default Topusers
