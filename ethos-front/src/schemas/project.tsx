import * as yup from "yup";

export interface TechStack {
  language?: string[];
  frameworks?: string[];
  databases?: string[];
  tools?: string[];
}

export interface UpdateTechStack {
  _id?: string;
  language?: string;
  frameworks?: string;
  databases?: string;
  tools?: string;
}

export interface TestingDetails {
  test_types?: string[];
  automation_frameworks?: string[];
  ci_cd_integration?: string[];
}

export interface UpdateTestingDetails {
  _id?: string;
  test_types?: string[];
  automation_frameworks?: string[];
  ci_cd_integration?: string[];
}


export interface ProjectSchema {
  _id?: string;
  title: string;
  description: string;
  project_url?: string;
  github_url?: string;
  technologies?: TechStack;
  roles?: string[];
  testing_details?: TestingDetails | null;
  images?: File[];
}


export interface CreateProjectSchema {
  title: string;
  description: string;
  github_url: string;
  roles?: string;
  images: (File | undefined)[];
}


export interface UpdateProjectSchema {
  _id: string;
  title?: string;
  description?: string;
  project_url?: string;
  github_url?: string;
  roles?: string;
}


export const projectSchema = yup.object().shape({
    title: yup.string().required('Title is required'),
    description: yup.string().required('Description is required'),
    // project_url: yup.string().url('Must be a valid URL').optional(),
    github_url: yup.string().url('Must be a valid URL').required('Github UrL is required'),
    
    roles: yup.string().required('Roles are required')
        .matches(/^[^@$!%*?&#^+=\\[\]{}|;:'"<>\/]*$/, 'Roles cannot contain special characters') // Added regex for special characters
        
        ,

    
    images: yup.array().of(
        yup.mixed<File>()
        .test('fileSize', 'File Size is too large', (value) => {
            if (!value) return true;
            return value.size <= 1048576 * 5;
        })
        .test('fileType', 'Unsupported File Format', (value) => {
            if (!value) return true
            return ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/mov', 'image/mp4', 'image/webp'].includes(value.type);
        })
        ).transform((currentValue, originalValue) => { // Correct Transform function
            if (originalValue) {
                if (originalValue instanceof FileList) {
                    return Array.from(originalValue);
                }
                if (Array.isArray(originalValue)) {
                    return originalValue
                }
            }
            return currentValue;
    }).optional(),
});

// update projects 
export const yupUpdateProjectSchema = yup.object().shape({
    title: yup.string().optional(),
    description: yup.string().optional(),
    project_url: yup.string().optional(),
    github_url: yup.string().optional(),
    
    roles: yup.string().optional()
        .matches(/^[^@$!%*?&#^+=\\[\]{}|;:'"<>\/]*$/, 'Roles cannot contain special characters') // Added regex for special characters
        
        ,
});


// update technologies 
export const yupUpdateProjectTechnologiesSchema = yup.object().shape({
    language: yup.array().of(yup.string()),
    frameworks: yup.array().of(yup.string()),
    databases: yup.array().of(yup.string()),
    tools: yup.array().of(yup.string()),
});





// export const UpdateTechnologies = () => {
//   const { loading, error, success } = useSelector((state: RootState) => state.project); // Type-safe selector
//   let [isOpen, setIsOpen] = useState(false);
//   const dispatch = useDispatch<AppDispatch>(); // Type-safe dispatch 
//   const flash = useFlash();

//   // Pre-filled technologies data
//   const [technologies, setTechnologies] = useState({
//     language: ['Python', 'JS', 'Typescript', 'update'],
//     frameworks: ['one', 'three', 'update'],
//     databases: ['mongo', 'sql', 'update'],
//     tools: ['selenium', 'update'],
//   });

  // const {
  //   register,
  //   handleSubmit,
  //   control,
  //   setValue,
  //   formState: { errors },
  //   setError,
  //   clearErrors,
  // } = useForm<CreateProjectSchema>({
  //   resolver: yupResolver(projectSchema),
  //   defaultValues: {
  //     technologies: technologies, // Pre-fill the form with technologies data
  //   },
  // });

  // // Pre-fill the form when the component mounts or technologies change
  // useEffect(() => {
  //   Object.entries(technologies).forEach(([category, items]) => {
  //     setValue(`technologies.${category}`, items);
  //   });
  // }, [technologies, setValue]);

  // dialog popup and close 
  // const open = () => setIsOpen(true);
  // const close = () => setIsOpen(false);

  // const onSubmit = async (data: CreateProjectSchema) => {
  //   console.log('Form submitted:', data);

    // try {
    //   clearErrors(); // Clear any previous errors

    //   // Dispatch the updated technologies data
    //   const response = await dispatch(createProject({
    //     title: data.title,
    //     description: data.description,
    //     github_url: data.github_url,
    //     roles: data.roles,
    //     technologies: data.technologies, // Include updated technologies
    //   }));

  //     if (success) {
  //       flash("Project Updated", "success");
  //       close(); // Close the dialog on success
  //     }
  //   } catch (err: any) {
  //     console.error("Update error:", err);
  //     flash("Project Update Failed", "error");

  //     if (axios.isAxiosError(err)) {
  //       setError("root", { type: "manual", message: err.response?.data?.message || err.message || 'Update failed due to network error' });
  //     } else {
  //       setError("root", { type: "manual", message: "An unexpected error occurred during update." });
  //     }
  //   }
  // };

//   return (
//     <>
//       <Button
//         onClick={open}
//         className="flex select-none items-center gap-2 rounded bg-slate-800 py-2.5 px-4 text-xs font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:shadow-lg hover:shadow-slate-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
//       >
//         Update Technologies
//       </Button>

//       <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close}>
//         <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
//           <div className="flex min-h-full items-center justify-center p-4">
//             <DialogPanel
//               transition
//               className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
//             >
//               <DialogTitle as="h3" className="text-base/7 font-medium text-white justify-center">
//                 Update Technologies
//               </DialogTitle>

              // <form onSubmit={handleSubmit(onSubmit)}>
              //   {/* Render fields for each technology category */}
              //   {Object.entries(technologies).map(([category, items]) => (
              //     <div key={category} className="col-span-6 sm:col-span-3">
              //       <label htmlFor={category} className="flex text-sm font-medium text-gray-700 py-1">
              //         {category.charAt(0).toUpperCase() + category.slice(1)}
              //       </label>
              //       <Controller
              //         name={`technologies.${category}`}
              //         control={control}
              //         render={({ field }) => (
              //           <input
              //             {...field}
              //             className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
              //             value={field.value.join(', ')} // Convert array to comma-separated string
              //             onChange={(e) => {
              //               const value = e.target.value.split(',').map(item => item.trim()); // Convert back to array
              //               field.onChange(value);
              //             }}
              //           />
              //         )}
              //       />
              //       {errors.technologies?.[category] && (
              //         <p className="flex mt-2 text-xs text-red-600">{errors.technologies[category].message}</p>
              //       )}
              //     </div>
              //   ))}

              //   <button
              //     className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-10 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
              //     type="submit"
              //     aria-disabled={loading}
              //   >
              //     {loading ? <SpinnerLineWave /> : 'Save'}
              //   </button>
              // </form>
//             </DialogPanel>
//           </div>
//         </div>
//       </Dialog>
//     </>
//   );
// };

// export default UpdateTechnologies;