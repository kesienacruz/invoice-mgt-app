import React from 'react';

export default function Sidebar({ theme, onToggleTheme }) {
  return (
    <aside className="sidebar" aria-label="App navigation">
      <div className="brand-mark" aria-hidden="true"><div className="brand-mark-inner" /></div>
      <div className="sidebar-bottom">
        <button className="theme-toggle" type="button" onClick={onToggleTheme} aria-label="Toggle light and dark mode">
          {theme === 'dark' ? '☀' : '☾'}
        </button>
        <div className="avatar" aria-hidden="true">MO</div>
      </div>
    </aside>
  );
}
