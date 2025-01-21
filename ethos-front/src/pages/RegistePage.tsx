import { RegInputField } from "../components/Auth/RegisterForm";
import EthosBody from "../components/Body";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@headlessui/react";
import useFlash from "../hooks/UseFlash";
import Config from "../config";
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from "../store";
import { registerUser } from "../services/auth";
import SpinnerLineWave from "../components/spinner";
import ErrorComponent from "../components/error";
// form and yup validation 
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form'
import { schema , RegisterUserInputSchema } from '../schemas/auth'
import axios from "axios";


// type FormErrorType = {
//   email?: string;
//   username?: string;
//   password?: string;
//   confirm?: string;
// };


const RegisterPage = () => {

  const { loading, error, success } = useSelector((state: RootState) => state.auth); // Type-safe selector
  const dispatch = useDispatch<AppDispatch>(); // Type-safe dispatch 

  // const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm<RegisterUserInputSchema>({
  //   resolver: yupResolver(schema)
  //   // defaultValues: {
  //   //   email: '',
  //   //   username: '',
  //   //   password: '',
  //   //   confirm: '',
  //   // }
  // });

  const {
      register,
      handleSubmit,
      formState: { errors },  setError, clearErrors
    } = useForm<RegisterUserInputSchema>({ resolver: yupResolver(schema) });
  


  const flash = useFlash();
  const navigate = useNavigate();

 
  // Redirect to login page if registration is successful
  useEffect(() => {
    // setFormerrors({})
    if (success) {
      navigate('/login'); // Replace '/login' with the actual path to your login page
      flash('Registeration successful', 'success')

    }
  }, [success, navigate]);


  const onSubmit = async (data: RegisterUserInputSchema) => {
      try {
        console.log('onsubmit in')
        clearErrors(); // Clear any previous errors
        console.log('onsubmit clear errors')

        const existingUserResponse = await axios.get(`${Config.baseURL}/auth/check-username?username=${data.username}`);
        console.log(existingUserResponse)
        if (existingUserResponse.data.exists) {
          setError("username", { type: "manual", message: "Username already exists" });
          return;
        }
        dispatch(registerUser({
          username: data.username, email: data.email, password: data.password,
          confirm: ""
        }));
      } catch (err: any) {
        console.error("Registration error:", err);
        if (axios.isAxiosError(err)) {
          setError("general", { type: "manual", message: err.response?.data?.message || err.message || 'Registration failed due to network error' });
        } else {
          setError("general", { type: "manual", message: "An unexpected error occurred during registration." });
        }
      }
    };
 

  return (
    <>
      <EthosBody nav={false}>
        <section className="bg-white">
          <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
            {/* <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
              <img src="/pexels-gabby-k-9430875.jpg" className="absolute inset-0 h-full w-full object-cover"/>
            </aside> */}

            <main
              className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
            >
              <div className="max-w-xl lg:max-w-3xl shadow-lg pb-5 px-3 rounded-md">
                <a className="block text-[#ba2a25]" href="/">
                  <span className="sr-only">Home</span>
                  {/* <StoreIcon className="h-[4rem] w-fit"/> */}
                </a>

                <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                  Welcome to Ethos <span className="inline-flex absolute mt-1 ml-1">
                  {/* <ShoppingBag /> */}
                  </span>
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid grid-cols-6 gap-6">
                  {/* {error && <ErrorComponent error={error}></ErrorComponent>} */}
                  {/* {errors.general && <ErrorComponent error={errors.general.message} />} */}
                  <div className="col-span-6">
                  
                    <label>Email</label>
                    <input {...register("email")} />
                    {errors.email && <p>{errors.email.message}</p>}

                 
                    <label>Username</label>
                    <input {...register("username")} />
                    {errors.username && <p>{errors.username.message}</p>}

  

                    <label>Password</label>
                    <input {...register("password")} />
                    {errors.password && <p>{errors.password.message}</p>}


                 
                    <label>Confirm Password</label>
                    <input {...register("confirm")} />
                    {errors.confirm && <p>{errors.confirm.message}</p>}

                    <div className="col-span-6">
                      <label htmlFor="MarketingAccept" className="flex gap-4">
                        <input
                          type="checkbox"
                          id="MarketingAccept"
                          name="marketing_accept"
                          className="size-5 rounded-md border-gray-200 bg-white shadow-sm"
                        />

                        <span className="text-sm text-gray-700">
                          I want to receive emails about events, product updates and company announcements.
                        </span>
                      </label>
                    </div>

                    <div className="col-span-6">
                      <p className="text-sm text-gray-500">
                        By creating an account, you agree to our
                        <a href="#" className="text-gray-700 underline"> terms and conditions </a>
                      </p>
                    </div>

          
                    <div className="max-w-max sm:flex py-4 sm:items-center sm:gap-4">

                      <Button
                        className="inline-block shrink-0 rounded-md border border-slate-900 bg-slate-800 hover:bg-transparent py-3 px-12 text-sm font-semibold text-white transition shadow-slate-600 focus:outline-1 hover:text-slate-900 data-[focus]:outline-2"
                        type="submit" disabled={loading}
                      >
                        {loading ? <SpinnerLineWave /> : 'Create Account'}

                      </Button>
                        <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                          Already have an account?
                          <a href="/login" className="text-gray-700 underline"> Log in</a>.
                        </p>
                    </div>
                    
                  </div>
                </form>


              </div>
            </main>
          </div>
        </section>

        {/* <form onSubmit={onSubmit}>
         
        </form> */}
      </EthosBody>
    </>
  );
};

export default RegisterPage;