'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Mail, Lock, Eye, EyeOff, AlertCircle, Shield,
  User, ArrowLeft, Crown, Package, Truck, BarChart3, Warehouse,
  Check, X,
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

export default function SignupPage() {
  const { signup, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'manager',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [passwordScore, setPasswordScore] = useState(0);

  const rules = [
    { label: 'At least 8 characters', test: (p) => p.length >= 8 },
    { label: 'One uppercase letter (A–Z)', test: (p) => /[A-Z]/.test(p) },
    { label: 'One lowercase letter (a–z)', test: (p) => /[a-z]/.test(p) },
    { label: 'One number (0–9)', test: (p) => /\d/.test(p) },
    { label: 'One special character (!@#$…)', test: (p) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
  ];

  useEffect(() => {
    const score = rules.filter(r => r.test(formData.password)).length;
    setPasswordScore(score);
  }, [formData.password]);

  const isPasswordStrong = passwordScore === 5;

  const strengthConfig = [
    { label: 'Too weak',  color: '#EF4444', bg: '#FEF2F2', border: '#FCA5A5' },
    { label: 'Weak',      color: '#F97316', bg: '#FFF7ED', border: '#FDBA74' },
    { label: 'Fair',      color: '#EAB308', bg: '#FEFCE8', border: '#FDE047' },
    { label: 'Good',      color: '#84CC16', bg: '#F7FEE7', border: '#BEF264' },
    { label: 'Strong',    color: '#10B981', bg: '#ECFDF5', border: '#6EE7B7' },
  ];
  const currentStrength = strengthConfig[Math.max(0, passwordScore - 1)] || strengthConfig[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }
    if (!isPasswordStrong) {
      setError('Password must meet all 5 requirements before submitting');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!formData.agreeToTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }

    const result = await signup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    });

    if (!result?.success) {
      setError(result?.error || 'Signup failed');
    }
  };

  const roleDescriptions = {
    admin:   'Full access — warehouses, products, all operations, user management',
    manager: 'Manage products, receipts, deliveries, transfers & adjustments',
    staff:   'Perform picking, shelving, transfers & stock counts',
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Syne:wght@700;800&display=swap');
        .display-font { font-family: 'Syne', sans-serif; }

        .su-input {
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
        .su-input:focus  { border-color: #7C3AED; background: white; }
        .su-input::placeholder { color: #9CA3AF; }
        .su-input:disabled { opacity: 0.6; cursor: not-allowed; }
        .su-input-pr { padding-right: 48px; }

        .su-select {
          width: 100%; height: 52px;
          padding: 0 16px;
          background: #F9F7FF;
          border: 2px solid #EDE9FE;
          border-radius: 14px;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          color: #1a1a2e; outline: none;
          transition: border-color 0.2s, background 0.2s;
          appearance: none;
          cursor: pointer;
        }
        .su-select:focus { border-color: #7C3AED; background: white; }
        .su-select:disabled { opacity: 0.6; cursor: not-allowed; }

        .btn-signup {
          width: 100%; height: 52px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          background: #7C3AED; color: white; border: none;
          border-radius: 999px; font-size: 15px; font-weight: 700;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .btn-signup:hover:not(:disabled) {
          background: #6d28d9; transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(124,58,237,0.35);
        }
        .btn-signup:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

        .back-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 14px; font-weight: 600; color: #6B7280;
          text-decoration: none; margin-bottom: 20px; transition: color 0.2s;
        }
        .back-link:hover { color: #7C3AED; }

        .show-pwd-btn {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #9CA3AF; padding: 0; display: flex; align-items: center;
          transition: color 0.2s;
        }
        .show-pwd-btn:hover { color: #7C3AED; }

        .strength-bar-seg {
          flex: 1; height: 6px; border-radius: 999px;
          transition: background 0.35s ease;
        }

        .rule-row {
          display: flex; align-items: center; gap: 8px;
          font-size: 12px; font-weight: 500;
          transition: color 0.2s;
        }

        .role-option {
          flex: 1; padding: 12px 10px; border-radius: 14px;
          border: 2px solid #EDE9FE; background: #F9F7FF;
          cursor: pointer; transition: all 0.2s; text-align: center;
        }
        .role-option.active {
          border-color: #7C3AED; background: #F3F0FF;
        }
        .role-option:hover:not(.active) { border-color: #C4B5FD; }

        .feature-pill {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 999px; padding: 8px 16px;
          font-size: 13px; font-weight: 600; color: white;
          width: fit-content;
        }

        .stat-item {
          text-align: center; padding: 14px 10px;
          background: rgba(255,255,255,0.07);
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.1);
          flex: 1;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }

        .signup-grid {
          display: grid; grid-template-columns: 1fr 1fr; min-height: 100vh;
        }
        .signup-left { display: flex; flex-direction: column; }
        @media (max-width: 768px) {
          .signup-grid { grid-template-columns: 1fr; }
          .signup-left { display: none; }
        }
      `}</style>

      <div className="signup-grid">

        {/* ── LEFT PANEL ── */}
        <div className="signup-left" style={{ background: '#1a1a2e', padding: '48px 44px', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', width: 300, height: 300, background: '#7C3AED', borderRadius: '50% 60% 40% 70%/60% 40% 70% 50%', top: -80, right: -80, opacity: 0.22, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', width: 200, height: 200, background: '#FFD93D', borderRadius: '60% 40% 50% 70%/50% 60% 40% 55%', bottom: 40, left: -70, opacity: 0.15, pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 56 }}>
              <div style={{ width: 42, height: 42, background: '#7C3AED', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Shield size={22} color="white" />
              </div>
              <div>
                <span className="display-font" style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>CoreInventory</span>
                <span style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: -2 }}>Enterprise IMS</span>
              </div>
            </div>

            <h2 className="display-font" style={{ fontSize: 36, fontWeight: 800, color: 'white', lineHeight: 1.1, marginBottom: 14 }}>
              Start managing<br />
              <span style={{ color: '#FFD93D' }}>smarter</span> today
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: 32, maxWidth: 320 }}>
              Join thousands of inventory managers who replaced spreadsheets with a real-time, centralized system.
            </p>

            {/* Feature pills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 44 }}>
              {[
                { icon: <Package size={14} />, text: 'Products with SKU & categories' },
                { icon: <Truck size={14} />, text: 'Receipts, deliveries & transfers' },
                { icon: <Warehouse size={14} />, text: 'Multi-warehouse support' },
                { icon: <BarChart3 size={14} />, text: 'Stock ledger & real-time KPIs' },
              ].map(f => (
                <div key={f.text} className="feature-pill">
                  <span style={{ color: '#FFD93D', display: 'flex' }}>{f.icon}</span> {f.text}
                </div>
              ))}
            </div>

            {/* Role guide */}
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: '16px 18px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Role guide</p>
              {[
                { role: 'Admin', desc: 'Full system access + user management' },
                { role: 'Manager', desc: 'Products, operations & reports' },
                { role: 'Staff', desc: 'Picking, shelving & transfers' },
              ].map(r => (
                <div key={r.role} style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#FFD93D', minWidth: 56 }}>{r.role}</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{r.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ position: 'relative', zIndex: 1, marginTop: 32 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { icon: <Package size={15} />, value: '2,500+', label: 'Businesses' },
                { icon: <Warehouse size={15} />, value: '50K+', label: 'Products' },
                { icon: <BarChart3 size={15} />, value: '99.9%', label: 'Uptime' },
              ].map(s => (
                <div key={s.label} className="stat-item">
                  <div style={{ color: '#FFD93D', marginBottom: 5, display: 'flex', justifyContent: 'center' }}>{s.icon}</div>
                  <div className="display-font" style={{ fontSize: 18, fontWeight: 800, color: 'white', marginBottom: 2 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL — form ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 24px', background: '#FAFAFA', overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: 440, paddingBottom: 40 }}>

            <Link href="/auth/login" className="back-link">
              <ArrowLeft size={16} /> Back to sign in
            </Link>

            {/* Card */}
            <div style={{ background: 'white', borderRadius: 28, padding: '32px 30px', boxShadow: '0 24px 64px rgba(124,58,237,0.09)', border: '1px solid #EDE9FE' }}>

              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ width: 58, height: 58, background: '#F3F0FF', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', border: '2px solid #EDE9FE' }}>
                  <Crown size={26} color="#7C3AED" />
                </div>
                <h2 className="display-font" style={{ fontSize: 24, fontWeight: 800, color: '#1a1a2e', margin: '0 0 5px' }}>Create Account</h2>
                <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>Join CoreInventory to manage your stock</p>
              </div>

              {/* Error */}
              {error && (
                <div style={{ marginBottom: 18, padding: '13px 15px', background: '#FEF2F2', border: '1.5px solid #FCA5A5', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <AlertCircle size={17} color="#EF4444" style={{ flexShrink: 0 }} />
                  <p style={{ fontSize: 13, color: '#B91C1C', margin: 0, fontWeight: 500 }}>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>

                {/* Full Name */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 7 }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                      <User size={17} color="#9CA3AF" />
                    </div>
                    <input id="name" type="text" value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="su-input" placeholder="Enter your full name"
                      disabled={isLoading} required />
                  </div>
                </div>

                {/* Email */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 7 }}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                      <Mail size={17} color="#9CA3AF" />
                    </div>
                    <input id="email" type="email" value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="su-input" placeholder="Enter your email"
                      disabled={isLoading} required />
                  </div>
                </div>

                {/* Role selector */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 7 }}>Role</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['admin', 'manager', 'staff'].map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setFormData({ ...formData, role: r })}
                        className={`role-option${formData.role === r ? ' active' : ''}`}
                        disabled={isLoading}
                      >
                        <div className="display-font" style={{ fontSize: 13, fontWeight: 700, color: formData.role === r ? '#7C3AED' : '#374151', textTransform: 'capitalize', marginBottom: 2 }}>{r}</div>
                        <div style={{ fontSize: 10, color: formData.role === r ? '#7C3AED' : '#9CA3AF', fontWeight: 500, lineHeight: 1.4 }}>
                          {r === 'admin' ? 'Full access' : r === 'manager' ? 'Operations' : 'Field work'}
                        </div>
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 6 }}>{roleDescriptions[formData.role]}</p>
                </div>

                {/* Password */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 7 }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                      <Lock size={17} color="#9CA3AF" />
                    </div>
                    <input id="password" type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="su-input su-input-pr" placeholder="Create a secure password"
                      disabled={isLoading} required />
                    <button type="button" className="show-pwd-btn" onClick={() => setShowPassword(!showPassword)} disabled={isLoading}>
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>

                  {/* Strength indicator */}
                  {formData.password && (
                    <div style={{ marginTop: 10, padding: '14px', background: currentStrength.bg, border: `1.5px solid ${currentStrength.border}`, borderRadius: 14 }}>
                      {/* Bar */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>Password strength</span>
                        <span style={{ fontSize: 12, fontWeight: 800, color: currentStrength.color }}>{currentStrength.label}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className="strength-bar-seg"
                            style={{ background: i <= passwordScore ? currentStrength.color : '#E5E7EB' }} />
                        ))}
                      </div>
                      {/* Rules checklist */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px 12px' }}>
                        {rules.map(r => {
                          const passed = r.test(formData.password);
                          return (
                            <div key={r.label} className="rule-row" style={{ color: passed ? '#065F46' : '#6B7280' }}>
                              <div style={{ width: 16, height: 16, borderRadius: '50%', background: passed ? '#10B981' : '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s' }}>
                                {passed
                                  ? <Check size={10} color="white" strokeWidth={3} />
                                  : <X size={10} color="#9CA3AF" strokeWidth={3} />}
                              </div>
                              {r.label}
                            </div>
                          );
                        })}
                      </div>
                      {!isPasswordStrong && (
                        <p style={{ fontSize: 11, color: currentStrength.color, fontWeight: 600, marginTop: 10, marginBottom: 0 }}>
                          Complete all 5 requirements to enable sign up
                        </p>
                      )}
                      {isPasswordStrong && (
                        <p style={{ fontSize: 11, color: '#10B981', fontWeight: 700, marginTop: 10, marginBottom: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Check size={12} strokeWidth={3} /> Great password! You're good to go.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 7 }}>Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                      <Lock size={17} color="#9CA3AF" />
                    </div>
                    <input id="confirmPassword" type={showConfirm ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="su-input su-input-pr"
                      placeholder="Confirm your password"
                      disabled={isLoading} required />
                    <button type="button" className="show-pwd-btn" onClick={() => setShowConfirm(!showConfirm)} disabled={isLoading}>
                      {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {/* Match indicator */}
                  {formData.confirmPassword && (
                    <p style={{ fontSize: 12, marginTop: 5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5, color: formData.password === formData.confirmPassword ? '#10B981' : '#EF4444' }}>
                      {formData.password === formData.confirmPassword
                        ? <><Check size={12} strokeWidth={3} /> Passwords match</>
                        : <><X size={12} strokeWidth={3} /> Passwords do not match</>}
                    </p>
                  )}
                </div>

                {/* Terms */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20 }}>
                  <div
                    onClick={() => !isLoading && setFormData({ ...formData, agreeToTerms: !formData.agreeToTerms })}
                    style={{
                      width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
                      border: `2px solid ${formData.agreeToTerms ? '#7C3AED' : '#D1D5DB'}`,
                      background: formData.agreeToTerms ? '#7C3AED' : 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {formData.agreeToTerms && <Check size={12} color="white" strokeWidth={3} />}
                  </div>
                  <label style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5, cursor: 'pointer' }}
                    onClick={() => !isLoading && setFormData({ ...formData, agreeToTerms: !formData.agreeToTerms })}>
                    I agree to the{' '}
                    <a href="#" style={{ color: '#7C3AED', fontWeight: 600, textDecoration: 'none' }}>Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" style={{ color: '#7C3AED', fontWeight: 600, textDecoration: 'none' }}>Privacy Policy</a>
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading || !isPasswordStrong || !formData.agreeToTerms}
                  className="btn-signup"
                >
                  {isLoading ? (
                    <>
                      <svg className="spin" width="17" height="17" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    <><Shield size={16} /> Create Account</>
                  )}
                </button>

                {!isPasswordStrong && formData.password && (
                  <p style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF', marginTop: 10, marginBottom: 0 }}>
                    Meet all password requirements to enable this button
                  </p>
                )}
              </form>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
                <div style={{ flex: 1, height: 1, background: '#F3F4F6' }} />
                <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>Already have an account?</span>
                <div style={{ flex: 1, height: 1, background: '#F3F4F6' }} />
              </div>

              <Link href="/auth/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 48, border: '2px solid #EDE9FE', borderRadius: 999, fontSize: 14, fontWeight: 700, color: '#7C3AED', textDecoration: 'none', transition: 'all 0.2s' }}>
                Sign in instead
              </Link>
            </div>

            <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: '#9CA3AF' }}>
              Protected by enterprise-grade security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}