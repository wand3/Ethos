import { useState } from 'react'
import { useLocation } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { HamburgerMenu } from './design/NavMain';
import ButtonMain from '../components/Button'



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
      className={`fixed top-0 left-0 w-full z-50  border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${
        openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        <a className="block w-[12rem] xl:mr-8" href="#hero">
          {/* <img src={brainwave} width={190} height={40} alt="Brainwave" /> */}
          <svg className="h-8 text-[#FFC876]" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
            d="M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424C7.6714 1.02234 10.6393 0 13.695 0C16.7507 0 19.7186 1.02234 22.1261 2.90424C24.5336 4.7861 26.2422 7.4194 26.98 10.3847H25.78C23.7557 10.3549 21.7729 10.9599 20.11 12.1147C20.014 12.1842 19.9138 12.2477 19.81 12.3047H19.67C19.5662 12.2477 19.466 12.1842 19.37 12.1147C17.6924 10.9866 15.7166 10.3841 13.695 10.3841C11.6734 10.3841 9.6976 10.9866 8.02 12.1147C7.924 12.1842 7.8238 12.2477 7.72 12.3047H7.58C7.4762 12.2477 7.376 12.1842 7.28 12.1147C5.6171 10.9599 3.6343 10.3549 1.61 10.3847H0.41ZM23.62 16.6547C24.236 16.175 24.9995 15.924 25.78 15.9447H27.39V12.7347H25.78C24.4052 12.7181 23.0619 13.146 21.95 13.9547C21.3243 14.416 20.5674 14.6649 19.79 14.6649C19.0126 14.6649 18.2557 14.416 17.63 13.9547C16.4899 13.1611 15.1341 12.7356 13.745 12.7356C12.3559 12.7356 11.0001 13.1611 9.86 13.9547C9.2343 14.416 8.4774 14.6649 7.7 14.6649C6.9226 14.6649 6.1657 14.416 5.54 13.9547C4.4144 13.1356 3.0518 12.7072 1.66 12.7347H0V15.9447H1.61C2.39051 15.924 3.154 16.175 3.77 16.6547C4.908 17.4489 6.2623 17.8747 7.65 17.8747C9.0377 17.8747 10.392 17.4489 11.53 16.6547C12.1468 16.1765 12.9097 15.9257 13.69 15.9447C14.4708 15.9223 15.2348 16.1735 15.85 16.6547C16.9901 17.4484 18.3459 17.8738 19.735 17.8738C21.1241 17.8738 22.4799 17.4484 23.62 16.6547ZM23.62 22.3947C24.236 21.915 24.9995 21.664 25.78 21.6847H27.39V18.4747H25.78C24.4052 18.4581 23.0619 18.886 21.95 19.6947C21.3243 20.156 20.5674 20.4049 19.79 20.4049C19.0126 20.4049 18.2557 20.156 17.63 19.6947C16.4899 18.9011 15.1341 18.4757 13.745 18.4757C12.3559 18.4757 11.0001 18.9011 9.86 19.6947C9.2343 20.156 8.4774 20.4049 7.7 20.4049C6.9226 20.4049 6.1657 20.156 5.54 19.6947C4.4144 18.8757 3.0518 18.4472 1.66 18.4747H0V21.6847H1.61C2.39051 21.664 3.154 21.915 3.77 22.3947C4.908 23.1889 6.2623 23.6147 7.65 23.6147C9.0377 23.6147 10.392 23.1889 11.53 22.3947C12.1468 21.9165 12.9097 21.6657 13.69 21.6847C14.4708 21.6623 15.2348 21.9135 15.85 22.3947C16.9901 23.1884 18.3459 23.6138 19.735 23.6138C21.1241 23.6138 22.4799 23.1884 23.62 22.3947Z"
            fill="currentColor"
            />
        </svg>
        </a>

        <nav
          className={`${
            openNavigation ? "flex" : "hidden"
          } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}
        >
          <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={item.url}
                onClick={handleClick}
                className={`block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 ${
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

        <a
          href="#signup"
          className="ButtonMain hidden mr-8 text-n-1/50 transition-colors hover:text-n-1 lg:block"
        >
          New account
        </a>
        <ButtonMain className="hidden lg:flex" href="#login">
          Sign in
        </ButtonMain>

        <ButtonMain
          className="ml-auto lg:hidden"
          px="px-3"
          onClick={toggleNavigation}
        >hgj
          {/* <MenuSvg openNavigation={openNavigation} /> */}
        </ButtonMain>
      </div>
    </div>
  );

}



// import { Menu, MenuButtonMain, MenuItem, MenuItems } from '@headlessui/react'
// import { useState } from 'react'
// import { ArrowRightIcon } from '@heroicons/react/16/solid'


//     // Replace javascript:void(0) path with your path
//     const navigation = [
//         { title: "Home", path: "/ethos" },
//         { title: "Services", path: "/services" },
//         { title: "About me", path: "/about" },

//         { title: "Projects", path: "/projects" },
//         { title: "Blog", path: "/blog" }
//     ]

// // p-2 px-1 text-lightbackground dark:text-darkbackground 
//     return (
//         <>
//             <header className="fixed top-0 left-0 w-full z-50  border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm"> 
//                 <div className=" max-w-screen-xl lg:px-8">
//                 {/* <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4"> */}

//                     <div className="flex h-16 items-center justify-between">
//                     <div className="md:flex md:items-center md:gap-12">
//                         <a className="block p-1" href="#">
//                         <span className="sr-only">Home</span>
//                         <svg className="h-8 text-[#FFC876]" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                             <path
//                             d="M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424C7.6714 1.02234 10.6393 0 13.695 0C16.7507 0 19.7186 1.02234 22.1261 2.90424C24.5336 4.7861 26.2422 7.4194 26.98 10.3847H25.78C23.7557 10.3549 21.7729 10.9599 20.11 12.1147C20.014 12.1842 19.9138 12.2477 19.81 12.3047H19.67C19.5662 12.2477 19.466 12.1842 19.37 12.1147C17.6924 10.9866 15.7166 10.3841 13.695 10.3841C11.6734 10.3841 9.6976 10.9866 8.02 12.1147C7.924 12.1842 7.8238 12.2477 7.72 12.3047H7.58C7.4762 12.2477 7.376 12.1842 7.28 12.1147C5.6171 10.9599 3.6343 10.3549 1.61 10.3847H0.41ZM23.62 16.6547C24.236 16.175 24.9995 15.924 25.78 15.9447H27.39V12.7347H25.78C24.4052 12.7181 23.0619 13.146 21.95 13.9547C21.3243 14.416 20.5674 14.6649 19.79 14.6649C19.0126 14.6649 18.2557 14.416 17.63 13.9547C16.4899 13.1611 15.1341 12.7356 13.745 12.7356C12.3559 12.7356 11.0001 13.1611 9.86 13.9547C9.2343 14.416 8.4774 14.6649 7.7 14.6649C6.9226 14.6649 6.1657 14.416 5.54 13.9547C4.4144 13.1356 3.0518 12.7072 1.66 12.7347H0V15.9447H1.61C2.39051 15.924 3.154 16.175 3.77 16.6547C4.908 17.4489 6.2623 17.8747 7.65 17.8747C9.0377 17.8747 10.392 17.4489 11.53 16.6547C12.1468 16.1765 12.9097 15.9257 13.69 15.9447C14.4708 15.9223 15.2348 16.1735 15.85 16.6547C16.9901 17.4484 18.3459 17.8738 19.735 17.8738C21.1241 17.8738 22.4799 17.4484 23.62 16.6547ZM23.62 22.3947C24.236 21.915 24.9995 21.664 25.78 21.6847H27.39V18.4747H25.78C24.4052 18.4581 23.0619 18.886 21.95 19.6947C21.3243 20.156 20.5674 20.4049 19.79 20.4049C19.0126 20.4049 18.2557 20.156 17.63 19.6947C16.4899 18.9011 15.1341 18.4757 13.745 18.4757C12.3559 18.4757 11.0001 18.9011 9.86 19.6947C9.2343 20.156 8.4774 20.4049 7.7 20.4049C6.9226 20.4049 6.1657 20.156 5.54 19.6947C4.4144 18.8757 3.0518 18.4472 1.66 18.4747H0V21.6847H1.61C2.39051 21.664 3.154 21.915 3.77 22.3947C4.908 23.1889 6.2623 23.6147 7.65 23.6147C9.0377 23.6147 10.392 23.1889 11.53 22.3947C12.1468 21.9165 12.9097 21.6657 13.69 21.6847C14.4708 21.6623 15.2348 21.9135 15.85 22.3947C16.9901 23.1884 18.3459 23.6138 19.735 23.6138C21.1241 23.6138 22.4799 23.1884 23.62 22.3947Z"
//                             fill="currentColor"
//                             />
//                         </svg>
//                         </a>
//                     </div>

//                     <div className="hidden md:block">
//                         <nav aria-label="Global">
//                             {/* <div className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${ state ? 'block' : 'hidden'}`}> */}

//                             <ul className="flex items-center gap-6 text-sm">
//                                 {
//                                     navigation.map((item, idx) => {
//                                         return (
//                                         <li key={idx} className=" hover:text-indigo-600">
//                                             <a href={item.path}>
//                                                 { item.title }
//                                             </a>
//                                         </li>
//                                         )
//                                     })
//                                 }
                        
//                             </ul>
//                             {/* </div> */}
//                         </nav>
//                     </div>

//                     <div className="flex items-center">
//                         <div className="flex sm:flex ">
                    
//                         <div onClick={() => {toggleDarkMode()}} id="toggleDark" className="mr-2 flex w-fit shrink background-light drop-shadow-lg dark:toggle-nav-dark h-fit px-2 my-3 pt-2 pb-2 items-center rounded-2xl cursor-pointer">


//                             <svg className="moon shrink h-7 w-6 mr-2 dark:drop-shadow-xl" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
//                                 <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />

//                             </svg>

//                             <div id="toggleBall" className="w-8 shrink-sm px-1 h-7 drop-shadow-lg bg-[#C5EC38] dark:ml-7 rounded-full absolute transform transition-transform duration-300">
//                             </div>

//                             <svg className="ml-2 h-6 w-6 shrink dark:border-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
//                                 <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
//                             </svg>
                            
//                         </div>
                        
//                         <div className='w-fit h-fit flex my-3'>
//                             <a
//                                 className="px-2 py-2.5 text-[0.6rem]  font-bold shadow rounded-xl outline-offset-4 border border-stone-900 dark:border-white "
//                                 href="#"
//                             >
//                                 Let's Connect
//                                 <ArrowRightIcon className='h-5 w-5 relative right-0 inline-block pl-1' />
//                             </a>
                        
//                         </div>
                      
//                         </div>

//                 {/* Profile dropdown */}
//                 <Menu as="div" className="relative ml-0">
//                 <div>
//                     <MenuButtonMain className="md:hidden outline-none p-2 rounded-xl border-white focus:border" onClick={() => setState(!state)} >
//                         {
//                             state ? (
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
//                                     <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                                 </svg>
//                             ) : (
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
//                                 </svg>
//                             )
//                         }
//                     </MenuButtonMain>
//                 </div>
//                 <MenuItems
//                     transition
//                     className="absolute right-0 z-[10] mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
//                 >
//                     <MenuItem>
//                     <a
//                         href="/ethos"
//                         className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
//                     >
//                         Home
//                     </a>
//                     </MenuItem>
//                     <MenuItem>
//                     <a
//                         href="/services"
//                         className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
//                     >
//                         Services
//                     </a>
//                     </MenuItem>
//                     <MenuItem>
//                     <a
//                         href="/projects"
//                         className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
//                     >
//                         Projects
//                     </a>
//                     </MenuItem>
//                     <MenuItem>
//                     <a
//                         href="/about"
//                         className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
//                     >
//                         About me
//                     </a>
//                     </MenuItem>
//                     <MenuItem>
//                     <a
//                         href="/blog"
//                         className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
//                     >
//                         Blog
//                     </a>
//                     </MenuItem>
//                 </MenuItems>
//                 </Menu>    
             
//                 </div>
//                 </div>
            
//             </div>
//             </header>

//         </>
//     )
// }

export default NavMain;



