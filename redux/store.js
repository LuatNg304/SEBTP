import { configureStore } from '@reduxjs/toolkit'
import  accountSlideReducer  from './accountSlide'

export const store = configureStore({
  reducer: {
    account: accountSlideReducer
  },
})