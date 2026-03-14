'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Shield, Menu, X, ArrowRight } from 'lucide-react';

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="mobile-menu-btn"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 8,
          color: '#374151',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Menu size={24} />
      </button>

      {open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            background: 'rgba(26,26,46,0.6)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '80vw',
              maxWidth: 320,
              height: '100%',
              background: 'white',
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, background: '#7C3AED', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={18} color="white" />
                </div>
                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: '#1a1a2e' }}>CoreInventory</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: 4 }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Links */}
            {['Features', 'Solutions', 'Pricing', 'About'].map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setOpen(false)}
                style={{
                  display: 'block',
                  padding: '16px 0',
                  borderBottom: '1px solid #F3F4F6',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: 17,
                  color: '#1a1a2e',
                  textDecoration: 'none',
                }}
              >
                {item}
              </a>
            ))}

            {/* Auth buttons */}
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Link
                href="/auth/login"
                onClick={() => setOpen(false)}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '14px',
                  border: '2px solid #EDE9FE',
                  borderRadius: 999,
                  fontWeight: 700,
                  fontSize: 15,
                  color: '#7C3AED',
                  textDecoration: 'none',
                }}
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '14px',
                  background: '#7C3AED',
                  borderRadius: 999,
                  fontWeight: 700,
                  fontSize: 15,
                  color: 'white',
                  textDecoration: 'none',
                }}
              >
                Get Started <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}