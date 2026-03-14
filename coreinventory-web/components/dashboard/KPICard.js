'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function KPICard({ 
  title, 
  value, 
  subtitle,
  icon, 
  color = 'default',
  trend,
  href,
  className = ''
}) {
  const colors = {
    default: {
      bg: 'bg-white',
      iconBg: 'bg-[#F3F0FF]',
      iconColor: 'text-[#7C3AED]',
      textColor: 'text-[#1a1a2e]',
      border: 'border-[#EDE9FE]'
    },
    yellow: {
      bg: 'bg-[#FFD93D]',
      iconBg: 'bg-[#1a1a2e]/10',
      iconColor: 'text-[#1a1a2e]',
      textColor: 'text-[#1a1a2e]',
      border: 'border-[#FFD93D]'
    },
    purple: {
      bg: 'bg-gradient-to-br from-[#7C3AED] to-[#9f67ff]',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      textColor: 'text-white',
      border: 'border-transparent'
    },
    green: {
      bg: 'bg-emerald-50',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      textColor: 'text-emerald-900',
      border: 'border-emerald-100'
    }
  };

  const cardColors = colors[color] || colors.default;

  const CardContent = () => (
    <div className={`${cardColors.bg} rounded-2xl p-6 shadow-sm border ${cardColors.border} hover:shadow-md transition-all ${href ? 'cursor-pointer hover:translate-y-[-2px]' : ''} ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`${cardColors.iconBg} w-12 h-12 rounded-xl flex items-center justify-center`}>
          <div className={cardColors.iconColor}>{icon}</div>
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            trend > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
          }`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      
      <p className={`text-sm font-medium ${color === 'purple' ? 'text-white/80' : 'text-[#6B7280]'} mb-1`}>
        {title}
      </p>
      <p className={`display-font text-3xl font-extrabold ${cardColors.textColor} mb-1`}>
        {value}
      </p>
      {subtitle && (
        <p className={`text-xs ${color === 'purple' ? 'text-white/60' : 'text-[#9CA3AF]'}`}>
          {subtitle}
        </p>
      )}
      
      {href && (
        <div className={`mt-4 flex items-center text-xs font-semibold ${color === 'purple' ? 'text-white' : 'text-[#7C3AED]'} group`}>
          View details 
          <ArrowRight size={12} className={`ml-1 group-hover:translate-x-1 transition-transform ${color === 'purple' ? 'text-white' : ''}`} />
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href}>
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
}
