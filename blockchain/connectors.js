import  { InjectedConnector }  from '@web3-react/injected-connector'


export const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] })

// export const infura = new NetworkOnlyConnector({
//     providerURL: "https://rinkeby.infura.io/v3/1580c0fc3df645be82c259aa72cad169"
//   })
   
// const connectors = { injected, infura }