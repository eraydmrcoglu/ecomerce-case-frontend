"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";

export default function Footer() {
  const pathname = usePathname();

  if (
    pathname?.startsWith("/auth") ||
    pathname?.startsWith("/product/")
  ) {
    return null;
  }

  return (
    <footer className="w-full mt-6">
      <div className="w-full border-t border-slate-200"></div>
      <div className="py-6 flex flex-col items-center text-gray-700 font-poppins">
        <div className="flex items-center gap-6 text-xs md:text-sm text-gray-500">
          <Link href="/" className="hover:text-black transition-all">Home</Link>
          <Link href="/products" className="hover:text-black transition-all">Products</Link>
          <Link href="/contact" className="hover:text-black transition-all">Contact</Link>
          <Link href="/help" className="hover:text-black transition-all">Help</Link>
        </div>

        <div className="flex items-center gap-4 mt-6 text-indigo-500">
          <a href="#" className="hover:-translate-y-0.5 transition-all duration-300">
            <FaFacebookF size={18} />
          </a>
          <a href="#" className="hover:-translate-y-0.5 transition-all duration-300">
            <FaInstagram size={18} />
          </a>
          <a href="#" className="hover:-translate-y-0.5 transition-all duration-300">
            <FaLinkedinIn size={18} />
          </a>
          <a href="#" className="hover:-translate-y-0.5 transition-all duration-300">
            <FaTwitter size={18} />
          </a>
        </div>

        <p className="mt-6 text-center text-gray-500 text-xs md:text-sm">
          © 2025 E-Commerce App. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
