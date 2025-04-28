// src/components/Input.jsx
import React from 'react';

export function Input({ label, ...props }) {
    return (
      <div className="space-y-1">
        {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
        <input
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-300 transition"
          {...props}
        />
      </div>
    );
  }