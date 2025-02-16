import NavMain from "./NavMain";
import React, { FC } from "react";
import FlashMessage from "./FlashMessage";
import Footer from "./Footer";


type BodyProps = {
  nav: boolean;
  children?: React.ReactNode;
};

const EthosBody: FC<BodyProps> = ({ nav, children }) => {
  return (
    <>
      <div className="bg-[#F4F2F0] dark:bg-[#000000]">
        {/* <div className="font-sans bg-gray-500 bg-clip-padding backdrop-filter  backdrop-blur bg-opacity-10 backdrop-saturate-100 backdrop-contrast-100"> */}
        <div className="font-sans">

          {nav && <NavMain />}
          {children}
          <FlashMessage />
          <Footer />
        </div>
        
      </div>
    </>
)};

export default EthosBody;
