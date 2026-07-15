import React, { useState } from "react";
import { NavLink } from "react-router";
import { HiMenu, HiX } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function UserNavbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  const [isOpen, setIsOpen] = useState(false);

  const length = cart?.totalItems || 0;

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

        {/* Desktop Menu */}
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
            <NavLink to="/cart" className={`${navLinkStyle} relative`}>
              Cart
              {length > 0 && (
                <span className="absolute -top-2 -right-4 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                  {length}
                </span>
              )}
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
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-3xl text-gray-700 transition hover:text-green-600 md:hidden"
        >
          {isOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-gray-200 bg-white shadow-md md:hidden">
          <ul className="flex flex-col gap-4 p-5 font-medium">
            <li>
              <NavLink
                to="/"
                end
                onClick={() => setIsOpen(false)}
                className={navLinkStyle}
              >
                Home
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/shop"
                onClick={() => setIsOpen(false)}
                className={navLinkStyle}
              >
                Shop
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/cart"
                onClick={() => setIsOpen(false)}
                className="relative inline-block text-gray-700 hover:text-green-600"
              >
                Cart
                {length > 0 && (
                  <span className="absolute -top-2 -right-5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                    {length}
                  </span>
                )}
              </NavLink>
            </li>

            {user ? (
              <>
                <li>
                  <NavLink
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className={navLinkStyle}
                  >
                    Profile
                  </NavLink>
                </li>

                <li>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="text-left text-red-500 transition hover:text-red-700"
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
                    onClick={() => setIsOpen(false)}
                    className="block rounded-md border border-green-600 px-4 py-2 text-center text-green-600 transition hover:bg-green-600 hover:text-white"
                  >
                    Sign Up
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block rounded-md bg-green-600 px-4 py-2 text-center text-white transition hover:bg-green-700"
                  >
                    Login
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}