import React from "react";

const Card = ({ children, className = "", onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-3xl p-5 shadow-sm border border-gray-100 ${className} ${
      onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""
    }`}
  >
    {children}
  </div>
);

export default Card;
