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
        <div className="segmented">
            {options.map((option) => (
                <button key={option.value} className={`btn ${option.value === value ? "btn-primary" : "btn-secondary"}`} onClick={() => onChange(option.value)}>
                    {option.label}
                </button>
            ))}
        </div>
    )
}