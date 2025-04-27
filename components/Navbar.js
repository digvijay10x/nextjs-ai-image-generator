"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";

const menuItemsLeft = [
  { name: "Gallery", href: "/gallery" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-black text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <Link href="/" aria-label="Home">
                <span className="text-white text-3xl font-bold">Artivio</span>
              </Link>
            </div>
            <div className="hidden sm:flex space-x-8">
              {menuItemsLeft.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-lg font-medium hover:text-[#4d6bfe]"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-8">
            {session && (
              <Link
                href="/profile"
                className="text-lg font-medium hover:text-[#4d6bfe]"
              >
                Profile
              </Link>
            )}
          </div>
          <div className="sm:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-300 focus:outline-none"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItemsLeft.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 rounded-md text-lg font-medium hover:text-[#4d6bfe]"
                onClick={toggleMenu}
              >
                {item.name}
              </Link>
            ))}
            {session && (
              <Link
                href="/profile"
                className="block px-3 py-2 rounded-md text-lg font-medium hover:text-[#4d6bfe]"
                onClick={toggleMenu}
              >
                Profile
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
