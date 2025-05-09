"use client";

import Link from "next/link";
import MobileMenu from "./mobile-menu";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export const DisplayNavBarContent = (props: {
  isMobile: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}) => {
  const isMobile = props.isMobile;
  const pathName = usePathname();
  const navBarContent = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "About",
      link: "/about",
    },
    {
      name: "How to Play",
      link: "/how-to-play",
    },
    {
      name: "High Scores",
      link: "/high-scores",
    },
  ];
  return (
    <>
      {navBarContent.map((content, index) => {
        const isActive = pathName.toLowerCase() === content.link.toLowerCase();
        return (
          <Link
            key={index}
            href={content.link}
            className={clsx(
              "nav-link",
              isActive ? "text-cyan-500" : "text-gray-300",
              "py-3  hover:text-cyan-400 text-center text-xl lg:text-sm"
            )}
            onClick={() => {
              if (isMobile && props.setIsOpen) {
                props.setIsOpen(false);
              }
            }}
          >
            {content.name}
          </Link>
        );
      })}
    </>
  );
};

const NavBar = () => {
  const pathname = usePathname();
  if (pathname.includes("/play")) {
    return null;
  }
  return (
    <header className="relative z-50 bg-black">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-3xl font-bold text-cyan-400 tracking-wider glow-text pixel-text"
        >
          TETRIS
        </Link>

        {/* Mobile menu button */}
        <div className="block lg:hidden">
          <MobileMenu />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-4">
          <DisplayNavBarContent isMobile={false} />
          <div className="flex items-center justify-center ">
            <Link
              href="/login"
              className="block w-fit p-3 border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 text-center transition-colors"
            >
              SIGN IN
            </Link>
            <Link
              href="/signup"
              className="block w-fit p-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-center transition-colors"
            >
              SIGN UP
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
