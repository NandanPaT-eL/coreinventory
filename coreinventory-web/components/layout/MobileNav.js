'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Menu, X, ArrowRight, LayoutDashboard, Package, Warehouse, Truck, History, Settings } from 'lucide-react';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/products', label: 'Products', icon: Package },
    { href: '/warehouses', label: 'Warehouses', icon: Warehouse },
    { href: '/operations/receipts', label: 'Receipts', icon: Truck },
    { href: '/operations/deliveries', label: 'Deliveries', icon: Truck },
    { href: '/move-history', label: 'Stock Ledger', icon: History },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (href) => {
    if (href === '/dashboard') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-[#6B7280] hover:text-[#7C3AED] hover:bg-[#F3F0FF] rounded-lg transition-colors"
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        >
          {/* Sidebar */}
          <div
            className="fixed top-0 left-0 h-full w-64 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#F3F0FF]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#7C3AED] to-[#9f67ff] rounded-lg flex items-center justify-center">
                  <Shield size={18} className="text-white" />
                </div>
                <span className="display-font text-lg font-extrabold text-[#1a1a2e]">
                  CoreInventory
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-[#6B7280] hover:text-[#7C3AED] hover:bg-[#F3F0FF] rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="p-4">
              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                        active 
                          ? 'bg-[#F3F0FF] text-[#7C3AED]' 
                          : 'text-[#6B7280] hover:bg-[#F9F7FF] hover:text-[#7C3AED]'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="text-sm font-medium">{item.label}</span>
                      {active && (
                        <ArrowRight size={16} className="ml-auto text-[#7C3AED]" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#F3F0FF]">
              <Link
                href="/auth/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center py-2.5 text-sm font-semibold text-[#7C3AED] border-2 border-[#7C3AED] rounded-xl hover:bg-[#7C3AED] hover:text-white transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
