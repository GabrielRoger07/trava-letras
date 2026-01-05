import "./ui.css"

type StepDotsProps = {
    total: number;
    current: number;
}

export function StepDots({ total, current }: StepDotsProps) {
    return (
        <div className="step-dots">
            {Array.from({ length: total }).map((_, index) => (
                <span 
                    key={index}
                    className={`step-dot ${index + 1 === current ? "active" : ""}`}
                />
            ))}
        </div>
    )
}