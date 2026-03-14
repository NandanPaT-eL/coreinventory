'use client';

import Badge from '../ui/Badge';

export default function SectionHeading({ 
  badge, 
  title, 
  highlight,
  description,
  align = 'center',
  className = ''
}) {
  const alignments = {
    center: 'text-center',
    left: 'text-left',
    right: 'text-right'
  };

  return (
    <div className={`space-y-4 ${alignments[align]} ${className}`}>
      {badge && (
        <Badge variant="default" className="inline-block">
          {badge}
        </Badge>
      )}
      
      <h2 className="display-font text-4xl md:text-5xl font-extrabold text-[#1a1a2e] leading-tight">
        {title}{' '}
        {highlight && (
          <span className="relative">
            <span className="relative z-10 text-[#7C3AED]">{highlight}</span>
            <span className="absolute bottom-2 left-0 w-full h-3 bg-[#FFD93D]/30 -z-0 rounded-full"></span>
          </span>
        )}
      </h2>
      
      {description && (
        <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}
