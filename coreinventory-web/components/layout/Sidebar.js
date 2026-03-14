'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Shield, LayoutDashboard, Package, Truck,
  ArrowLeftRight, ClipboardList, History,
  Settings, Warehouse, User, LogOut, ChevronDown, ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const NAV = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard size={18} />,
  },
  {
    label: 'Products',
    href: '/products',
    icon: <Package size={18} />,
  },
  {
    label: 'Operations',
    icon: <Truck size={18} />,
    children: [
      { label: 'Receipts',     href: '/operations/receipts' },
      { label: 'Deliveries',   href: '/operations/deliveries' },
      { label: 'Transfers',    href: '/operations/transfers' },
      { label: 'Adjustments',  href: '/operations/adjustments' },
    ],
  },
  {
    label: 'Move History',
    href: '/move-history',
    icon: <History size={18} />,
  },
  {
    label: 'Settings',
    icon: <Settings size={18} />,
    children: [
      { label: 'Warehouses', href: '/settings/warehouses', icon: <Warehouse size={14} /> },
      { label: 'Profile',    href: '/settings/profile',   icon: <User size={14} /> },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [openGroups, setOpenGroups] = useState({ Operations: true, Settings: false });

  const toggleGroup = (label) =>
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));

  const isActive = (href) =>
    href === '/dashboard' ? pathname === href : pathname.startsWith(href);

  const isGroupActive = (children) =>
    children?.some((c) => pathname.startsWith(c.href));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Syne:wght@700;800&display=swap');
        .sidebar-root {
          width: 240px; min-height: 100vh; flex-shrink: 0;
          background: #1a1a2e;
          display: flex; flex-direction: column;
          border-right: 1px solid rgba(255,255,255,0.06);
        }
        .sidebar-logo {
          padding: 24px 20px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: center; gap: 10px;
        }
        .sidebar-logo-icon {
          width: 36px; height: 36px; background: #7C3AED;
          border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .sidebar-nav { flex: 1; padding: 16px 12px; overflow-y: auto; }
        .nav-section-label {
          font-size: 10px; font-weight: 700; letter-spacing: 0.08em;
          color: rgba(255,255,255,0.25); text-transform: uppercase;
          padding: 0 8px; margin: 16px 0 6px;
        }
        .nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 12px; border-radius: 10px;
          font-size: 14px; font-weight: 500;
          color: rgba(255,255,255,0.55);
          text-decoration: none; cursor: pointer;
          transition: background 0.15s, color 0.15s;
          margin-bottom: 2px; border: none; background: none;
          width: 100%; text-align: left;
        }
        .nav-item:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.9); }
        .nav-item.active {
          background: rgba(124,58,237,0.18); color: white;
          font-weight: 600;
        }
        .nav-item.active .nav-dot { background: #7C3AED; }
        .nav-item.group-active { color: rgba(255,255,255,0.8); }
        .nav-child {
          display: flex; align-items: center; gap: 8px;
          padding: 7px 12px 7px 34px; border-radius: 8px;
          font-size: 13px; font-weight: 500;
          color: rgba(255,255,255,0.45);
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
          margin-bottom: 1px;
        }
        .nav-child:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.8); }
        .nav-child.active { color: #A78BFA; font-weight: 600; }
        .nav-icon { color: inherit; flex-shrink: 0; }
        .sidebar-footer {
          padding: 16px 12px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .user-card {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 10px;
          background: rgba(255,255,255,0.04);
          margin-bottom: 8px;
        }
        .user-avatar {
          width: 32px; height: 32px; border-radius: '50%';
          background: #7C3AED; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; color: white; flex-shrink: 0;
        }
        .logout-btn {
          display: flex; align-items: center; gap: 8px;
          width: 100%; padding: 8px 12px; border-radius: 8px;
          background: none; border: none; cursor: pointer;
          font-size: 13px; font-weight: 500;
          color: rgba(255,255,255,0.4);
          transition: background 0.15s, color 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .logout-btn:hover { background: rgba(239,68,68,0.12); color: #FCA5A5; }
        .role-badge {
          font-size: 10px; font-weight: 700; padding: 2px 8px;
          border-radius: 999px; text-transform: capitalize;
          background: rgba(124,58,237,0.25); color: #C4B5FD;
        }
      `}</style>

      <aside className="sidebar-root" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Shield size={18} color="white" />
          </div>
          <div>
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 800, color: 'white' }}>
              CoreInventory
            </span>
            <span style={{ display: 'block', fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: -1 }}>
              Enterprise IMS
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">Main</div>

          {NAV.map((item) => {
            if (!item.children) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item${isActive(item.href) ? ' active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </Link>
              );
            }

            const groupOpen   = openGroups[item.label];
            const groupActive = isGroupActive(item.children);

            return (
              <div key={item.label}>
                <button
                  className={`nav-item${groupActive ? ' group-active' : ''}`}
                  onClick={() => toggleGroup(item.label)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {groupOpen
                    ? <ChevronDown size={14} style={{ opacity: 0.5 }} />
                    : <ChevronRight size={14} style={{ opacity: 0.5 }} />}
                </button>

                {groupOpen && (
                  <div style={{ marginBottom: 4 }}>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`nav-child${isActive(child.href) ? ' active' : ''}`}
                      >
                        {child.icon && <span style={{ opacity: 0.7 }}>{child.icon}</span>}
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          {user && (
            <div className="user-card">
              <div className="user-avatar">
                {user.name?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'white', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name}
                </p>
                <span className="role-badge">{user.role}</span>
              </div>
            </div>
          )}
          <button className="logout-btn" onClick={logout}>
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>
    </>
  );
}