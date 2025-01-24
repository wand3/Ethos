import Nav from "./Nav";
import NavMain from "./NavMain";
import React, { FC } from "react";
import FlashMessage from "./FlashMessage";


type BodyProps = {
  nav: boolean;
  children?: React.ReactNode;
};

const EthosBody: FC<BodyProps> = ({ nav, children }) => {
  return (
    <>
      <div className="font-sans">
        {nav && <NavMain />}
        {children}
        <FlashMessage />       
        
      </div>
    </>
)};

export default EthosBody;
