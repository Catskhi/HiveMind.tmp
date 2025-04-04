import { toshibaSatFont } from "@/app/styles/font";
import TextGlitchEffect from "@/components/style/TextGlitchEffect";
import TextButton from "@/components/ui/TextButton";
import Link from "next/link";
import HeaderGlobalChatButton from "./HeaderGlobalChatButton";
import ShowContactListButton from "./ShowContactListButton";
import HeaderUserInfo from "./HeaderUserInfo";

export default function ChatHeader() {
    return (
        <nav className={toshibaSatFont.className + "  border-[#9b9b9b] bg-black h-24 flex items-center border-b select-none"}>
            <div className="flex items-center w-1/3 md:w-64
                 text-sm md:text-base lg:text-lg pl-5">
                <ShowContactListButton className="mr-5" />
                <span className="mr-2 select-none">
                    <img src="/images/bee-pixel-sprite.svg" className='w-14' />
                </span> 
                <TextButton>
                <Link href={"/app"} className="hidden md:block">
                    <TextGlitchEffect className=' select-none'
                    text="HIVEMIND.TMP" duration={75} interval={45} />
                </Link>
                </TextButton>
            </div>
            <div className="px-4 block md:hidden grow text-end">
                <HeaderUserInfo />
            </div>
            <div className="px-4 text-sm md:text-base lg:text-lg hidden md:flex md:space-x-3">
                <Link href={'/app/find'}>
                    <TextButton>
                        [ <TextGlitchEffect text="Find People" duration={75} interval={30} /> ]
                    </TextButton>
                </Link>
                <span className="hidden md:block">
                    { " │ " }
                </span>
                <HeaderGlobalChatButton />
                <span className="hidden md:block">
                    { " │ " }
                </span>
                <Link href={'/app/private-key'}>
                    <TextButton>
                        [ <TextGlitchEffect text="Private Key" duration={75} interval={30} /> ]
                    </TextButton>
                </Link>
            </div>
        </nav>
    )
}