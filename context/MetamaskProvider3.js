import React, { createContext, useEffect, useState } from "react";
import { injected } from '../blockchain/connectors'
import { useWeb3React } from '@web3-react/core'
import Web3 from 'web3';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const MetamaskContext = createContext({});

let ethereum;

export const MetamaskProvider = ({ children }) => {
  const { active, account, library : web3, connector, activate, deactivate } = useWeb3React()
  const [chain, setChain] = useState();
  const [canMint, setCanMint] = useState(false);

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) {
        // window.alert("You must install MetaMask to use this website");
        toast.error("You must install MetaMask to use this website")
        return;
      }

      ethereum = window.ethereum;
      setChain(parseInt(ethereum.chainId));
      ethereum.on("chainChanged", () => {
        setChain(parseInt(window.ethereum.chainId));
      });

      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        setCanMint(true);
      }
    } catch (e) {
      toast.error("Error please check Metamask for correct credentials");
    }
  };

  const signUser = async () => {
    const sMessage = `Celo NFT uses this cryptographic signature in place of a password, verifying that you are the owner of this Ethereum address - ` + new Date().getTime()
    console.log(sMessage);
    // login api
    // const web3 = new Web3(window.ethereum)
    console.log("web3: ", web3);
    console.log("Address: ", account);
    const signature = await web3.eth.personal.sign(sMessage, account)

    console.log(signature);
    axios.post(`${url}/auth/signin`, {
      "sWalletAddress": account,
      "sMessage": sMessage,
      "sSignature": signature
    }) 
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [chain]);

  async function connect() {
    try {
      await activate()
      setCanMint(true)
    } catch (e) {
      // alert("Please connect Metamask to Ethereum Mainnet");
      toast.warn("Please connect Metamask to Rinkeby Network")
    }
  }

  return (
    <MetamaskContext.Provider
      value={{
        chain,
        canMint,
        connect,
        deactivate,
        signUser,
      }}
    >
      {children}
    </MetamaskContext.Provider>
  );
};