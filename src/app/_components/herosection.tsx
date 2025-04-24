import Image from "next/image";
import React from "react";

export function HeroSection() {
  return (
    <div className="h-screen w-screen justify-center items-center bg-black">
      <Image src="/filter.png" alt="" layout="fill" objectFit="cover" />
      <div className="relative justify-center items-center text-center m-auto">
        <div className="pt-60 pb-10 font-bold text-8xl text-white">To Glorify God</div>
        <div className="font-bold text-2xl text-white">by fulfilling the Great Commission</div>
      </div>
    </div>
  );
}
