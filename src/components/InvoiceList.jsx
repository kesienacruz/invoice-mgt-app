import React from 'react';
import EmptyState from './EmptyState';
import StatusBadge from './StatusBadge';
import { calculateTotal, formatCurrency, formatDate } from '../utils/invoice';

export default function InvoiceList({ invoices, onSelect }) {
  if (!invoices.length) return <EmptyState message="Create a new invoice and get started." />;
  return (
    <section className="invoice-list" aria-label="Invoice list">
      {invoices.map((invoice) => (
        <button key={invoice.id} type="button" className="invoice-card" onClick={() => onSelect(invoice)}>
          <span className="invoice-id"><span className="muted-hash">#</span>{invoice.id}</span>
          <span className="invoice-date">Due {formatDate(invoice.paymentDue)}</span>
          <span className="invoice-client">{invoice.clientName}</span>
          <span className="invoice-total">{formatCurrency(calculateTotal(invoice))}</span>
          <StatusBadge status={invoice.status} />
          <span className="chevron">›</span>
        </button>
      ))}
    </section>
  );
}
