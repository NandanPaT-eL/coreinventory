'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { 
  Shield, 
  Bell, 
  User, 
  ChevronDown, 
  LogOut, 
  Settings,
  Menu,
  X,
  Search,
  Package,
  Truck,
  Warehouse as WarehouseIcon
} from 'lucide-react';
import MobileNav from './MobileNav';  // This is correct - MobileNav is in the same directory
import Badge from '../ui/Badge';

export default function Topbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const displayName = user?.name || 'User';
  const displayRole = user?.role || 'staff';
  const userInitial = displayName.charAt(0).toUpperCase();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.profile-menu') && !e.target.closest('.notifications-menu')) {
        setProfileOpen(false);
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Get page title from pathname
  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname.includes('/products')) return 'Products';
    if (pathname.includes('/warehouses')) return 'Warehouses';
    if (pathname.includes('/operations/receipts')) return 'Receipts';
    if (pathname.includes('/operations/deliveries')) return 'Deliveries';
    if (pathname.includes('/operations/transfers')) return 'Transfers';
    if (pathname.includes('/operations/adjustments')) return 'Adjustments';
    if (pathname.includes('/move-history')) return 'Stock Ledger';
    if (pathname.includes('/settings')) return 'Settings';
    return 'CoreInventory';
  };

  return (
    <header className="bg-white border-b border-[#F3F0FF] sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Page Title */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <MobileNav />
            </div>

            {/* Logo - Hidden on mobile */}
            <Link href="/dashboard" className="hidden lg:flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#7C3AED] to-[#9f67ff] rounded-lg flex items-center justify-center">
                <Shield size={18} className="text-white" />
              </div>
              <span className="display-font text-lg font-extrabold text-[#1a1a2e]">
                CoreInventory
              </span>
            </Link>

            {/* Page Title */}
            <div className="hidden md:block">
              <h1 className="display-font text-xl font-bold text-[#1a1a2e]">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search products, receipts, warehouses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#F9F7FF] border border-[#EDE9FE] rounded-full text-sm focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Search Toggle - Mobile */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 text-[#6B7280] hover:text-[#7C3AED] hover:bg-[#F3F0FF] rounded-full transition-colors"
            >
              <Search size={20} />
            </button>

            {/* Notifications */}
            <div className="relative notifications-menu">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setNotificationsOpen(!notificationsOpen);
                  setProfileOpen(false);
                }}
                className="p-2 text-[#6B7280] hover:text-[#7C3AED] hover:bg-[#F3F0FF] rounded-full transition-colors relative"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#FFD93D] rounded-full"></span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-lg border border-[#EDE9FE] overflow-hidden z-50">
                  <div className="p-4 border-b border-[#F3F0FF] bg-[#F9F7FF]">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-[#1a1a2e]">Notifications</h3>
                      <Badge variant="purple" className="text-xs">3 new</Badge>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {[
                      { title: 'Low Stock Alert', desc: 'Steel Rods is running low (12 units left)', time: '5 min ago', color: 'text-amber-600' },
                      { title: 'Delivery Completed', desc: 'Order #INV-2024-042 has been delivered', time: '2 hours ago', color: 'text-emerald-600' },
                      { title: 'Warehouse Transfer', desc: 'Transfer #TR-123 from Main to North completed', time: 'Yesterday', color: 'text-blue-600' },
                    ].map((notif, idx) => (
                      <div key={idx} className="p-4 hover:bg-[#F9F7FF] transition-colors border-b border-[#F3F0FF] last:border-0">
                        <p className={`text-sm font-semibold ${notif.color} mb-1`}>{notif.title}</p>
                        <p className="text-xs text-[#6B7280] mb-2">{notif.desc}</p>
                        <p className="text-xs text-[#9CA3AF]">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-[#F3F0FF] text-center bg-[#F9F7FF]">
                    <button className="text-xs font-semibold text-[#7C3AED] hover:text-[#6d28d9]">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative profile-menu">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileOpen(!profileOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-[#F3F0FF] transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#7C3AED] to-[#9f67ff] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {userInitial}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-[#1a1a2e]">{displayName}</p>
                  <p className="text-xs text-[#6B7280] capitalize">{displayRole}</p>
                </div>
                <ChevronDown size={16} className="text-[#6B7280] hidden md:block" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-[#EDE9FE] overflow-hidden z-50">
                  <div className="p-4 border-b border-[#F3F0FF] bg-[#F9F7FF]">
                    <p className="text-sm font-semibold text-[#1a1a2e]">{displayName}</p>
                    <p className="text-xs text-[#6B7280]">{user?.email}</p>
                    <Badge variant="purple" className="mt-2 text-xs capitalize">{displayRole}</Badge>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/settings/profile"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-[#374151] hover:bg-[#F3F0FF] rounded-xl transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <User size={16} className="text-[#6B7280]" />
                      <span>Your Profile</span>
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-[#374151] hover:bg-[#F3F0FF] rounded-xl transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Settings size={16} className="text-[#6B7280]" />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <LogOut size={16} />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar - Collapsible */}
        {searchOpen && (
          <div className="md:hidden py-3 border-t border-[#F3F0FF]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#F9F7FF] border border-[#EDE9FE] rounded-full text-sm focus:outline-none focus:border-[#7C3AED] focus:bg-white"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
