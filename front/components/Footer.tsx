import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-cyan-400 glow-text mb-4 md:mb-0 pixel-text text-sm">
            TETRIS © {new Date().getFullYear()}
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-gray-400 hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white">
              Terms
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
