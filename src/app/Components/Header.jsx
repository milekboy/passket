"use client";
import { useState, useEffect } from "react";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";

export default function Header({
  handleContactClick,
  handleCompanyClick,
  handleServicesClick,
  handleSecureClick,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const navHandler = () => setMenuOpen(false);

  const scrollToServices = () => {
    if (pathname !== "/") {
      router.push("/?scroll=services");
    } else {
      handleServicesClick();
    }
  };
  const scrollToCompany = () => {
    if (pathname !== "/") {
      router.push("/?scroll=services");
    } else {
      handleCompanyClick();
    }
  };

  const scrollToContact = () => {
    if (pathname !== "/") {
      router.push("/?scroll=contact");
    } else {
      handleContactClick();
    }
  };

  const scrollToSecure = () => {
    if (pathname !== "/") {
      router.push("/?scroll=contact");
    } else {
      handleSecureClick();
    }
  };

  return (
    <header className={`sticky top-0 z-40  transition-colors duration-300`}>
      <div className="container  max-w-7xl mx-auto px-4 pt-5">
        <nav className="bg-transparent flex justify-between items-center py-3">
          <Link href="/">
            <p className="font-extrabold text-[#EFBF04] text-xl">PASSKET</p>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex items-center space-x-12">
            <li>
              <Link
                href="/"
                className={`text-sm font-semibold hover:text-blueGray-500 tracking-wider   ${
                  pathname === "/" ? "text-[#EFBF04]" : "text-blueGray-600 "
                }`}
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                href="/about-us"
                className={`text-sm font-semibold hover:text-blueGray-500 tracking-wider   ${
                  pathname === "/about-us"
                    ? "text-[#EFBF04]"
                    : "text-blueGray-600 "
                }`}
              >
                All Events
              </Link>
            </li>
            <li
              className="text-sm font-semibold text-blueGray-600 hover:text-blueGray-500 tracking-wide cursor-pointer"
              onClick={scrollToServices}
            >
              About us
            </li>
            <li
              onClick={scrollToCompany}
              className="text-sm cursor-pointer font-semibold text-blueGray-600 hover:text-blueGray-500 tracking-wide"
            >
              Plans
            </li>
            <li
              onClick={scrollToContact}
              className="text-sm font-semibold text-blueGray-600 hover:text-blueGray-500 tracking-wide cursor-pointer"
            >
              Contact
            </li>
          </ul>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex space-x-4">
            <Link
              href="/login"
              className={`text-[#EFBF04] w-[131px] rounded-lg  border-[#EFBF04] border-2 h-[40px] font-semibold text-center flex justify-center items-center px-3  ${
                pathname === "/login"
                  ? "bg-[#489AFF] text-white"
                  : "text-[#489AFF]"
              }`}
            >
              LOG IN
            </Link>

            <Link
              href="/signup"
              className={`text-[#EFBF04] w-[131px] rounded-lg  border-[#EFBF04] border-2 h-[40px] font-semibold text-center flex justify-center items-center px-3  ${
                pathname === "/signup"
                  ? "bg-[#EFBF04] text-white"
                  : "text-[#489AFF]"
              }`}
            >
              SIGN UP
            </Link>
          </div>

          {/* Mobile Menu */}
          <div
            className={`fixed top-0 left-0 h-full w-[80%] bg-black opacity-80 shadow-lg transition-transform duration-300 z-40 ${
              menuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex px-4 justify-between mt-6">
              <Link href="/">
                <p className="font-extrabold text-[#EFBF04] text-xl">PASSKET</p>
              </Link>

              <IoMdClose
                onClick={toggleMenu}
                size={26}
                className="text-[#EFBF04 ]"
              />
            </div>
            <ul className="p-6 flex flex-col gap-7 font-medium list-disc list-inside h-full overflow-y-scroll">
              <Link href="/">
                <li onClick={navHandler}>Home</li>
              </Link>

              <Link href="/about-us">
                <li onClick={navHandler}> All Events</li>
              </Link>

              <li
                onClick={() => {
                  setMenuOpen(false);
                  scrollToServices();
                }}
              >
                About Us
              </li>

              <li
                onClick={() => {
                  setMenuOpen(false);
                  scrollToCompany();
                }}
              >
                Plans
              </li>

              <li
                onClick={() => {
                  setMenuOpen(false);
                  scrollToContact();
                }}
              >
                Contact
              </li>

              <Link href="/login">
                <li onClick={navHandler}>Log In</li>
              </Link>
              <Link href="/signup">
                <li onClick={navHandler}>Sign Up</li>
              </Link>

              <div>
                <p className="text-sm mt-8">
                  Get in touch{" "}
                  <span className="text-[#EFBF04] cursor-pointer">
                    contact@passket.com
                  </span>
                </p>
                <div className="flex gap-5 text-[#EFBF04] text-lg mt-4 pb-20">
                  <FaFacebookF /> <FaInstagram />
                </div>
              </div>
            </ul>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="navbar-burger flex items-center py-2 px-3 text-[#EFBF04]  border border-amber-300  rounded"
            >
              <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                <title>Mobile menu</title>
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
              </svg>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
