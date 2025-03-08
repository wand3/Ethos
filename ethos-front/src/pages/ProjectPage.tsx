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
import { DeleteProjectSchema, ProjectSchema } from "../schemas/project";
// import { date } from "yup";
import DisplayComponent from "../components/DisplayCkeditorDescription";
import Edges from "../assets/svg/Edges";


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
      flash(`Image deleted`, "success")
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

        <section className="relative max-w-screen-xl mt-[15%] md:mt-[10%] glass-effect rounded-lg lg:mt-[6%] px-auto py-3 mx-[2%] md:px-8">
          <div className="absolute top-0 left-0 w-full h-full opacity-40 -z-1 rounded-md bg-white/40 dark:bg-black/80"></div>
            <div className="shadow-md rounded-lg overflow-hidden md:flex">
              <div className="md:w-1/2">
                <div className="flex-1  mx-[2%] sm:mx-0 md:mx-0 lg:w-auto">

                    {/* <button onClick={() => handleDeleteImage(project?.images[0])}>Delete Image</button> */}
                    <img  src={`${Config.baseURL}/static/images/project_images/${project?.images[0]}`} className="object-cover w-full h-48 sm:h-64 md:h-80 lg:h-96 xl:h-auto" />
                </div>
              </div>
              <div className="py-4 px-[3%] space-y-3 text-n-6 dark:text-n-8 md:w-1/2">
                                          <Edges></Edges>

                <h3 className="text-2xl tracking-tagline font-iceberg capitalize md:text-2xl">
                  {project?.title}
                </h3>
                  
                  {project?.description && (
                    <div className="w-full">
                      <DisplayComponent content={project?.description} />
                    </div>
                  )}
                 
                  {project?.roles && (
                    <div className="flex flex-wrap transition">
                      <div className="w-full md:w-[15%] mr-2 text-lg font-iceberg tracking-wider">Role(s)</div>
                      <hr className="block md:hidden lg:hidden xl:hidden h-[2px] rounded-full py-0 shadow-xl backdrop-blur-md w-[30%] my-2 justify-start border-n-3 dark:border-color-7" />

                      <div className="flex flex-wrap relative md:left-[24%] md:right-0  flex-col font-electrolize">
                        {project?.roles?.map((role, index) => (
                          <p className="w-full md:flex-1 px-2" key={index}>{role}</p>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Conditionally render technologies if they exist  */}

                  {project?.technologies?.language && (
                    <div className="flex flex-wrap transition">
                      <div className="w-full md:w-[15%] mr-2 text-lg font-iceberg tracking-wider">Language(s)</div>
                      <hr className="block md:hidden lg:hidden xl:hidden h-[2px] rounded-full py-0 shadow-2xl backdrop-blur-md border-n-3 dark:border-color-7 w-[30%] my-2 justify-start" />

                      <div className="flex w-fit flex-wrap relative md:right-[-10vw] flex-col font-electrolize">
                        {project?.technologies?.language?.map((language, index) => (
                          <p className="w-full md:flex-1 px-2" key={index}>{language}</p>
                        ))}
                      </div>
                    </div>
                  )}
                  
      
                {project?.technologies?.frameworks && (
                  <div className="flex flex-wrap transition">
                    <div className="w-full md:w-[15%] mr-2 text-lg font-iceberg tracking-wider">Framework(s)</div>
                    <hr className="block md:hidden lg:hidden xl:hidden h-[2px] rounded-full py-0 shadow-2xl backdrop-blur-md border-n-3 dark:border-color-7 w-[30%] my-2 justify-start" />

                    <div className="flex flex-wrap relative md:right-[-10vw] flex-col font-electrolize">
                      {project.technologies.frameworks.map((framework, index) => (
                        <p className="w-full md:flex-1 px-2" key={index}>{framework}</p>
                      ))}
                    </div>
                  </div>
                )}

                {project?.technologies?.databases && (
                  <div className="flex flex-wrap">
                    <div className="w-full md:w-[15%] mr-2 text-lg font-iceberg tracking-wider">Database(s)</div>
                    <hr className="block md:hidden lg:hidden xl:hidden h-[2px] rounded-full py-0 shadow-2xl backdrop-blur-md border-n-3 dark:border-color-7 w-[30%] my-2 justify-start" />

                    <div className="flex flex-wrap relative md:right-[-10vw] flex-col font-electrolize">
                      {project.technologies.databases.map((database, index) => (
                        <p className="w-full md:flex-1 px-2" key={index}>{database}</p>
                      ))}
                    </div>
                  </div>
                )}

                {project?.technologies?.tools && (
                  <div className="flex flex-wrap">
                    <div className="w-full md:w-[15%] mr-2 text-lg font-iceberg tracking-wider">Tool(s)</div>
                    <hr className="block md:hidden lg:hidden xl:hidden h-[2px] rounded-full py-0 shadow-2xl backdrop-blur-md border-n-3 dark:border-color-7 w-[30%] my-2 justify-start" />

                    <div className="flex flex-wrap relative md:right-[-10vw] flex-col font-electrolize">
                      {project.technologies.tools.map((tool, index) => (
                        <p className="w-full md:flex-1 px-2" key={index}>{tool}</p>
                      ))}
                    </div>
                  </div>
                )}
                 
                </div>

                {/* <div className="flex-1 mt-5 mx-auto sm:w-9/12 lg:mt-0 lg:w-auto">
                    <button onClick={() => handleDeleteImage(project?.images[0])}>Delete Image</button>
                    <img  src={`${Config.baseURL}/static/images/project_images/${project?.images[0]}`} className="w-full" />
                </div> */}

                
                
            </div>
            {/* <div className="relative z-10 gap-5 items-center lg:flex ">
                <div className="flex-1 max-w-lg py-5 sm:mx-auto sm:text-center lg:max-w-max lg:text-left">
                  
            </div> */}
            
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