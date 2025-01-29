import useFlash from "../../hooks/UseFlash";
import React, { useEffect, useRef, useState } from "react";
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from "../../store";
// form and yup validation 
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form'
import { UpdateProjectSchema, yupUpdateProjectSchema } from '../../schemas/project'
import axios from "axios";
import { updateProject, useGetProjectDetailQuery } from "../../services/project";
import SpinnerLineWave from "../spinner";
import { useParams } from "react-router-dom";



export const UpdateProject = () => {
  const { loading, error, success } = useSelector((state: RootState) => state.project); // Type-safe selector
  let [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch<AppDispatch>(); // Type-safe dispatch 
  const {id} = useParams();
  const { data: project, isLoading } = useGetProjectDetailQuery(id);

  const flash = useFlash();

  const titleField = useRef<HTMLInputElement>(null);
  const descriptionField = useRef<HTMLInputElement>(null);
  const github_urlField = useRef<HTMLInputElement>(null);
  const project_urlField = useRef<HTMLInputElement>(null);
  const rolesField = useRef<HTMLInputElement>(null);

  useEffect(() => {

    if (project) {
      if (titleField.current) titleField.current.value = project.title || "";
      if (descriptionField.current) descriptionField.current.value = project.description || '';
      if (github_urlField.current) github_urlField.current.value = project.github_url || '';
      if (project_urlField.current) project_urlField.current.value = project.project_url || '';
    //   if (rolesField.current) rolesField.current.value = project.roles || '';
    }
  }, [project]);

  // dialog popup and close 
  function open() {
    setIsOpen(true)
  }
  function close() {
    setIsOpen(false)
  }

  //   const formData = new FormData();
  const {
      register,
      handleSubmit,
      formState: { errors },  setError, clearErrors
  } = useForm<UpdateProjectSchema>({ resolver: yupResolver(yupUpdateProjectSchema) });
  
  //   const formData = new FormData();


  const onSubmit = async (data: UpdateProjectSchema) => {
    console.log('project form subit test begin')

    console.log('form subit test begin')

    try {
        console.log('onsubmit in')
        clearErrors(); // Clear any previous errors
        // check if username exist 
        // const existingUserResponse = await axios.get(`${Config.baseURL}/auth/check-username?username=${data.username}`);
        // // console.log(existingUserResponse)
        // if (existingUserResponse.data.exists) {
        //   setError("username", { type: "manual", message: "Username already exists" });
        //   return;
        // }
        // check if email exist 
        console.log(id)
        const response = await dispatch(updateProject({
            _id: id,
            title: titleField.current?.value,
            description: descriptionField.current?.value,
            github_url: github_urlField.current?.value,
            roles: rolesField.current?.value,
            project_url: project_urlField.current?.value

            }));
        // console.log(response.payload)

        if (success) {
            flash("Project Updated", "success")
            // console.log('Project created successfully:', response);

            return response.payload;
        }
      } catch (err: any) {
        console.error("Registration error:", err);
        flash("Project Update Failed", "error")

        if (axios.isAxiosError(err)) {
          setError("root", { type: "manual", message: err.response?.data?.message || err.message || 'Registration failed due to network error' });
        } else {
          setError("root", { type: "manual", message: "An unexpected error occurred during registration." });
        }
      }
  }

  return (
    <>
      <Button
        onClick={open}
        className="flex select-none items-center gap-2 rounded bg-slate-800 py-2.5 px-4 text-xs font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:shadow-lg hover:shadow-slate-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
      >
        Update Project
      </Button>

      <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close}>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <DialogTitle as="h3" className="text-base/7 font-medium text-white justify-center">
                Add New Project
              </DialogTitle>

              <form onSubmit={handleSubmit(onSubmit)}>
                
                {/* <Field> */}
                <div className="col-span-6 sm:col-span-3">
                    <label  htmlFor="Title" className="flex text-sm font-medium text-gray-700 py-1" >Title</label>
                    <input className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm" {...register("title")} ref={titleField} />
                    {errors.title && <p className="flex mt-2 text-xs text-red-600">{errors.title.message}</p>}
                </div>
                 

                <div className="col-span-6 sm:col-span-3">
                    <label  htmlFor="Description" className="flex text-sm font-medium text-gray-700 py-1" >Description</label>
                    <input className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm" {...register("description")} ref={descriptionField}/>
                    {errors.description && <p className="flex mt-2 text-xs text-red-600">{errors.description.message}</p>}
                </div>

                <div className="col-span-6 sm:col-span-3">
                    <label  htmlFor="github_url" className="flex text-sm font-medium text-gray-700 py-1" >Github URL</label>
                    <input className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm" {...register("github_url")} ref={github_urlField}/>
                    {errors.github_url && <p className="flex mt-2 text-xs text-red-600">{errors.github_url.message}</p>}
                </div>

                <div className="col-span-6 sm:col-span-3">
                    <label  htmlFor="github_url" className="flex text-sm font-medium text-gray-700 py-1" >Project URL</label>
                    <input className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm" {...register("project_url")} ref={project_urlField}/>
                    {errors.project_url && <p className="flex mt-2 text-xs text-red-600">{errors.project_url.message}</p>}
                </div>

                 <div className="col-span-6 sm:col-span-3">
                    <label  htmlFor="github_url" className="flex text-sm font-medium text-gray-700 py-1" >Roles</label>
                    <input className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm" {...register("roles")} />
                    {errors.roles && <p className="flex mt-2 text-xs text-red-600">{errors.roles.message}</p>}
                </div>
                 
                  
                {/* <Button
                  className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                  type="submit"
                >
                  Submit
                </Button> */}
                <button
                    className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-10 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                    type="submit" aria-disabled={loading}
                    >
                    {loading ? <SpinnerLineWave /> : 'Update project'}
                </button>
              
              </form>

            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default UpdateProject;