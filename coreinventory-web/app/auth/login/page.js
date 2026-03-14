'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Shield, ArrowLeft, CheckCircle, Package, Warehouse, TrendingUp } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccessMessage('Account created successfully! Please sign in.');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }
    const result = await login(formData.email, formData.password);
    if (!result?.success) {
      setError(result?.error || 'Login failed');
    }
  };

  const stats = [
    { icon: <Package size={16} />, value: '2,500+', label: 'Businesses' },
    { icon: <Warehouse size={16} />, value: '50K+', label: 'Products tracked' },
    { icon: <TrendingUp size={16} />, value: '99.9%', label: 'Uptime' },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Syne:wght@700;800&display=swap');
        .display-font { font-family: 'Syne', sans-serif; }

        .login-input {
          width: 100%; height: 52px;
          padding: 0 16px 0 48px;
          background: #F9F7FF;
          border: 2px solid #EDE9FE;
          border-radius: 14px;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          color: #1a1a2e; outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .login-input:focus { border-color: #7C3AED; background: white; }
        .login-input::placeholder { color: #9CA3AF; }
        .login-input:disabled { opacity: 0.6; cursor: not-allowed; }
        .login-input-pr { padding-right: 48px; }

        .btn-login {
          width: 100%; height: 52px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          background: #7C3AED; color: white; border: none;
          border-radius: 999px; font-size: 15px; font-weight: 700;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .btn-login:hover:not(:disabled) {
          background: #6d28d9; transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(124,58,237,0.35);
        }
        .btn-login:disabled { opacity: 0.65; cursor: not-allowed; }

        .back-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 14px; font-weight: 600; color: #6B7280;
          text-decoration: none; margin-bottom: 24px; transition: color 0.2s;
        }
        .back-link:hover { color: #7C3AED; }

        .show-pwd-btn {
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #9CA3AF; padding: 0; display: flex; align-items: center;
          transition: color 0.2s;
        }
        .show-pwd-btn:hover { color: #7C3AED; }

        .forgot-link {
          font-size: 13px; font-weight: 600; color: #7C3AED;
          text-decoration: none; transition: color 0.2s;
        }
        .forgot-link:hover { color: #6d28d9; text-decoration: underline; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }

        .feature-pill {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 999px; padding: 8px 16px;
          font-size: 13px; font-weight: 600; color: white;
        }

        .stat-item {
          text-align: center;
          padding: 16px 12px;
          background: rgba(255,255,255,0.08);
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.12);
          flex: 1;
        }

        /* responsive */
        .login-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
        }
        .login-left { display: flex; flex-direction: column; }
        @media (max-width: 768px) {
          .login-grid { grid-template-columns: 1fr; }
          .login-left  { display: none; }
        }
      `}</style>

      <div className="login-grid">

        {/* ── LEFT PANEL — brand / info ── */}
        <div className="login-left" style={{ background: '#1a1a2e', padding: '48px 44px', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
          {/* bg blobs */}
          <div style={{ position: 'absolute', width: 300, height: 300, background: '#7C3AED', borderRadius: '50% 60% 40% 70% / 60% 40% 70% 50%', top: -80, right: -80, opacity: 0.25, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', width: 180, height: 180, background: '#FFD93D', borderRadius: '60% 40% 50% 70% / 50% 60% 40% 55%', bottom: 60, left: -60, opacity: 0.18, pointerEvents: 'none' }} />

          {/* Logo */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 64 }}>
              <div style={{ width: 42, height: 42, background: '#7C3AED', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Shield size={22} color="white" />
              </div>
              <div>
                <span className="display-font" style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>CoreInventory</span>
                <span style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: -2 }}>Enterprise IMS</span>
              </div>
            </div>

            <h2 className="display-font" style={{ fontSize: 38, fontWeight: 800, color: 'white', lineHeight: 1.1, marginBottom: 16 }}>
              Manage your<br />
              <span style={{ color: '#FFD93D' }}>inventory</span><br />
              with confidence
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 36, maxWidth: 340 }}>
              Replace manual registers and Excel sheets with a centralized, real-time system trusted by thousands of businesses.
            </p>

            {/* Feature pills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 48 }}>
              {[
                { icon: '📦', text: 'Multi-warehouse stock tracking' },
                { icon: '📋', text: 'Receipts, deliveries & transfers' },
                { icon: '🔔', text: 'Low stock alerts & reorder rules' },
                { icon: '📊', text: 'Real-time dashboard & ledger' },
              ].map(f => (
                <div key={f.text} className="feature-pill" style={{ width: 'fit-content' }}>
                  <span style={{ fontSize: 15 }}>{f.icon}</span> {f.text}
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              {stats.map(s => (
                <div key={s.label} className="stat-item">
                  <div style={{ color: '#FFD93D', marginBottom: 6, display: 'flex', justifyContent: 'center' }}>{s.icon}</div>
                  <div className="display-font" style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 2 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL — form ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: '#FAFAFA', minHeight: '100vh' }}>
          <div style={{ width: '100%', maxWidth: 420 }}>

            <Link href="/" className="back-link">
              <ArrowLeft size={16} /> Back to home
            </Link>

            {/* Card */}
            <div style={{ background: 'white', borderRadius: 28, padding: '36px 32px', boxShadow: '0 24px 64px rgba(124,58,237,0.09)', border: '1px solid #EDE9FE' }}>

              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{ width: 60, height: 60, background: '#F3F0FF', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', border: '2px solid #EDE9FE' }}>
                  <Shield size={28} color="#7C3AED" />
                </div>
                <h2 className="display-font" style={{ fontSize: 24, fontWeight: 800, color: '#1a1a2e', margin: '0 0 6px' }}>Welcome Back</h2>
                <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>Sign in to your inventory dashboard</p>
              </div>

              {/* Success */}
              {successMessage && (
                <div style={{ marginBottom: 20, padding: '14px 16px', background: '#ECFDF5', border: '1.5px solid #6EE7B7', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CheckCircle size={18} color="#10B981" style={{ flexShrink: 0 }} />
                  <p style={{ fontSize: 13, color: '#065F46', margin: 0, fontWeight: 500 }}>{successMessage}</p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div style={{ marginBottom: 20, padding: '14px 16px', background: '#FEF2F2', border: '1.5px solid #FCA5A5', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <AlertCircle size={18} color="#EF4444" style={{ flexShrink: 0 }} />
                  <p style={{ fontSize: 13, color: '#B91C1C', margin: 0, fontWeight: 500 }}>{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {/* Email */}
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                      <Mail size={18} color="#9CA3AF" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="login-input"
                      placeholder="Enter your email"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>Password</label>
                    <Link href="/auth/reset-password" className="forgot-link">Forgot password?</Link>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                      <Lock size={18} color="#9CA3AF" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="login-input login-input-pr"
                      placeholder="••••••••"
                      disabled={isLoading}
                      required
                    />
                    <button type="button" className="show-pwd-btn" onClick={() => setShowPassword(!showPassword)} disabled={isLoading}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: 24 }} />

                <button type="submit" disabled={isLoading} className="btn-login">
                  {isLoading ? (
                    <>
                      <svg className="spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Signing In...
                    </>
                  ) : 'Sign In'}
                </button>
              </form>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
                <div style={{ flex: 1, height: 1, background: '#F3F4F6' }} />
                <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>New to CoreInventory?</span>
                <div style={{ flex: 1, height: 1, background: '#F3F4F6' }} />
              </div>

              <Link
                href="/auth/signup"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 48, border: '2px solid #EDE9FE', borderRadius: 999, fontSize: 14, fontWeight: 700, color: '#7C3AED', textDecoration: 'none', transition: 'all 0.2s', background: 'transparent' }}
                onMouseEnter={undefined}
              >
                Create an account
              </Link>
            </div>

            <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#9CA3AF' }}>
              Protected by enterprise-grade security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Suspense wrapper — fixes useSearchParams() build error ──
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #EDE9FE', borderTopColor: '#7C3AED', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ fontSize: 14, color: '#9CA3AF', fontFamily: 'DM Sans, sans-serif' }}>Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}