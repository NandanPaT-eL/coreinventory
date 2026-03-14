'use client';

export default function IconBox({ 
  icon, 
  variant = 'primary',
  size = 'default',
  className = '',
  ...props 
}) {
  const variants = {
    primary: 'bg-[#7C3AED] text-white',
    'primary-light': 'bg-[#EDE9FE] text-[#7C3AED]',
    yellow: 'bg-[#FFD93D] text-[#1a1a2e]',
    success: 'bg-emerald-100 text-emerald-600',
    warning: 'bg-amber-100 text-amber-600',
    white: 'bg-white/20 text-white',
    transparent: 'bg-transparent',
  };

  const sizes = {
    sm: 'w-8 h-8 rounded-lg',
    default: 'w-12 h-12 rounded-xl',
    lg: 'w-16 h-16 rounded-2xl',
  };

  return (
    <div 
      className={`flex items-center justify-center flex-shrink-0 ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {icon}
    </div>
  );
}
