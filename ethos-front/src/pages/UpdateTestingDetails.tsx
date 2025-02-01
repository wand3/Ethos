import useFlash from "../hooks/UseFlash";
import React, { useEffect, useRef, useState } from "react";
import { Button, Field } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from "../store";

import { ProjectSchema } from '../schemas/project'
import { updateProjectTesting, useGetProjectDetailQuery } from "../services/project";
import SpinnerLineWave from "../components/spinner";
import { useNavigate, useParams } from "react-router-dom";
import InputField from "../components/Auth/FormInput";
import EthosBody from "../components/Body";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";



export type FormUpdateTesting = {
  test_types?: string;
  automation_frameworks?: string;
  ci_cd_integration?: string;
}

export const UpdateTesting = () => {
  const { loading, error, success } = useSelector((state: RootState) => state.project); // Type-safe selector
  const [formErrors, setFormErrors] = useState<FormUpdateTesting>({});
  const dispatch = useDispatch<AppDispatch>(); // Type-safe dispatch 
  const {id} = useParams();
  const navigate = useNavigate();
  const { data: project } = useGetProjectDetailQuery(id as string, { // Type data and add other states
        pollingInterval: 400,
        skip: !localStorage.getItem('token') // Skip query if no token
  });

  // Pre-filled testing_details data
  const [testDetails, setTestDetails] = useState<ProjectSchema['testing_details']>({
    test_types: project?.testing_details?.test_types,
    automation_frameworks: project?.testing_details?.automation_frameworks,
    ci_cd_integration: project?.testing_details?.ci_cd_integration,
  });

  const flash = useFlash();

  const test_typesField = useRef<HTMLInputElement>(null);
  const automation_frameworksField = useRef<HTMLInputElement>(null);
  const ci_cd_integrationField = useRef<HTMLInputElement>(null);
  
      
  // Pre-fill the form when the component mounts or testing_details change
  useEffect(() => {
    if (project)
      // Object.entries(project?.testing_details).forEach(([category, items]) => {
      //   setValue(`testing_details.${category}`, items);
      // });
      setTestDetails(project.testing_details)
      const test_typesCommaSeparated = Array.isArray(project?.testing_details?.test_types)
        ? project?.testing_details?.test_types.join(", ")
        : "";
      if (test_typesField.current) test_typesField.current.value = test_typesCommaSeparated || ''
    //   setDeftest_types(test_typesCommaSeparated)

      const automation_frameworksCommaSeparated = Array.isArray(project?.testing_details?.automation_frameworks)
        ? project?.testing_details?.automation_frameworks.join(", ")
        : "";
      if (automation_frameworksField.current) automation_frameworksField.current.value = automation_frameworksCommaSeparated || ''
    //   setDefFrameworks(automation_frameworksCommaSeparated)

      const ci_cd_integrationCommaSeparated = Array.isArray(project?.testing_details?.ci_cd_integration)
        ? project?.testing_details?.ci_cd_integration.join(", ")
        : "";
      if (ci_cd_integrationField.current) ci_cd_integrationField.current.value = ci_cd_integrationCommaSeparated || ''


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

    console.log('project form subit test begin')


    const test_types = test_typesField.current ? test_typesField.current.value : "";
    const automation_frameworks = automation_frameworksField.current ? automation_frameworksField.current.value : "";
    const ci_cd_integration = ci_cd_integrationField.current ? ci_cd_integrationField.current.value : "";
  

    console.log('form subit test begin')
    const errors: FormUpdateTesting = {};

    if (!validateCommaSeparatedStrings(test_types)) {
            console.log(test_types)

      errors.test_types = "Invalid format for Programming test_types(s). Use comma-separated words.";
      console.log('form subit past test')

    }
    if (!validateCommaSeparatedStrings(automation_frameworks)) {
      errors.automation_frameworks = "Invalid format for Framework(s). Use comma-separated words.";
    }
    if (!ci_cd_integration) {
      errors.ci_cd_integration = `${error}`;
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }
   
    try {
        console.log('onsubmit in')
       
        const response = await dispatch(updateProjectTesting({
            _id: id,
            test_types: test_types,
            ci_cd_integration: ci_cd_integration,
            automation_frameworks: automation_frameworks,
            }));
        // console.log(response.payload)

        if (response.payload) {
            navigate(`/project/${id}`); // Replace with project route
            flash("Project Test Methods updated", "success")

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
                      Update Projects' Testing Details
                  </h3>
                <form onSubmit={handleSubmit} >
                    
                    {/* // <Field> */}
                    <Field>
                        <InputField
                        name="test_typess"
                        label="Test type e.g Unittest, Security"
                        type="name"
                        error={formErrors.test_types}
                        Fieldref={test_typesField} value={""} />


                        <InputField
                        name="Frameworks"
                        label="Test Framework(s)"
                        type="name"
                        error={formErrors.automation_frameworks}
                        Fieldref={automation_frameworksField} value={''} />

                        <InputField
                            name="ci_cd_integration"
                            label="CI/CD Integration"
                            type="text"
                            error={formErrors.ci_cd_integration}
                            Fieldref={ci_cd_integrationField} value={''} />

                    {/* Left */}

                    
                    <div className='h-fit flex my-3'>
                      <Button
                      className="group relative drop-shadow-md rounded-lg bg-[#C5EC38] dark:bg-white inline-block overflow-hidden border border-l-0 dark:border-white px-8 py-3 focus:ring-3 focus:outline-hidden"
                      type="submit" aria-disabled={loading}
                      >
                        <span
                          className="absolute inset-y-0 left-0 w-[4px] bg-[#000000] dark:bg-[#C5EC38] dark:group-hover:bg-[#C5EC38] transition-all group-hover:w-full"
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

export default UpdateTesting;