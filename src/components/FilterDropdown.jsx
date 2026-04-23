import React, { useEffect, useRef, useState } from 'react';
import { capitalize } from '../utils/invoice';

export default function FilterDropdown({ filters, onFilterChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const statuses = ['draft', 'pending', 'paid'];
  useEffect(() => {
    const handleClick = (event) => { if (!rootRef.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);
  const toggleStatus = (status) => onFilterChange(filters.includes(status) ? filters.filter((x) => x !== status) : [...filters, status]);
  return (
    <div className="filter-wrap" ref={rootRef}>
      <button type="button" className="filter-button" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        Filter by status <span className={`chevron-down ${open ? 'open' : ''}`}>⌄</span>
      </button>
      {open && <div className="filter-menu" role="group" aria-label="Filter invoices by status">
        {statuses.map((status) => <label key={status} className="checkbox-row"><input type="checkbox" checked={filters.includes(status)} onChange={() => toggleStatus(status)} /><span>{capitalize(status)}</span></label>)}
        {filters.length > 0 && <button type="button" className="clear-filter-btn" onClick={() => onFilterChange([])}>Clear filters</button>}
      </div>}
    </div>
  );
}
