// src/components/SummaryCard.jsx
import React from 'react';
import { formatCurrency } from '../utils/format';

/**
 * SummaryCard displays a label and its corresponding formatted amount.
 */
export function SummaryCard({ label, amount }) {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-md p-4 flex flex-col items-center">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="mt-1 text-xl font-semibold">
        {formatCurrency(amount)}
      </span>
    </div>
  );
}