import localFont from "next/font/local";
import { Children, ReactNode } from "react";

const webplusFont = localFont({
  src: '../public/fonts/WebPlus_HP_100LX_6x8.woff'
})

interface TitleProps {
  children: ReactNode;
  className: string
}

export default function Title({children, className}: TitleProps) {
  

  return (
    <div>
      <pre className={"lg:text-[1vw] text-[0.4vh] leading-[1] text-left flex " + 
                      webplusFont.className + " " +
                      className}>
        {Children.map(children, child =>
            <div className="xl:mx-2 whitespace-pre">
              {child}
            </div>
          )}
      </pre>
    </div>
  );
}
