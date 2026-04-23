import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import InvoiceList from './components/InvoiceList';
import InvoiceDetail from './components/InvoiceDetail';
import InvoiceFormDrawer from './components/InvoiceFormDrawer';
import InvoiceForm from './components/InvoiceForm';
import DeleteModal from './components/DeleteModal';
import EmptyState from './components/EmptyState';
import { emptyInvoice, loadInvoices, loadTheme, STORAGE_KEY, THEME_KEY, STATUS, derivePaymentDue } from './utils/invoice';

function App() {
  const [theme, setTheme] = useState(loadTheme);
  const [invoices, setInvoices] = useState(loadInvoices);
  const [selectedId, setSelectedId] = useState(() => loadInvoices()[0]?.id ?? null);
  const [view, setView] = useState('list');
  const [filters, setFilters] = useState([]);
  const [formMode, setFormMode] = useState('create');
  const [editingInvoice, setEditingInvoice] = useState(emptyInvoice());
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
    if (!selectedId && invoices.length) setSelectedId(invoices[0].id);
  }, [invoices, selectedId]);

  const filteredInvoices = useMemo(() => filters.length ? invoices.filter((invoice) => filters.includes(invoice.status)) : invoices, [filters, invoices]);
  const selectedInvoice = invoices.find((invoice) => invoice.id === selectedId) ?? filteredInvoices[0] ?? null;

  const handleCreateNew = () => {
    setFormMode('create');
    setEditingInvoice(emptyInvoice());
    setView('form');
  };

  const handleEdit = (invoice) => {
    setFormMode('edit');
    setEditingInvoice(JSON.parse(JSON.stringify(invoice)));
    setView('form');
  };

  const closeForm = () => setView(selectedId ? 'detail' : 'list');

  const saveInvoice = (invoice, statusOverride) => {
    const existingInvoice = formMode === 'edit' ? invoices.find((item) => item.id === invoice.id) : null;
    let status = statusOverride ?? existingInvoice?.status ?? invoice.status;
    if (existingInvoice?.status === STATUS.PAID) status = STATUS.PAID;
    if (!existingInvoice && status === STATUS.PAID) status = STATUS.PENDING;
    const normalized = { ...invoice, status, paymentDue: derivePaymentDue(invoice.createdAt, invoice.paymentTerms) };
    if (formMode === 'create') {
      setInvoices((current) => [normalized, ...current]);
      setSelectedId(normalized.id);
    } else {
      setInvoices((current) => current.map((item) => item.id === normalized.id ? normalized : item));
      setSelectedId(normalized.id);
    }
    setView('detail');
  };

  const deleteInvoice = () => {
    if (!selectedInvoice) return;
    const remaining = invoices.filter((invoice) => invoice.id !== selectedInvoice.id);
    setInvoices(remaining);
    setShowDeleteModal(false);
    setView('list');
    setSelectedId(remaining[0]?.id ?? null);
  };

  const markAsPaid = () => {
    if (!selectedInvoice || selectedInvoice.status !== STATUS.PENDING) return;
    setInvoices((current) => current.map((invoice) => invoice.id === selectedInvoice.id ? { ...invoice, status: STATUS.PAID } : invoice));
  };

  const countText = filteredInvoices.length === 1 ? '1 total invoice' : `${filteredInvoices.length} total invoices`;

  return (
    <div className="app-shell">
      <Sidebar theme={theme} onToggleTheme={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} />
      <main className="app-main">
        <div className="content-wrap">
          <Header countLabel={countText} filters={filters} onFilterChange={setFilters} onCreateNew={handleCreateNew} />
          {view === 'list' && <InvoiceList invoices={filteredInvoices} onSelect={(invoice) => { setSelectedId(invoice.id); setView('detail'); }} />}
          {view === 'detail' && selectedInvoice && <InvoiceDetail invoice={selectedInvoice} onBack={() => setView('list')} onEdit={() => handleEdit(selectedInvoice)} onDelete={() => setShowDeleteModal(true)} onMarkPaid={markAsPaid} />}
          {view === 'detail' && !selectedInvoice && <EmptyState message="No invoice selected." />}
        </div>
      </main>
      {view === 'form' && <InvoiceFormDrawer onClose={closeForm}><InvoiceForm mode={formMode} initialInvoice={editingInvoice} onCancel={closeForm} onSubmit={saveInvoice} /></InvoiceFormDrawer>}
      {showDeleteModal && selectedInvoice && <DeleteModal invoiceId={selectedInvoice.id} onCancel={() => setShowDeleteModal(false)} onConfirm={deleteInvoice} />}
    </div>
  );
}

export default App;
