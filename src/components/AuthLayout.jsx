// src/components/AuthLayout.jsx
import React from "react";

/**
 * Full-screen auth layout with a simple brand gradient,
 * a bold title outside the card, and a centered frosted-glass panel.
 */
export function AuthLayout({ children }) {
  return (
    <div
      className="
        min-h-screen flex flex-col items-center justify-center
        bg-gradient-to-b from-gray-900 to-gray-600 
        p-4
      "
    >
      {/* App title outside the card */}
      <h1
        className="
          mb-8
          text-5xl font-heading font-semibold text-white
          drop-shadow-lg
        "
      >
        Budget Buddy
      </h1>
      <p className="mb-8 text-lg text-gray-200 text-center">
        Your personal budgeting companion—track every dollar effortlessly.
      </p>

      {/* Frosted-glass card */}
      <div
        className="
          w-full max-w-md
          bg-white backdrop-blur-md
          rounded-2xl shadow-lg
          p-8
        "
      >
        {children}
      </div>
    </div>
  );
}
