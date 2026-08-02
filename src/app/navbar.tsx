import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="px-5 py-4">
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
          />

          <span className="text-3xl font-bold text-white hover:text-gray-300">
            Saskatoon New Life Community Fellowship
          </span>
        </Link>
      </nav>
    </header>
  );
}
