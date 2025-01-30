import useFlash from "../hooks/UseFlash";
import React, { useEffect, useRef, useState } from "react";
import { Field } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from "../store";

import { ProjectSchema } from '../schemas/project'
import axios from "axios";
import { updateProjectTechStack, useGetProjectDetailQuery } from "../services/project";
import SpinnerLineWave from "../components/spinner";
import { useNavigate, useParams } from "react-router-dom";
import InputField from "../components/Auth/FormInput";
import EthosBody from "../components/Body";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";


export const UpdateTechnologies = () => {
  const { loading, error, success } = useSelector((state: RootState) => state.project); // Type-safe selector
  let [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch<AppDispatch>(); // Type-safe dispatch 
  const {id} = useParams();
  const navigate = useNavigate();
  const { data: project } = useGetProjectDetailQuery(id, { // Type data and add other states
          pollingInterval: 9000,
        skip: !localStorage.getItem('token') // Skip query if no token
  });

  // Pre-filled technologies data
  const [technologies, setTechnologies] = useState<ProjectSchema['technologies']>({
    language: project?.technologies?.language,
    frameworks: project?.technologies?.frameworks,
    databases: project?.technologies?.databases,
    tools: project?.technologies?.tools,
  });

//   const [defLanguage, setDefLanguage] = useState<string>('')
//   const [defFrameworks, setDefFrameworks] = useState<string>('')
//   const [defDatabases, setDefDatabases] = useState<string>('')
//   const [defTools, setDefTools] = useState<string>('')

  

  const flash = useFlash();

  const languageField = useRef<HTMLInputElement>(null);
  const frameworksField = useRef<HTMLInputElement>(null);
  const databasesField = useRef<HTMLInputElement>(null);
  const toolsField = useRef<HTMLInputElement>(null);
  
    
  // dialog popup and close 
  function open() {
    setIsOpen(true)
  }
  function close() {
    setIsOpen(false)
  }

  
  // Pre-fill the form when the component mounts or technologies change
  useEffect(() => {
    if (project)
      // Object.entries(project?.technologies).forEach(([category, items]) => {
      //   setValue(`technologies.${category}`, items);
      // });
      setTechnologies(project.technologies)
      const languageCommaSeparated = Array.isArray(project?.technologies?.language)
        ? project?.technologies?.language.join(", ")
        : "";
      if (languageField.current) languageField.current.value = languageCommaSeparated || ''
    //   setDefLanguage(languageCommaSeparated)

      const frameworksCommaSeparated = Array.isArray(project?.technologies?.frameworks)
        ? project?.technologies?.frameworks.join(", ")
        : "";
      if (frameworksField.current) frameworksField.current.value = frameworksCommaSeparated || ''
    //   setDefFrameworks(frameworksCommaSeparated)

      const databasesCommaSeparated = Array.isArray(project?.technologies?.databases)
        ? project?.technologies?.databases.join(", ")
        : "";
      if (databasesField.current) databasesField.current.value = databasesCommaSeparated || ''


      const toolsCommaSeparated = Array.isArray(project?.technologies?.tools)
        ? project?.technologies?.tools.join(", ")
        : "";
      if (toolsField.current) toolsField.current.value = toolsCommaSeparated || ''


  }, [project]);
  

  //   const formData = new FormData();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    console.log('project form subit test begin')


    const language = languageField.current ? languageField.current.value : "";
    const frameworks = frameworksField.current ? frameworksField.current.value : "";
    const databases = databasesField.current ? databasesField.current.value : "";
    const tools = toolsField.current ? toolsField.current.value : "";
    // });
  

    console.log('form subit test begin')

    try {
        console.log('onsubmit in')
        // clearErrors(); // Clear any previous errors
       
        const response = await dispatch(updateProjectTechStack({
            _id: id,
            language: language,
            databases: databases,
            frameworks: frameworks,
            tools: tools,
            }));
        // console.log(response.payload)

        if (success) {
            flash("Project Technologies updated", "success")
            // console.log('Project created successfully:', response);

            return response.payload;
        }
      } catch (err: any) {
        console.error("Registration error:", err);
        flash("Project Technologies update Failed", "error")
      }
  }

  // back button 
  const goBack = () => {
    return navigate(-1);
  }

 

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
                      Update Project technologies
                  </h3>
                <form onSubmit={handleSubmit}>
                    
                    {/* // <Field> */}
                    <Field>
                        <InputField
                        name="languages"
                        label="Programming Language(s)"
                        type="name"
                        // error={errors.root?.message}
                        Fieldref={languageField} value={""} />


                        <InputField
                        name="Frameworks"
                        label="Framework(s)"
                        type="name"
                        // error={""}
                        // value={project?.title}

                        Fieldref={frameworksField} value={''} />

                        <InputField
                            name="databases"
                            label="Database Technologie(s)"
                            type="text"
                            // error={""}
                            // value={project?.title}

                            Fieldref={databasesField} value={''} />


                        <InputField
                            name="tools"
                            label="Tools"
                            type="text"
                            // error={""}
                            // value={project?.title}

                            Fieldref={toolsField} value={''} />



                    
                    <button
                        className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-10 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                        type="submit" aria-disabled={loading}
                        >
                        {loading ? <SpinnerLineWave /> : 'Save'}
                    </button>
                </Field>
                </form>
              </div>
            </div>
          </div>             
        </div>


      </EthosBody>
    </>
    )}

export default UpdateTechnologies;