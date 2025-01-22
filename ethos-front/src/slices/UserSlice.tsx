import { UserInDBSchema } from '../schemas/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  loading: boolean;
  user: UserInDBSchema | null;
  error: string | null;
  success: boolean;
}

const initialState : UserState = {
  loading: false,
  user: null,
  error: null,
  success: false,
}


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers : {},

  extraReducers: (builder) => {
    builder
    .addCase()
  },

})