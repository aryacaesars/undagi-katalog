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
import { useState, useMemo, useEffect } from "react";
import { useCartDB } from "@/lib/cart-db";
import { ShoppingCart } from "lucide-react";

export default function Navigasi() {
  const [isOpen, setIsOpen] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const { cartItems, getItemCount } = useCartDB();
  
  // Listen to cart update events
  useEffect(() => {
    const handleCartUpdate = (event) => {
      console.log('Cart update event received:', event.detail);
      setForceUpdate(prev => prev + 1); // Force re-render
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);
  
  // Use useMemo to ensure re-calculation when cartItems change
  const itemCount = useMemo(() => {
    return cartItems.reduce((count, item) => count + (item.quantity || 0), 0)
  }, [cartItems, forceUpdate]); // Add forceUpdate dependency

  console.log('Navbar render - cartItems:', cartItems.length, 'itemCount:', itemCount, 'forceUpdate:', forceUpdate);

  const navItems = [
    { name: "Beranda", link: "/" },
    { name: "Katalog", link: "#katalog" },
    { name: "Tentang Kami", link: "https://www.undagicorp.com/en" },  
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
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                  {itemCount > 99 ? '99+' : itemCount}
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
            <NavbarButton href="/keranjang" className="mt-4 flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4" />
              <span>Keranjang</span>
              {itemCount > 0 && (
                <span className="bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] ml-2">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </NavbarButton>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
