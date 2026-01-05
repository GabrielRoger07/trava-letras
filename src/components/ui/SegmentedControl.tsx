import "./ui.css"

type Option<T extends string | number> = {
    label: string;
    value: T;
}

type SegmentedControlProps<T extends string | number> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function SegmentedControl<T extends string | number>({
    options, value, onChange
}: SegmentedControlProps<T>) {
    return (
        <div className="segmented" role="group" aria-label="Opções">
            {options.map((option) => {
                const pressed = option.value === value;

                return (
                    <button 
                        key={String(option.value)} 
                        type="button"
                        aria-pressed={pressed}
                        className={pressed ? "active" : ""} 
                        onClick={() => onChange(option.value)}
                    >
                        {option.label}
                    </button>
                )
            })}
        </div>
    )
}