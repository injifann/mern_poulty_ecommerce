import React from "react";
import { NavLink } from "react-router";
import { useAuth } from "../../context/AuthContext";

export default function UserNavbar() {
  const { user, logout } = useAuth();

  const navLinkStyle = ({ isActive }) =>
    `transition ${
      isActive
        ? "text-green-600 font-semibold border-b-2 border-green-600 pb-1"
        : "text-gray-700 hover:text-green-600"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">

        {/* Logo */}
        <div className="text-2xl font-bold text-green-600">
          PoultryShop
        </div>

        {/* Links */}
        <ul className="hidden items-center gap-6 font-medium md:flex">

          <li>
            <NavLink to="/" className={navLinkStyle} end>
              Home
            </NavLink>
          </li>

          <li>
            <NavLink to="/shop" className={navLinkStyle}>
              Shop
            </NavLink>
          </li>

          <li>
            <NavLink to="/cart" className={navLinkStyle}>
              Cart
            </NavLink>
          </li>

          {user ? (
            <>
              <li>
                <NavLink to="/profile" className={navLinkStyle}>
                  Profile
                </NavLink>
              </li>

              <li>
                <button
                  onClick={logout}
                  className="text-red-500 transition hover:text-red-700"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/register"
                  className="rounded-md border border-green-600 px-3 py-1 text-green-600 transition hover:bg-green-600 hover:text-white"
                >
                  Sign Up
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/login"
                  className="rounded-md bg-green-600 px-3 py-1 text-white transition hover:bg-green-700"
                >
                  Login
                </NavLink>
              </li>
            </>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button className="text-gray-700 text-2xl">☰</button>
        </div>
      </div>
    </nav>
  );
}