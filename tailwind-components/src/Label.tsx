import React from "react";

interface LabelProps {
  label?: string;
  className?: string;
  required?: boolean;
  error?: boolean;
}

export function Label({ label, className = "", required, error }: LabelProps) {
  if (!label) {
    return <></>;
  }
  return (
    <label className={`${className} font-semibold text-md ${error ? "text-red-700" : "text-gray-900"}`} title={required ? "Champ obligatoire" : undefined}>
      {label}
      {required && <span className="ml-1 text-gray-400 text-xs">(obligatoire)</span>}
    </label>
  );
}
