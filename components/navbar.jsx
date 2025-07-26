"use client";

import { 
  Navbar, 
  NavBody, 
  NavItems, 
  MobileNav, 
  MobileNavHeader, 
  MobileNavMenu, 
  MobileNavToggle, 
  NavbarLogo, 
  NavbarButton 
} from "@/components/ui/resizeable-navbar";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { ShoppingCart } from "lucide-react";

export default function Navigasi() {
  const [isOpen, setIsOpen] = useState(false);
  const { cartCount } = useCart();

  const navItems = [
    { name: "Beranda", link: "/" },
    { name: "Katalog", link: "#about" },
    { name: "Tentang Kami", link: "#services" },  
    { name: "Contact", link: "#contact" },
  ];

  return (
    <div className="font-sans">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="relative">
            <NavbarButton href="/keranjang" className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4" />
              <span>Keranjang</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle 
              isOpen={isOpen} 
              onClick={() => setIsOpen(!isOpen)} 
            />
          </MobileNavHeader>
          <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <NavbarButton href="#contact" className="mt-4 flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4" />
              <span>Keranjang</span>
              {cartCount > 0 && (
                <span className="bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] ml-2">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </NavbarButton>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
