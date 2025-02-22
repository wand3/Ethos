import { useState } from 'react'
import { useLocation } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { HamburgerMenu } from './design/NavMain';
import ButtonMain from '../components/Button'
import { StrikethroughIcon } from '@heroicons/react/16/solid';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import {w} from "../assets"
import MenuSvg from '../assets/svg/MenuSvg';


const navigation = [
  {
    id: "0",
    title: "Ethos",
    url: "#ethos",
  },
  {
    id: "1",
    title: "Services",
    url: "#services",
  },
  {
    id: "2",
    title: "About",
    url: "/about",
  },
  {
    id: "3",
    title: "Projects",
    url: "/projects",
  },
  {
    id: "4",
    title: "Blog",
    url: "/blog",
    onlyMobile: true,
  },
  {
    id: "5",
    title: "Let's Talk",
    url: "#contact",
    onlyMobile: true,
  },
];


export const NavMain = () => {
  const pathname = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;

    enablePageScroll();
    setOpenNavigation(false);
  };

  // JavaScript to toggle dark mode
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
  };


  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 lg:bg-n-8/100 dark:bg-slate-900 backdrop-blur-lg lg:backdrop-blur-lg drop-shadow-md dark:text-white ${
        openNavigation ? "bg-n-8 h-screen" : "bg-n-8/100 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center px-2 lg:px-7.5 xl:px-10 max-lg:py-4">
        <div className="flex w-[30%] h-10 opacity-100 right-[70%] float-end">
          <a className="flex xl:mr-8 mr-2" href="#hero">
            <img src={w} className='w-[3rem] pr-2 flex' alt="Wande" />
            <span className='text-2xl font-bold flex relative items-center'>Wa<span className='text-white px-1 dark:text-black'>nde</span>
              <div className='bg-black dark:bg-[#ffffff] w-[52%] h-[1.5em] left-[45%] -z-[2] absolute'>
                
              </div>
              </span>

          </a>
          
        </div>

        <nav
          className={`${
            openNavigation ? "flex" : "hidden"
          } fixed top-[5rem] left-0 right-0 bottom-0 dark:backdrop-blur-0 lg:static lg:flex lg:bg-transparent`}
        >
          <div className="relative z-2 flex flex-col items-center justify-center lg:flex-row m-auto">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={item.url}
                onClick={handleClick}
                className={`block relative font-code text-lg capitalize text-n-1 hover:bg-color-3 dark:text-white transition-colors hover:shadow-lg dark:hover:text-color-1 border-b-[transparent] dark:shadow-2xl lg:flex-row ${
                  item.onlyMobile ? "lg:hidden" : ""
                } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold ${
                  item.url === pathname.hash
                    ? "z-2 lg:text-n-1"
                    : "lg:text-n-1/50"
                } lg:leading-5 lg:hover:text-n-1 xl:px-12`}
              >
                {item.title}
              </a>
            ))}
          </div>
           
          <HamburgerMenu />
        </nav>

         <div className="flex items-center absolute left-[50vw] lg:left-[80vw] gap-3">

            <div onClick={() => {toggleDarkMode()}} id="toggleDark" className="flex w-fit shrink background-light drop-shadow-lg dark:toggle-nav-dark h-fit px-2 my-3 pt-2 pb-2 items-center rounded-2xl cursor-pointer bg-[#d9ccae8f]">


                <svg className="moon shrink h-7 w-6 mr-2 dark:drop-shadow-xl" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />

                </svg>

                <div id="toggleBall" className="w-8 shrink-sm px-1 h-7 drop-shadow-lg bg-[#FFC876] dark:ml-7 rounded-full absolute transform transition-transform duration-300">
                </div>

                <svg className="ml-2 h-6 w-6 shrink dark:border-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                </svg>

            </div>
                        
                <div className='hidden w-fit h-fit lg:flex my-3'>
                    <a
                        className="px-2 py-2.5 text-[0.6rem] font-bold shadow rounded-lg outline-offset-4 border border-stone-900 dark:border-white "
                      href="#"
                  >
                      Let's Connect
                      <ArrowRightIcon className='h-5 w-5 relative right-0 inline-block pl-1' />
                  </a>
                  
                </div>
          </div>
  
          


        <ButtonMain
          className="ml-auto lg:hidden"
          onClick={toggleNavigation}
        >
          <MenuSvg openNavigation={openNavigation} />
        
        </ButtonMain>
      </div>
    </div>
  );

}


export default NavMain;

