import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProjectSchema } from '../schemas/project';
import { createProject, updateProject } from '../services/project';


interface ProjectState {
  loading: boolean
  project: ProjectSchema | null;
  error: string | null;
  success: boolean;
}

const initialState: ProjectState = {
  loading: false,
  project: null,
  error: null,
  success: false,
}

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers : {
  
  },

  extraReducers: (builder) => {
    builder
    // adding project 
    .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
    })
    .addCase(createProject.fulfilled, (state, action: PayloadAction<ProjectSchema>) => {
        state.loading = false;
        state.project = action.payload;
        state.success = true;
    })
    .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Could not add project";
    })

    // updating project 
    .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
    })
    .addCase(updateProject.fulfilled, (state, action: PayloadAction<ProjectSchema>) => {
        state.loading = false;
        state.project = action.payload;
        state.success = true;
    })
    .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Could not update project";
    })
},

})

// export const {  } = projectSlice.actions
export default projectSlice.reducer