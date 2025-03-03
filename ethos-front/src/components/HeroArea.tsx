// // import { curve, heroBackground, robot } from "../assets";
// // import Button from "./Button";
// import Section from "./Section";
// import { BottomLine, Gradient } from "./design/Hero";
// // import { heroIcons } from "../constants";
// import { ScrollParallax } from "react-just-parallax";
// import { useRef } from "react";
// import Button from "./Button";
// import ButtonMain from "./Button";
// // import Generating from "./Generating";
// // import Notification from "./Notification";
// // import CompanyLogos from "./CompanyLogos";

// const HeroArea = () => {
//   const parallaxRef = useRef(null);

//   return (
//     <Section
//       className="pt-[12rem] -mt-[5.25rem] backdrop-blur-xl dark:grid-pattern-dark h-[50vh] lg:h-[58vh]"
//       // className="bg-[url('../ethos-hero-1.png')] bg-clip-content  pt-[12rem] -mt-[5.25rem] backdrop-blur-xl dark:grid-pattern-dark h-[50vh] lg:h-[58vh]"
//       crosses
//       crossesOffset="lg:translate-y-[5.25rem]"
//       customPaddings
//       id="hero"
//     >
//     <div className="absolute -top-[54%] w-[100vw] md:-top-[46%] md:w-[138%] lg:-top-[104%]">
//       <img className="bg-[url('../gradient-hero-1.png')] bg-cover h-[800px] md:h-[900px] lg:h-[150vh] " width="1440" />
//     </div>
//     {/* <div className=" grid-pattern-light-pos sm:min-h-60"> */}
//     <div className="grid-pattern-light absolute h-[500px] w-[100vw] md:-mt-[15%] lg:-mt-[15%] -mt-[37%] lg:min-h-[900px] "> </div>
//     {/* </div>   */}
//     {/* <div className="relative m-auto top-[-20%] grid-circle-light dark:grid-circle-dark"> */}
     
  
//       <div className="mx-auto z-1" ref={parallaxRef}>
//         <div className="flex-col relative pl-[1rem] md:px-[5rem] text-black mb-[3.875rem] md:mb-20 lg:mb-[6.25rem] text-transition">
//           <p className="text-2xl font-oswald font-light dark:text-white">I'm,</p>
//           <h1 className="font-oswald font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl dark:text-white tracking-wider">
//             Babawande
//             {/* <span className="inline-block relative">
//               Brainwave{" "} */}
//               {/* <img
//                 src={curve}
//                 className="absolute top-full left-0 w-full xl:-mt-2"
//                 width={624}
//                 height={28}
//                 alt="Curve"
//               /> */}
//             {/* </span> */}
//           </h1>
//           <p className="absolute w-full font-medium max-w-3xl mx-[5%] mb-10 dark:text-n-2 lg:mb-8 font-oswald text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
//             A Software Engineer 
//             <span className="text-color-1"> & </span>
//             <span className="text-color-3 font-normal mb-[5%]">Automations Engineer</span>  
//           </p> 
//         </div>
        // <div className="flex gap-4 relative mx-auto  w-full xl:mb-24 ml-[5%] mt-[120px] sm:mt-[150px] md:mt-[170px] lg:mt-[200px]">
        //   <div className="">
        //     <ButtonMain className="rounded-md" href="/projects" white px="2" line>
        //       Explore My works
        //     </ButtonMain>
        //   </div> 
        //   <div className="">
        //     <ButtonMain href="/contact" white>
        //       Let's Talk
        //     </ButtonMain>
        //   </div>
            
        //     {/* <Gradient /> */}
        // </div>
      

//         {/* <CompanyLogos className="hidden relative z-10 mt-20 lg:block" /> */}
//       </div>

//       <BottomLine />
//     {/* </div> */}

//     </Section>
//   );
// };

// export default HeroArea;






  // ------------------------------------      v2     ---------------------------------------

import Section from "./Section";
import { BottomLine, Gradient } from "./design/Hero";
// import { heroIcons } from "../constants";
import { ScrollParallax } from "react-just-parallax";
import { useRef } from "react";
import Button from "./Button";
import ButtonMain from "./Button";


const HeroArea = () => {
  const parallaxRef = useRef(null);

  return (
    <>
      <header className="hero-section h-[140vh] md:h-[115vh] lg:h-[100vh] overflow-hidden position relative -mt-[3%]">
      
        <div className="flex-col flex mt-[30%] md:mt-[17%] justify-center text-center m-auto left-1/2 w-[96%]  -translate-x-1/2 relative pl-[1rem] md:px-[5rem] text-white mb-[3.875rem] md:mb-20 lg:mb-[6.25rem] text-transition z-1">
          {/* <p className="text-2xl font-oswald font-dark">I'm,</p> */}
          <h1 className="font-iceberg font-bold text-5xl relative z-1 sm:text-4xl md:text-4xl lg:text-5xl dark:text-white tracking-wider w-[80vw]">
          Hi! I'm Babawande, a Software engineer
            <span className="text-color-1"> &</span> 
            <span className="text-color-3"> Automations Engineer. </span>

          </h1>
          <p className="py-3 w-[80%] mx-[10%] my-[3%]" data-v-fb61fddf="">I bring value to software industry by merging technical expertise in Web Developement, Automations, AI and Testing with creativity and aesthetics.</p>



        </div>
          <div className="flex z-10 absolute justify-center w-full xl:mb-10 mt-0 mx-auto">
              <ButtonMain className="rounded-md" href="/projects" white px="2" line>
                Explore My works
              </ButtonMain>
              <ButtonMain href="/contact" white>
                Let's Talk
              </ButtonMain>
              
            {/* <Gradient /> */}
        </div>
        <div className="absolute inset-0 glass-effect top-[10%] mx-[2%] h-[140vh]"></div>
        <div className="glass-text absolute inset-0 flex items-center justify-center z-0 mx-[5%] mt-[10%]">
          <h1 className="text-[150px] whitespace-nowrap move-across sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-[#313131d9] bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900 backdrop-filter">
              Dark Glass Text
          </h1>
      </div>
      
      </header>
    </>
  );
};

export default HeroArea;