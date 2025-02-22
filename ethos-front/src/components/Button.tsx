// import { Button } from "@headlessui/react";

interface ButtonProps {
  className?: string;
  href?: string;
  onClick?: any;
  px?: string;
  white?: boolean;
  line?: boolean;
  children: React.ReactNode
}

const ButtonMain = ({ className, href, onClick, children, px, white, line }: ButtonProps) => {
  // const classes = `relative inline-flex items-center justify-center overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 ${
  //   px || "px-1"
  // } ${white ? "text-n-8" : "text-n-1"} ${className || ""}`;
  // const spanClasses = "relative z-10 relative px-5 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent";
  const classes = `group relative rounded-lg overflow-hidden border border-l-0 mr-[5%] px-4 py-2 focus:ring-3 focus:outline-hidden button-color-light dark:button-color-dark drop-shadow-lg ${
    px || "px-1"
  } ${white ? "text-n-8" : "text-n-1"} ${className || ""}`;
  const spanClasses = "relative z-10 relative text-sm font-medium text-[#170414] transition-colors group-hover:text-white dark:group-hover:text-black transition-all ease-in duration-75";
  const spanLine = `absolute inset-y-0 left-0 w-[4px] h-[100%] rounded-[30%] bg-[#000000] dark:button-span-inside transition-all group-hover:w-full ${line || "hidden"}`

  const renderButton = () => (
  
   <button className={classes} onClick={onClick}>
    <span className={spanLine}></span>
    <span className={spanClasses}>{children}</span>
   </button>
  );

  const renderLink = () => (
    <a href={href} className={classes}>
      <span className={spanLine}></span>
      <span className={spanClasses}>{children}</span>
    </a>
  );

  return href ? renderLink() : renderButton();
};

export default ButtonMain;
