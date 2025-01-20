import { UserSchema } from '../schemas/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { registerUser } from '../services/auth';

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
  extraReducers: (builder) => {
    builder
    // registerUser.pending 
    .addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    // registerUser.fulfilled || success 
    .addCase(registerUser.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
    })
    // registerUser.rejected 
    .addCase(registerUser.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.loading = false;
      state.error = action.payload || 'Registeration failed';
    })
  
  },

})


export default authSlice.reducer
