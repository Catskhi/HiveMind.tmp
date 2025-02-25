
interface Props {
    type?: string,
    required?: boolean,
    className?: string,
    placeholder?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function FormTextInput({type, required, className, placeholder, onChange}: Props) {
    return (
        <input type={type ? type : "text"} required={required}
        className={className + 
            " bg-transparent focus:outline-none border-b-[1px] placeholder-[#C0C0C0] w-full"} 
        placeholder={placeholder}
        onChange={onChange}
        />
    )
}