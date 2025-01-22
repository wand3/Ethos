import { UserSchema } from '../schemas/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { registerUser, loginUser } from '../services/auth';


// initialize userToken from local storage
const userToken = localStorage.getItem('token')
  ? localStorage.getItem('token')
  : null



interface AuthState {
  loading: boolean;
  user: UserSchema | null; // Store user object or null
  token: string | null; // Store JWT or null
  error: string | null; // Store error message or null
  success: boolean; // Monitor registration or other operations
}

const initialState: AuthState = {
  user: null,
  token: userToken,
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
    // -------------- user login 
    // loginUser pending 
    .addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    // loginUser.fulfilled 
    .addCase(loginUser.fulfilled, (state, action: PayloadAction<{user: UserSchema; access_token: string}>) => { // Type the payload
        state.loading = false;
        state.user = action.payload.user;
        console.log(state.user)
        state.success = true;
        state.token = action.payload.access_token;
      })

    // .addCase(loginUser.fulfilled, (state, action: PayloadAction<string | undefined>) => {
    //   state.loading = false;
    //   state.user = action.payload;
    //   state.success = true;
    //   state.token = userToken;
    // })
    //     if error for any case that relates to No overload matches this call.
    //   Overload 1 of 2, '(actionCreator: AsyncThunkFulfilledActionCreator<LoginUserOutputSchema, LoginUserInputSchema, { rejectValue: string; state?: unknown; dispatch?: ThunkDispatch<unknown, unknown, UnknownAction> | undefined; ... 4 more ...; rejectedMeta?: unknown; }>, reducer: CaseReducer<...>): ActionReducerMapBuilder<...>', gave the following error.
    //     Argument of type '(state: WritableDraft<AuthState>, action: { payload: { user: UserSchema; access_token: string; }; type: string; }) => void' is not assignable to parameter of type 'CaseReducer<AuthState, PayloadAction<LoginUserOutputSchema, string, { arg: LoginUserInputSchema; requestId: string; requestStatus: "fulfilled"; }, never>>'.


    // The error you're getting, "No overload matches this call... Argument of type '(state: WritableDraft<AuthState>, action: { payload: { user: UserSchema; access_token: string; }; type: string; }) => void' is not assignable to parameter of type 'CaseReducer<AuthState, PayloadAction<LoginUserOutputSchema...>>'", is a common TypeScript issue when working with Redux Toolkit and asynchronous actions. It arises from a mismatch between the expected payload type in your reducer and the actual payload type coming from the fulfilled action.

    // Here's the breakdown of the problem and the solution:

    // Problem:

    // You're likely defining your LoginUserOutputSchema differently from how you're using it in the extraReducers. TypeScript is very strict about type matching, and even slight differences can cause this error.

    // Solution:

    // Ensure that your LoginUserOutputSchema exactly matches the payload you're returning from your userLogin async thunk.


    // loginUser.rejected
    .addCase(loginUser.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.loading = false;
      state.error = action.payload || 'Login failed';
    })



    // -------------- user registeration 
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
