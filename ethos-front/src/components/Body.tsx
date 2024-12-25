import Nav from "./Nav";
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
        {nav && <Nav />}
        {children}
        <FlashMessage />       
        
      </div>
    </>
)};

export default EthosBody;
