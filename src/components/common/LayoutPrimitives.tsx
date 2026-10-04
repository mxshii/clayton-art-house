import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'narrow' | 'wide' | 'full';
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
  size = 'default',
}) => {
  const maxWidthClass =
    size === 'narrow'
      ? 'max-w-4xl'
      : size === 'wide'
      ? 'max-w-[1600px]'
      : size === 'full'
      ? 'max-w-full'
      : 'max-w-[1440px]';

  return (
    <div className={`w-full ${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-16 ${className}`}>
      {children}
    </div>
  );
};

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  bg?: 'canvas' | 'white' | 'sand' | 'green' | 'transparent';
  spacing?: 'default' | 'compact' | 'spacious' | 'none';
}

export const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  id,
  bg = 'transparent',
  spacing = 'default',
}) => {
  const bgClass =
    bg === 'canvas'
      ? 'bg-[#F6F3EF]'
      : bg === 'white'
      ? 'bg-white'
      : bg === 'sand'
      ? 'bg-[#E5D2C2]'
      : bg === 'green'
      ? 'bg-[#577057] text-white'
      : '';

  const spacingClass =
    spacing === 'compact'
      ? 'py-10 sm:py-14'
      : spacing === 'spacious'
      ? 'py-20 sm:py-28 lg:py-32'
      : spacing === 'none'
      ? ''
      : 'py-16 sm:py-20 lg:py-24';

  return (
    <section id={id} className={`w-full relative ${bgClass} ${spacingClass} ${className}`}>
      {children}
    </section>
  );
};

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
  theme?: 'dark' | 'light' | 'green';
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  className = '',
  theme = 'light',
}) => {
  const isCenter = align === 'center';

  const titleColor =
    theme === 'dark'
      ? 'text-white'
      : theme === 'green'
      ? 'text-[#577057]'
      : 'text-stone-900';

  const eyebrowColor =
    theme === 'dark'
      ? 'text-[#DFA363]'
      : 'text-[#DFA363]';

  const descColor =
    theme === 'dark'
      ? 'text-white/80'
      : 'text-stone-600';

  return (
    <div
      className={`flex flex-col ${
        isCenter ? 'items-center text-center' : 'sm:flex-row sm:items-end justify-between'
      } gap-6 mb-12 sm:mb-16 ${className}`}
    >
      <div className={`space-y-2 ${isCenter ? 'max-w-2xl' : 'max-w-2xl'}`}>
        {eyebrow && (
          <span className={`font-courgette text-2xl sm:text-3xl block ${eyebrowColor}`}>
            {eyebrow}
          </span>
        )}
        <h2 className={`font-montserrat text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight ${titleColor}`}>
          {title}
        </h2>
        {description && (
          <p className={`font-montserrat text-sm sm:text-base font-normal leading-relaxed ${descColor}`}>
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
