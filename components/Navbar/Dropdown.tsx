import React from 'react'
import { IoCreate, IoExit } from 'react-icons/io5'
import { IoIosListBox } from 'react-icons/io'
import { RiSettingsFill, RiAccountCircleFill } from 'react-icons/ri'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useWeb3React } from '@web3-react/core'
import { injected } from '../../blockchain/connectors'

const Dropdown = (props: any) => {
  const {
    active,
    account,
    library: web3,
    connector,
    activate,
    deactivate,
  } = useWeb3React()
  const router = useRouter()

  console.log('activeactiveactiveactive', injected)

  const disconnect = async () => {
    try {
      await deactivate(injected)
      console.log('inside disconnect')
      // localStorage.removeItem('auth_pass')
    } catch (ex) {
      console.log(ex)
    }
  }

  return (
    <div className="shadow-dropdown absolute top-11 z-30 h-auto w-full bg-white px-5 py-3">
      <div className="flex flex-col gap-3 border-b-[1px] border-gray-300 pb-4">
        <div
          onClick={() => router.push('/create')}
          className="flex cursor-pointer items-center justify-start gap-4 p-1 font-bold text-eBlue"
        >
          <IoCreate className="text-2xl" />
          <span className="text-sm text-eGreen">Create</span>
        </div>
        <Link href="/profile">
          <div className="flex cursor-pointer items-center justify-start gap-4 p-1 font-bold text-eBlue">
            <RiAccountCircleFill className="text-2xl" />
            <span className="text-sm text-eGreen">Profile</span>
          </div>
        </Link>
        <Link href="/profile-edit">
          <div className="flex cursor-pointer items-center justify-start gap-4 p-1 font-bold text-eBlue">
            <RiSettingsFill className="text-2xl" />
            <span className="text-sm text-eGreen">Settings</span>
          </div>
        </Link>
      </div>
      <div className="">
        <div
          onClick={props.logout}
          className="flex cursor-pointer items-center justify-start gap-4 p-1 py-4 font-bold text-red-500"
        >
          <IoExit className="text-2xl" />
          <span className="text-sm text-eGreen" onClick={disconnect}>
            Sign out
          </span>
        </div>
      </div>
    </div>
  )
}

export default Dropdown
