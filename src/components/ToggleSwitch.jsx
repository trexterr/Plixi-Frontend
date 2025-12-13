export default function ToggleSwitch({ checked, onChange, label, description, disabled }) {
  return (
    <label className={`toggle-switch ${disabled ? 'is-disabled' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        disabled={disabled}
      />
      <span className="track">
        <span className="thumb" />
      </span>
      <span className="toggle-copy">
        <strong>{label}</strong>
        {description && <small>{description}</small>}
      </span>
    </label>
  );
}
