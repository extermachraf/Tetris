"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { DisplayNavBarContent } from "./NavBar";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="block lg:hidden p-2 text-cyan-400 hover:text-cyan-300 focus:outline-none"
      >
        <Menu className="h-8 w-8" />
      </button>

      <div
        className={`w-screen lg:hidden fixed right-0 top-0 bottom-0  bg-black border-l border-cyan-900  transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4  flex justify-end">
          <button
            onClick={() => setIsOpen(false)}
            className="text-cyan-400 hover:text-cyan-300 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex flex-col p-4 gap-32">
          <div className="flex gap-9 flex-col">
            <DisplayNavBarContent isMobile={true} setIsOpen={setIsOpen} />
          </div>
          <div className="">
            <Link
              href="/login"
              className="block mx-auto w-fit px-10 py-3 border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 text-center transition-colors"
              onClick={() => setIsOpen(false)}
            >
              SIGN IN
            </Link>
            <Link
              href="/signup"
              className="block mx-auto px-10 w-fit py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-center transition-colors"
              onClick={() => setIsOpen(false)}
            >
              SIGN UP
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
