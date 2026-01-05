import "./ui.css"

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: "primary" | "secondary" | "hero";
    type?: "button" | "submit";
};

export function Button({
    children, onClick, disabled, variant = "primary", type = "button"
}: ButtonProps) {
    return (
        <button type={type} className={`btn btn-${variant}`} onClick={onClick} disabled={disabled}>{children}</button>
    );
}