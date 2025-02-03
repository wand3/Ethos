import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DeleteProjectSuccess, ProjectSchema } from '../schemas/project';
import { createProject, deleteProjectThunk, updateProject, updateProjectImages, updateProjectTechStack, updateProjectTesting, deleteProjectImageThunk } from '../services/project';


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


    // updating project technologies
    .addCase(updateProjectTechStack.pending, (state) => {
        state.loading = true;
        state.error = null;
    })
    .addCase(updateProjectTechStack.fulfilled, (state, action: PayloadAction<ProjectSchema>) => {
        state.loading = false;
        state.project = action.payload;
        state.success = true;
    })
    .addCase(updateProjectTechStack.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Could not update project technologies";
    })

    // updating project testtings
    .addCase(updateProjectTesting.pending, (state) => {
        state.loading = true;
        state.error = null;
    })
    .addCase(updateProjectTesting.fulfilled, (state, action: PayloadAction<ProjectSchema>) => {
        state.loading = false;
        state.project = action.payload;
        state.success = true;
    })
    .addCase(updateProjectTesting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Could not update project technologies";
    })


    // update project images
    .addCase(updateProjectImages.pending, (state) => {
        state.loading = true;
        state.error = null;
    })
    .addCase(updateProjectImages.fulfilled, (state, action: PayloadAction<ProjectSchema>) => {
        state.loading = false;
        state.project = action.payload;
        state.success = true;
    })
    .addCase(updateProjectImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Could not update project images";
    })

    // delete project image(s)
    .addCase(deleteProjectImageThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
    })
    .addCase(deleteProjectImageThunk.fulfilled, (state, action: PayloadAction<ProjectSchema>) => {
        state.loading = false;
        state.project = action.payload;
        state.success = true;
    })
    .addCase(deleteProjectImageThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Could not delete project image";
    })

    // // delete project
    // .addCase(deleteProjectThunk.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    // })
    // .addCase(deleteProjectThunk.fulfilled, (state, action: PayloadAction<DeleteProjectSuccess>) => {
    //     state.loading = false;
    //     state = action.payload;
    //     state.success = true;
    // })
    // .addCase(deleteProjectThunk.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload || "Could not update project images";
    // })

},

})

// export const {  } = projectSlice.actions
export default projectSlice.reducer