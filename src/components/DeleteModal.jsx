import React, { useEffect, useRef } from 'react';

export default function DeleteModal({ invoiceId, onCancel, onConfirm }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    const handleKeyDown = (event) => { if (event.key === 'Escape') onCancel(); };
    dialog?.addEventListener('keydown', handleKeyDown);
    return () => dialog?.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);
  return <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}><div className="modal" role="dialog" aria-modal="true" ref={dialogRef}><h2>Confirm Deletion</h2><p>Are you sure you want to delete invoice #{invoiceId}? This action cannot be undone.</p><div className="modal-actions"><button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button><button type="button" className="btn btn-danger" onClick={onConfirm}>Delete</button></div></div></div>;
}
