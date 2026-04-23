import React from 'react';
import FilterDropdown from './FilterDropdown';

export default function Header({ countLabel, filters, onFilterChange, onCreateNew }) {
  return (
    <section className="topbar">
      <div>
        <h1>Invoices</h1>
        <p className="topbar-subtext">There are {countLabel}</p>
      </div>
      <div className="topbar-actions">
        <FilterDropdown filters={filters} onFilterChange={onFilterChange} />
        <button className="btn btn-primary btn-new" type="button" onClick={onCreateNew}><span className="btn-plus">+</span><span>New Invoice</span></button>
      </div>
    </section>
  );
}
