import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import * as React from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider, EmotionCache } from '@emotion/react'
import theme from '../theme'
import createEmotionCache from '../createEmotionCache'
import { Provider, useStateValue } from '../context/context.js'
import { Web3ReactProvider } from '@web3-react/core'
import Web3 from 'web3'
import MetamaskProvider from '../context/MetamaskProvider'
import contextReducer, { initialState } from '../context/contextReducer'
import axios from 'axios'
import actionTypes from '../context/action-types'
import { LocalizationProvider } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'

// import { provider } from 'web3-core';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

function getLibrary(provider: any) {
  return new Web3(provider)
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>

        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Provider initialState={initialState} reducer={contextReducer}>
            <Web3ReactProvider getLibrary={getLibrary}>
              <MetamaskProvider>
                <Component {...pageProps} />
              </MetamaskProvider>
            </Web3ReactProvider>
          </Provider>
        </ThemeProvider>
      </CacheProvider>
    </LocalizationProvider>
  )
}
