import { createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit';
import axios, {AxiosError} from 'axios';
import { UserSchema } from '../schemas/user';
import { RegisterUserInputSchema, RegisterUserOutputSchema } from '../schemas/Auth';
import Config from '../config';



// register user thunk
export const registerUser = createAsyncThunk<RegisterUserOutputSchema, RegisterUserInputSchema, { rejectValue: string}> (
  'auth/register',
  async ({ username, email, password }: RegisterUserInputSchema, { rejectWithValue }) => { 
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await axios.post(
        `${Config.baseURL}/auth/register`,
        { username, email, password },
        config
      );
      if (response.status === 201) {
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


// Async thunk for login
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: { username: string; password: string }, { rejectWithValue }) => {
        try {
          const response = await axios.post('/api/auth/login', credentials); // Your FastAPI endpoint
          const { access_token, user } = response.data;
          localStorage.setItem('token', access_token); // Store token in local storage
          return { token: access_token, user };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Login failed');
        }
    }
);
