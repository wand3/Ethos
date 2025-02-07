// import useFlash from "../hooks/UseFlash";
// import InputField from "../components/Auth/FormInput";
// import React, { useRef, useState, useEffect } from "react";
// import { Button, Field } from '@headlessui/react'
// import Config from "../config";
// import EthosBody from "../components/Body";
// import { useNavigate, useParams } from "react-router-dom";
// // import { AddProjectSchema, FormProjectErrorType } from "../../components/Admin/AddProject";
// import { ProjectSchema } from '../schemas/project'
// import { useGetProjectDetailQuery } from "../services/project";
// import { useGetUserDetailsQuery } from "../services/user";
// import { CKEditor } from "ckeditor4-react";


// import { ArrowLeftIcon } from "@heroicons/react/24/solid";
// import SpinnerLineWave from "../components/spinner";
// import axios from "axios";

// export type FormProjectErrorType = {
//   title?: string;
//   description?: string;
//   project_url?: string;
//   github_url?: string;
//   roles?: string;
// }

// export const UpdateProject = () => {
//   const {id} = useParams();
//   const [formErrors, setFormErrors] = useState<FormProjectErrorType>({});
//   const [ project, setProject ] = useState<ProjectSchema | null >();

//   const [roles, setRoles] = useState<string>('')
//   const { data: currentProject, error } = useGetProjectDetailQuery(id as string, { // Type data and add other states
//     pollingInterval: 9000,
//     skip: !localStorage.getItem('token') // Skip query if no token
//   });

//   const { data: userDetails, isLoading } = useGetUserDetailsQuery();
  
//   const flash = useFlash();
//   const navigate = useNavigate();


//   // back button 
//   const goBack = () => {
//     return navigate(-1);
//   }


//   // get product function
//   const getProject = async () => {
//     try {
//       const response = currentProject
//       console.log(response)
//       setProject(response); 

//     } catch (error) {
//       setProject(null); // Handle error state
//     }
//   };

//   const titleField = useRef<HTMLInputElement>(null);
//   const descriptionField = useRef<HTMLInputElement>(null);
//   const github_urlField = useRef<HTMLInputElement>(null);
//   const project_urlField = useRef<HTMLInputElement>(null);
//   const rolesField = useRef<HTMLInputElement>(null);


//   useEffect(() => {
//     getProject();
//     if (project) {
//       // console.log('project found')
//       if (titleField.current) titleField.current.value = project.title || "";
//       if (descriptionField.current) descriptionField.current.value = project.description || '';
//       if (github_urlField.current) github_urlField.current.value = project.github_url || '';
//       if (project_urlField.current) project_urlField.current.value = project.project_url || '';
//       // if (rolesField.current) rolesField.current.value = project.roles || '';
//       // Safely convert the roles array to a comma-separated string
//       const rolesCommaSeparated = Array.isArray(project.roles)
//         ? project.roles.join(", ")
//         : "";
//       if (rolesField.current) rolesField.current.value = rolesCommaSeparated || ''
//       setRoles(rolesCommaSeparated)
//     }
//   }, [project]);


//   const validateCommaSeparatedStrings = (input: string): boolean => {
//     const regex = /^[a-zA-Z0-9\s]+(,\s*[a-zA-Z0-9\s]+)*$/;
//       return regex.test(input);
//   };
//   function clearErrors() {
//     setFormErrors({});
//   }
  
//    // form onchange event handlers 
//   const handleRolesChange = (event: React.ChangeEvent<HTMLInputElement>) => {

//     const errors: FormProjectErrorType = {};
//     const value = event.target.value;
//     if (!validateCommaSeparatedStrings(value)) {
//       errors.roles = "Invalid format for Programming language(s). Use comma-separated words.";
//     }

//     setFormErrors(errors);
//     if (Object.keys(errors).length > 0) {
//       return;
//     }
//   }
    
   
  
//   const handleSubmit = async (event: React.FormEvent) => {
//     clearErrors();
//     event.preventDefault();

//     const title = titleField.current ? titleField.current.value : "";
//     const description = descriptionField.current ? descriptionField.current.value : "";
//     const project_url = project_urlField.current ? project_urlField.current.value : "";
//     const github_url = github_urlField.current ? github_urlField.current.value : "";
//     const role = rolesField.current ? rolesField.current.value : "";

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("description", description);
//     formData.append("project_url", project_url);
//     formData.append("github_url", github_url);
//     formData.append("roles", role);
//     // console.log(role)


//     const errors: FormProjectErrorType = {};
//     if (!title){
//       errors.title = "Project Title must be provided";
//     }
//     if (!description){
//       errors.description = "Project description must be provided";
//     }
//     if (!github_url){
//       errors.github_url = "Github URL must be provided";
//     }
//     if (!validateCommaSeparatedStrings(role)) {
//       errors.roles = "Invalid format for Role(s). Use comma-separated words.";
//     }
    
//     setFormErrors(errors);
//     if (Object.keys(errors).length > 0) {
//       return;
//     }

//     try {
//       const response = await axios.put(`${Config.baseURL}/project/${id}/project/`,
//         formData, // Send formData (FormData object)
//         {
//           headers: {
//             'authorization': `Bearer ${localStorage.getItem('token')}`,
//           },
//         },
//       );
//       if (response.status === 201) {
//           // navigate(`/project/${id}`); // Replace with project route
//           flash('Project Updated!', 'success')
//           goBack()

//           return response.data;
//       }
//       // console.log(data);
//     } catch (error) {
//       console.error("Error updating projects:", error);
//       flash('Project Update Failed!', 'error')
//     }
//   };


//   return (
//     <>
//       <EthosBody nav={true}>
        

//         <div className="text-white dark:bg-black pb-20 relative">
//           <div className="p-6 backdrop-opacity-30 duration-300 ease-out flex justify-center">
//             <button onClick={() => {goBack()}}>
//               <span className="absolute m-2 top-[5%] md:top-[10%] md:ml-[-40px] hover:text-red-600"><ArrowLeftIcon className="w-6 h-6 font-extrabold"/>
//               </span>
//             </button>
//             <div className="w-full max-w-md rounded-xl h-fit mt-[20%] md:mt-[10%] form-light dark:form-dark ">
//                 <div className="min-w-[50%] min-h-[50%] items-center justify-between p-4">
                  
//                   <h3 className="flex text-base/10 pb-4 font-medium justify-center">
//                       Update Project Method
//                   </h3>
                    
//                     <form onSubmit={handleSubmit} className="">
                      
//                       <Field>
//                         <InputField
//                           name="title"
//                           label="Project Title"
//                           type="name"
//                           error={formErrors.title}
//                           Fieldref={titleField} value={""} />

//                         <InputField
//                           name="project_description"
//                           label="Project Description"
//                           type="text"
//                           error={formErrors.description}
//                           Fieldref={descriptionField} value={""} />

                          
//                         <InputField
//                           name="github_url"
//                           label="Github URL"
//                           type="text"
//                           error={formErrors.github_url}
//                           Fieldref={github_urlField} value={""} />


//                         <InputField
//                           name="project_url"
//                           label="Project URL"
//                           type="text"
//                           error={formErrors.project_url}
//                           Fieldref={project_urlField} value={""} />

//                         <InputField
//                           name="roles"
//                           label="Roles"
//                           type="text"
//                           onChange={handleRolesChange}
//                           error={formErrors.roles}
//                           description="format - 'Backend Engineer, DevOps'"
//                           Fieldref={rolesField} value={""} />

//                         {/* Left */}
                        
                                            
//                       <div className='h-fit flex my-3 justify-end'>
//                         <Button
//                         className="group relative drop-shadow-lg rounded-lg  inline-block overflow-hidden border border-l-0 mr-[5%] px-4 py-2 focus:ring-3 focus:outline-hidden button-color-light dark:button-color-dark"
//                         type="submit" aria-disabled={isLoading}
//                         >
//                           <span
//                             className="absolute inset-y-0 left-0 w-[4px] bg-[#000000] dark:button-span-inside transition-all group-hover:w-full"
//                           ></span>
  
//                           <span
//                             className="relative text-sm font-medium text-[#170414] transition-colors group-hover:text-white dark:group-hover:text-black"
//                           >
//                             {isLoading ? <SpinnerLineWave /> : 'Save'}
//                           </span>
//                         </Button>
//                       </div>
//                     </Field>
//                   </form>             
//                 </div>
//             </div>
//           </div>             
//         </div>


//       </EthosBody>
//     </>
//   )
// }

// export default UpdateProject;
import useFlash from "../hooks/UseFlash";
import InputField from "../components/Auth/FormInput";
import React, { useRef, useState, useEffect } from "react";
import { Button, Field, Textarea } from '@headlessui/react'
import Config from "../config";
import EthosBody from "../components/Body";
import { useNavigate, useParams } from "react-router-dom";
// import { AddProjectSchema, FormProjectErrorType } from "../../components/Admin/AddProject";
import { ProjectSchema } from '../schemas/project'
import { useGetProjectDetailQuery } from "../services/project";
import { useGetUserDetailsQuery } from "../services/user";
import {EditorField} from "../components/CkeditorField";

import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import SpinnerLineWave from "../components/spinner";
import axios from "axios";
import { CKEditor } from "ckeditor4-react";
import useProducts from "../hooks/UseProducts";

export type FormProjectErrorType = {
  title?: string;
  description?: string;
  project_url?: string;
  github_url?: string;
  roles?: string;
}

export const UpdateProject = () => {
  const {id} = useParams();
  const [formErrors, setFormErrors] = useState<FormProjectErrorType>({});
  const [ project, setProject ] = useState<ProjectSchema | null >();
  const [descriptio, setDescription] = useState(''); // State for CKEditor 4 content

  const [roles, setRoles] = useState<string>('')
  const { data: currentProject, error } = useGetProjectDetailQuery(id as string, { // Type data and add other states
    pollingInterval: 9000,
    skip: !localStorage.getItem('token') // Skip query if no token
  });

  const { data: userDetails, isLoading } = useGetUserDetailsQuery();
  
  const flash = useFlash();
  const navigate = useNavigate();


  // back button 
  const goBack = () => {
    return navigate(-1);
  }


  // get product function
  const getProject = async () => {
    try {
      const response = currentProject
      // console.log(response)
      setProject(response); 
      // console.log(project?.description)
      // console.log(projectDescription)

    } catch (error) {
      setProject(null); // Handle error state
    }
  };

  const titleField = useRef<HTMLInputElement>(null);
  // const descriptionField = useRef<HTMLInputElement>(null);
  const descriptionField = useRef<HTMLDivElement>(null);

  const github_urlField = useRef<HTMLInputElement>(null);
  const project_urlField = useRef<HTMLInputElement>(null);
  const rolesField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getProject(); // Call getProject to fetch data
  }, []); // Empty dependency array ensures this runs only once on mount


  useEffect(() => {
    // getProject();
    // console.log(project)
    if (project) {
      // console.log('project found')
      if (titleField.current) titleField.current.value = project.title || "";
      // if (descriptionField.current) {
      //   descriptionField.current.value = project.description || '';
      setDescription(project['description'] || '')
      console.log(descriptio)
      console.log(project.description)

      //   };
      if (project.description) {
        // descriptionField.current.innerHTML = project.description || '';
        setDescription(project.description || '')
        };
      if (github_urlField.current) github_urlField.current.value = project.github_url || '';
      if (project_urlField.current) project_urlField.current.value = project.project_url || '';
      // if (rolesField.current) rolesField.current.value = project.roles || '';
      // Safely convert the roles array to a comma-separated string
      const rolesCommaSeparated = Array.isArray(project.roles)
        ? project.roles.join(", ")
        : "";
      if (rolesField.current) rolesField.current.value = rolesCommaSeparated || ''
      setRoles(rolesCommaSeparated)
    }
  }, [project]);

  


  const validateCommaSeparatedStrings = (input: string): boolean => {
    const regex = /^[a-zA-Z0-9\s]+(,\s*[a-zA-Z0-9\s]+)*$/;
      return regex.test(input);
  };
  function clearErrors() {
    setFormErrors({});
  }
  
   // form onchange event handlers 
  const handleRolesChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    const errors: FormProjectErrorType = {};
    const value = event.target.value;
    if (!validateCommaSeparatedStrings(value)) {
      errors.roles = "Invalid format for Programming language(s). Use comma-separated words.";
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }
  }
    
   
  
  const handleSubmit = async (event: React.FormEvent) => {
    clearErrors();
    event.preventDefault();

    const title = titleField.current ? titleField.current.value : "";
    // const description = descriptionField.current ? descriptionField.current.value : "";
    const description = descriptio;

    const project_url = project_urlField.current ? project_urlField.current.value : "";
    const github_url = github_urlField.current ? github_urlField.current.value : "";
    const role = rolesField.current ? rolesField.current.value : "";

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("project_url", project_url);
    formData.append("github_url", github_url);
    formData.append("roles", role);
    // console.log(role)


    const errors: FormProjectErrorType = {};
    if (!title){
      errors.title = "Project Title must be provided";
    }
    if (!description){
      errors.description = "Project description must be provided";
    }
    if (!github_url){
      errors.github_url = "Github URL must be provided";
    }
    if (!validateCommaSeparatedStrings(role)) {
      errors.roles = "Invalid format for Role(s). Use comma-separated words.";
    }
    
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const response = await axios.put(`${Config.baseURL}/project/${id}/project/`,
        formData, // Send formData (FormData object)
        {
          headers: {
            'authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        },
      );
      if (response.status === 201) {
          // navigate(`/project/${id}`); // Replace with project route
          flash('Project Updated!', 'success')
          goBack()

          return response.data;
      }
      // console.log(data);
    } catch (error) {
      console.error("Error updating projects:", error);
      flash('Project Update Failed!', 'error')
    }
  };

  const handleDescriptionChange = (data: string) => {
    setDescription(data);
  };

  const handleCkeditor = (event: any) => {
    const data = event.editor.getData()
    setDescription(data);

    console.log(data)
  };


  return (
    <>
      <EthosBody nav={true}>
        

        <div className="text-white dark:bg-black pb-20 relative">
          <div className="p-6 backdrop-opacity-30 duration-300 ease-out flex justify-center">
            <button onClick={() => {goBack()}}>
              <span className="absolute m-2 top-[5%] md:top-[10%] md:ml-[-40px] hover:text-red-600"><ArrowLeftIcon className="w-6 h-6 font-extrabold"/>
              </span>
            </button>
            <div className="w-full max-w-md rounded-xl h-fit mt-[20%] md:mt-[10%] form-light dark:form-dark ">
                <div className="min-w-[50%] min-h-[50%] items-center justify-between p-4">
                  
                  <h3 className="flex text-base/10 pb-4 font-medium justify-center">
                      Update Project Method
                  </h3>
                    
                    <form onSubmit={handleSubmit} className="">
                      
                      <Field>
                        <InputField
                          name="title"
                          label="Project Title"
                          type="name"
                          error={formErrors.title}
                          Fieldref={titleField} value={""} />

                        {/* <InputField
                          name="project_description"
                          label="Project Description"
                          type="text"
                          error={formErrors.description}
                          Fieldref={descriptionField} value={""} /> */}

                        {/* Replace description InputField with CKEditor 4 */}
                        <div className="mb-4">
        
                          <label className="block text-sm font-medium mb-2">Project Description</label>
                          {/* <Textarea className='col-span-full' type='text' value={project?.description} name='descroption'></Textarea>                 */}
                          { project && (
                            <CKEditor 
                              onChange={handleCkeditor}
                              initData={`${project?.description}`}
                            />
                          
                          )}
                          

                            {/* <EditorField 
                              data={projectDescription}
                              // initData={pzrojectDescription}
                              // ref={descriptionField}
                              onChange={handleDescriptionChange}
                            /> */}
                          {/* <CKEditor
                            editorUrl="../../ckeditor"
                            initialData={project?.description}
                            data={projectDescription}
                            ref={descriptionField}
                            onChange={(event) => {
                              const data = event.editor.getData();
                              setDescription(data);
                            }}
                          />
                          <>
                          {formErrors.description && (
                            <span className="text-red-500 text-sm">{formErrors.description}</span>
                          )}</> */}
                        </div>

                          
                        <InputField
                          name="github_url"
                          label="Github URL"
                          type="text"
                          error={formErrors.github_url}
                          Fieldref={github_urlField} value={""} />


                        <InputField
                          name="project_url"
                          label="Project URL"
                          type="text"
                          error={formErrors.project_url}
                          Fieldref={project_urlField} value={""} />

                        <InputField
                          name="roles"
                          label="Roles"
                          type="text"
                          onChange={handleRolesChange}
                          error={formErrors.roles}
                          description="format - 'Backend Engineer, DevOps'"
                          Fieldref={rolesField} value={""} />

                        {/* Left */}
                        
                                            
                      <div className='h-fit flex my-3 justify-end'>
                        <Button
                        className="group relative drop-shadow-lg rounded-lg  inline-block overflow-hidden border border-l-0 mr-[5%] px-4 py-2 focus:ring-3 focus:outline-hidden button-color-light dark:button-color-dark"
                        type="submit" aria-disabled={isLoading}
                        >
                          <span
                            className="absolute inset-y-0 left-0 w-[4px] bg-[#000000] dark:button-span-inside transition-all group-hover:w-full"
                          ></span>
  
                          <span
                            className="relative text-sm font-medium text-[#170414] transition-colors group-hover:text-white dark:group-hover:text-black"
                          >
                            {isLoading ? <SpinnerLineWave /> : 'Save'}
                          </span>
                        </Button>
                      </div>
                    </Field>
                  </form>             
                </div>
            </div>
          </div>             
        </div>


      </EthosBody>
    </>
  )
}

export default UpdateProject;
