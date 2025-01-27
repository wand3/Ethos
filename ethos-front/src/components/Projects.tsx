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
        <main className="overflow-scroll flex gap-5 px-3 md:px-5 pb-12">

         {/* <main className="grid grid-cols-2 md:h-[80vh] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-xl:gap-4 gap-6 pt-10 px-3"> */}
            {pageContent}
        </main>
    )

    return content


}
  // if (areProjectsLoading) return <div>Loading projects...</div>;
  // if (error) return <div>Error loading projects: {error?.message}</div>;

  // return (
  //   <>
  //       <div>
        
  //       {/* Display projects */}
  //       {projects && (
  //           <ul>
  //           {projects.map((project) => (
  //               <><li key={project._id}>{project.title}</li>
  //               <li>{project.description}</li>
  //               <li>{project.roles?.map((role, index) => (
  //                 <p className='text-red-500' key={index}>{role}</p>
  //               ))}</li></>
  //           ))}
  //           </ul>
  //       )}
  //       </div>
  //   </>
  // );

export default ProjectPart;



