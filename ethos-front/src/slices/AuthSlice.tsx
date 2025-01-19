import { UserSchema } from '../schemas/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface AuthState {
  loading: boolean;
  user: UserSchema | null; // Store user object or null
  token: string | null; // Store JWT or null
  error: string | null; // Store error message or null
  success: boolean; // Monitor registration or other operations
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  success: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
  
  },
  extraReducers: (builder) => {},

})


export default authSlice.reducer
