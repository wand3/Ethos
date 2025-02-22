

// export const HeroArea = () => {
  
//   return (
//     <>
      
//       {/* <div className="grid grid-cols-1 gap-4 lg:grid-cols-1 lg:gap-8 glass mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 z-[-1] relative">
//         <div className="mx-auto max-w-3xl text-center">
//             <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Trusted by eCommerce Businesses</h2>

//             <p className="mt-4 text-gray-500 sm:text-xl">
//             Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione dolores laborum labore
//             provident impedit esse recusandae facere libero harum sequi.
//             </p>
//         </div>

//       </div> */}
//       <section className="bg-gray-900 text-white ">
//         <div className="mx-auto max-w-screen-xl px-4 py-32 z-[-1] lg:flex lg:h-screen lg:items-center">
//           <div className="mx-auto max-w-3xl text-center">
//             <h1
//               className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl"
//             >
//               Understand User Flow.

//               <span className="sm:block"> Increase Conversion. </span>
//             </h1>

//             <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed">
//               Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nesciunt illo tenetur fuga ducimus
//               numquam ea!
//             </p>

//             <div className="mt-8 flex flex-wrap justify-center gap-4">
//               <a
//                 className="block w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
//                 href="#"
//               >
//                 Get Started
//               </a>

//               <a
//                 className="block w-full rounded border border-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring active:bg-blue-500 sm:w-auto"
//                 href="#"
//               >
//                 Learn More
//               </a>
//             </div>
//           </div>
//         </div>
//       </section>

        
//     </>
  
//   )


// }

// export default HeroArea;


// import { curve, heroBackground, robot } from "../assets";
// import Button from "./Button";
import Section from "./Section";
import { BottomLine, Gradient } from "./design/Hero";
// import { heroIcons } from "../constants";
import { ScrollParallax } from "react-just-parallax";
import { useRef } from "react";
import Button from "./Button";
import ButtonMain from "./Button";
// import Generating from "./Generating";
// import Notification from "./Notification";
// import CompanyLogos from "./CompanyLogos";

const HeroArea = () => {
  const parallaxRef = useRef(null);

  return (
    <Section
      className="pt-[12rem] -mt-[5.25rem] backdrop-blur-xl dark:grid-pattern-dark h-[50vh] lg:h-[58vh]"
      // className="bg-[url('../ethos-hero-1.png')] bg-clip-content  pt-[12rem] -mt-[5.25rem] backdrop-blur-xl dark:grid-pattern-dark h-[50vh] lg:h-[58vh]"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >
    <div className="absolute -top-[54%] w-[100vw] md:-top-[46%] md:w-[138%] lg:-top-[104%]">
      <img className="bg-[url('../gradient-hero-1.png')] bg-cover h-[80vh] md:h-[90vh] lg:h-[130vh] " width="1440" />
    </div>
    {/* <div className=" grid-pattern-light-pos sm:min-h-60"> */}
        <div className="grid-pattern-light absolute h-[500px] w-[100vw] md:-mt-[15%]  -mt-[30%] lg:min-h-[900px] "> </div>
    {/* </div>   */}
    <div className="relative m-auto top-[-20%] grid-circle-light dark:grid-circle-dark">
     
  
      <div className="mx-auto z-1" ref={parallaxRef}>
        <div className="relative pl-[1rem] md:px-[5rem] text-black mb-[3.875rem] md:mb-20 lg:mb-[6.25rem] text-transition">
          <p className="text-2xl font-oswald font-light dark:text-white">I'm,</p>
          <h1 className="font-oswald font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl dark:text-white tracking-wider">
            Babawande
            {/* <span className="inline-block relative">
              Brainwave{" "} */}
              {/* <img
                src={curve}
                className="absolute top-full left-0 w-full xl:-mt-2"
                width={624}
                height={28}
                alt="Curve"
              /> */}
            {/* </span> */}
          </h1>
          <p className="absolute font-medium max-w-3xl mx-[5%] mb-10 dark:text-n-2 lg:mb-8 font-oswald text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
            A Software Engineer 
            <span className="text-color-1"> &</span>
            <span className="text-color-3 font-normal pl-[5%]">Automations Engineer</span>  
          </p>


          
        </div>
        <div className="absolute flex gap-4 mx-auto xl:mb-24 mt-[25%] sm:mt-[15%] md:mt-[15%] lg:mt-[25%] ml-[5%] ">
          <div className="">
            <ButtonMain className="pl-1" href="/projects">
              Explore My works
            </ButtonMain>
          </div> 
          <div className="">
            <ButtonMain href="/contact" white>
              Let's Talk
            </ButtonMain>
          </div>
            

            

            {/* <Gradient /> */}
    
        </div>

        {/* <CompanyLogos className="hidden relative z-10 mt-20 lg:block" /> */}
      </div>

      <BottomLine />
    </div>

    </Section>
  );
};

export default HeroArea;