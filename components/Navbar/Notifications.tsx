import React from 'react'
import NotificationItem from './NotificationItem'

const Notifications = (props: any) => {
  const { data } = props
  return (
    <div className="shadow-button absolute top-11 left-1/2 z-50 h-80 w-72 -translate-x-1/2 bg-white p-3">
      <div className="p-2 text-2xl font-bold text-eGreen">
        <h1>Notifications</h1>
      </div>
      <div className="h-60 overflow-y-auto ">
        {data?.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center text-center text-lg font-semibold">
            <h3>No Notifications Found</h3>
          </div>
        ) : (
          data?.map((item: any, index: any) => (
            <NotificationItem key={index} data={item} />
          ))
        )}
      </div>
    </div>
  )
}

export default Notifications
