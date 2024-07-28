import clsx from "clsx";
import React from "react";

export default function Modal({ title, onClose, children, className }) {
  return (
    <div
      className={
        "fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
      }
      onClick={onClose}
    >
      <div
        className={clsx(
          "relative bg-white text-black rounded-lg p-8 w-96",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-black">{title}</h3>
          <button
            className="text-gray-500 hover:bg-gray-100 rounded-full p-2"
            onClick={onClose}
            aria-label="Close"
          >
            <span className="block w-5 h-5 relative">
              <span className="absolute w-full h-0.5 bg-gray-500 transform rotate-45 top-1/2 left-0"></span>
              <span className="absolute w-full h-0.5 bg-gray-500 transform -rotate-45 top-1/2 left-0"></span>
            </span>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
