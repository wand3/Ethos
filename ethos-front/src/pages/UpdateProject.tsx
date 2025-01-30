import useFlash from "../hooks/UseFlash";
import InputField from "../components/Auth/FormInput";
import React, { useRef, useState, useEffect } from "react";
import { Button, Dialog, DialogPanel, DialogTitle, Field } from '@headlessui/react'
import Config from "../config";
import EthosBody from "../components/Body";
import { Link, useNavigate, useParams } from "react-router-dom";
// import { AddProjectSchema, FormProjectErrorType } from "../../components/Admin/AddProject";
import { ProjectSchema } from '../schemas/project'
import { useGetProjectDetailQuery } from "../services/project";
import { useGetUserDetailsQuery } from "../services/user";


import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import SpinnerLineWave from "../components/spinner";
import axios from "axios";

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

  const [roles, setRoles] = useState<string>('')
  const { data: currentProject, error } = useGetProjectDetailQuery(id, { // Type data and add other states
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
      console.log(response)
      setProject(response); 

    } catch (error) {
      setProject(null); // Handle error state
    }
  };

  const titleField = useRef<HTMLInputElement>(null);
  const descriptionField = useRef<HTMLInputElement>(null);
  const github_urlField = useRef<HTMLInputElement>(null);
  const project_urlField = useRef<HTMLInputElement>(null);
  const rolesField = useRef<HTMLInputElement>(null);

  

  // useEffect(() => {
  //   getProject();
  //   // console.log(project)
  // }, []);


  useEffect(() => {
    getProject();
    if (project) {
      console.log('project found')
      if (titleField.current) titleField.current.value = project.title || "";
      if (descriptionField.current) descriptionField.current.value = project.description || '';
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


  
   
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const title = titleField.current ? titleField.current.value : "";
    const description = descriptionField.current ? descriptionField.current.value : "";
    const project_url = project_urlField.current ? project_urlField.current.value : "";
    const github_url = github_urlField.current ? github_urlField.current.value : "";
    const role = rolesField.current ? rolesField.current.value : "";

    // console.log('submit in')

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
    
    setFormErrors(errors);
    // console.log(`form data ${formData}`)

    try {
      // const update = async function () {
      // console.log('try in')

      const response = await axios.put(`${Config.baseURL}/project/${id}/project/`,
        formData, // Send formData (FormData object)
        {
          headers: {
            // 'Content-Type': 'application/json',  // Incorrect: Remove this!
            // 'Content-Type': 'form-data', // Correct:  Or let Axios handle it
            'authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        },
      );
      // console.log(response)
      // const data = await response.data;
      flash('Project Updated!', 'success')
      goBack()
      // console.log(data);
    } catch (error) {
      console.error("Error updating projects:", error);
      flash('Project Updated!', 'error')

      // alert("Failed to update projects. Please try again.");
    }
  };


  return (
    <>
      <EthosBody nav={false}>
        

        <div className="bg-[#eeeeeb] pb-20 relative">
          <div className="p-6 backdrop-opacity-30 duration-300 ease-out flex justify-center">
            <button onClick={() => {goBack()}}>
              <span className="absolute m-2 top-[5%] md:top-[10%] md:ml-[-40px] hover:text-red-600"><ArrowLeftIcon className="w-6 h-6 font-extrabold"/>
              </span>
            </button>
            <div className="w-full max-w-md rounded-xl bg-[#F7F7F7] h-fit mt-[20%] md:mt-[10%] ">
                <div className="min-w-[50%] min-h-[50%] items-center justify-between p-4">
                  
                  <h3 className="flex text-base/10 pb-4 font-medium text-slate-800 justify-center">
                      Update Project Method
                  </h3>
                    
                      <form onSubmit={handleSubmit} className="text-slate-800">
                      
                        <Field>
                            <InputField
                        name="title"
                        label="Project Title"
                        type="name"
                        // placeholder="Enter P"
                        error={formErrors.title}
                        // value={project?.title}
                        Fieldref={titleField} value={""} />


                            <InputField
                        name="project_description"
                        label="Project Description"
                        type="text"
                        // placeholder="1 2 3 4 .."
                        error={formErrors.description}
                        Fieldref={descriptionField} value={""} />

                            
                            <InputField
                        name="github_url"
                        label="Github URL"
                        type="text"
                        // placeholder="number of day(s) before arrival"
                        error={formErrors.github_url}
                        Fieldref={github_urlField} value={""} />


                        <InputField
                          name="project_url"
                          label="Project URL"
                          type="text"
                          // placeholder="number of day(s) before arrival"
                          error={formErrors.project_url}
                          Fieldref={project_urlField} value={""} />

                         <InputField
                          name="roles"
                          label="Roles"
                          type="text"
                          // placeholder="number of day(s) before arrival"
                          error={formErrors.roles}
                          Fieldref={rolesField} value={""} />



                        <div className="flex justify-end pr-3 pt-3">
                          {/* <Button
                              className="gap-2 rounded-md bg-gray-700 py-2 px-5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                              type="submit"
                          >
                              Submit
                          </Button> */}
                            <Button
                              className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-10 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                              type="submit"
                              >
                              { (isLoading && userDetails) ? <SpinnerLineWave /> : 'Update project'}
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
