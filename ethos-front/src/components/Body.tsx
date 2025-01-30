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
      <div className="font-sans">
        {nav && <NavMain />}
        {children}
        <FlashMessage />
      </div>
      <Footer />
    </>
)};

export default EthosBody;
