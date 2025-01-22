import { createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit';
import axios, {AxiosError} from 'axios';
import Config from '../config';
import { UserInDBSchema } from '../schemas/user';


// get user thunk 
export const getUser = createAsyncThunk<UserInDBSchema, { rejectValue: string}> (
  'auth/register',
  async ({ rejectWithValue }) => { 
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await axios.post(
        `${Config.baseURL}/user/me`,
        config
      );
      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      // Handle Axios errors with type safety
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        if (axiosError.response && axiosError.response.data.message) {
          return rejectWithValue(axiosError.response.data.message);
        }
      }
      // Handle non-Axios errors or generic error messages
      return rejectWithValue((error as Error).message);
    }
  }

);
