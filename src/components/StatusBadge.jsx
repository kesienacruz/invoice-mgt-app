import React from 'react';
import { capitalize } from '../utils/invoice';

export default function StatusBadge({ status }) {
  return <span className={`status-badge ${status}`}>{capitalize(status)}</span>;
}
