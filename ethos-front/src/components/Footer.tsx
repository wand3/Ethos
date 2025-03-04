import { linkedin, x, telegram, github, mail, web } from "../assets";

export const Footer = () => {
  
  return (
    <>
            {/*
        Heads up! 👋

        This component comes with some `rtl` classes. Please remove them if they are not needed in your project.

        Plugins:
          - @tailwindcss/forms
      */}

      <footer className="bg-[#bfcdca] dark:bg-[#000000]">
        <div className="mx-auto max-w-screen-xl px-4 pt-[16rem] pb-[7rem] sm:px-6 lg:px-8">
          <div
            className="flex flex-col items-center gap-4 rounded-lg bg-color-1 p-6 shadow-lg sm:flex-row sm:justify-between"
          >
            <strong className="text-xl text-black sm:text-xl"> Book a free discovery call! </strong>

            <a
              className="inline-flex items-center gap-2 rounded-full border border-white bg-white px-8 py-3 text-[#1a1a1aeb] hover:bg-transparent hover:text-white focus:outline-none focus:ring active:bg-white/90"
              href="mailto:godswillbaiyewu@gmail.com?subject=Schedule a discovery"
            >
              <span className="text-sm font-medium"> Let's Talk </span>

              <svg
                className="size-5 rtl:rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-gray-900 dark:text-white">Sitemap</p>

              <ul className="mt-8 space-y-4 text-sm">
                <li>
                  <a
                    className="flex items-center justify-center gap-1.5 ltr:sm:justify-start rtl:sm:justify-end"
                    href="/ethos"
                  >
                    <span className="flex-1 text-gray-700 dark:text-color-7">Home</span>
                  </a>
                </li>

                <li>
                  <a
                    className="flex items-center justify-center gap-1.5 ltr:sm:justify-start rtl:sm:justify-end"
                    href="/about"
                  >
                    {/* <img src={x} className='w-[1rem] flex text-gray-900 dark:text-color-7' alt="linkedin" /> */}


                    <span className="flex-1 text-gray-700 dark:text-color-7">About</span>
                  </a>
                </li>


                <li>
                  <a
                    className="flex items-center justify-center gap-1.5 ltr:sm:justify-start rtl:sm:justify-end"
                    href="#contact"
                  >
                    {/* <img src={x} className='w-[1rem] flex text-gray-900 dark:text-color-7' alt="linkedin" /> */}


                    <span className="flex-1 text-gray-700 dark:text-color-7">Contact</span>
                  </a>
                </li>



                <li>
                  <a
                    className="flex items-center justify-center gap-1.5 ltr:sm:justify-start rtl:sm:justify-end"
                    href="/projects"
                  >
                    {/* <img src={linkedin} className='w-[1rem] flex text-gray-900 dark:text-color-7' alt="linkedin" /> */}


                    <span className="flex-1 text-gray-700 dark:text-color-7">Projects</span>
                  </a>
                </li>

                <li>
                   <a
                    className="flex items-center justify-center gap-1.5 ltr:sm:justify-start rtl:sm:justify-end"
                    href="/projects"
                  > <span className="flex-1 text-gray-700 dark:text-color-7">Blog</span>

                  </a> 
                </li>
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-gray-900 dark:text-white">Services</p>

              <ul className="mt-8 space-y-4 text-sm">
                
                <li>
                  <a className="text-gray-700 dark:text-color-7 transition hover:text-gray-700/75" href="#">
                    Frontend Engineer
                  </a>
                </li>
                <li>
                  <a className="text-gray-700 dark:text-color-7 transition hover:text-gray-700/75" href="#">
                    Backend Engineer
                  </a>
                </li>
                <li>
                  <a className="text-gray-700 dark:text-color-7 transition hover:text-gray-700/75" href="#">
                    Web Scrapping
                  </a>
                </li>
                <li>
                  <a className="text-gray-700 dark:text-color-7 transition hover:text-gray-700/75" href="#">Web Design and development</a>
                </li>

                <li>
                  <a className="text-gray-700 dark:text-color-7 transition hover:text-gray-700/75" href="#">Bot Development</a>
                </li>

                <li>
                  <a className="text-gray-700 dark:text-color-7 transition hover:text-gray-700/75" href="#">Test Automation</a>
                </li>
                <li>
                  <a className="text-gray-700 dark:text-color-7 transition hover:text-gray-700/75" href="#">
                    Customized software Development
                  </a>
                </li>
                <li>
                  <a className="text-gray-700 dark:text-color-7 transition hover:text-gray-700/75" href="#">
                    Software Deployment
                  </a>
                </li>
              </ul>
            </div>

          <div className="mt-16 border-t border-gray-100 pt-6 sm:flex sm:items-center sm:justify-between">
            <p className="text-center text-sm text-gray-500 sm:text-left">
              Copyright &copy; 2025. All rights reserved.
            </p>

            <ul className="mt-4 relative z-10 flex justify-center gap-1 w-[25vw] sm:mt-0 mx-auto dark:p-1 dark:rounded-sm dark:bg-color-1">
              <li>
                <a
                  href="mailto:godswillbaiyewu@gmail.com?subject=Schedule a discovery"
                  // rel="noreferrer"
                  target="_blank"
                  className="text-gray-700 dark:text-color-7 transition hover:text-gray-700/75"
                >
                  <img src={mail} className='w-[1.5rem] flex text-gray-900 dark:text-color-7' alt="mail" />

                </a>
              </li>
              <li>
                <a
                  href="https://t.me/Babawand3"
                  // rel="noreferrer"
                  target="_blank"
                  className="text-gray-700 dark:text-color-7 transition hover:text-gray-700/75"
                >
                  <img src={telegram} className='w-[1.5rem] flex text-gray-900 dark:text-color-7' alt="x" />

                </a>
              </li>

              <li>
                <a
                  href="https://linkedin.com/in/baiyewu-babawande-204b6027b
"
                  // rel="noreferrer"
                  target="_blank"
                  className="text-gray-700 dark:text-color-7 transition hover:text-gray-700/75"
                >
                  <img src={linkedin} className='w-[1.5rem] flex rounded text-gray-900 dark:text-color-7' alt="linkedin" />

                </a>
              </li>

              <li>
                <a
                  href="https://x.com/Babawand3"
                  target="_blank"
                  className="text-gray-700 dark:text-color-7 transition hover:text-gray-700/75"
                >
                  <img src={x} className='w-[1.5rem] flex text-gray-900 dark:text-color-7' alt="x" />

                </a>
              </li>

              <li>
                <a
                  href="https://github.com/wand3"
                  target="_blank"
                  className="text-gray-700 dark:text-color-7 transition hover:text-gray-700/75"
                >
                  <img src={github} className='w-[1.5rem] flex text-gray-900 dark:text-color-7' alt="github" />

                </a>
              </li>

              <li>
                <a
                  href="https://babawande.pro"
                  target="_blank"
                  className="text-gray-700 dark:text-color-7 transition hover:text-gray-700/75"
                >
                  <img src={web} className='w-[1.5rem] flex text-gray-900 dark:text-color-7' alt="web" />

                </a>
              </li>
            </ul>
          </div>
          </div>
        </div>
      </footer>
    </>
  
  );


}

export default Footer;

