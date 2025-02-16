import { Button } from "@headlessui/react";

interface ButtonProps {
  className?: string;
  href?: string;
  onClick?: any;
  px?: string;
  white?: boolean;
  children: React.ReactNode
}

const ButtonMain = ({ className, href, onClick, children, px, white }: ButtonProps) => {
  const classes = `button relative inline-flex items-center justify-center h-11 transition-colors hover:text-color-1 ${
    px || "px-7"
  } ${white ? "text-n-8" : "text-n-1"} ${className || ""}`;
  const spanClasses = "relative z-10";

  const renderButton = () => (
    <Button className={classes} onClick={onClick}>
      <span className={spanClasses}>{children}</span>
    </Button>
  );

  const renderLink = () => (
    <a href={href} className={classes}>
      <span className={spanClasses}>{children}</span>
    </a>
  );

  return href ? renderLink() : renderButton();
};

export default ButtonMain;
