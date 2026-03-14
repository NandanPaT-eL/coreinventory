'use client';

import { CheckCircle } from 'lucide-react';

export default function StepIndicator({ 
  number, 
  title, 
  description,
  subtitle,
  icon,
  color = '#7C3AED',
  isActive = true,
  className = ''
}) {
  const colors = {
    '#7C3AED': { bg: '#EDE9FE', text: '#7C3AED' },
    '#FFD93D': { bg: '#FFFBEB', text: '#D97706' },
    '#10B981': { bg: '#ECFDF5', text: '#059669' }
  };

  const theme = colors[color] || colors['#7C3AED'];

  return (
    <div className={`text-center ${className}`}>
      <div className="relative inline-block">
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-3 relative"
          style={{ 
            background: theme.bg,
            borderColor: color,
            borderWidth: '3px'
          }}
        >
          <div style={{ color: theme.text }}>
            {icon}
          </div>
          <div 
            className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ 
              background: color,
              color: color === '#FFD93D' ? '#1a1a2e' : 'white'
            }}
          >
            {number.toString().padStart(2, '0')}
          </div>
        </div>
        
        {isActive && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
            <CheckCircle size={16} className="text-emerald-500" />
          </div>
        )}
      </div>

      <h3 className="display-font font-bold text-base text-[#1a1a2e] mb-1">
        {title}
      </h3>
      
      {description && (
        <p className="text-sm text-[#6B7280] mb-2">{description}</p>
      )}
      
      {subtitle && (
        <span 
          className="inline-block px-3 py-1 rounded-full text-xs font-bold"
          style={{ background: theme.bg, color: theme.text }}
        >
          {subtitle}
        </span>
      )}
    </div>
  );
}
