import React, { ReactElement, useEffect } from 'react';
import { ProjectSchema } from '../schemas/project';
import Project from './Project';
import { useGetProjectsDetailsQuery } from '../services/project';

type AllProjects = {
  projects: ProjectSchema[];
}

const ProjectPart = (all_projects: AllProjects) => {
  const { data: projects, isLoading: areProjectsLoading, error } = useGetProjectsDetailsQuery();


  useEffect(() => {
      console.log("projects", projects)
  }, [ projects])

  let pageContent: ReactElement | ReactElement[] = <p>Loading...</p>

  if (projects?.length) {
      pageContent = projects.map(project => {

          return (
              <Project
                  key={project._id}
                  project={project}
              />
          )
      })
    }

    const content = (
        <main className="gap-5 px-[3%] py-[5%] md:px-5 pb-12 h-fit">
            <div className='flex justify-center mt-[7%]'>
                <h1 className='text-heading justify-center'>Project Highlights</h1>
            </div>
            

         {/* <main className="grid grid-cols-2 md:h-[80vh] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-xl:gap-4 gap-6 pt-10 px-3"> */}
            {pageContent}
        </main>
    )

    return content


}


export default ProjectPart;



