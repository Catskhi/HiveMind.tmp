import { toshibaSatFont } from "@/app/styles/font";
import TextGlitchEffect from "@/components/style/TextGlitchEffect";
import TextButton from "@/components/ui/TextButton";
import Link from "next/link";

export default function ChatHeader() {
    return (
        <nav className={toshibaSatFont.className + " text-lg border-[#9b9b9b] bg-black h-24 flex items-center border-b select-none"}>
            <div className="text-lg pl-5 flex items-center w-64">
                <span className="mr-2 select-none">
                <img src="/images/bee-pixel-sprite.svg" className='w-[30px] h-[30px]' />
                </span> 
                <TextButton>
                <Link href={"/app"}>
                    <TextGlitchEffect className=' select-none'
                    text="HIVEMIND.TMP" duration={75} interval={45} />
                </Link>
                </TextButton>
            </div>
            <div className="px-4">
                <Link href={'/app/find'}>
                    <TextButton>
                        [ <TextGlitchEffect text="Find" duration={75} interval={45} /> ]
                    </TextButton>
                </Link>
                { " │ " }
                <TextButton>
                    [ <TextGlitchEffect text="Global Chat" duration={75} interval={45} /> ]
                </TextButton>
            </div>
        </nav>
    )
}