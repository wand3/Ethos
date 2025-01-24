import Config from '../config';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import { CreateProjectSchema, ProjectSchema , TechStack, TestingDetails } from '../schemas/project';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';


// initialize userToken from local storage
export const userToken = localStorage.getItem('token')
  ? localStorage.getItem('token')
  : null


// get all projects rtk query 
export const projectApi = createApi({
  reducerPath: 'projectApi',
  baseQuery: fetchBaseQuery({
    baseUrl: Config.baseURL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token; // Type the getState result
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers; // Important: Return the headers
    },
  }),
  endpoints: (builder) => ({
    getProjectsDetails: builder.query<ProjectSchema[], void>({ // Type the query result and argument
      query: () => ({
        url: `${Config.baseURL}/projects/`,
        method: 'GET',
      }),
    }),
  }),
});

// create project thunk
export const createProject = createAsyncThunk<ProjectSchema, CreateProjectSchema, { rejectValue: string}> (
  'project/add',
  async ({ title, description, github_url, images, roles }: CreateProjectSchema, { rejectWithValue }) => { 
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      if (github_url) {
        formData.append('github_url', github_url);
      }
      if (roles) {
        formData.append('roles', roles);
      }

      console.log(formData)
      console.log(images)
      console.log(userToken)


      // Handle multiple image uploads
      images?.forEach((image) => formData.append('images', image));

      const config = {
        headers: {
          // 'Content-Type': 'application/json',
          'Content-Type': 'multipart/form-data', // Set for form data with images
          'authorization': `Bearer ${userToken}`
        },
  
      };
      const response = await axios.post(
        `${Config.baseURL}/project/add`,
        formData,
        // { title, description, project_url, github_url, images },
        config
      );
      if (response.status === 201) {
        return response.data
      }
    } catch (error) {
      // Handle Axios errors with type safety
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        if (axiosError.response && axiosError.response.data.message) {
          return rejectWithValue(axiosError.response.data.message);
        }
      }
      // Handle non-Axios errors or generic error messages
      return rejectWithValue((error as Error).message);
    }
  }

);



export const { useGetProjectsDetailsQuery } = projectApi; // Export the hook









// // Async Thunks
// export const fetchProjects = createAsyncThunk<Project[], void, {rejectValue: string, state: RootState}>(
//   'project/fetchProjects',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get<Project[]>(`${Config.baseURL}/projects`);
//       return response.data;
//     } catch (error: any) {
//         return rejectWithValue(error.response?.data?.message || error.message || "Could not fetch projects")
//     }
//   }
// );

// export const addProject = createAsyncThunk<Project, Project, {rejectValue: string, state: RootState}>(
//   'project/addProject',
//   async (project, { rejectWithValue }) => {
//     try {
//       const response = await axios.post<Project>(`${Config.baseURL}/projects`, project);
//       return response.data;
//     } catch (error: any) {
//         return rejectWithValue(error.response?.data?.message || error.message || "Could not add project")
//     }
//   }
// );

// export const updateProject = createAsyncThunk<Project, Project, {rejectValue: string, state: RootState}>(
//   'project/updateProject',
//   async (project, { rejectWithValue }) => {
//     try {
//       const response = await axios.put<Project>(`${Config.baseURL}/projects/${project.id}`, project);
//       return response.data;
//     } catch (error: any) {
//         return rejectWithValue(error.response?.data?.message || error.message || "Could not update project")
//     }
//   }
// );

// export const deleteProject = createAsyncThunk<number, number, {rejectValue: string, state: RootState}>( // Returns the deleted ID
//   'project/deleteProject',
//   async (projectId, { rejectWithValue }) => {
//     try {
//       await axios.delete(`${Config.baseURL}/projects/${projectId}`);
//       return projectId; // Return the deleted project ID
//     } catch (error: any) {
//         return rejectWithValue(error.response?.data?.message || error.message || "Could not delete project")
//     }
//   }
// );