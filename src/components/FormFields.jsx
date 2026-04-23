import React, { useId } from 'react';

export function FormGroup({ title, children }) {
  return <section className="form-section"><h3 className="section-subtitle">{title}</h3><div className="field-stack">{children}</div></section>;
}

export function LabeledInput({ label, value, onChange, error, type = 'text' }) {
  const id = useId();
  return <div className="field"><div className="field-label-row"><label htmlFor={id}>{label}</label>{error && <span className="field-error-inline">{error}</span>}</div><input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} className={error ? 'has-error' : ''} /></div>;
}

export function LabeledSelect({ label, value, onChange, options, error }) {
  const id = useId();
  return <div className="field"><div className="field-label-row"><label htmlFor={id}>{label}</label>{error && <span className="field-error-inline">{error}</span>}</div><select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={error ? 'has-error' : ''}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>;
}
