'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  Warehouse, 
  History, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Receipt,
  ArrowRightLeft,
  Scale,
  Users,
  BarChart3,
  AlertCircle
} from 'lucide-react';
import Badge from '../ui/Badge';

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { 
      section: 'Main',
      items: [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, match: '/dashboard' },
      ]
    },
    {
      section: 'Inventory',
      items: [
        { href: '/products', label: 'Products', icon: Package, match: '/products', badge: '156' },
        { href: '/warehouses', label: 'Warehouses', icon: Warehouse, match: '/warehouses', badge: '3' },
      ]
    },
    {
      section: 'Operations',
      items: [
        { href: '/operations/receipts', label: 'Receipts', icon: Receipt, match: '/operations/receipts', badge: '5' },
        { href: '/operations/deliveries', label: 'Deliveries', icon: Truck, match: '/operations/deliveries', badge: '8' },
        { href: '/operations/transfers', label: 'Transfers', icon: ArrowRightLeft, match: '/operations/transfers', badge: '3' },
        { href: '/operations/adjustments', label: 'Adjustments', icon: Scale, match: '/operations/adjustments' },
      ]
    },
    {
      section: 'Analytics',
      items: [
        { href: '/move-history', label: 'Stock Ledger', icon: History, match: '/move-history' },
        { href: '/reports', label: 'Reports', icon: BarChart3, match: '/reports' },
      ]
    },
    {
      section: 'Settings',
      items: [
        { href: '/settings/warehouses', label: 'Warehouses', icon: Warehouse, match: '/settings/warehouses' },
        { href: '/settings/profile', label: 'Profile', icon: Users, match: '/settings/profile' },
        { href: '/settings', label: 'Settings', icon: Settings, match: '/settings' },
      ]
    }
  ];

  const isActive = (href, match) => {
    if (match === '/dashboard') return pathname === href;
    return pathname.startsWith(match);
  };

  return (
    <aside 
      className={`bg-white border-r border-[#F3F0FF] h-[calc(100vh-64px)] sticky top-16 transition-all duration-300 hidden lg:block ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 w-6 h-6 bg-white border border-[#EDE9FE] rounded-full flex items-center justify-center text-[#6B7280] hover:text-[#7C3AED] hover:border-[#7C3AED] transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Navigation */}
      <nav className="p-4 overflow-y-auto h-full">
        {navItems.map((section) => (
          <div key={section.section} className="mb-6">
            {!collapsed && (
              <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3 px-3">
                {section.section}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href, item.match);
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      active 
                        ? 'bg-[#F3F0FF] text-[#7C3AED]' 
                        : 'text-[#6B7280] hover:bg-[#F9F7FF] hover:text-[#7C3AED]'
                    } ${collapsed ? 'justify-center' : ''}`}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-sm font-medium">{item.label}</span>
                        {item.badge && (
                          <Badge variant="purple" className="text-xs px-2 py-0.5">
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                    {collapsed && item.badge && (
                      <span className="absolute top-0 right-0 w-4 h-4 bg-[#7C3AED] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Low Stock Alert - Special Item */}
        <div className="mt-auto pt-4">
          <Link
            href="/products?filter=low-stock"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <AlertCircle size={20} />
            {!collapsed && (
              <>
                <span className="flex-1 text-sm font-medium">Low Stock Alert</span>
                <Badge variant="warning" className="text-xs">12</Badge>
              </>
            )}
          </Link>
        </div>
      </nav>
    </aside>
  );
}
