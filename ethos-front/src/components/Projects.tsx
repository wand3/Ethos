import { ReactElement, useEffect } from 'react';
import { ProjectSchema } from '../schemas/project';
import Project from './Project';
import { useGetProjectsDetailsQuery } from '../services/project';
import Heading from './Heading';

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
      const topProjects = projects.slice(0, 3);  // Get the top 3 projects
      pageContent = topProjects.map(project => {

          return (
              <Project
                  key={project._id}
                  project={project}
              />
          )
      })
    }

    const content = ( 
        <main className="gap-5 px-[3%] py-[5%] md:px-5 pb-12 h-fit ">
            {/* <div className='flex justify-center mt-[7%] pb-[6%]'>

                <h1 className="text-heading justify-center duration-[300ms] taos:[transform:perspective(2500px)_rotateX(-100deg)] taos:invisible taos:[backface-visibility:hidden]" data-taos-offset="400">Project Highlights</h1>
            </div> */}
             <Heading
                className="md:max-w-md lg:max-w-2xl"
                title="Project Highlights"
            />
            
         {/* <main className="grid grid-cols-2 md:h-[80vh] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-xl:gap-4 gap-6 pt-10 px-3"> */}
            <ul className="mt-8 gap-4 sm:grid-cols-1 lg:grid-cols-1 lg:px-10">
                    {pageContent}
                

            </ul>
        </main>
    )

    return content


}


export default ProjectPart;



