'use client';

import { forwardRef } from 'react';
import Link from 'next/link';

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'default',
  href,
  className = '',
  icon,
  iconPosition = 'left',
  ...props 
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-bold transition-all duration-200 cursor-pointer no-underline';
  
  const variants = {
    primary: 'bg-[#7C3AED] text-white hover:bg-[#6d28d9] hover:translate-y-[-2px] hover:shadow-[0_12px_32px_rgba(124,58,237,0.35)]',
    yellow: 'bg-[#FFD93D] text-[#1a1a2e] hover:bg-[#fcc800] hover:translate-y-[-2px]',
    ghost: 'bg-transparent text-[#7C3AED] border-2 border-[#7C3AED] hover:bg-[#7C3AED] hover:text-white',
    'ghost-light': 'bg-transparent text-white/80 border-2 border-white/30 hover:bg-white/10',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-full',
    default: 'px-8 py-3.5 text-base rounded-full',
    lg: 'px-10 py-4 text-lg rounded-full',
  };

  const content = (
    <>
      {icon && iconPosition === 'left' && icon}
      <span>{children}</span>
      {icon && iconPosition === 'right' && icon}
    </>
  );

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} ref={ref} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} ref={ref} {...props}>
      {content}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
