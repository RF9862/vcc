import React from "react";

export default function CreditCard({ width = 32, height = 32 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      className="design-iconfont"
      width={width}
      height={height}
    >
      <defs>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="a">
          <stop stopColor="#7D66F2" offset="0%" />
          <stop stopColor="#4F3DF5" offset="100%" />
        </linearGradient>
      </defs>
      <path
        d="M39 8.713C39 6.11 36.812 4 34.114 4H5.887C3.188 4 1 6.11 1 8.713v21.573C1 32.89 3.188 35 5.887 35h28.227C36.812 35 39 32.89 39 30.286V8.714zM5.886 7.142h28.227c.896 0 1.629.707 1.629 1.571v3.823H4.257V8.713c0-.864.733-1.571 1.63-1.571zm28.227 24.716H5.887c-.896 0-1.629-.707-1.629-1.571v-14.61h31.485v14.61c0 .864-.733 1.571-1.63 1.571h-.001zM15.22 24.737H7.84c-.901 0-1.629.701-1.629 1.571 0 .868.729 1.57 1.629 1.57h7.38c.901 0 1.629-.701 1.629-1.571 0-.868-.729-1.572-1.629-1.572h-.001z"
        fill="url(#a)"
        fillRule="evenodd"
      />
    </svg>
  );
}
