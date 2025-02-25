import BlockedButton from "@/components/BlockedButton";
import FormTextInput from "@/components/forms/FormTextInput";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="lg:mt-10 mt-5 flex justify-center text-xs lg:text-base px-5">
            <div className="m-auto flex flex-col xl:w-[55%] md:w-[70%] sm:w-[75%] w-[90%] px-5">
                <div>$ Login</div>
                <div className="mt-5 md:flex">
                    <div className="md:mr-2 flex-shrink-0">{'>'} email@hivemind.tmp: </div>
                    <FormTextInput className="md:mt-0 mt-2" 
                    type="email"
                    placeholder="youremail@hivemind.tmp" />
                </div>
                <div className="mt-3 md:flex">
                    <div className="md:mr-2 flex-shrink-0">{'>'} password@hivemind.tmp: </div>
                    <FormTextInput className="md:mt-0 mt-2 w-full" 
                    type="password"
                    placeholder="your passw0rd" />
                </div>
                <BlockedButton className="mt-5">CONNECT TO HIVE</BlockedButton>
                <Link href="/">
                    <BlockedButton className="mt-5 w-full">BACK</BlockedButton>
                </Link>
                <div>
                    
                </div>
            </div>
        </div>
    )
}