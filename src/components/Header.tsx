import React from "react";
import { ToastContainer } from "react-toastify";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-amber-200 shadow-md">
      <ToastContainer />
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
              <i className="fas fa-hard-hat text-white text-xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-amber-900">RentalTracker</h1>
          </div>

          <nav className="hidden md:flex space-x-8">
            <a
              href="/"
              className="text-amber-900 hover:text-amber-700 font-medium transition-colors"
            >
              Dashboard
            </a>
            <a
              href="/assets"
              className="text-amber-800 hover:text-amber-700 font-medium transition-colors"
            >
              Assets
            </a>
            <a
              href="/contracts"
              className="text-amber-800 hover:text-amber-700 font-medium transition-colors"
            >
              Contracts
            </a>
            <a
              href="#"
              className="text-amber-800 hover:text-amber-700 font-medium transition-colors"
            >
              Reports
            </a>
            <a
              href="/clients"
              className="text-amber-800 hover:text-amber-700 font-medium transition-colors"
            >
              Clients
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full bg-amber-100 hover:bg-amber-300 transition-colors">
              <i className="fas fa-bell text-amber-800"></i>
            </button>
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-medium">
              JS
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
