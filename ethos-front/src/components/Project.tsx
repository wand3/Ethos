import { ProjectSchema } from "../schemas/project"
import { ReactElement, memo } from "react"
import Config from "../config"
import { Link } from "react-router-dom"
import Edges from "../assets/svg/Edges"
import FolderOpenIcon from "@heroicons/react/24/solid/FolderOpenIcon"
import ArrowTopRightOnSquareIcon from "@heroicons/react/24/solid/ArrowTopRightOnSquareIcon"


type PropsType = {
    project: ProjectSchema,
}



const Project = ({ project }: PropsType): ReactElement => {
    
    const img: string = new URL(`${Config.baseURL}/static/images/project_images/${project.images[0]}`, import.meta.url).href
    // const img: string = `${Config.baseURL}/static/images/project_images/${project.images}`
    // console.log(img)
    const content =
        <>
            <div className=" sm:h-[45vh] rounded-2xl px-3 py-4 my-2 cursor-pointer hover:-translate-y-1 transition-all relative">



            <Link to={`/project/${project._id}`} className="group relative block h-[fit]">
                {/* <div className="overflow-hidden flex justify-center ml-auto mr-auto md:mb-2 mb-4 w-[60%] h-[40%]">
        <img src={img} alt={project.title} className="mb-3 h-fit" />
    </div> */}
                {/* <span className="absolute inset-0 border-2 border-dashed border-black"></span> */}
                        <Edges></Edges>

                <div
                    className="relative flex transform items-end transition-transform group-hover:-translate-x-auto group-hover:-translate-y-auto"
                >
                    <div
                        className="m-[1%] !pt-0 pb-[3%] transition-opacity group-hover:absolute group-hover:opacity-0 sm:p-2 lg:p-8"
                    >

                        <li className="flex transition hover:shadow-xl shadow-lg w-[84vw] sm:w-[85vw]  lg:w-[80vw] sm:mx-1 sm:px-1 mt-[2%] md:py-2 glass flex-col py-2 text-left sm:flex-row sm:space-x-5 rounded-md p-4 sm:flex sm:justify-start">
                            <div className="hidden md:block rotate-180 p-2 [writing-mode:_vertical-lr]">
                                <div
                                    className="flex items-center justify-between gap-4 text-xs font-bold uppercase text-gray-900"
                                >
                                    <span className="w-px flex-1 bg-gray-900/10"></span>
                                    {/* <span><FolderOpenIcon className="h-5 w-5 rotate-180" /></span> */}
                                </div>
                            </div>

                            <div className="relative shrink-0 my-auto">

                                <img
                                    alt=""
                                    src={img}
                                    className="aspect-square h-[100px] w-full rounded-md drop-shadow-md object-cover transition duration-500 group-hover:scale-105 md:h-[8rem]" />
                            </div>

                            <div className="flex flex-1 flex-col justify-between md:my-auto">
                                <div className="border-s border-gray-900/10 p-4 sm:border-l-transparent sm:p-[1em]">
                                    <a href="#">
                                        <h3 className="font-bold uppercase text-gray-900 sm:text-3xl ">
                                            {project.title}
                                        </h3>
                                    </a>

                                    <p className="mt-1 line-clamp-3 text-sm/relaxed text-gray-700">
                                        {project.description.slice(0, 50)}
                                    </p>
                                </div>

                                <div className="flex items-end gap-2 justify-end m-1">




                                    <a
                                        href="#"
                                        className="block bg-yellow-300 px-2 py-2 text-center text-xs font-bold uppercase text-gray-900 transition hover:bg-yellow-400 rounded-lg"
                                    >
                                        <ArrowTopRightOnSquareIcon className="h-5 w-6" />
                                    </a>

                                </div>
                            </div>
                        </li>
                        {/* <img src={img} alt={project.title} className="mb-3 h-[40%]" /> */}
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
    </svg>

    <h2 className="mt-4 text-xl font-medium sm:text-2xl">{project.title}</h2> */}
                    </div>

                    <div className="absolute p-4 opacity-0 transition-opacity group-hover:relative group-hover:opacity-100 sm:p-6 lg:p-8">
                        <h3 className="mt-4 text-xl font-medium sm:text-2xl">{project.title}</h3>

                        <p className="mt-4 text-sm sm:text-base">
                            {project.description.slice(0, 40)}
                        </p>

                        <p className="mt-8 font-bold">Read more</p>
                    </div>
                </div>
            </Link>
        </div></>
    return content
}

export default Project;