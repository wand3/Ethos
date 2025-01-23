// import { createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit';
// import axios, {AxiosError} from 'axios';
import Config from '../config';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store'; // Import your RootState type
import { UserInDBSchema } from '../schemas/user';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: Config.baseURL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token; // Type the getState result
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers; // Important: Return the headers
    },
  }),
  endpoints: (builder) => ({
    getUserDetails: builder.query<UserInDBSchema, void>({ // Type the query result and argument
      query: () => ({
        url: `${Config.baseURL}/user/me`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetUserDetailsQuery } = authApi; // Export the hook
// // get user thunk 
// export const getUser = createAsyncThunk<UserInDBSchema, { rejectValue: string}> (
//   'auth/register',
//   async ({ rejectWithValue }) => { 
//     try {
//       const config = {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       };
//       const response = await axios.post(
//         `${Config.baseURL}/user/me`,
//         config
//       );
//       if (response.status === 200) {
//         return response.data
//       }
//     } catch (error) {
//       // Handle Axios errors with type safety
//       if (axios.isAxiosError(error)) {
//         const axiosError = error as AxiosError<{ message: string }>;
//         if (axiosError.response && axiosError.response.data.message) {
//           return rejectWithValue(axiosError.response.data.message);
//         }
//       }
//       // Handle non-Axios errors or generic error messages
//       return rejectWithValue((error as Error).message);
//     }
//   }

// );
