import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EthosBody from "../components/Body";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import useFlash from "../hooks/UseFlash";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { deleteProjectImageThunk, deleteProjectThunk, useGetProjectDetailQuery } from "../services/project";
import { useGetUserDetailsQuery } from "../services/user";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import AddProject from "../components/Admin/AddProject";
import UpdateProjectImages from "../components/Admin/UpdateProjectImages";
import Config from "../config";
import { DeleteProjectSchema } from "../schemas/project";
import { date } from "yup";


export const ProjectPage = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const { data: project, error } = useGetProjectDetailQuery(id as string, { // Type data and add other states
    pollingInterval: 9000,
    skip: !localStorage.getItem('token') // Skip query if no token
  });
  const dispatch = useDispatch<AppDispatch>(); // Type-safe dispatch 
  
  
  // Get the user state from Redux
  const token = useSelector((state: RootState) => {state.user.token})
  // automatically authenticate user if token is found
  const { data: user } = useGetUserDetailsQuery(token, { // Type data and add other states
    pollingInterval: 9000,
    skip: !localStorage.getItem('token') // Skip query if no token
  });

  const flash = useFlash();


  // back button 
  const goBack = () => {
    return navigate(-1);
  }


  const goToUpdatePage = () => {
    return navigate(`/project/${id}/update`);
  }

  const goToUpdateTechnologiesPage = () => {
    return navigate(`/project/${id}/update/technologies`);
  }

  const goToUpdateTestingsPage = () => {
    return navigate(`/project/${id}/update/testings`);
  }

  const handleDelete = async (_id: string) => {
    if (!project) {
      flash("Project delete Failed", "error")
      return
    }
    const response = await dispatch(deleteProjectThunk({
      _id: id as string}
      ));

    
    if (response.payload) {
      navigate(`/projects`); // Replace with project route
      flash(`Project deleted`, "success")
      return response.payload;
    }
  };

  const handleDeleteImage = async (filename: string) => {

    const response = await dispatch(deleteProjectImageThunk({ _id: id as string, filename: filename }));
    if (response.payload) {
      // navigate(`/projects`); // Replace with project route
      flash(`${response.payload.toString} Image deleted`, "success")
      return response.payload;
    }
  };
  
  // useEffect( () => {
  //   const getproj = async (id: string) =>{
  //     await dispatch(useGetProjectDetailQuery({id=id}))

  //   }
  // }, [])

  // const img: string = `${Config.baseURL}/static/images/project_images/${project?.images[0]}`

  
  return (
    <>
      <EthosBody nav>
        <div className="absolute z-10 mt-0 mx-4 lg:ml-[6%] p-1 hover:text-red-600 text-black dark:text-white">
          <div onClick={() => {goBack()}}>
            <ArrowLeftIcon className="w-6 h-6 font-extrabold"/>
          </div>
        </div>

        <section className="relative max-w-screen-xl mx-auto py-3 px-4 md:px-8">
          
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-40"></div>
            <div className="relative z-10 gap-5 items-center lg:flex">
                <div className="flex-1 max-w-lg py-5 sm:mx-auto sm:text-center lg:max-w-max lg:text-left">
                  <h3 className="text-3xl text-gray-800 font-semibold md:text-4xl">
                      {project?.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed mt-3">
                      {project?.description}
                  </p>
                  <p>Project roles</p>
                  {project?.roles?.map((role, index) => (
                    <p className="text-indigo-600 p-2 m-1 font-medium bg-indigo-50 rounded-full inline-flex items-center" key={index}>{role}</p>
                  ))}
{/* 
                  { project?.technologies. !==  (
                    <>
                     <p>Project roles</p>
                      {project?.technologies.map((technology, index) => (
                        <p className="text-indigo-600 p-2 m-1 font-medium bg-indigo-50 rounded-full inline-flex items-center" key={index}>{technology}</p>
                      ))}
                    </>
                  
                  ) } */}

                  {/* Conditionally render technologies if they exist  */}

                  { project?.technologies && (
                    <>
                      <p>Languages</p>
                      {project?.technologies?.language?.map((technology, index) => (
                        <p
                          className="text-indigo-600 p-2 m-1 font-medium bg-indigo-50 rounded-full inline-flex items-center"
                          key={index}
                        >
                          {technology}
                        </p>
                      ))}

                      <p>Frameworks</p>
                      {project?.technologies?.frameworks?.map((technology, index) => (
                        <p
                          className="text-indigo-600 p-2 m-1 font-medium bg-indigo-50 rounded-full inline-flex items-center"
                          key={index}
                        >
                          {technology}
                        </p>
                      ))}

                      <p>Databases</p>
                      {project?.technologies?.databases?.map((technology, index) => (
                        <p
                          className="text-indigo-600 p-2 m-1 font-medium bg-indigo-50 rounded-full inline-flex items-center"
                          key={index}
                        >
                          {technology}
                        </p>
                      ))}

                      <p>Tools</p>
                      {project?.technologies?.tools?.map((technology, index) => (
                        <p
                          className="text-indigo-600 p-2 m-1 font-medium bg-indigo-50 rounded-full inline-flex items-center"
                          key={index}
                        >
                          {technology}
                        </p>
                      ))}
                    </>
                  )}

                  
                 
                  <a
                      className="mt-5 px-4 py-2 text-indigo-600 font-medium bg-indigo-50 rounded-full inline-flex items-center"
                      href="javascript:void()">
                      Try it out
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-1 duration-150" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                  </a>
                </div>

                <div className="flex-1 mt-5 mx-auto sm:w-9/12 lg:mt-0 lg:w-auto">
                    <button onClick={() => handleDeleteImage(project?.images[0])}>Delete Image</button>
                    <img  src={`${Config.baseURL}/static/images/project_images/${project?.images[0]}`} className="w-full" />


                    {/* <img 
                        src="https://i.postimg.cc/kgd4WhyS/container.png" 
                        alt="" 
                        className="w-full" 
                    /> */}
                </div>
                <div className="flex-1 mt-5 mx-auto sm:w-9/12 lg:mt-0 lg:w-auto">
                    <button onClick={() => handleDeleteImage(project?.images[1])}>Delete Image</button>
                    <img  src={`${Config.baseURL}/static/images/project_images/${project?.images[1]}`} className="w-full" />

                    
                    {/* <img 
                        src="https://i.postimg.cc/kgd4WhyS/container.png" 
                        alt="" 
                        className="w-full" 
                    /> */}
                </div>
            </div>
            
        </section>
       

        { user && (
          <>
            <button onClick={() => {handleDelete(id)}}>
                <span className="mt-0 mx-4 lg:ml-12 p-1 hover:text-red-600 text-black dark:text-white">
                Delete Project
                </span>
            </button>
            <button onClick={() => {goToUpdatePage()}}>
                <span className="mt-0 mx-4 lg:ml-12 p-1 hover:text-red-600 text-black dark:text-white">
                Update Project
                </span>
            </button>

            <button onClick={() => {goToUpdateTechnologiesPage()}}>
                <span className="rounded border mt-0 mx-4 lg:ml-12 p-1 hover:text-red-600 text-black dark:text-white">
                Techlologies
                </span>
            </button>

            <button onClick={() => {goToUpdateTestingsPage()}}>
                <span className="rounded border mt-0 mx-4 lg:ml-12 p-1 hover:text-red-600 text-black dark:text-white">
                Testing
                </span>
            </button>
            <AddProject />
            <UpdateProjectImages />
          </>
        )}



              
      </EthosBody>
    </>
  
  )


}

export default ProjectPage;