import React from 'react';
export default function EmptyState({ message }) {
  return <section className="empty-state"><h2>There’s nothing here</h2><p>{message}</p></section>;
}
