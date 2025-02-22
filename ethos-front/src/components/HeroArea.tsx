

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
import { Button } from "@headlessui/react";
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
    <div className="relative m-auto top-0 grid-circle-light dark:grid-circle-dark">
     
  
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


          {/* <Button href="/pricing" white>
            Get started
          </Button> */}
        </div>
        <div className="max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24 my-[15%] mx-auto hidden">
          <div className="z-1 p-0.5 rounded-2xl bg-conic-gradient">
            <div className=" bg-n-8 rounded-[1rem]">
              <div className="h-[1.4rem] bg-n-10 rounded-t-[0.9rem] " />

              <div className="aspect-[33/40] rounded-b-[0.9rem] overflow-hidden md:aspect-[688/490] lg:aspect-[1024/490]">
                {/* <img
                  src={robot}
                  className="w-full scale-[1.7] translate-y-[8%] md:scale-[1] md:-translate-y-[10%] lg:-translate-y-[23%]"
                  width={1024}
                  height={490}
                  alt="AI"
                /> */}

                {/* <Generating className="absolute left-4 right-4 bottom-5 md:left-1/2 md:right-auto md:bottom-8 md:w-[31rem] md:-translate-x-1/2" /> */}

                <ScrollParallax isAbsolutelyPositioned>
                  {/* <ul className="hidden absolute -left-[5.5rem] bottom-[7.5rem] px-1 py-1 bg-n-9/40 backdrop-blur border border-n-1/10 rounded-2xl xl:flex">
                    {heroIcons.map((icon, index) => (
                      <li className="p-5" key={index}>
                        <img src={icon} width={24} height={25} alt={icon} />
                      </li>
                    ))}
                  </ul> */}
                </ScrollParallax>

                <ScrollParallax isAbsolutelyPositioned>
                  {/* <Notification
                    className="hidden absolute -right-[5.5rem] bottom-[11rem] w-[18rem] xl:flex"
                    title="Code generation"
                  /> */}
                </ScrollParallax>
              </div>
            </div>

            <Gradient />
          </div>
          <div className="absolute z-4 -top-[54%] left-1/2 w-[234%] -translate-x-1/2 md:-top-[46%] md:w-[138%] lg:-top-[104%]">
            {/* <img
              src={heroBackground}
              className="w-full"
              width={1440}
              height={1800}
              alt="hero"
            /> */}
            
          </div>

          {/* <BackgroundCircles /> */}
        </div>

        {/* <CompanyLogos className="hidden relative z-10 mt-20 lg:block" /> */}
      </div>

      <BottomLine />
    </div>

    </Section>
  );
};

export default HeroArea;

{/* <div class="relative h-full w-full bg-black">
<div class="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
<div class="absolute left-0 right-0 top-[-10%] h-[1000px] w-[1000px] rounded-full bg-[radial-gradient(circle_400px_at_50%_300px,#fbfbfb36,#000)]"></div></div> */}
