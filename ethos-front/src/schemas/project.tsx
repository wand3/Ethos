import * as yup from "yup";

export interface TechStack {
  language?: string[];
  frameworks?: string[];
  databases?: string[];
  tools?: string[];

}

export interface TestingDetails {
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
  testing_details?: TestingDetails;
  images?: File[];
}


export interface CreateProjectSchema {
  title: string;
  description: string;
  github_url: string;
  roles?: string;
  images: (File | undefined)[];
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
            return ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(value.type);
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
