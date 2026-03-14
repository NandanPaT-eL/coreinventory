'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, AlertCircle, CheckCircle, Shield, Send, Lock } from 'lucide-react';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (email) {
        setIsSubmitted(true);
      } else {
        setError('Please enter your email address');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Syne:wght@700;800&display=swap');
        .display-font { font-family: 'Syne', sans-serif; }

        .rp-input {
          width: 100%;
          height: 52px;
          padding: 0 16px 0 48px;
          background: #F9F7FF;
          border: 2px solid #EDE9FE;
          border-radius: 14px;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          color: #1a1a2e;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .rp-input:focus { border-color: #7C3AED; background: white; }
        .rp-input::placeholder { color: #9CA3AF; }
        .rp-input:disabled { opacity: 0.6; cursor: not-allowed; }

        .rp-input-plain {
          width: 100%;
          height: 52px;
          padding: 0 16px;
          background: #F9F7FF;
          border: 2px solid #EDE9FE;
          border-radius: 14px;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          color: #1a1a2e;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .rp-input-plain:focus { border-color: #7C3AED; background: white; }
        .rp-input-plain::placeholder { color: #9CA3AF; }

        .rp-otp-input {
          width: 100%;
          height: 64px;
          text-align: center;
          font-size: 28px;
          letter-spacing: 0.4em;
          font-family: 'Courier New', monospace;
          font-weight: 700;
          background: #F9F7FF;
          border: 2px solid #EDE9FE;
          border-radius: 14px;
          color: #7C3AED;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .rp-otp-input:focus { border-color: #7C3AED; background: white; }

        .btn-purple {
          width: 100%;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #7C3AED;
          color: white;
          border: none;
          border-radius: 999px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .btn-purple:hover:not(:disabled) {
          background: #6d28d9;
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(124,58,237,0.35);
        }
        .btn-purple:disabled { opacity: 0.65; cursor: not-allowed; }

        .btn-green {
          width: 100%;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #10B981;
          color: white;
          border: none;
          border-radius: 999px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .btn-green:hover {
          background: #059669;
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(16,185,129,0.3);
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          color: #6B7280;
          text-decoration: none;
          margin-bottom: 28px;
          transition: color 0.2s;
        }
        .back-link:hover { color: #7C3AED; }

        .resend-btn {
          background: none;
          border: none;
          font-size: 14px;
          font-weight: 600;
          color: #7C3AED;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          padding: 0;
          transition: color 0.2s;
        }
        .resend-btn:hover { color: #6d28d9; text-decoration: underline; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 20px' }}>
        <div style={{ width: '100%', maxWidth: 440 }}>

          <Link href="/auth/login" className="back-link">
            <ArrowLeft size={16} /> Back to sign in
          </Link>

          {/* Card */}
          <div style={{ background: 'white', borderRadius: 28, padding: '36px 32px', boxShadow: '0 24px 64px rgba(124,58,237,0.1)', border: '1px solid #EDE9FE' }}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ width: 64, height: 64, background: '#F3F0FF', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '2px solid #EDE9FE' }}>
                <Shield size={30} color="#7C3AED" />
              </div>
              <h2 className="display-font" style={{ fontSize: 26, fontWeight: 800, color: '#1a1a2e', margin: '0 0 6px' }}>
                Reset Password
              </h2>
              <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>
                {isSubmitted ? 'Check your email for the OTP' : 'Enter your email to receive an OTP'}
              </p>
            </div>

            {/* Success banner */}
            {isSubmitted && (
              <div style={{ marginBottom: 24, padding: '20px', background: '#ECFDF5', border: '1.5px solid #6EE7B7', borderRadius: 16, textAlign: 'center' }}>
                <div style={{ width: 44, height: 44, background: '#D1FAE5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <CheckCircle size={22} color="#10B981" />
                </div>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#065F46', margin: '0 0 4px' }}>OTP Sent Successfully!</p>
                <p style={{ fontSize: 13, color: '#047857', margin: 0 }}>
                  Sent to <strong>{email}</strong> — check your inbox & spam
                </p>
              </div>
            )}

            {/* Error banner */}
            {error && !isSubmitted && (
              <div style={{ marginBottom: 20, padding: '14px 16px', background: '#FEF2F2', border: '1.5px solid #FCA5A5', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                <AlertCircle size={18} color="#EF4444" style={{ flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: '#B91C1C', margin: 0, fontWeight: 500 }}>{error}</p>
              </div>
            )}

            {/* Step 1 — email form */}
            {!isSubmitted ? (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 20 }}>
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="rp-input"
                      placeholder="Enter your email"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 6 }}>
                    We'll send a one-time password to this email
                  </p>
                </div>

                <button type="submit" disabled={isLoading} className="btn-purple">
                  {isLoading ? (
                    <>
                      <svg className="spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <Send size={17} /> Send OTP
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Step 2 — OTP + new password */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>
                    Enter OTP
                  </label>
                  <input
                    id="otp"
                    type="text"
                    maxLength="6"
                    className="rp-otp-input"
                    placeholder="······"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>
                    New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                      <Lock size={18} color="#9CA3AF" />
                    </div>
                    <input
                      id="newPassword"
                      type="password"
                      className="rp-input"
                      placeholder="Enter new password"
                    />
                  </div>
                </div>

                <button type="button" className="btn-green">
                  <CheckCircle size={17} /> Reset Password
                </button>

                <div style={{ textAlign: 'center' }}>
                  <button type="button" onClick={() => setIsSubmitted(false)} className="resend-btn">
                    Didn't receive OTP? Resend
                  </button>
                </div>
              </div>
            )}

            {/* Footer note */}
            <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Lock size={12} color="#9CA3AF" />
              <span style={{ fontSize: 12, color: '#9CA3AF' }}>OTP will expire in 10 minutes</span>
            </div>
          </div>

          {/* Sign in link */}
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6B7280' }}>
            Remembered your password?{' '}
            <Link href="/auth/login" style={{ color: '#7C3AED', fontWeight: 700, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}