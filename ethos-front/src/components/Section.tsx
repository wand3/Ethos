// import SectionSvg from "../assets/svg/SectionSvg";

interface SectionProps {
  className?: string;
  id?: string;
  crosses?: boolean;
  crossesOffset?: string;
  customPaddings?: boolean;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({
  className = "",
  id,
  crosses = false,
  crossesOffset = "",
  customPaddings = "",
  children,
}) => {

  // const backgroundImage = 
  return (
    <div
      id={id}
      className={`
        relative 
        ${
          customPaddings ||
          `py-10 lg:py-16 xl:py-20 ${crosses ? "lg:py-32 xl:py-40" : ""}`
        } 
        ${className}`}
      // style={{ background: `${backgroundImage}`}}
    >
      {children}

      <div className="hidden absolute top-0 left-5 w-0.25 h-full bg-stroke-1 pointer-events-none md:block lg:left-7.5 xl:left-10" />
      <div className="hidden absolute top-0 right-5 w-0.25 h-full bg-stroke-1 pointer-events-none md:block lg:right-7.5 xl:right-10" />

      {crosses && (
        <>
          <div
            className={`hidden absolute top-0 left-7.5 right-7.5 h-0.25 bg-stroke-1 ${
              crossesOffset || ""
            } pointer-events-none lg:block xl:left-10 xl:right-10`}
          />
          {/* <SectionSvg crossesOffset={crossesOffset} /> */}
        </>
      )}
    </div>
  );
};

{/* <div class="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"><div class="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div></div> */}

export default Section;