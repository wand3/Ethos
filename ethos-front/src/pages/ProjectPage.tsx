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
import Gallery from "../components/design/ImageViewer";



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
  //   const galleryElement = document.getElementById('lightgallery');
  //   LightGallery.
  
  
  // }, [project])
  
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
          <div className="absolute top-0 left-0 w-full h-fit opacity-40 -z-1 rounded-md bg-white/40 dark:bg-black/80"></div>
            <div className="shadow-md rounded-lg overflow-hidden md:flex">
              <div className="md:w-1/2 px-[3%] relative group">
                <div className="flex-1  py-[10%] sm:mx-0 md:mx-0 lg:w-auto ">

                    {/* <button onClick={() => handleDeleteImage(project?.images[0])}>Delete Image</button> */}
                    <img  src={`${Config.baseURL}/static/images/project_images/${project?.images[0]}`} className="rounded-md object-cover w-full h-48 sm:h-64 md:h-80 lg:h-96 xl:max-h-[28rem]" />

                    {/* Icon overlay container */}
                  <div className="absolute inset-0 bg-black/20 dark:bg-black/40 rounded-md flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                    {/* GitHub Icon */}
                    {project?.github_url && (
                      <a 
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white/20 dark:bg-black/30 rounded-full hover:bg-white/30 dark:hover:bg-black/40 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                        aria-label="GitHub Repository"
                      >
                        <svg 
                          className="w-8 h-8 dark:text-white text-n-4"
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </a>
                    )}

                    {/* Web/External Link Icon */}
                    {project?.project_url && (
                      <a
                        href={project.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white/20 dark:bg-black/30 rounded-full hover:bg-white/30 dark:hover:bg-black/40 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                        aria-label="Live Preview"
                      >
                        <svg 
                          className="w-8 h-8 dark:text-white text-n-4"
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="py-4 px-[3%] space-y-3 text-n-6 dark:text-n-8 md:w-1/2">

                <h3 className="text-2xl tracking-tagline font-iceberg capitalize md:text-2xl">
                  <Edges></Edges>
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

                      <div className="flex w-fit flex-wrap relative md:right-[-10vw] flex-col font-electrolize">
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
             

                <div className="flex-1 mt-5 mx-auto sm:w-9/12 lg:mt-0 lg:w-auto">
                    <button onClick={() => handleDeleteImage(project?.images[0])}>Delete Image</button>
                    <img  src={`${Config.baseURL}/static/images/project_images/${project?.images[0]}`} className="w-full" />
                </div>

                
                
            </div>
            {/* <div className="relative z-10 gap-5 items-center lg:flex ">
                <div className="flex-1 max-w-lg py-5 sm:mx-auto sm:text-center lg:max-w-max lg:text-left">
                  
            </div> */}
            {/* <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Gallery images={project?.images} title={project?.title || "Project Image(s)"} />
                
              </div> */}
            {/* Gallery Section */}
          <div className="mt-8 w-full max-w-screen-xl mx-auto">
            <div className="bg-white/10 dark:bg-n-1 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </span>
                <h3 className="text-xl font-semibold text-n-6 dark:text-n-2">
                  Project Gallery
                  <span className="ml-3 text-sm text-n-4 dark:text-n-4/80 font-normal animate-pulse">
                    (Click images to preview)
                  </span>
                </h3>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-transparent opacity-20 rounded-xl -z-10 group-hover:opacity-30 transition-opacity" />
                
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <Gallery 
                    images={project?.images} 
                    title={project?.title || "Project Image(s)"}
                    className="cursor-zoom-in"
                  />
                </div>
                
                {/* Hover indicator */}
                {/* <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-2 text-primary-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                    <span className="font-semibold">Click to explore</span>
                  </div>

                </div> */}

              </div>
            </div>
          </div>
        </section>
       

        { user && (
          <>
            <div className="z-10 absolute">
            
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
            </div>

          </>
        )}



              
      </EthosBody>
    </>
  
  )


}

export default ProjectPage;