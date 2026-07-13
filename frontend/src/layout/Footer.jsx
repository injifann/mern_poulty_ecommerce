import React from "react";
import { Link } from "react-router";
import { FaEnvelope, FaGithub, FaGlobe } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-16 bg-gray-900 text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white">
            PoultryShop
          </h2>

          <p className="mt-4 text-sm leading-6 text-gray-400">
            Fresh poultry products delivered with quality and reliability.
            This project demonstrates a modern MERN e-commerce application.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">
            Quick Links
          </h3>

          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="transition hover:text-green-400"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/shop"
                className="transition hover:text-green-400"
              >
                Shop
              </Link>
            </li>

            <li>
              <Link
                to="/cart"
                className="transition hover:text-green-400"
              >
                Cart
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">
            Contact
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-green-400" />
              <span>kabegutema4@gmail.com</span>
            </div>

        <div className="flex items-center gap-3">
            <FaGithub className="text-lg text-green-400" />
            <a
            href="https://github.com/injifann"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-green-400 hover:underline"
            >
            GitHub
            </a>
        </div>

        <div className="flex items-center gap-3">
            <FaGlobe className="text-lg text-green-400" />
            <a
            href="https://injifann.github.io/kabe_gutema_new/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-green-400 hover:underline"
            >
            Portfolio
            </a>
        </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800 py-5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 text-sm text-gray-400 md:flex-row">
          <p>
            © {new Date().getFullYear()} PoultryShop. All rights reserved.
          </p>

          <p>
            Developed with ❤️ by{" "}
            <span className="font-semibold text-green-400">
              Kabe Gutema
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}