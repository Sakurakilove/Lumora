"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { FONTS } from "@/lib/styles";

const NAV_LINKS = [
  { href: "/", label: "首页" },
  { href: "/explore", label: "探索 Skills" },
  { href: "/#about", label: "关于" },
  { href: "/#community", label: "社区" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 sm:px-10 py-6">
        <Link
          href="/"
          className="text-white text-xl sm:text-2xl italic"
          style={FONTS.serif}
        >
          Lumora <span className="text-white/60 text-base not-italic" style={FONTS.system}>Skills</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1 liquid-glass rounded-full pl-2 pr-2 py-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/90 hover:text-white text-sm px-4 py-1.5 transition-colors duration-200"
              style={FONTS.system}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden liquid-glass rounded-full w-11 h-11 flex items-center justify-center relative"
          aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
        >
          <Menu
            className={`absolute text-white transition-all duration-300 ease-in-out ${
              mobileOpen
                ? "opacity-0 rotate-90 scale-75"
                : "opacity-100 rotate-0 scale-100"
            }`}
            size={22}
          />
          <X
            className={`absolute text-white transition-all duration-300 ease-in-out ${
              mobileOpen
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 -rotate-90 scale-75"
            }`}
            size={22}
          />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-7">
            {NAV_LINKS.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-white text-3xl"
                style={{
                  ...FONTS.system,
                  animation: `mobile-menu-link-in 500ms cubic-bezier(0.4,0,0.2,1) ${
                    100 + index * 50
                  }ms both`,
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
