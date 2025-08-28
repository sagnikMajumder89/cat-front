import React from "react";
import { ToastContainer } from "react-toastify";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-amber-200 shadow-md">
      <ToastContainer />
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
              <i className="fas fa-hard-hat text-white text-xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-amber-900">RentalTracker</h1>
          </div>

          {/* Navigation */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className="px-3 py-2 text-amber-900 hover:text-amber-700 font-medium transition-colors"
                  href="/"
                >
                  Dashboard
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  className="px-3 py-2 text-amber-900 hover:text-amber-700 font-medium transition-colors"
                  href="/assets"
                >
                  Assets
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Contracts Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-amber-900 hover:text-amber-700 font-medium bg-transparent">
                  Contracts
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white shadow-md rounded-md p-2">
                  <NavigationMenuLink
                    href="/contracts/create"
                    className="block px-4 py-2 rounded-md text-amber-800 hover:bg-amber-100"
                  >
                    Create Contract
                  </NavigationMenuLink>
                  <NavigationMenuLink
                    href="/contracts"
                    className="block px-4 py-2 rounded-md text-amber-800 hover:bg-amber-100"
                  >
                    View All Contracts
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  className="px-3 py-2 text-amber-900 hover:text-amber-700 font-medium transition-colors"
                  href="#"
                >
                  Reports
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  className="px-3 py-2 text-amber-900 hover:text-amber-700 font-medium transition-colors"
                  href="/clients"
                >
                  Clients
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right section */}
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
