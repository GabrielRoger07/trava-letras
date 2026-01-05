import "./ui.css"

type TextInputProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function TextInput({
    value, onChange, placeholder
}: TextInputProps) {
    return (
        <input className="input" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    );
}