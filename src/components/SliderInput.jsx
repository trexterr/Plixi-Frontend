export default function SliderInput({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  suffix = '',
  prefix = '',
  description,
  onChange,
  disabled,
}) {
  const handleValueChange = (nextValue) => {
    const parsed = Number(nextValue);
    if (Number.isNaN(parsed)) return;
    onChange(parsed);
  };

  return (
    <div className={`slider-control ${disabled ? 'is-disabled' : ''}`}>
      <div className="slider-label">
        <div>
          <strong>{label}</strong>
          {description && <small>{description}</small>}
        </div>
        <div className="slider-value">
          {prefix}
          {value}
          {suffix}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => handleValueChange(event.target.value)}
        disabled={disabled}
      />
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => handleValueChange(event.target.value)}
        disabled={disabled}
      />
    </div>
  );
}
