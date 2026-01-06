import React from "react";

const Input = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  step,
  disabled,
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-500 mb-1 ml-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      step={step}
      disabled={disabled}
      className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
    />
  </div>
);

export default Input;
