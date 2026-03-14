'use client';

import Link from 'next/link';
import { Edit, Trash2, Power, Eye, MapPin, Phone, User } from 'lucide-react';

export default function WarehouseTable({ 
  warehouses, 
  isLoading, 
  onDeactivate, 
  onActivate,
  pagination,
  onPageChange 
}) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-slate-200 rounded"></div>
          <div className="h-20 bg-slate-200 rounded"></div>
          <div className="h-20 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Code</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Name</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Location</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Contact</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Status</th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {warehouses.map((warehouse) => (
              <tr key={warehouse._id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6">
                  <span className="font-mono text-sm font-medium text-slate-900">{warehouse.code}</span>
                </td>
                <td className="py-4 px-6">
                  <div>
                    <p className="font-medium text-slate-900">{warehouse.name}</p>
                    {warehouse.metadata?.type && (
                      <p className="text-xs text-slate-500 mt-1">{warehouse.metadata.type}</p>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-slate-400 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-600">{warehouse.location?.city}</p>
                      <p className="text-xs text-slate-500">{warehouse.location?.state}, {warehouse.location?.country}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="space-y-1">
                    {warehouse.contact?.manager && (
                      <div className="flex items-center text-sm text-slate-600">
                        <User className="h-3 w-3 text-slate-400 mr-2" />
                        {warehouse.contact.manager}
                      </div>
                    )}
                    {warehouse.contact?.phone && (
                      <div className="flex items-center text-sm text-slate-600">
                        <Phone className="h-3 w-3 text-slate-400 mr-2" />
                        {warehouse.contact.phone}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    warehouse.isActive 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      warehouse.isActive ? 'bg-emerald-500' : 'bg-slate-400'
                    }`}></span>
                    {warehouse.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      href={`/settings/warehouses/${warehouse._id}`}
                      className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    {warehouse.isActive ? (
                      <button
                        onClick={() => onDeactivate(warehouse._id)}
                        className="p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Deactivate"
                      >
                        <Power className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onActivate(warehouse._id)}
                        className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Activate"
                      >
                        <Power className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200">
          <p className="text-sm text-slate-600">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} results
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
