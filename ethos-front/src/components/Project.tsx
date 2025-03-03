import { ProjectSchema } from "../schemas/project"
import { ReactElement, memo } from "react"
import Config from "../config"
import { Link } from "react-router-dom"


type PropsType = {
    project: ProjectSchema,
}



const Project = ({ project }: PropsType): ReactElement => {
    
    const img: string = new URL(`${Config.baseURL}/static/images/project_images/${project.images[0]}`, import.meta.url).href
    // const img: string = `${Config.baseURL}/static/images/project_images/${project.images}`
    // console.log(img)
    const content =
        <div className="bg-white max-h-[35vh] shadow-lg rounded-2xl px-3 py-4 cursor-pointer hover:-translate-y-2 transition-all relative">
            
            <Link to={`/project/${project._id}`} className="group relative block h-[full]">
                    {/* <div className="overflow-hidden flex justify-center ml-auto mr-auto md:mb-2 mb-4 w-[60%] h-[40%]">
                        <img src={img} alt={project.title} className="mb-3 h-fit" />
                    </div> */}
                <span className="absolute inset-0 border-2 border-dashed border-black"></span>

                <div
                    className="relative flex transform items-end border-2 border-black bg-white transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2"
                >
                    <div
                    className="p-4 !pt-0 transition-opacity group-hover:absolute group-hover:opacity-0 sm:p-6 lg:p-8"
                    >
                        <img src={img} alt={project.title} className="mb-3 h-[40%]" />
                        {/* <img src={'./..'} alt={''} className="mb-3 h-[40%]" /> */}

                        {/* <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="size-10 sm:size-12"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg> */}

                        <h2 className="mt-4 text-xl font-medium sm:text-2xl">{project.title}</h2>
                    </div>

                    <div className="absolute p-4 opacity-0 transition-opacity group-hover:relative group-hover:opacity-100 sm:p-6 lg:p-8">
                        <h3 className="mt-4 text-xl font-medium sm:text-2xl">{project.title}</h3>

                        <p className="mt-4 text-sm sm:text-base">
                            {project.description.slice(0,40)}
                        </p>

                        <p className="mt-8 font-bold">Read more</p>
                    </div>
                </div>
            </Link>
        </div>
    return content
}

export default Project;