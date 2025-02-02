import useFlash from "../../hooks/UseFlash";
import React, { useState } from "react";
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from "../../store";
// form and yup validation 
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form'
import { projectImagesSchema, AddProjectImagesSchema } from '../../schemas/project'
import axios from "axios";
import { createProject, updateProjectImages } from "../../services/project";
import SpinnerLineWave from "../spinner";
import { useParams } from "react-router-dom";


export const UpdateProjectImages = () => {
  const { id } = useParams();
  const { loading, error, success } = useSelector((state: RootState) => state.project); // Type-safe selector
  let [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch<AppDispatch>(); // Type-safe dispatch 

  // image upload 
  const [images, setImages] = useState<File[] | []>([]);
  const [status, setStatus] = useState<'initial'| 'uploading'| 'success' | 'fail'>('initial')
  const [previewURLs, setPreviewURLs] = useState<string[]>([]);

  const flash = useFlash();

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
  } = useForm<AddProjectImagesSchema>({ resolver: yupResolver(projectImagesSchema) });
  


  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setImages((prevFiles) => [...prevFiles, ...files]);
    setPreviewURLs((prevPreviews) => [
      ...prevPreviews,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };
  

  // remove image from preview 
  const handleRemoveImage = (index: number) => {
    if (images) {
      setImages(images.filter((_, i) => i !== index));
      setPreviewURLs(previewURLs.filter((_, i) => i !== index));
    }
  };

//   const formData = new FormData();

  const onSubmit = async (data: AddProjectImagesSchema) => {
    console.log('project form subit test begin')

    // Append all selected files to the FormData
    // images?.forEach((image) => {
    //   formData.append("images", image);
    // });
  

    console.log('form subit test begin')

    try {
        console.log('onsubmit in')
        clearErrors(); // Clear any previous errors
        const response = await dispatch(updateProjectImages({
          _id: id as string,
          images: data.images
        }));
        // console.log(response.payload)

        if (success) {
            flash("Project Image(s) Added", "success")
            // console.log('Project created successfully:', response);

            return response.payload;
        }
      } catch (err: any) {
        console.error("Registration error:", err);
        flash("Project Add Failed", "error")

        if (axios.isAxiosError(err)) {
          setError("root", { type: "manual", message: err.response?.data?.message || err.message || 'Registration failed due to network error' });
        } else {
          setError("root", { type: "manual", message: "An unexpected error occurred during registration." });
        }
      }
  }

  const resetForm = () => {
    setImages([]);
    setPreviewURLs([]);
  };

  return (
    <>
      <Button
        onClick={open}
        className="flex select-none items-center gap-2 rounded bg-slate-800 py-2.5 px-4 text-xs font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:shadow-lg hover:shadow-slate-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
      >
        Add images
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
                {/* <ImageUpload  multiple={true} onChange={handleImageUpload} onError={errors.images?.message}/> */}
                <div className="col-span-6 sm:col-span-3 py-3">

                    <label className="block py-1" htmlFor="images">Project Samples</label>
                    <input type="file" id="images" multiple {...register('images')} onChange={handleImageUpload}/>
                    {errors.images && <p className="flex mt-2 text-xs text-red-600">{errors.images.message}</p>}
                    {/* {errors.images && errors.images.map((error, index) => <p key={index}>{error.message}</p>)} */}

                </div>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {previewURLs.map((url, index) => (
                    <div key={index} className="relative group p-2">
                    <img src={url} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                    <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 px-2 my-3 mr-[7%] text-white bg-red-600 hover:bg-red-700 p-1 rounded-lg lg:opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        &times;
                    </button>
                    </div>
                ))}
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
                    {loading ? <SpinnerLineWave /> : 'Add project'}
                </button>
              
              </form>

            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default UpdateProjectImages;