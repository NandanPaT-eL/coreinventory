'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Mail, Lock, Eye, EyeOff, AlertCircle, Shield, 
  User, CheckCircle, ArrowLeft, Crown 
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

export default function SignupPage() {
  const router = useRouter();
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
  const [error, setError] = useState('');
  const [passwordScore, setPasswordScore] = useState(0);

  useEffect(() => {
    let score = 0;
    const password = formData.password;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;
    setPasswordScore(score);
  }, [formData.password]);

  const getPasswordStrength = () => {
    if (passwordScore <= 1) return { text: 'Very weak', color: 'bg-red-500', textColor: 'text-red-700', bg: 'bg-red-50' };
    if (passwordScore <= 2) return { text: 'Weak', color: 'bg-orange-500', textColor: 'text-orange-700', bg: 'bg-orange-50' };
    if (passwordScore <= 3) return { text: 'Fair', color: 'bg-yellow-500', textColor: 'text-yellow-700', bg: 'bg-yellow-50' };
    if (passwordScore <= 4) return { text: 'Good', color: 'bg-green-400', textColor: 'text-green-700', bg: 'bg-green-50' };
    return { text: 'Strong', color: 'bg-green-600', textColor: 'text-green-800', bg: 'bg-green-100' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
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

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-md">
        <Link 
          href="/auth/login" 
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to sign in
        </Link>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-100/50 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl mb-4 border border-blue-100">
              <Crown className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
            <p className="text-slate-600">Join CoreInventory to manage your stock</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-800">Registration Error</p>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-12 pr-4 w-full h-14 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-0 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder-slate-400"
                  placeholder="Enter your full name"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="group">
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-12 pr-4 w-full h-14 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-0 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder-slate-400"
                  placeholder="Enter your email"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="group">
              <label htmlFor="role" className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                Role
              </label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full h-14 px-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-0 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
                disabled={isLoading}
              >
                <option value="manager">Manager</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="group">
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-12 pr-12 w-full h-14 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-0 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder-slate-400"
                  placeholder="Create a secure password"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                  )}
                </button>
              </div>

              {formData.password && (
                <div className={`mt-4 p-4 rounded-xl ${strength.bg} border ${strength.textColor.replace('text-', 'border-')}/20`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Password Strength</span>
                    <span className={`text-sm font-semibold ${strength.textColor}`}>
                      {strength.text}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-500`}
                      style={{ width: `${(passwordScore / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="group">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="pl-12 pr-4 w-full h-14 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-0 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder-slate-400"
                  placeholder="Confirm your password"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="flex items-start">
              <input
                id="agreeTerms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                className="h-5 w-5 mt-0.5 text-blue-600 focus:ring-blue-500 border-slate-300 rounded transition-colors cursor-pointer"
                disabled={isLoading}
                required
              />
              <label htmlFor="agreeTerms" className="ml-3 block text-sm text-slate-700 cursor-pointer">
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || passwordScore < 3}
              className="w-full h-14 flex items-center justify-center rounded-xl shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 relative overflow-hidden group bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000"></div>
              
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-white font-semibold">Creating Account...</span>
                </>
              ) : (
                <span className="text-white font-semibold text-lg relative flex items-center justify-center">
                  <Shield className="inline h-5 w-5 mr-2 -mt-1" />
                  Create Account
                </span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="text-slate-600">
              Already have an account?{' '}
              <Link 
                href="/auth/login" 
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
