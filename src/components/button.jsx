// src/components/Button.jsx
import React from 'react';

/**
 * Sleek solid button with subtle animation and focus states.
 */
export function Button({ children, variant = 'primary', className = '', ...props }) {
  const base =
    'w-full px-5 py-3 rounded-md font-medium flex items-center justify-center ' +
    'transition duration-200 ease-out';

  const styles = {
    primary:
      'bg-brand-500 text-black shadow-md ' +
      'hover:bg-brand-600 hover:shadow-lg ' +
      'focus:outline-none focus:ring-2 focus:ring-brand-400 ' +
      'active:scale-95',
    secondary:
      'bg-gray-100 text-gray-900 shadow-sm ' +
      'hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 ' +
      'active:scale-95',
  };

  const classes = `${base} ${styles[variant]} ${className}`.trim();
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
