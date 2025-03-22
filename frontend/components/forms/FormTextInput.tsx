
interface Props {
    type?: string,
    required?: boolean,
    className?: string,
    placeholder?: string
    value?: string
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function FormTextInput({type, required, className, placeholder, onChange, onKeyDown, value}: Props) {
    return (
        <input 
        value={value}
        type={type ? type : "text"} required={required}
        onKeyDown={onKeyDown}
        className={className + 
            " bg-transparent focus:outline-none border-b-[1px] placeholder-[#9b9b9b] w-full"} 
        placeholder={placeholder}
        onChange={onChange}
        />
    )
}