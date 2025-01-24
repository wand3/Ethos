import React, { useEffect } from 'react';
import { useGetProjectsDetailsQuery } from '../services/project';

const ProjectPart = () => {
  const { data: projects, isLoading: areProjectsLoading, error } = useGetProjectsDetailsQuery();

  useEffect(() => {
      console.log("projects", projects)
  }, [ projects])


  if (areProjectsLoading) return <div>Loading projects...</div>;
  if (error) return <div>Error loading projects: {error?.message}</div>;

  return (
    <>
        <div>
        
        {/* Display projects */}
        {projects && (
            <ul>
            {projects.map((project) => (
                <><li key={project._id}>{project.title}</li>
                <li>{project.description}</li>
                <li>{project.roles[0]}</li></>
            ))}
            </ul>
        )}
        </div>
    </>
  );
};

export default ProjectPart;