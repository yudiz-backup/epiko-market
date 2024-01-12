import React, { useReducer, createContext, useContext } from 'react'
import contextReducer from './contextReducer.js'
import actionTypes from './action-types'

export const StateContext = createContext()

export const Provider = ({ reducer, initialState, children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
)

export const useStateValue = () => useContext(StateContext)
