import React from "react";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const {user,logout} = useAuth();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <div className="text-2xl font-bold text-green-600">
          PoultryShop
        </div>

        {/* Links */}
        <ul className="hidden md:flex items-center gap-6 text-gray-700 font-medium">

          <li>
            <Link to="/" className="hover:text-green-600">
              Home
            </Link>
          </li>

          <li>
            <Link to="/products" className="hover:text-green-600">
              Products
            </Link>
          </li>

          <li>
            <Link to="/cart" className="hover:text-green-600">
              Cart
            </Link>
          </li>

          <li>
            <Link to="/category" className="hover:text-green-600">
              Category
            </Link>
          </li>

          {/* AUTH SECTION */}
          {user ? (
            <>
              <li>
                <Link to="/profile" className="hover:text-green-600">
                  Profile
                </Link>
              </li>

              <li>
                <button onClick={logout}
                  className="text-red-500 hover:text-red-700"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/register"
                  className="px-3 py-1 rounded-md border border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                >
                  Sign Up
                </Link>
              </li>

              <li>
                <Link
                  to="/login"
                  className="px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700"
                >
                  Login
                </Link>
              </li>
            </>
          )}
        </ul>

        <div className="md:hidden">
          <button className="text-gray-700">☰</button>
        </div>
      </div>
    </nav>
  );
}
