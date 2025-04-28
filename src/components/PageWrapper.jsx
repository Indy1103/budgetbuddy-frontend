// src/components/PageWrapper.jsx
import React from "react";

export function PageWrapper({ children }) {
  return (
    <div className="min-h-screen bg-bg-light flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md w-full max-w-sm p-8">
        {children}
      </div>
    </div>
  );
}
