"use client";
import { useState, useEffect } from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { IoMdClose } from "react-icons/io";

export default function Header({
  handleContactClick,
  handleCompanyClick,

  handleFaqClick,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleMenu = () => setMenuOpen((v) => !v);
  const closeMenu = () => setMenuOpen(false);

  const scrollToCompany = () => {
    if (pathname !== "/") router.push("/?scroll=company");
    else handleCompanyClick?.();
  };

  const scrollToContact = () => {
    if (pathname !== "/") router.push("/?scroll=contact");
    else handleContactClick?.();
  };
  const scrollToFaq = () => {
    if (pathname !== "/") router.push("/?scroll=faq");
    else handleFaqClick?.();
  };

  return (
    <header className="sticky top-0 z-40 transition-colors duration-300">
      <div className="container max-w-7xl mx-auto px-4">
        <nav
          className={`bg-transparent flex justify-between items-center py-3 ${
            scrolled ? "backdrop-blur-3xl" : ""
          }`}
        >
          <Link href="/" className="font-extrabold text-[#EFBF04] text-xl">
            PASSKET
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex items-center space-x-12">
            <li>
              <Link
                href="/"
                className={`text-sm font-semibold tracking-wider hover:text-blueGray-500 ${
                  pathname === "/" ? "text-[#EFBF04]" : "text-blueGray-600"
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/events"
                className={`text-sm font-semibold tracking-wider hover:text-blueGray-500 ${
                  pathname === "/events"
                    ? "text-[#EFBF04]"
                    : "text-blueGray-600"
                }`}
              >
                All Events
              </Link>
            </li>
            <li
              className="text-sm font-semibold text-blueGray-600 hover:text-blueGray-500 tracking-wide cursor-pointer"
              onClick={scrollToCompany}
            >
              About us
            </li>
            <li
              className="text-sm font-semibold text-blueGray-600 hover:text-blueGray-500 tracking-wide cursor-pointer"
              onClick={scrollToFaq}
            >
              Faqs
            </li>
            <li
              className="text-sm font-semibold text-blueGray-600 hover:text-blueGray-500 tracking-wide cursor-pointer"
              onClick={scrollToContact}
            >
              Contact
            </li>
          </ul>

          {/* Desktop Auth */}
          <div className="hidden lg:flex space-x-4">
            <Link
              href="/login"
              className="w-[131px] h-[40px] rounded-lg border-2 border-[#EFBF04] font-semibold flex items-center justify-center text-[#EFBF04]"
            >
              LOG IN
            </Link>
            <Link
              href="/signup"
              className="w-[131px] h-[40px] rounded-lg border-2 border-[#EFBF04] font-semibold flex items-center justify-center text-[#EFBF04]"
            >
              SIGN UP
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="navbar-burger flex items-center py-2 px-3 text-[#EFBF04] border border-amber-300 rounded"
              aria-label="Open menu"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
              </svg>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer + Backdrop */}
      <div
        className={`fixed inset-0 z-50 transition-opacity ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60" onClick={closeMenu} />

        {/* Panel */}
        <div
          className={`absolute left-0 top-0 h-full w-[80%] bg-black text-white shadow-lg transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex px-4 justify-between mt-6">
            <Link
              href="/"
              onClick={closeMenu}
              className="font-extrabold text-[#EFBF04] text-xl"
            >
              PASSKET
            </Link>
            <button onClick={closeMenu} aria-label="Close menu">
              <IoMdClose size={26} className="text-[#EFBF04]" />
            </button>
          </div>

          <ul
            className={`p-6 flex flex-col gap-7 font-medium h-full ${
              menuOpen ? "overflow-y-auto" : "overflow-hidden"
            }`}
          >
            <li>
              <Link href="/" onClick={closeMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/events" onClick={closeMenu}>
                All Events
              </Link>
            </li>
            <li
              onClick={() => {
                closeMenu();
                scrollToCompany();
              }}
            >
              About Us
            </li>
            <li
              onClick={() => {
                closeMenu();
                scrollToFaq();
              }}
            >
              Faqs
            </li>
            <li
              onClick={() => {
                closeMenu();
                scrollToContact();
              }}
            >
              Contact
            </li>
            <li>
              <Link href="/login" onClick={closeMenu}>
                Log In
              </Link>
            </li>
            <li>
              <Link href="/signup" onClick={closeMenu}>
                Sign Up
              </Link>
            </li>

            <div className="mt-8">
              <p className="text-sm">
                Get in touch{" "}
                <span className="text-[#EFBF04] cursor-pointer">
                  contact@passket.com
                </span>
              </p>
              <div className="flex gap-5 text-[#EFBF04] text-lg mt-4 pb-20">
                <FaFacebookF />
                <FaInstagram />
              </div>
            </div>
          </ul>
        </div>
      </div>
    </header>
  );
}
