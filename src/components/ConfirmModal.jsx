export default function ConfirmModal({ title, description, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel }) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="modal-actions">
          <button type="button" className="ghost-btn" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="primary-btn" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
