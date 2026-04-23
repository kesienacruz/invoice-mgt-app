import React, { useEffect, useRef } from 'react';

export default function InvoiceFormDrawer({ children, onClose }) {
  const drawerRef = useRef(null);
  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return undefined;
    const focusable = drawer.querySelectorAll('button, input, select, textarea');
    focusable[0]?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    drawer.addEventListener('keydown', handleKeyDown);
    return () => drawer.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  return <div className="drawer-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><aside className="form-drawer" role="dialog" aria-modal="true" ref={drawerRef}>{children}</aside></div>;
}
