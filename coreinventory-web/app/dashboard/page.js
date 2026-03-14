'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { 
  Package, 
  Warehouse, 
  TrendingUp, 
  ArrowRight, 
  Clock, 
  Truck, 
  AlertCircle,
  BarChart3,
  Layers,
  Zap,
  CheckCircle,
  Building,
  Plus,
  RefreshCw,
  Users,
  Settings,
  History,
  Database
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useWarehouses } from '../../hooks/useWarehouses';
import { useProducts } from '../../hooks/useProducts';
import { useReceipts } from '../../hooks/useReceipts';
import { useDeliveries } from '../../hooks/useDeliveries';
import { useTransfers } from '../../hooks/useTransfers';
import { getDashboardKPIs, getRecentMovements, getLowStockProducts } from '../../lib/api/dashboard';
import KPICard from '../../components/dashboard/KPICard';
import RecentMovements from '../../components/dashboard/RecentMovements';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import SectionHeading from '../../components/shared/SectionHeading';

export default function DashboardPage() {
  const { user, getCurrentUser } = useAuth();
  const { warehouses, loading: warehousesLoading, fetchWarehouses } = useWarehouses();
  const { products, fetchProducts } = useProducts();
  const { fetchReceipts } = useReceipts();
  const { fetchDeliveries } = useDeliveries();
  const { fetchTransfers } = useTransfers();
  
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({
    totalProducts: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    pendingReceipts: 0,
    pendingDeliveries: 0,
    pendingTransfers: 0
  });
  
  const [recentMovements, setRecentMovements] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [stats, setStats] = useState({
    totalWarehouses: 0,
    activeWarehouses: 0
  });

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch user details
      const userData = await getCurrentUser();
      if (userData) {
        setUserDetails(userData);
      }

      // Fetch warehouses data
      const warehousesData = await fetchWarehouses({ limit: 100 });
      if (warehousesData?.data) {
        const activeCount = warehousesData.data.filter(w => w.isActive).length;
        setStats({
          totalWarehouses: warehousesData.data.length,
          activeWarehouses: activeCount
        });
      }

      // Fetch dashboard KPIs
      const kpiResponse = await getDashboardKPIs();
      if (kpiResponse.success) {
        setKpis(kpiResponse.data);
      }

      // Fetch recent movements
      const movementsResponse = await getRecentMovements(10);
      if (movementsResponse.success) {
        setRecentMovements(movementsResponse.data);
      }

      // Fetch low stock products
      const lowStockResponse = await getLowStockProducts(5);
      if (lowStockResponse.success) {
        setLowStockItems(lowStockResponse.data);
      }

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchWarehouses, getCurrentUser]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const displayName = userDetails?.name || user?.name || 'User';
  const displayRole = userDetails?.role || user?.role || 'staff';
  const isAdmin = displayRole === 'admin';

  // Calculate today's scheduled transfers
  const todayTransfers = lowStockItems.filter(item => {
    // This is mock - you'd need actual scheduled date from API
    return true;
  }).length;

  if (loading || warehousesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#F3F0FF] border-t-[#7C3AED] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#6B7280]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[1600px] mx-auto space-y-6 lg:space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#7C3AED]/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#FFD93D]/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-2">
            <div>
              <Badge variant="purple" className="mb-4 inline-block">
                <span className="flex items-center gap-1">
                  <Zap size={12} />
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
              </Badge>
              
              <h1 className="display-font text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1a1a2e] mb-2">
                Welcome back, <span className="text-[#7C3AED]">{displayName}</span>! 👋
              </h1>
              
              <p className="text-base lg:text-lg text-[#6B7280]">
                Here's what's happening with your inventory today.
              </p>
            </div>

            <div className="flex items-center gap-3 mt-2 lg:mt-0">
              <Button 
                variant="ghost" 
                size="sm" 
                icon={<RefreshCw size={16} />}
                onClick={loadDashboardData}
              >
                Refresh
              </Button>
              <Button variant="primary" size="sm" icon={<Plus size={16} />} href="/operations">
                New Operation
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <KPICard
          title="Total Products"
          value={kpis.totalProducts.toLocaleString()}
          subtitle={`Across ${stats.activeWarehouses} warehouses`}
          icon={<Package size={24} />}
          href="/products"
          trend={kpis.totalProducts > 0 ? '+12 this month' : undefined}
        />

        <KPICard
          title="Low Stock Items"
          value={kpis.lowStockCount}
          subtitle={`${kpis.outOfStockCount} out of stock`}
          icon={<AlertCircle size={24} />}
          color="yellow"
          href="/products?filter=low-stock"
        />

        <KPICard
          title="Pending Receipts"
          value={kpis.pendingReceipts}
          subtitle="Awaiting validation"
          icon={<Truck size={24} />}
          color="green"
          href="/operations/receipts?status=Draft,Waiting"
        />

        <KPICard
          title="Pending Deliveries"
          value={kpis.pendingDeliveries}
          subtitle="Ready to dispatch"
          icon={<Package size={24} />}
          color="purple"
          href="/operations/deliveries?status=Draft,Ready"
        />
      </div>

      {/* Second Row - Additional KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-5 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#F3F0FF] rounded-xl flex items-center justify-center">
                <Layers size={20} className="text-[#7C3AED]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#6B7280]">Pending Transfers</p>
                <p className="display-font text-2xl font-bold text-[#1a1a2e]">{kpis.pendingTransfers}</p>
              </div>
            </div>
            <Link href="/operations/transfers" className="text-[#7C3AED] hover:text-[#6d28d9]">
              <ArrowRight size={20} />
            </Link>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 bg-[#FFD93D] rounded-full"></span>
            <span className="text-[#6B7280]">Awaiting completion</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-5 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#F3F0FF] rounded-xl flex items-center justify-center">
                <Warehouse size={20} className="text-[#7C3AED]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#6B7280]">Warehouses</p>
                <p className="display-font text-2xl font-bold text-[#1a1a2e]">{stats.activeWarehouses}/{stats.totalWarehouses}</p>
              </div>
            </div>
            <Link href="/settings/warehouses" className="text-[#7C3AED] hover:text-[#6d28d9]">
              <ArrowRight size={20} />
            </Link>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            <span className="text-[#6B7280]">{stats.activeWarehouses} active locations</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#7C3AED] to-[#9f67ff] rounded-2xl shadow-lg p-5 lg:p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm font-medium">Quick Actions</p>
              <p className="text-xl lg:text-2xl font-bold">New Operation</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost-light" size="sm" href="/operations/receipts/new" className="flex-1">
              Receipt
            </Button>
            <Button variant="ghost-light" size="sm" href="/operations/deliveries/new" className="flex-1">
              Delivery
            </Button>
            <Button variant="ghost-light" size="sm" href="/operations/transfers/new" className="flex-1">
              Transfer
            </Button>
          </div>
        </div>
      </div>

      {/* Recent Activity and Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Recent Movements - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentMovements movements={recentMovements} />
        </div>

        {/* Low Stock Items - Takes 1 column */}
        <div className="space-y-4 lg:space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-5 lg:p-6">
            <h3 className="display-font font-bold text-lg text-[#1a1a2e] mb-4">Low Stock Alert</h3>
            {lowStockItems.length > 0 ? (
              <div className="space-y-3">
                {lowStockItems.map((item) => (
                  <Link
                    key={item._id}
                    href={`/products/${item._id}`}
                    className="flex items-center justify-between p-3 bg-[#F9F7FF] rounded-xl hover:bg-[#F3F0FF] transition-colors group"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-[#1a1a2e] text-sm">{item.name}</p>
                      <p className="text-xs text-[#6B7280]">SKU: {item.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-mono font-bold ${
                        item.totalStock === 0 ? 'text-red-600' : 'text-amber-600'
                      }`}>
                        {item.totalStock}
                      </p>
                      <p className="text-xs text-[#6B7280]">min: {item.reorderPoint}</p>
                    </div>
                  </Link>
                ))}
                <Link
                  href="/products?filter=low-stock"
                  className="block text-center text-sm text-[#7C3AED] hover:text-[#6d28d9] mt-2"
                >
                  View all low stock items
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-2" />
                <p className="text-[#1a1a2e] font-medium">All stock levels are healthy</p>
                <p className="text-sm text-[#6B7280] mt-1">No low stock alerts</p>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-[#FFD93D] to-[#fcc800] rounded-2xl shadow-lg p-5 lg:p-6">
            <h3 className="display-font font-bold text-lg text-[#1a1a2e] mb-2">Need Help?</h3>
            <p className="text-sm text-[#1a1a2e]/80 mb-4">Check our documentation or contact support</p>
            <Button variant="primary" size="sm" className="w-full" href="/docs">
              View Documentation
            </Button>
          </div>
        </div>
      </div>

      {/* Admin Section - Only visible to admins */}
      {isAdmin && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-5 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h3 className="display-font font-bold text-lg text-[#1a1a2e]">Admin Quick Actions</h3>
            <Badge variant="purple" className="w-fit">Admin only</Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
            {[
              { label: 'Manage Users', icon: Users, href: '/admin/users' },
              { label: 'System Settings', icon: Settings, href: '/admin/settings' },
              { label: 'Audit Logs', icon: History, href: '/admin/audit' },
              { label: 'Backup', icon: Database, href: '/admin/backup' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className="p-4 bg-[#F9F7FF] rounded-xl hover:bg-[#F3F0FF] transition-colors text-left group"
                >
                  <Icon size={20} className="text-[#7C3AED] mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium text-[#1a1a2e]">{item.label}</p>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
