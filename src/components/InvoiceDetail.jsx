import React from 'react';
import StatusBadge from './StatusBadge';
import { STATUS, calculateTotal, formatCurrency, formatDate } from '../utils/invoice';

export default function InvoiceDetail({ invoice, onBack, onEdit, onDelete, onMarkPaid }) {
  const total = calculateTotal(invoice);
  const canMarkPaid = invoice.status === STATUS.PENDING;
  const canEdit = invoice.status !== STATUS.PAID;
  return (
    <section className="detail-view">
      <button type="button" className="back-link" onClick={onBack}><span>‹</span> Go back</button>
      <div className="detail-toolbar">
        <div className="status-row"><span>Status</span><StatusBadge status={invoice.status} /></div>
        <div className="detail-actions">
          <button type="button" className="btn btn-secondary" onClick={onEdit} disabled={!canEdit}>Edit</button>
          <button type="button" className="btn btn-danger btn-soft" onClick={onDelete}>Delete</button>
          <button type="button" className="btn btn-primary" onClick={onMarkPaid} disabled={!canMarkPaid}>Mark as Paid</button>
        </div>
      </div>
      <article className="detail-card">
        <div className="detail-header-grid">
          <div><h2><span className="muted-hash">#</span>{invoice.id}</h2><p>{invoice.description}</p></div>
          <address><span>{invoice.senderAddress.street}</span><span>{invoice.senderAddress.city}</span><span>{invoice.senderAddress.postCode}</span><span>{invoice.senderAddress.country}</span></address>
        </div>
        {invoice.status === STATUS.PAID && <p className="paid-note">This invoice has been paid and can no longer be edited.</p>}
        <div className="detail-info-grid">
          <div className="info-stack"><div><h3>Invoice Date</h3><strong>{formatDate(invoice.createdAt)}</strong></div><div><h3>Payment Due</h3><strong>{formatDate(invoice.paymentDue)}</strong></div></div>
          <div><h3>Bill To</h3><strong>{invoice.clientName}</strong><address><span>{invoice.clientAddress.street}</span><span>{invoice.clientAddress.city}</span><span>{invoice.clientAddress.postCode}</span><span>{invoice.clientAddress.country}</span></address></div>
          <div><h3>Sent to</h3><strong>{invoice.clientEmail}</strong></div>
        </div>
        <div className="items-card">
          <div className="items-header items-grid"><span>Item Name</span><span>QTY.</span><span>Price</span><span>Total</span></div>
          {invoice.items.map((item) => <div key={item.id} className="items-grid item-row"><div><strong>{item.name}</strong></div><span>{item.quantity}</span><span>{formatCurrency(item.price)}</span><strong>{formatCurrency(item.quantity * item.price)}</strong></div>)}
          <div className="grand-total"><span>Amount Due</span><strong>{formatCurrency(total)}</strong></div>
        </div>
      </article>
    </section>
  );
}
