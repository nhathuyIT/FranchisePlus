import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import { ROUTER_URL } from "@/router/route.const";

const exploreLinks = [
  { label: "Our Coffee", to: ROUTER_URL.HOME },
  { label: "Menu", to: `/${ROUTER_URL.MENU}` },
  { label: "Locations", to: ROUTER_URL.LOCATIONS },
  { label: "Our Story", to: ROUTER_URL.ABOUT },
];

export const FooterInfo = () => {
  return (
    <footer className="bg-[#3E2723] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start mb-4">
              <img
                src="/coffee-beans.png"
                alt="GOAT Coffee Logo"
                className="h-12 w-12 rounded-full object-cover bg-[#ede7dd] p-2"
              />
              <span className="ml-3 text-2xl font-serif font-bold tracking-wide text-[#fffbea]">
                GOAT Coffee
              </span>
            </div>
            <p className="text-[#BCAAA4] leading-relaxed mb-4">
              Elevating your daily ritual with premium, ethically sourced coffee and a sensory experience in every cup.
            </p>
            <div className="flex justify-center md:justify-start gap-4 mt-2">
              <a href="#" aria-label="Facebook" className="hover:text-[#BCAAA4] transition">
                <FaFacebookF size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-[#BCAAA4] transition">
                <FaInstagram size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-[#BCAAA4] transition">
                <FaTwitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-4">Explore</h4>
            <ul className="space-y-2 text-[#fffbea]">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="hover:text-[#BCAAA4] transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-[#fffbea]">
              <li className="flex items-center justify-center md:justify-start gap-2">
                <FaMapMarkerAlt className="text-[#BCAAA4]" />
                123 Aroma St, District 1, HCMC
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <FaPhoneAlt className="text-[#BCAAA4]" />
                <a href="tel:+84123456789" className="hover:text-[#BCAAA4] transition">+84 123 456 789</a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <FaEnvelope className="text-[#BCAAA4]" />
                <a href="mailto:info@goatcoffee.com" className="hover:text-[#BCAAA4] transition">info@goatcoffee.com</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-4">Opening Hours</h4>
            <ul className="text-[#fffbea] space-y-1">
              <li>Mon - Fri: <span className="text-[#BCAAA4]">7:00 - 22:00</span></li>
              <li>Sat - Sun: <span className="text-[#BCAAA4]">8:00 - 23:00</span></li>
              <li>Public Holidays: <span className="text-[#BCAAA4]">8:00 - 20:00</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#6D4C41] mt-12 pt-6 text-center text-[#BCAAA4] text-sm">
          &copy; {new Date().getFullYear()} GOAT Coffee. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
