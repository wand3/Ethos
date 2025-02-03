import useFlash from "../hooks/UseFlash";
import React, { useEffect, useRef, useState } from "react";
import { Button, Field } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from "../store";

import { ProjectSchema } from '../schemas/project'
import { updateProjectTechStack, useGetProjectDetailQuery } from "../services/project";
import SpinnerLineWave from "../components/spinner";
import { useNavigate, useParams } from "react-router-dom";
import InputField from "../components/Auth/FormInput";
import EthosBody from "../components/Body";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export type FormUpdateTechnologies = {
  language?: string;
  frameworks?: string;
  databases?: string;
  tools?: string;
}


export const UpdateTechnologies = () => {
  const { loading, error, success } = useSelector((state: RootState) => state.project); // Type-safe selector
  const [formErrors, setFormErrors] = useState<FormUpdateTechnologies>({});
  const dispatch = useDispatch<AppDispatch>(); // Type-safe dispatch 
  const {id} = useParams();
  const navigate = useNavigate();
  const { data: project } = useGetProjectDetailQuery(id as string, { // Type data and add other states
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

  const flash = useFlash();

  const languageField = useRef<HTMLInputElement>(null);
  const frameworksField = useRef<HTMLInputElement>(null);
  const databasesField = useRef<HTMLInputElement>(null);
  const toolsField = useRef<HTMLInputElement>(null);

  
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
  

  const validateCommaSeparatedStrings = (input: string): boolean => {
    const regex = /^[a-zA-Z0-9\s]+(,\s*[a-zA-Z0-9\s]+)*$/;
      return regex.test(input);
  };
  function clearErrors() {
    setFormErrors({});
  }

  const handleSubmit = async (event: React.FormEvent) => {
    clearErrors();

    event.preventDefault();

    // console.log('project form subit test begin')

    const language = languageField.current ? languageField.current.value : "";
    const frameworks = frameworksField.current ? frameworksField.current.value : "";
    const databases = databasesField.current ? databasesField.current.value : "";
    const tools = toolsField.current ? toolsField.current.value : "";
    // });
  

    // console.log('form subit test begin')
    const errors: FormUpdateTechnologies = {};


    if (!validateCommaSeparatedStrings(language)) {
            // console.log(language)
      errors.language = "Invalid format for Programming language(s). Use comma-separated words.";
    }
    if (!validateCommaSeparatedStrings(frameworks)) {
      errors.frameworks = "Invalid format for Framework(s). Use comma-separated words.";
    }
    if (!validateCommaSeparatedStrings(databases)) {
      errors.databases = "Invalid format for Database(s). Use comma-separated words.";
    }
    if (!tools) {
      errors.tools = "Invalid format for Tool(s). Use comma-separated words.";
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }
    
    try {
      const response = await dispatch(updateProjectTechStack({
          _id: id,
          language: language,
          databases: databases,
          frameworks: frameworks,
          tools: tools,
          }));
      // console.log(response.payload)
      if (response.payload) {
        navigate(`/project/${id}`); 
        flash("Project Technologies updated", "success")

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
      <EthosBody nav={true}>
        <div className="text-white dark:bg-black pb-20 relative">
          <div className="p-6 backdrop-opacity-30 duration-300 ease-out flex justify-center">
            <button onClick={() => {goBack()}}>
              <span className="absolute m-2 top-[5%] md:top-[10%] md:ml-[-40px] hover:text-red-600"><ArrowLeftIcon className="w-6 h-6 font-extrabold"/>
              </span>
            </button>
            <div className="w-full max-w-md rounded-xl h-fit mt-[20%] md:mt-[10%] form-light dark:form-dark">
              <div className="min-w-[50%] min-h-[50%] items-center justify-between p-4">
                  
                <h3 className="flex text-base/10 pb-4 font-medium justify-center">
                      Update Projects' technologies
                </h3>
                <form onSubmit={handleSubmit}>
                    
                    <Field>
                        <InputField
                        name="languages"
                        label="Programming Language(s)"
                        type="name"
                        error={formErrors.language}
                        Fieldref={languageField} value={""} />


                        <InputField
                        name="Frameworks"
                        label="Framework(s)"
                        type="name"
                        error={formErrors.frameworks}

                        Fieldref={frameworksField} value={''} />

                        <InputField
                            name="databases"
                            label="Database Technologie(s)"
                            type="text"
                            error={formErrors.databases}
                            Fieldref={databasesField} value={''} />


                        <InputField
                            name="tools"
                            label="Tools"
                            type="text"
                            error={formErrors.tools}

                            Fieldref={toolsField} value={''} />


                    <div className='h-fit flex my-3 justify-end'>
                      <Button
                      className="group relative drop-shadow-lg rounded-lg  inline-block overflow-hidden border border-l-0 mr-[5%] px-4 py-2 focus:ring-3 focus:outline-hidden button-color-light dark:button-color-dark"
                      type="submit" aria-disabled={loading}
                      >
                        <span
                          className="absolute inset-y-0 left-0 w-[4px] bg-[#000000] dark:button-span-inside transition-all group-hover:w-full"
                        ></span>

                        <span
                          className="relative text-sm font-medium text-[#170414] transition-colors group-hover:text-white dark:group-hover:text-black"
                        >
                          {loading ? <SpinnerLineWave /> : 'Save'}
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
    )}

export default UpdateTechnologies;