import Image from "next/image";
import React from "react";

export default function Navbar() {
  return (
    <div>
      <nav>
        <div className="relative z-20  pt-4 px-5 p-1 flex items-center">
          <Image
            src="/logo.jpg"
            width="120"
            height="120" alt={""}          />
          <div className="hover:text-gray-200 font-bold text-3xl pl-2 w-120 text-white">
            Saskatoon New Life Community Fellowship
          </div>
        </div>
      </nav>
    </div>
  );
}
