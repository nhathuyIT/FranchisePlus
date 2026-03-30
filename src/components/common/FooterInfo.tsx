import { Link } from "react-router-dom";
import type { IconType } from "react-icons";
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

const socialLinks: { label: string; href: string; Icon: IconType }[] = [
  { label: "Facebook", href: "#", Icon: FaFacebookF },
  { label: "Instagram", href: "#", Icon: FaInstagram },
  { label: "Twitter", href: "#", Icon: FaTwitter },
];

const contactItems: {
  label: string;
  value: string;
  href?: string;
  Icon: IconType;
}[] = [
  {
    label: "Address",
    value: "123 Aroma St, District 1, HCMC",
    Icon: FaMapMarkerAlt,
  },
  {
    label: "Phone",
    value: "+84 123 456 789",
    href: "tel:+84123456789",
    Icon: FaPhoneAlt,
  },
  {
    label: "Email",
    value: "info@goatcoffee.com",
    href: "mailto:info@goatcoffee.com",
    Icon: FaEnvelope,
  },
];

const openingHours = [
  { label: "Mon - Fri", value: "7:00 - 22:00" },
  { label: "Sat - Sun", value: "8:00 - 23:00" },
  { label: "Public Holidays", value: "8:00 - 20:00" },
];

export const FooterInfo = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#3E2723] pb-8 pt-12 text-white sm:pt-14 lg:pt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-4">
        <div className="lg:hidden">
          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,#4B322D_0%,#3E2723_100%)] p-5 shadow-[0_20px_60px_rgba(15,8,6,0.2)] sm:p-6">
            <div className="flex flex-col gap-5 text-center sm:text-left">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
                <img
                  src="/coffee-beans.png"
                  alt="GOAT Coffee Logo"
                  className="h-14 w-14 rounded-full bg-[#ede7dd] p-2 object-cover"
                />
                <div>
                  <span className="text-2xl font-serif font-bold tracking-wide text-[#fffbea]">
                    GOAT Coffee
                  </span>
                  <p className="mt-2 text-sm leading-6 text-[#D7CCC8]">
                    Elevating your daily ritual with premium, ethically sourced
                    coffee and a sensory experience in every cup.
                  </p>
                </div>
              </div>

              <div className="flex justify-center gap-3 sm:justify-start">
                {socialLinks.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#FFF8F1] transition hover:border-[#C4A77D] hover:bg-white/10 hover:text-white"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <h4 className="text-lg font-bold text-[#fffbea]">Explore</h4>
              <div className="mt-4 flex flex-col gap-2">
                {exploreLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#fffbea] transition hover:border-[#C4A77D]/50 hover:bg-white/10 hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <h4 className="text-lg font-bold text-[#fffbea]">Contact Us</h4>
              <ul className="mt-4 space-y-4 text-sm text-[#fffbea]">
                {contactItems.map(({ label, value, href, Icon }) => (
                  <li key={label} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/8 text-[#BCAAA4]">
                      <Icon size={15} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-[#BCAAA4]">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="mt-1 block break-words text-sm text-[#fffbea] transition hover:text-[#D7CCC8]"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="mt-1 text-sm leading-6 text-[#fffbea]">
                          {value}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 sm:col-span-2">
              <h4 className="text-lg font-bold text-[#fffbea]">Opening Hours</h4>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {openingHours.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3"
                  >
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[#BCAAA4]">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm font-medium text-[#fffbea]">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="hidden gap-12 text-left lg:grid lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center justify-start">
              <img
                src="/coffee-beans.png"
                alt="GOAT Coffee Logo"
                className="h-12 w-12 rounded-full bg-[#ede7dd] p-2 object-cover"
              />
              <span className="ml-3 text-2xl font-serif font-bold tracking-wide text-[#fffbea]">
                GOAT Coffee
              </span>
            </div>
            <p className="mb-4 leading-relaxed text-[#BCAAA4]">
              Elevating your daily ritual with premium, ethically sourced coffee
              and a sensory experience in every cup.
            </p>
            <div className="mt-2 flex justify-start gap-4">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="transition hover:text-[#BCAAA4]"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xl font-bold">Explore</h4>
            <ul className="space-y-2 text-[#fffbea]">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="transition hover:text-[#BCAAA4]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xl font-bold">Contact Us</h4>
            <ul className="space-y-3 text-[#fffbea]">
              {contactItems.map(({ label, value, href, Icon }) => (
                <li
                  key={label}
                  className="flex items-center justify-start gap-2"
                >
                  <Icon className="text-[#BCAAA4]" />
                  {href ? (
                    <a href={href} className="transition hover:text-[#BCAAA4]">
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xl font-bold">Opening Hours</h4>
            <ul className="space-y-1 text-[#fffbea]">
              {openingHours.map((item) => (
                <li key={item.label}>
                  {item.label}:{" "}
                  <span className="text-[#BCAAA4]">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[#6D4C41] pt-6 text-center text-sm text-[#BCAAA4] lg:mt-12">
          &copy; {currentYear} GOAT Coffee. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
