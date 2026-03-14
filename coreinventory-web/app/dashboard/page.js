'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import { useWarehouses } from '../../hooks/useWarehouses';
import { LogOut, User, Shield, Package, Warehouse, ArrowRight, Building, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, getCurrentUser } = useAuth();
  const { warehouses, loading: warehousesLoading, fetchWarehouses } = useWarehouses();
  
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalWarehouses: 0,
    activeWarehouses: 0,
    totalProducts: 0,
    pendingDeliveries: 12
  });

  const hasFetched = useRef(false);

  // Load dashboard data only once
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const loadDashboardData = async () => {
      const localToken = localStorage.getItem('token');
      if (!localToken) {
        window.location.href = '/auth/login';
        return;
      }

      try {
        // Fetch user details
        const userData = await getCurrentUser();
        if (userData) {
          setUserDetails(userData);
        }

        // Fetch warehouses data
        const warehousesData = await fetchWarehouses({ limit: 100 });
        if (warehousesData) {
          const activeCount = warehousesData.filter(w => w.isActive).length;
          setStats(prev => ({
            ...prev,
            totalWarehouses: warehousesData.length,
            activeWarehouses: activeCount
          }));
        }

      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []); // Empty dependency array - run only once

  const handleLogout = () => {
    logout();
  };

  if (loading || warehousesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const displayName = userDetails?.name || user?.name || 'User';
  const displayEmail = userDetails?.email || user?.email || '';
  const displayRole = userDetails?.role || user?.role || 'staff';
  const isAdmin = displayRole === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
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
          {/* Total Products Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                Total
              </span>
            </div>
            <h3 className="text-3xl font-bold text-slate-900">{stats.totalProducts}</h3>
            <p className="text-sm text-slate-600 mt-1">Products in stock</p>
            <p className="text-xs text-slate-400 mt-2">Across {stats.activeWarehouses} warehouses</p>
          </div>

          {/* Warehouses Card */}
          <Link href="/settings/warehouses" className="block">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow hover:border-blue-200 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Warehouse className="h-6 w-6 text-amber-600" />
                </div>
                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                  Active
                </span>
              </div>
              <h3 className="text-3xl font-bold text-slate-900">{stats.activeWarehouses}</h3>
              <p className="text-sm text-slate-600 mt-1">Active Warehouses</p>
              <p className="text-xs text-slate-400 mt-2">Total: {stats.totalWarehouses}</p>
            </div>
          </Link>

          {/* Pending Deliveries Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <ArrowRight className="h-6 w-6 text-emerald-600" />
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                Today
              </span>
            </div>
            <h3 className="text-3xl font-bold text-slate-900">{stats.pendingDeliveries}</h3>
            <p className="text-sm text-slate-600 mt-1">Pending Deliveries</p>
            <p className="text-xs text-slate-400 mt-2">Awaiting processing</p>
          </div>

          {/* Role Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                Access
              </span>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 capitalize">{displayRole}</h3>
            <p className="text-sm text-slate-600 mt-1">Account Type</p>
            {isAdmin && (
              <p className="text-xs text-blue-600 mt-2">Full system access</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/settings/warehouses/new" className="block">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">Add Warehouse</h3>
                  <p className="text-sm text-slate-600 mt-1">Create a new warehouse location</p>
                </div>
                <Building className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </Link>

          <Link href="/settings/warehouses" className="block">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">Manage Warehouses</h3>
                  <p className="text-sm text-slate-600 mt-1">View and edit warehouse details</p>
                </div>
                <Warehouse className="h-8 w-8 text-amber-600" />
              </div>
            </div>
          </Link>

          <Link href="/profile" className="block">
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">Profile Settings</h3>
                  <p className="text-sm text-slate-600 mt-1">Update your account details</p>
                </div>
                <User className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Warehouses */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Recent Warehouses</h2>
            <Link href="/settings/warehouses" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all →
            </Link>
          </div>
          
          <div className="space-y-3">
            {warehouses && warehouses.length > 0 ? (
              warehouses.slice(0, 3).map((warehouse) => (
                <Link key={warehouse._id} href={`/settings/warehouses/${warehouse._id}`}>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div>
                      <p className="font-medium text-slate-900">{warehouse.name}</p>
                      <p className="text-sm text-slate-600">{warehouse.code}</p>
                    </div>
                    <div className="flex items-center">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        warehouse.isActive 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {warehouse.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <ArrowRight className="h-4 w-4 text-slate-400 ml-2" />
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                <p>No warehouses found</p>
                {isAdmin && (
                  <Link href="/settings/warehouses/new" className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block">
                    Create your first warehouse →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
