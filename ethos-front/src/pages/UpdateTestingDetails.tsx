import useFlash from "../hooks/UseFlash";
import React, { useEffect, useRef, useState } from "react";
import { Field } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from "../store";

import { ProjectSchema } from '../schemas/project'
import { updateProjectTesting, useGetProjectDetailQuery } from "../services/project";
import SpinnerLineWave from "../components/spinner";
import { useNavigate, useParams } from "react-router-dom";
import InputField from "../components/Auth/FormInput";
import EthosBody from "../components/Body";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";


export const UpdateTesting = () => {
  const { loading, error, success } = useSelector((state: RootState) => state.project); // Type-safe selector
  const dispatch = useDispatch<AppDispatch>(); // Type-safe dispatch 
  const {id} = useParams();
  const navigate = useNavigate();
  const { data: project } = useGetProjectDetailQuery(id, { // Type data and add other states
          pollingInterval: 9000,
        skip: !localStorage.getItem('token') // Skip query if no token
  });


// _id?: string;
//   test_types?: string[];
//   automation_automation_frameworks?: string[];
//   ci_cd_integration?: string[];
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
  
    
  // // dialog popup and close 
  // function open() {
  //   setIsOpen(true)
  // }
  // function close() {
  //   setIsOpen(false)
  // }

  
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
    //   setDefLanguage(test_typesCommaSeparated)

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
  


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    console.log('project form subit test begin')


    const test_types = test_typesField.current ? test_typesField.current.value : "";
    const automation_frameworks = automation_frameworksField.current ? automation_frameworksField.current.value : "";
    const ci_cd_integration = ci_cd_integrationField.current ? ci_cd_integrationField.current.value : "";
  

    console.log('form subit test begin')

    try {
        console.log('onsubmit in')
        // clearErrors(); // Clear any previous errors
       
        const response = await dispatch(updateProjectTesting({
            _id: id,
            test_types: test_types,
            ci_cd_integration: ci_cd_integration,
            automation_frameworks: automation_frameworks,
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
      <EthosBody nav={true}>
        

        <div className="bg-[#eeeeeb] pb-20 relative">
          <div className="p-6 backdrop-opacity-30 duration-300 ease-out flex justify-center">
            <button onClick={() => {goBack()}}>
              <span className="absolute m-2 top-[5%] md:top-[10%] md:ml-[-40px] hover:text-red-600"><ArrowLeftIcon className="w-6 h-6 font-extrabold"/>
              </span>
            </button>
            <div className="w-full max-w-md rounded-xl bg-[#F7F7F7] h-fit mt-[20%] md:mt-[10%] ">
                <div className="min-w-[50%] min-h-[50%] items-center justify-between p-4">
                  
                  <h3 className="flex text-base/10 pb-4 font-medium text-slate-800 justify-center">
                      Update Projects' Testing Details
                  </h3>
                <form onSubmit={handleSubmit}>
                    
                    {/* // <Field> */}
                    <Field>
                        <InputField
                        name="test_typess"
                        label="Test type e.g Unittest, Security"
                        type="name"
                        // error={errors.root?.message}
                        Fieldref={test_typesField} value={""} />


                        <InputField
                        name="Frameworks"
                        label="Test Framework(s)"
                        type="name"
                        // error={""}
                        // value={project?.title}

                        Fieldref={automation_frameworksField} value={''} />

                        <InputField
                            name="ci_cd_integration"
                            label="CI/CD Integration"
                            type="text"
                            // error={""}
                            // value={project?.title}

                            Fieldref={ci_cd_integrationField} value={''} />

                    <button
                        className="inline-block my-2 shrink-0 rounded-md border border-blue-600 bg-blue-600 px-10 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
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

export default UpdateTesting;