// import { Button } from "@headlessui/react";

interface ButtonProps {
  className?: string;
  href?: string;
  onClick?: any;
  px?: string;
  white?: boolean;
  children: React.ReactNode
}

const ButtonMain = ({ className, href, onClick, children, px, white }: ButtonProps) => {
  const classes = `relative inline-flex items-center justify-center overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 ${
    px || "px-1"
  } ${white ? "text-n-8" : "text-n-1"} ${className || ""}`;
  const spanClasses = "relative z-10 relative px-5 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent";

  const renderButton = () => (
    // <a className={classes} onClick={onClick}>
    //     <span className={spanClasses}>{children}</span>
    // </a>
   <button className={classes} onClick={onClick}>
    <span className={spanClasses}>{children}</span>
   </button>
  );

  const renderLink = () => (
    <a href={href} className={classes}>
      <span className={spanClasses}>{children}</span>
    </a>
  );

  return href ? renderLink() : renderButton();
};

export default ButtonMain;
