import React from "react";
import { Link } from "react-router-dom";

const navLinks = [
  { label: "Our Coffee", href: "#coffee" },
  { label: "Menu", href: "#menu" },
  { label: "Locations", href: "#locations" },
  { label: "Our Story", href: "#story" },
];

const Header = () => {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 backdrop-blur-md ${
        scrolled ? "bg-[#ede7dd] shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-[100rem] mx-auto flex items-center justify-between px-5 py-4">
        {/* Left: Original Logo Block */}
        <Link
          to={"/"}
          className="flex w-48 h-16 overflow-hidden rounded-md group mr-[45px]"
        >
          {/* PHẦN BÊN TRÁI: Chứa Logo (50% chiều rộng) */}
          <div className="w-1/2 h-full flex items-center justify-end">
            <img
              className="h-15 object-contain group-hover:scale-110 transition-transform"
              src={"/coffee-beans.png"}
              alt="Coffee Franchise"
            />
          </div>

          {/* PHẦN BÊN PHẢI: Chia đôi trên dưới (50% chiều rộng) */}
          <div className="w-1/2 h-full flex flex-col">
            <div className="h-1/2 flex items-end justify-start pl-2">
              <h3 className="font-bold leading-none text-[24px] text-[#6D4C41] uppercase tracking-tighter">
                GOAT
              </h3>
            </div>
            <div className="h-1/2 flex items-start justify-between pl-2">
              <p className="text-lg font-medium text-[#6D4C41] italic">
                coffee
              </p>
            </div>
          </div>
        </Link>
        {/* Center: Navigation */}
        <nav className="hidden md:flex gap-8 text-[#3E2723] font-semibold text-lg">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-[#ffffff] transition hover:bg-[#6D4C41] px-3 py-2 rounded-full "
            >
              {link.label}
            </a>
          ))}
        </nav>
        {/* Right: Auth */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-[#6D4C41] hover:underline font-medium px-3 py-1 rounded transition"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="bg-[#6D4C41] text-[#fffbea] font-bold px-5 py-2 rounded-full shadow-md hover:bg-[#5D4037 hover:scale-110 transition"
            style={{ letterSpacing: "0.02em" }}
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
