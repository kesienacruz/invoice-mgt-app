import React, { useEffect, useState } from 'react';
import { STATUS, derivePaymentDue, formatCurrency, validateInvoice } from '../utils/invoice';
import { FormGroup, LabeledInput, LabeledSelect } from './FormFields';

export default function InvoiceForm({ mode, initialInvoice, onCancel, onSubmit }) {
  const [invoice, setInvoice] = useState(initialInvoice);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  useEffect(() => { setInvoice(initialInvoice); setErrors({}); setFormError(''); }, [initialInvoice]);
  const isPaidEdit = mode === 'edit' && invoice.status === STATUS.PAID;

  const updateField = (path, value) => {
    setInvoice((current) => {
      const next = structuredClone(current);
      const keys = path.split('.');
      let ref = next;
      for (let i = 0; i < keys.length - 1; i += 1) ref = ref[keys[i]];
      ref[keys[keys.length - 1]] = value;
      if (path === 'paymentTerms' || path === 'createdAt') next.paymentDue = derivePaymentDue(path === 'createdAt' ? value : next.createdAt, path === 'paymentTerms' ? value : next.paymentTerms);
      return next;
    });
  };

  const updateItem = (id, field, value) => setInvoice((current) => ({ ...current, items: current.items.map((item) => item.id === id ? { ...item, [field]: value } : item) }));
  const addItem = () => setInvoice((current) => ({ ...current, items: [...current.items, { id: crypto.randomUUID(), name: '', quantity: 1, price: 0 }] }));
  const removeItem = (id) => setInvoice((current) => ({ ...current, items: current.items.filter((item) => item.id !== id) }));

  const handleSubmit = (statusOverride) => {
    const nextErrors = validateInvoice(invoice, statusOverride, mode);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setFormError(statusOverride === STATUS.DRAFT ? 'This paid invoice cannot be moved back to draft.' : 'Please fix the highlighted fields before saving.');
      requestAnimationFrame(() => {
        const firstErrorField = document.querySelector('.invoice-form .has-error, .invoice-form .error-text');
        firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      return;
    }
    setFormError('');
    onSubmit(invoice, statusOverride);
  };

  return (
    <section className="form-page">
      <form className="invoice-form" onSubmit={(e) => e.preventDefault()} noValidate>
        <div className="invoice-form-scroll">
          <h2>{mode === 'create' ? 'New Invoice' : `Edit #${invoice.id}`}</h2>
          {formError && <div className="form-summary-error" role="alert">{formError}</div>}
          <FormGroup title="Bill From">
            <LabeledInput label="Street Address" value={invoice.senderAddress.street} onChange={(v) => updateField('senderAddress.street', v)} error={errors['senderAddress.street']} />
            <div className="grid-3 compact-grid">
              <LabeledInput label="City" value={invoice.senderAddress.city} onChange={(v) => updateField('senderAddress.city', v)} error={errors['senderAddress.city']} />
              <LabeledInput label="Post Code" value={invoice.senderAddress.postCode} onChange={(v) => updateField('senderAddress.postCode', v)} error={errors['senderAddress.postCode']} />
              <LabeledInput label="Country" value={invoice.senderAddress.country} onChange={(v) => updateField('senderAddress.country', v)} error={errors['senderAddress.country']} />
            </div>
          </FormGroup>
          <FormGroup title="Bill To">
            <LabeledInput label="Client’s Name" value={invoice.clientName} onChange={(v) => updateField('clientName', v)} error={errors.clientName} />
            <LabeledInput label="Client’s Email" type="email" value={invoice.clientEmail} onChange={(v) => updateField('clientEmail', v)} error={errors.clientEmail} />
            <LabeledInput label="Street Address" value={invoice.clientAddress.street} onChange={(v) => updateField('clientAddress.street', v)} error={errors['clientAddress.street']} />
            <div className="grid-3 compact-grid">
              <LabeledInput label="City" value={invoice.clientAddress.city} onChange={(v) => updateField('clientAddress.city', v)} error={errors['clientAddress.city']} />
              <LabeledInput label="Post Code" value={invoice.clientAddress.postCode} onChange={(v) => updateField('clientAddress.postCode', v)} error={errors['clientAddress.postCode']} />
              <LabeledInput label="Country" value={invoice.clientAddress.country} onChange={(v) => updateField('clientAddress.country', v)} error={errors['clientAddress.country']} />
            </div>
            <div className="grid-2 compact-grid">
              <LabeledInput label="Invoice Date" type="date" value={invoice.createdAt} onChange={(v) => updateField('createdAt', v)} error={errors.createdAt} />
              <LabeledSelect label="Payment Terms" value={invoice.paymentTerms} onChange={(v) => updateField('paymentTerms', v)} options={[{ value: '1', label: 'Net 1 Day' }, { value: '7', label: 'Net 7 Days' }, { value: '14', label: 'Net 14 Days' }, { value: '30', label: 'Net 30 Days' }]} error={errors.paymentTerms} />
            </div>
            <LabeledInput label="Project Description" value={invoice.description} onChange={(v) => updateField('description', v)} error={errors.description} />
          </FormGroup>
          <section className="items-section">
            <h3 className="items-title">Item List</h3>
            {errors.items && <p className="error-text global-error">{errors.items}</p>}
            <div className="item-form-grid item-form-head"><span>Item Name</span><span>Qty.</span><span>Price</span><span>Total</span><span className="sr-only">Action</span></div>
            {invoice.items.map((item, index) => {
              const rowTotal = Number(item.quantity || 0) * Number(item.price || 0);
              return <div className="item-form-grid item-entry" key={item.id}>
                <div><input className={errors[`items.${index}.name`] ? 'has-error' : ''} value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)} />{errors[`items.${index}.name`] && <p className="error-text">{errors[`items.${index}.name`]}</p>}</div>
                <div><input type="number" min="1" className={errors[`items.${index}.quantity`] ? 'has-error' : ''} value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', e.target.value)} />{errors[`items.${index}.quantity`] && <p className="error-text">{errors[`items.${index}.quantity`]}</p>}</div>
                <div><input type="number" min="0.01" step="0.01" className={errors[`items.${index}.price`] ? 'has-error' : ''} value={item.price} onChange={(e) => updateItem(item.id, 'price', e.target.value)} />{errors[`items.${index}.price`] && <p className="error-text">{errors[`items.${index}.price`]}</p>}</div>
                <strong className="item-total">{formatCurrency(rowTotal)}</strong>
                <button type="button" className="delete-item-btn" onClick={() => removeItem(item.id)}>✕</button>
              </div>;
            })}
            <button type="button" className="btn btn-add-item btn-block" onClick={addItem}>+ Add New Item</button>
          </section>
        </div>
        <div className="form-actions sticky-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Discard</button>
          <div className="split-actions">
            {!isPaidEdit && <button type="button" className="btn btn-dark" onClick={() => handleSubmit(STATUS.DRAFT)}>Save as Draft</button>}
            <button type="button" className="btn btn-primary" onClick={() => handleSubmit(mode === 'create' ? STATUS.PENDING : undefined)}>Save & Send</button>
          </div>
        </div>
      </form>
    </section>
  );
}
