"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const useLightNavbar =
    pathname.startsWith("/about") || pathname.startsWith("/events");

  return (
    <header
      className={`absolute inset-x-0 top-0 z-50 transition-colors ${
        useLightNavbar ? "border-b border-gray-200 bg-white" : "bg-transparent"
      }`}
    >
      <nav className="flex h-40 items-center px-5">
        <Link
          href="/"
          className="inline-flex items-center gap-5"
          aria-label="Go to homepage"
        >
          <Image
            src="/transparent.png"
            width={120}
            height={120}
            alt="SNLCF Church logo"
            priority
            className="h-[120px] w-[120px] object-contain"
          />

          <span
            className={`text-3xl font-bold transition-colors ${
              useLightNavbar ? "text-blue-950" : "text-white"
            }`}
          >
            Saskatoon New Life Community Fellowship
          </span>
        </Link>
      </nav>
    </header>
  );
}
