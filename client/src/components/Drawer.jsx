import clsx from "clsx";
import React from "react";
import { NavLink } from "react-router-dom";

function DrawerItem({ text, href, icon, children, level = 0 }) {
  const paddingLeft = `${1.5 * (level + 1)}rem`;

  if (children && children.length > 0) {
    return (
      <div className="flex flex-col">
        <div
          className={clsx("flex items-center gap-2 px-4 py-2 text-gray-700")}
          style={{ paddingLeft }}
        >
          {icon}
          {text}
        </div>
        <div className="flex flex-col">
          {children.map((child, idx) => (
            <DrawerItem key={idx} {...child} level={level + 1} />
          ))}
        </div>
      </div>
    );
  }

  return href ? (
    href.startsWith("http") ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 text-gray-700 hover:bg-blue-300 flex items-center gap-2"
        style={{ paddingLeft }}
      >
        {icon}
        {text}
      </a>
    ) : (
      <NavLink
        to={href}
        className={({ isActive }) =>
          clsx("flex items-center gap-2 px-4 py-2", {
            "bg-blue-400 text-white hover:bg-blue-300": isActive,
            "text-gray-700 hover:bg-blue-300": !isActive,
          })
        }
        style={{ paddingLeft }}
      >
        {icon}
        {text}
      </NavLink>
    )
  ) : (
    <></>
  );
}

export default function Drawer({ data, isOpen, setIsOpen }) {
  return (
    <>
      <div
        className={clsx("fixed inset-0 bg-black transition-opacity", {
          "opacity-50 pointer-events-auto": isOpen,
          "opacity-0 pointer-events-none": !isOpen,
        })}
        onClick={() => setIsOpen(false)}
      ></div>

      <div
        className={clsx(
          "fixed z-50 inset-y-0 left-0 w-64 bg-slate-900 shadow-lg transform transition-transform",
          {
            "translate-x-0": isOpen,
            "-translate-x-full": !isOpen,
          }
        )}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2"
        >
          &times;
        </button>
        <div className="w-full flex justify-center items-center mt-12">
          <img src="/img/logo.png" alt="Side panel logo" width={100} />
        </div>
        <nav className="mt-8">
          {data.map((item, idx) => (
            <DrawerItem key={idx} {...item} />
          ))}
        </nav>
      </div>
    </>
  );
}
