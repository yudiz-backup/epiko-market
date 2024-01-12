import React, { useEffect, useState } from 'react'
import { injected } from '../blockchain/connectors'
import { useWeb3React } from '@web3-react/core'

function MetamaskProvider({ children }) {
  const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React()
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    injected
      .isAuthorized()
      .then((isAuthorized) => {
        setLoaded(true)
        if (isAuthorized && !networkActive && !networkError) {
          activateNetwork(injected)
        }
      })
      .catch(() => {
        setLoaded(true) 
      })
  }, [activateNetwork, networkActive, networkError])
  if (loaded) {
    return children
  }
  return  <div className='absolute w-screen h-screen flex justify-center items-center'>
            <div className="spinner-container">
              <div className="loading-spinner">
              </div>
            </div>
          </div>
}

export default MetamaskProvider