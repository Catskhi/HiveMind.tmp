import localFont from "next/font/local";
import { Children, ReactNode } from "react";
import BackText from "./style/BackText";
import WhiteText from "./style/WhiteText";
import { webplusFont } from "@/app/styles/font";

interface TitleProps {
  className?: string
}

export default function Title({className}: TitleProps) {
  

  return (
    <div className="text-[#C0C0C0] overflow-x-hidden">
      <pre className={"xl:text-[1vw] text-[1.5vw] leading-[1] text-left flex  " + 
                      webplusFont.className + " " +
                      className}>
        <div className="xl:mx-2 whitespace-pre flex xl:gap-x-4 md:gap-x-2 gap-x-1">
          <div>
            <BackText>#</BackText><WhiteText>@</WhiteText>       <br/>
            <BackText/><WhiteText>██</WhiteText>  <BackText/><WhiteText>██▌</WhiteText><br/>
            <BackText/>██▌ <BackText/>█▀ <br/>
            <BackText/>██▌ <BackText/>█# <br/>
            <BackText/>██████% <br/>
            <BackText/>▓█▌ <BackText/>█▓ <br/>
            <BackText/>▒█▌ <BackText/>█▓ <br/>
            <BackText/>██  <BackText/>▒█ <br/>
            <BackText/>▓█  <BackText/>▓█ <br/>
            <BackText>%</BackText>▒   <BackText/>▒  <br/>
            <BackText>%</BackText>@     <BackText/> <br/>
          </div>
          <div><br/>
            <BackText>%</BackText><WhiteText>█#</WhiteText><br/>
            <BackText>░██</BackText><br/>
            <BackText/>██<br/>
            <BackText/>██<br/>
            <BackText/>██<br/>
            <BackText/>█▒<br/>
            <BackText/>▓█<br/>
            <BackText/>▓▓<br/>
            <BackText/>  <br/>
            <BackText/>
          </div>
          <div><br/>
            <BackText/><WhiteText>██</WhiteText>      <BackText/><WhiteText>█▌</WhiteText><br/>
            <BackText/>██<WhiteText>█</WhiteText>   <BackText>░░</BackText><WhiteText>██▌</WhiteText><br/>
            <BackText>░░</BackText>███  <BackText/>▒██<WhiteText>▌</WhiteText><br/> <BackText>░0</BackText>▓██ <BackText/>██  <br/>  <BackText>1░</BackText>██▄▒█▀<br/>   <BackText/><BackText/>▓███<br/>    <BackText/>███#<br/>     <BackText/>%█<br/>     <BackText/>%%<br/>      <BackText/>
          </div>
          <div><br/>
            <BackText/><WhiteText>███████</WhiteText><br/>
            <BackText/>▀█<WhiteText>█</WhiteText>   <br/>
            <BackText/>██     <br/>
            <BackText/>▒▓█████<br/>
            <BackText>0</BackText>██<WhiteText>▀</WhiteText>    <br/>
            <BackText/>██     <br/>
            <BackText/>▓█▄    <br/>
            <BackText/>▒▒██▓██<br/>
            <BackText/>%    <WhiteText>▀</WhiteText><br/>
          </div>
          <div><br/>
            <BackText/><WhiteText>██▌</WhiteText>  <BackText/><WhiteText>██</WhiteText><br/>
            <BackText/>███ <BackText/>██<WhiteText>█</WhiteText><br/>
            <BackText/>██▀██<BackText/>█@<br/>
            <BackText/>█▌   <BackText/>██<br/>
            <BackText/>██   <BackText/>██<br/>
            <BackText/>█@   <BackText/>▒█<br/>
            <BackText/>#▓▒  <BackText/>█▒<br/>
            <BackText/>▒▒    <BackText/>▒<br/>
            <BackText/>0
          </div>
          <div><br/>
            <BackText>#</BackText><WhiteText>*█</WhiteText><br/>
            <BackText>░██</BackText><br/>
            <BackText/>██<br/>
            <BackText/>██<br/>
            <BackText/>██<br/>
            <BackText/>█*<br/>
            <BackText/>▓█<br/>
            <BackText/>▓▓<br/>
            <BackText/>  <br/>
            <BackText/>
          </div>
          <div>
            <BackText>@</BackText><WhiteText>▄</WhiteText>        <br/>
            <BackText/><WhiteText>█▄</WhiteText>     <WhiteText>█▌</WhiteText><br/>
            <BackText/>██<WhiteText>▌</WhiteText>   ▄█<WhiteText>▌</WhiteText><br/>
            <BackText/>▓█<WhiteText>█</WhiteText>  <BackText>0</BackText>█▌<br/>
            <BackText>#</BackText>████ <BackText/>██▌<br/>
            <BackText/>▓█ ██<BackText/>██<WhiteText>▌</WhiteText><br/>
            <BackText/>██  ████ <br/>
            <BackText/>█1  <BackText/>▓▒█ <br/>
            <BackText/>▓█   <BackText/>█% <br/>
            <BackText/>█▀   <BackText/>▒▀ <br/>
            <BackText/>    <BackText>░░</BackText>  <br/>
          </div>
          <div><br/>
            <BackText>#</BackText>█<WhiteText>███▌</WhiteText>  <br/>
            <BackText/>██▀█<WhiteText>██</WhiteText> <br/>
            <BackText/>██ <BackText/>██<WhiteText>▌</WhiteText><br/>
            <BackText>@</BackText>█▓  <BackText>%</BackText>█▌<br/>
            <BackText/>██  <BackText/>█▌<br/>
            <BackText/>██ <BackText/>██<WhiteText>▌</WhiteText><br/>
            <BackText/>▓██▒██ <br/>
            <BackText/>█▒█▀▀  <br/>
            <BackText>#░░</BackText>    <br/><BackText/>
          </div>
          <div className="self-center">
            <img src="/images/bee-pixel-sprite.svg" className='w-[12vw] h-[11vw] xl:h-[10vw] xl:w-[12vw]' />
          </div>
        </div>
      </pre>
    </div>
  );
}
