import React from 'react'
import Card from './Card'

import Data from './data'

const Discover = () => {
  return (
    <section className="contain py-40">
      <div className="py-10">
        <div className="flex items-center text-eGreen">
          <div className="flex h-9 w-9 items-start justify-end">
            <img src="/assets/icons/double_arrow.svg" alt="" />
          </div>
          <h2 className="text-2xl font-bold">Discover</h2>
        </div>
      </div>
      <div className="flex w-full gap-3">
        {Data.filter((data) => data.id < 5).map((data) => (
          <Card key={data.id} data={data} />
        ))}
      </div>
    </section>
  )
}

export default Discover
