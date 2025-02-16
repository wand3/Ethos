

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
import { BackgroundCircles, BottomLine, Gradient } from "./design/Hero";
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
      className="pt-[12rem] -mt-[5.25rem]"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >

  {/* <div class=""></div> */}
  
      <div className="container relative" ref={parallaxRef}>
        <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]">
          <h1 className="h1 mb-6">
            Explore the Possibilities of&nbsp;AI&nbsp;Chatting with {` `}
            <span className="inline-block relative">
              Brainwave{" "}
              {/* <img
                src={curve}
                className="absolute top-full left-0 w-full xl:-mt-2"
                width={624}
                height={28}
                alt="Curve"
              /> */}
            </span>
          </h1>
          <p className="body-1 max-w-3xl mx-auto mb-6 text-n-2 lg:mb-8">
            Unleash the power of AI within Brainwave. Upgrade your productivity
            with Brainwave, the open AI chat app.
          </p>
          {/* <Button href="/pricing" white>
            Get started
          </Button> */}
        </div>
        <div className="relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24">
          <div className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient">
            <div className="relative bg-n-8 rounded-[1rem]">
              <div className="h-[1.4rem] bg-n-10 rounded-t-[0.9rem]" />

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
          <div className="absolute -top-[54%] left-1/2 w-[234%] -translate-x-1/2 md:-top-[46%] md:w-[138%] lg:-top-[104%]">
            {/* <img
              src={heroBackground}
              className="w-full"
              width={1440}
              height={1800}
              alt="hero"
            /> */}
          </div>

          <BackgroundCircles />
        </div>

        {/* <CompanyLogos className="hidden relative z-10 mt-20 lg:block" /> */}
      </div>

      <BottomLine />
    </Section>
  );
};

export default HeroArea;
