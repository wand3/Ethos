import NavMain from "./NavMain";
import React, { FC } from "react";
import FlashMessage from "./FlashMessage";
import Footer from "./Footer";
import LetsTalk from "./LetsTalk";


type BodyProps = {
  nav: boolean;
  children?: React.ReactNode;
};

const EthosBody: FC<BodyProps> = ({ nav, children }) => {
  return (
    <>
    {/* dark:bg-[#F4F2F0] */}
      <div className="inset-0 radial-blur top-[-15%] sm:top-[-10%] h-[115vh] sm:h-[80vh] md:h-[120vh] mx-[5%] rounded-lg lg:mt-0 lg:h-[96vh] left-1/3 w-[96%] sm:w-[100vw] -translate-x-1/2 overflow-hidden fixed"></div>

      <div className="bg-[#e7f0c6] dark:bg-[#000000] pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden"> 
        {/* <div className="font-sans bg-gray-500 bg-clip-padding backdrop-filter  backdrop-blur bg-opacity-10 backdrop-saturate-100 backdrop-contrast-100"> */}

        {/* <div className="font-sans"> */}


          {nav && <NavMain />}
          <LetsTalk />
          {children}
          <FlashMessage />
          <Footer />
        {/* </div> */}
        
      </div>
    </>
)};

export default EthosBody;
