"use client";
import { auth } from "./../lib/firebase/config";
import { signOut } from "firebase/auth";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

export function Header() {
  const { user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); 

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const getInitials = () => {
    if (!user?.displayName) return "U";
    return user.displayName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  async function handleLogout() {
    try {
      await signOut(auth);
      await fetch("/api/logout", {
        method: "GET",
      });
      window.location.reload();
    } catch (error) {
      console.error("Error en logout:", error);
    }
  }

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <header className="antialiased">
      <nav className="border-gray-200 px-4 lg:px-6 py-2.5 border-b border-b-gray-300 dark:border-b-gray-900">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex justify-start items-center">
       
       
            <a  className="flex mr-4">
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                Employee
              </span>
            </a>
          </div>
          <div className="flex items-center lg:order-2">
            <button
              onClick={toggleDropdown}
              type="button"
              aria-expanded={isDropdownOpen}
              className="flex mx-3 text-sm rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              id="user-menu-button"
              data-dropdown-toggle="dropdown"
            >
              <span className="sr-only">Open user menu</span>
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                {getInitials()}
              </div>
            </button>

            <div
              ref={dropdownRef} 
              className={`${
                isDropdownOpen ? "block" : "hidden"
              } absolute right-0 mt-2 top-12 z-50 w-64 bg-white dark:bg-black rounded-lg shadow-lg border border-gray-200 dark:border-gray-700`}
              id="dropdown"
            >
              <div className="py-4 px-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {user?.displayName || "Usuario"}
                </h3>
                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                  {user?.email || "email@example.com"}
                </p>
              </div>
              <ul className="py-2 text-gray-700 dark:text-gray-300">
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white rounded transition-all duration-150"
                  >
                    Sign out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
