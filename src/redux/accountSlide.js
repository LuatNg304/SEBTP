import { createSlice } from '@reduxjs/toolkit'

const initialState = null

export const accountSlide = createSlice({
  name: 'account',
  initialState,
  reducers: {
   login : (state, action) => {
        state = action.payload
        return state
   },
   logout: () => {
    return initialState
   },
    
  },
})

// Action creators are generated for each case reducer function
export const { login,logout } = accountSlide.actions

export default accountSlide.reducer