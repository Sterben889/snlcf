"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navigationLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About Us",
    href: "/about",
  },
  {
    label: "Gather",
    href: "/gather",
  },
  {
    label: "Discipleship",
    href: "/discipleship",
  },
  {
    label: "Events",
    href: "/events",
  },
  {
    label: "Serve",
    href: "/serve",
  },
  {
    label: "Give",
    href: "/give",
  },
] as const;

export default function Navbar() {
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /*
   * Homepage:
   * transparent navbar + white text.
   *
   * Other public pages:
   * white navbar + navy text.
   */
  const useLightNavbar =
    pathname.startsWith("/about") ||
    pathname.startsWith("/gather") ||
    pathname.startsWith("/discipleship") ||
    pathname.startsWith("/events") ||
    pathname.startsWith("/serve") ||
    pathname.startsWith("/give");

  /*
   * Close the mobile menu whenever the route changes.
   */
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  function isActiveLink(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  return (
    <header
      className={`absolute inset-x-0 top-0 z-50 transition-colors ${
        useLightNavbar ? "border-b border-gray-200 bg-white" : "bg-transparent"
      }`}
    >
      {/* Main navbar */}
      <nav className="mx-auto flex h-40 max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:px-10">
        {/* Logo + church name */}
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 sm:gap-5"
          aria-label="Go to homepage"
        >
          <Image
            src="/transparent.png"
            width={120}
            height={120}
            alt="SNLCF Church logo"
            priority
            className="h-[90px] w-[90px] shrink-0 object-contain sm:h-[110px] sm:w-[110px] lg:h-[120px] lg:w-[120px]"
          />

          <span
            className={`hidden font-bold transition-colors sm:block sm:text-xl lg:text-3xl ${
              useLightNavbar ? "text-blue-950" : "text-white"
            }`}
          >
            Saskatoon New Life Community Fellowship
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-8 lg:flex">
          {navigationLinks.map((link) => {
            const active = isActiveLink(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-2 text-base font-semibold transition-colors ${
                  useLightNavbar
                    ? active
                      ? "text-blue-900"
                      : "text-gray-700 hover:text-blue-900"
                    : active
                      ? "text-white"
                      : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}

                {active && (
                  <span
                    className={`absolute inset-x-0 -bottom-1 h-0.5 rounded-full ${
                      useLightNavbar ? "bg-blue-900" : "bg-white"
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((current) => !current)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={
            mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md transition lg:hidden ${
            useLightNavbar
              ? "text-blue-950 hover:bg-gray-100"
              : "text-white hover:bg-white/10"
          }`}
        >
          {mobileMenuOpen ? (
            /*
             * X icon
             */
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-9 w-9"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12" />
              <path d="M18 6 6 18" />
            </svg>
          ) : (
            /*
             * Hamburger icon
             */
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-10 w-10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-gray-200 bg-white shadow-xl lg:hidden"
        >
          <nav
            aria-label="Mobile navigation"
            className="mx-auto flex max-w-[1600px] flex-col px-5 py-4 sm:px-8"
          >
            {navigationLinks.map((link) => {
              const active = isActiveLink(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-4 py-4 text-lg font-semibold transition ${
                    active
                      ? "bg-blue-50 text-blue-950"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-950"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
