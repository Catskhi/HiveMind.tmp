import Chat from "@/components/app/Chat"
import ContactsSidebar from "@/components/app/ContactsSidebar"
import TextGlitchEffect from "@/components/style/TextGlitchEffect"

export default function app() {
    return (
    <div className="flex bg-[rgb(0,0,0,0.45)]">
        {/* Main Content */}
        <main className="w-full h-screen flex flex-col">
            {/* Chat Header */}
            <div className="text-lg border-[#9b9b9b] bg-black h-24 flex items-center border-b">
                <div className="text-lg pl-5 flex items-center w-64">
                    <span className="mr-2">
                    <img src="/images/bee-pixel-sprite.svg" className='w-[30px] h-[30px]' />
                    </span> 
                    <TextGlitchEffect text="HIVEMIND.TMP" duration={75} interval={45} />
                </div>
                <div className="px-4">
                    [ Find ] │ [ Global Chat ]
                </div>
            </div>
            <div className="flex-1 flex w-full">
                <ContactsSidebar className="" />
                <Chat />
            </div>
        </main>
    </div>
    )
}