import actionTypes from './action-types.js'

export const initialState = {
  // loggedIn: false,
  balance: '',
  profile: {},
  activity: [],
  onSaleNft: [],
  createdNft: [],
}

const contextReducer = (state, action) => {
  switch (action.type) {
    // case actionTypes.SET_TOKEN:
    //   localStorage.setItem('user', JSON.stringify(state))
    //   return state

    // case actionTypes.REMOVE_TOKEN:
    //   localStorage.removeItem('user', JSON.stringify(state))
    //   return state

    case actionTypes.SET_BALANCE:
      return {
        ...state, 
        balance: action.payload
      }

    case actionTypes.SET_NFT_ONSALE:
      state = {
        ...state,
        onSaleNft: action.payload,
      }
      return state

    case actionTypes.SET_NFT_CREATED_BY_USER:
      state = {
        ...state,
        createdNft: action.payload,
      }
      return state

    case actionTypes.SET_PROFILE:
      state = {
        ...state,
        profile: action.payload,
      }
      return state

    case actionTypes.SET_ACTIVITY:
      state = {
        ...state,
        activity: action.payload,
      }
      return state

    default:
      return state
  }
}

export default contextReducer
