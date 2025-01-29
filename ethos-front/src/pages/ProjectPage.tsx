import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Config from "../config";
import EthosBody from "../components/Body";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
// import { ArrowLeftIcon } from "lucide-react";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useGetProjectDetailQuery } from "../services/project";
import Footer from "../components/Footer";


import UpdateProject from "../components/Admin/UpdateProject";

// interface ApiResponse {
//   products: ProductType[];
// }


export const ProjectPage = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const { data: project, error } = useGetProjectDetailQuery(id, { // Type data and add other states
    pollingInterval: 9000,
    skip: !localStorage.getItem('token') // Skip query if no token
  });
  
  let [isOpen, setIsOpen] = useState(false) 


 
  const [status, setStatus] = useState<'initial'| 'uploading'| 'success' | 'fail'>('initial')

  // dialog popup and close 
  function open() {
    setIsOpen(true)
  }
  function close() {
    setIsOpen(false);
    
  }

  // back button 
  const goBack = () => {
    return navigate(-1);
  }
  


  
  useEffect( () => {
    // loadProduct();
    // if (product) {
    //   laodCategory(product?.category_id);
    // }
    // laodCategory(product?.category_id || 2);

  }, [])


  
  return (
    <>
      <EthosBody nav>
        <div className="absolute z-10 mt-0 mx-4 lg:ml-12 p-1 hover:text-red-600 text-black dark:text-white">
          <div onClick={() => {goBack()}}>
            <ArrowLeftIcon className="w-6 h-6 font-extrabold"/>
          </div>
        </div>

        <section className="relative max-w-screen-xl mx-auto py-3 px-4 md:px-8">
        
          {/* <button onClick={() => {goBack()}}>
            <span className="absolute mt-0 mx-4 lg:ml-12 p-1 hover:text-red-600 text-black dark:text-white">
            <ArrowLeftIcon className="w-6 h-6 font-extrabold"/>
            </span>
          </button> */}
          
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-40"></div>
            <div className="relative z-10 gap-5 items-center lg:flex">
                <div className="flex-1 max-w-lg py-5 sm:mx-auto sm:text-center lg:max-w-max lg:text-left">
                  <h3 className="text-3xl text-gray-800 font-semibold md:text-4xl">
                      {project?.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed mt-3">
                      {project?.description}
                  </p>
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
                    <img 
                        src="https://i.postimg.cc/kgd4WhyS/container.png" 
                        alt="" 
                        className="w-full" 
                    />
                </div>
            </div>
            
        </section>
        <UpdateProject />

              
        <Footer />
      </EthosBody>
    </>
  
  )


}

export default ProjectPage;

