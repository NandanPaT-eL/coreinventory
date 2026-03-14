'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, User, Shield, Package, Warehouse, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, logout, getCurrentUser } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔍 Dashboard auth check started');
      console.log('Token from store:', token);
      console.log('User from store:', user);
      
      // Check localStorage directly as backup
      const localToken = localStorage.getItem('token');
      const localUser = localStorage.getItem('user');
      
      console.log('Token from localStorage:', localToken ? 'exists' : 'missing');
      console.log('User from localStorage:', localUser ? 'exists' : 'missing');
      
      // If no token anywhere, redirect to login
      if (!token && !localToken) {
        console.log('❌ No token found anywhere, redirecting to login');
        window.location.href = '/auth/login';
        return;
      }

      try {
        // If we have token but no user details, fetch them
        if ((token || localToken) && !userDetails) {
          console.log('📤 Fetching user details...');
          const userData = await getCurrentUser();
          console.log('📥 User data fetched:', userData);
          
          if (userData) {
            setUserDetails(userData);
          } else {
            // If fetch fails, token might be invalid
            console.log('❌ Failed to fetch user, token might be invalid');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            window.location.href = '/auth/login';
            return;
          }
        } else if (localUser && !userDetails) {
          // Use stored user if available
          setUserDetails(JSON.parse(localUser));
        }
      } catch (error) {
        console.error('❌ Error checking auth:', error);
        window.location.href = '/auth/login';
        return;
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [token, user, getCurrentUser]);

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!authChecked) {
    return null;
  }

  const displayName = userDetails?.name || user?.name || 'User';
  const displayEmail = userDetails?.email || user?.email || '';
  const displayRole = userDetails?.role || user?.role || 'staff';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="p-2 bg-blue-600 rounded-xl">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-slate-900">CoreInventory</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">
                <span className="font-medium">{displayName}</span> ({displayRole})
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="px-8 py-12">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {displayName}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              You're logged in as {displayRole}. Here's your inventory overview.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                Total
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">156</h3>
            <p className="text-sm text-slate-600 mt-1">Products in stock</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Warehouse className="h-6 w-6 text-amber-600" />
              </div>
              <span className="text-sm font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                Active
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">3</h3>
            <p className="text-sm text-slate-600 mt-1">Warehouses</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <ArrowRight className="h-6 w-6 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                Today
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">12</h3>
            <p className="text-sm text-slate-600 mt-1">Pending deliveries</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                Role
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 capitalize">{displayRole}</h3>
            <p className="text-sm text-slate-600 mt-1">Account type</p>
          </div>
        </div>

        {/* User Details Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Profile Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Name</label>
              <p className="text-lg font-semibold text-slate-900 mt-1">{displayName}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Email</label>
              <p className="text-lg font-semibold text-slate-900 mt-1">{displayEmail}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">User ID</label>
              <p className="text-sm font-mono text-slate-900 mt-1">{userDetails?.id || user?.id || 'N/A'}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status</label>
              <p className="text-lg font-semibold text-emerald-600 mt-1">✓ Active</p>
            </div>
          </div>
        </div>

        {/* Debug Info - Remove in production */}
        <div className="mt-8 p-4 bg-slate-100 rounded-lg">
          <p className="text-xs text-slate-500 font-mono">
            Auth Status: {isAuthenticated ? '✅' : '❌'} | 
            Token: {token ? '✅' : '❌'} | 
            User: {user ? '✅' : '❌'}
          </p>
        </div>
      </main>
    </div>
  );
}
