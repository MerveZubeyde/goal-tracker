import { configureStore } from '@reduxjs/toolkit'
import goalsReducer from '../features/goals/goalsSlice'
import authReducer from '../features/auth/authSlice'
import profileReducer from '../features/profile/profileSlice';

export const store = configureStore({
  reducer: {
    goals: goalsReducer,
    auth: authReducer, 
    profile: profileReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
