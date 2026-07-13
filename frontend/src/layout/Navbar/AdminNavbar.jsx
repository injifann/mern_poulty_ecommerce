import { NavLink } from "react-router";
import { FaBoxOpen, FaClipboardList, FaHome, FaList, FaSignOutAlt, FaUsers } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

export default function AdminNavbar() {
    const {logout} = useAuth()
  const navLinkStyle = ({ isActive }) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
    }`;
    

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-blue-600 p-2 text-white">
            <FaClipboardList />
          </div>

          <div>
            <h1 className="text-lg font-bold text-gray-800">
              Poultry Admin
            </h1>
            <p className="text-xs text-gray-500">
              Management Panel
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="hidden items-center gap-2 md:flex">
          <NavLink to="/admin/dashboard" className={navLinkStyle}>
            <FaHome />
            Dashboard
          </NavLink>

          <NavLink to="/admin/products" className={navLinkStyle}>
            <FaBoxOpen />
            Products
          </NavLink>

          <NavLink to="/admin/categories" className={navLinkStyle}>
            <FaList />
            Categories
          </NavLink>

          <NavLink to="/admin/manageusers" className={navLinkStyle}>
            <FaUsers />
            Users
          </NavLink>
        </div>

        {/* Logout */}
        <button onClick={logout}
          className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </nav>
  );
}