export const STORAGE_KEY = 'invoice-app-data-v1';
export const THEME_KEY = 'invoice-app-theme-v1';
export const STATUS = { DRAFT: 'draft', PENDING: 'pending', PAID: 'paid' };

export const seedInvoices = [
  {
    id: 'RT3080',
    createdAt: '2024-08-18',
    paymentDue: '2024-08-19',
    description: 'Brand identity design',
    paymentTerms: '1',
    clientName: 'Jensen Huang',
    clientEmail: 'jensen@example.com',
    status: STATUS.PAID,
    senderAddress: { street: '19 Union Terrace', city: 'Lagos', postCode: '100001', country: 'Nigeria' },
    clientAddress: { street: '86 Femi Okunnu Estate', city: 'Lekki', postCode: '106104', country: 'Nigeria' },
    items: [{ id: '1', name: 'Logo guidelines', quantity: 1, price: 1800.9 }]
  },
  {
    id: 'XM9141',
    createdAt: '2024-09-20',
    paymentDue: '2024-09-20',
    description: 'Website redesign',
    paymentTerms: '0',
    clientName: 'Alex Grim',
    clientEmail: 'alex@example.com',
    status: STATUS.PENDING,
    senderAddress: { street: '5 Allen Avenue', city: 'Ikeja', postCode: '100271', country: 'Nigeria' },
    clientAddress: { street: '22 Wellington Road', city: 'Abuja', postCode: '900001', country: 'Nigeria' },
    items: [{ id: '2', name: 'UI audit', quantity: 2, price: 278 }]
  },
  {
    id: 'RG0314',
    createdAt: '2024-10-01',
    paymentDue: '2024-10-01',
    description: 'Social media templates',
    paymentTerms: '0',
    clientName: 'John Morrison',
    clientEmail: 'john@example.com',
    status: STATUS.PAID,
    senderAddress: { street: '12 Admiralty Way', city: 'Lagos', postCode: '106104', country: 'Nigeria' },
    clientAddress: { street: '7 Palm Street', city: 'Port Harcourt', postCode: '500001', country: 'Nigeria' },
    items: [{ id: '3', name: 'Instagram posts', quantity: 6, price: 2333.67 }]
  },
  {
    id: 'TY9141',
    createdAt: '2024-10-31',
    paymentDue: '2024-10-31',
    description: 'Consulting',
    paymentTerms: '0',
    clientName: 'Thomas Wagner',
    clientEmail: 'thomas@example.com',
    status: STATUS.PENDING,
    senderAddress: { street: '12 Admiralty Way', city: 'Lagos', postCode: '106104', country: 'Nigeria' },
    clientAddress: { street: '3 Queen Street', city: 'Accra', postCode: '00233', country: 'Ghana' },
    items: [{ id: '4', name: 'Consulting', quantity: 1, price: 6155.91 }]
  },
  {
    id: 'FV2353',
    createdAt: '2024-11-12',
    paymentDue: '2024-11-12',
    description: 'Draft proposal',
    paymentTerms: '0',
    clientName: 'Anita Washington',
    clientEmail: 'anita@example.com',
    status: STATUS.DRAFT,
    senderAddress: { street: '12 Admiralty Way', city: 'Lagos', postCode: '106104', country: 'Nigeria' },
    clientAddress: { street: '10 Market St', city: 'Nairobi', postCode: '00100', country: 'Kenya' },
    items: [{ id: '5', name: 'Proposal', quantity: 1, price: 3102.04 }]
  }
];

export function generateInvoiceId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const letters = Array.from({ length: 2 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const numbers = Math.floor(1000 + Math.random() * 9000);
  return `${letters}${numbers}`;
}

export const emptyInvoice = () => ({
  id: generateInvoiceId(),
  createdAt: new Date().toISOString().slice(0, 10),
  paymentDue: new Date().toISOString().slice(0, 10),
  description: '',
  paymentTerms: '30',
  clientName: '',
  clientEmail: '',
  status: STATUS.PENDING,
  senderAddress: { street: '', city: '', postCode: '', country: '' },
  clientAddress: { street: '', city: '', postCode: '', country: '' },
  items: [{ id: crypto.randomUUID(), name: '', quantity: 1, price: 0 }]
});

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2 }).format(value || 0);
}

export function calculateTotal(invoice) {
  return invoice.items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.price || 0), 0);
}

export function formatDate(dateString) {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function derivePaymentDue(createdAt, paymentTerms) {
  if (!createdAt || paymentTerms === undefined || paymentTerms === null) return '';
  const date = new Date(createdAt);
  date.setDate(date.getDate() + Number(paymentTerms));
  return date.toISOString().slice(0, 10);
}

export function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function loadInvoices() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedInvoices));
      return seedInvoices;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedInvoices));
      return seedInvoices;
    }
    return parsed;
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedInvoices));
    return seedInvoices;
  }
}

export function loadTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return 'dark';
}

export function validateInvoice(invoice, statusOverride, mode = 'create') {
  const errors = {};
  const finalStatus = statusOverride ?? invoice.status;
  const requiredFields = [
    'clientName','clientEmail','description','createdAt','paymentTerms',
    'senderAddress.street','senderAddress.city','senderAddress.postCode','senderAddress.country',
    'clientAddress.street','clientAddress.city','clientAddress.postCode','clientAddress.country'
  ];
  requiredFields.forEach((path) => {
    const value = path.split('.').reduce((acc, key) => acc?.[key], invoice);
    if (!String(value ?? '').trim()) errors[path] = 'Required';
  });
  if (invoice.clientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invoice.clientEmail)) {
    errors.clientEmail = 'Invalid email';
  }
  if (!invoice.items.length) errors.items = 'At least one item is required';
  invoice.items.forEach((item, index) => {
    if (!String(item.name).trim()) errors[`items.${index}.name`] = 'Required';
    if (!(Number(item.quantity) > 0)) errors[`items.${index}.quantity`] = 'Must be positive';
    if (!(Number(item.price) > 0)) errors[`items.${index}.price`] = 'Must be positive';
  });
  if (finalStatus === STATUS.DRAFT) {
    if (mode === 'edit' && invoice.status === STATUS.PAID) errors.status = 'Paid invoices cannot be moved back to draft';
    return errors.status ? errors : {};
  }
  return errors;
}
