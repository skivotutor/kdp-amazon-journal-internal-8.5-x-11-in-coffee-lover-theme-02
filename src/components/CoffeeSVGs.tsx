import React from 'react';

interface SVGProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  strokeWidth?: number;
}

export const CozyHeartCup: React.FC<SVGProps> = ({ size = 100, className = '', strokeWidth = 1.5, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Steam Hearts */}
    <path d="M 42 35 C 38 25, 30 25, 38 12 C 45 6, 50 18, 42 35 Z" fill="none" />
    <path d="M 58 35 C 54 27, 48 24, 52 14 C 57 8, 62 18, 58 35 Z" fill="none" strokeDasharray="1 1" />
    <path d="M 50 30 C 47 22, 42 22, 47 16 C 51 12, 54 18, 50 30 Z" fill="none" />
    
    {/* Heart floating at top */}
    <path d="M 50 10 C 49 7, 45 7, 47 4 C 50 1, 51 6, 50 10 Z" strokeWidth={1} />
    <path d="M 46 16 C 44 14, 44 10, 47 11 C 50 10, 50 14, 46 16 Z" fill="currentColor" stroke="none" />
    <path d="M 54 17 C 52 15, 52 11, 55 12 C 58 11, 58 15, 54 17 Z" fill="currentColor" stroke="none" />

    {/* Cup Body */}
    <path d="M 25 38 L 75 38 C 75 38, 73 68, 50 68 C 27 68, 25 38, 25 38 Z" fill="none" strokeWidth={strokeWidth + 0.3} />
    
    {/* Cup Pattern - Cute heart inside the cup */}
    <path d="M 50 54 C 44 46, 42 50, 50 58 C 58 50, 56 46, 50 54 Z" fill="none" strokeWidth={1.2} />
    
    {/* Cup Handle */}
    <path d="M 75 44 C 84 44, 84 56, 73 58" fill="none" />
    
    {/* Saucer */}
    <path d="M 18 76 C 18 72, 82 72, 82 76 C 82 82, 18 82, 18 76 Z" fill="none" />
    <line x1="28" y1="76" x2="72" y2="76" strokeWidth={1.2} />
    
    {/* Coffee Aroma lines */}
    <path d="M 12 45 C 10 40, 10 50, 8 45" />
    <path d="M 92 45 C 90 40, 90 50, 88 45" />
  </svg>
);

export const ElegantLineCup: React.FC<SVGProps> = ({ size = 100, className = '', strokeWidth = 1.5, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Elegant single-stroke curve steam */}
    <path d="M 38 28 Q 44 18, 38 8 T 44 -2" transform="scale(0.8) translate(15, 12)" />
    <path d="M 48 28 Q 54 16, 48 6 T 54 -4" transform="scale(0.8) translate(15, 14)" />
    <path d="M 58 28 Q 63 20, 58 10 T 63 0" transform="scale(0.8) translate(15, 12)" />

    {/* Modern Cup Outline */}
    <path d="M 30 38 C 30 55, 35 66, 50 66 C 65 66, 70 55, 70 38" strokeWidth={strokeWidth + 0.5} />
    <line x1="26" y1="38" x2="74" y2="38" strokeWidth={2} />
    
    {/* Sleek Square Handle */}
    <path d="M 70 42 H 84 V 54 H 68.5" />
    
    {/* Double Saucer Lines */}
    <path d="M 20 74 C 35 79, 65 79, 80 74" />
    <path d="M 28 80 C 40 83, 60 83, 72 80" strokeWidth={1} />
    
    {/* Minimalist Sparkles */}
    <path d="M 20 25 L 22 27 M 22 25 L 20 27" strokeWidth={1} />
    <path d="M 80 28 L 82 30 M 82 28 L 80 30" strokeWidth={1} />
    <circle cx="50" cy="52" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

export const LatteArtCup: React.FC<SVGProps> = ({ size = 100, className = '', strokeWidth = 1.5, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Outer Cup Rim (Top down view) */}
    <circle cx="50" cy="50" r="32" strokeWidth={strokeWidth + 0.5} />
    <circle cx="50" cy="50" r="28" strokeWidth={1} />
    
    {/* Coffee liquid boundary */}
    <circle cx="50" cy="50" r="24" strokeDasharray="3 2" strokeWidth={0.8} />
    
    {/* Latte Art (Rosetta leaf pattern) */}
    <path d="M 50 72 V 32" strokeWidth={1.2} />
    <path d="M 50 68 C 44 65, 42 58, 50 56 C 58 58, 56 65, 50 68 Z" fill="none" />
    <path d="M 50 58 C 42 55, 40 48, 50 46 C 60 48, 58 55, 50 58 Z" fill="none" />
    <path d="M 50 48 C 44 46, 42 40, 50 38 C 58 40, 56 46, 50 48 Z" fill="none" fillRule="evenodd" />
    <path d="M 50 38 Q 45 34, 50 30 Q 55 34, 50 38" fill="currentColor" />
    
    {/* Cup Handle (Visible from top slightly offset) */}
    <path d="M 81.5 45 C 87 40, 89 54, 81.5 55" strokeWidth={strokeWidth} />
    
    {/* Saucer Outer Edge */}
    <circle cx="50" cy="50" r="44" strokeWidth={1} strokeDasharray="10 3" />
    
    {/* Coffee steam rising horizontally (cute spiral effect) */}
    <path d="M 12 18 C 16 14, 20 22, 24 18" strokeWidth={0.8} />
    <path d="M 76 18 C 80 14, 84 22, 88 18" strokeWidth={0.8} strokeDasharray="1 1" />
  </svg>
);

export const SteamingCup: React.FC<SVGProps> = ({ size = 100, className = '', strokeWidth = 1.5, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Classic Steam Waves */}
    <path d="M 36 30 C 36 20, 44 22, 40 10 C 37 2, 45 4, 43 -2" transform="translate(4, 5)" />
    <path d="M 46 30 C 46 18, 54 20, 50 8 C 47 0, 55 2, 53 -4" transform="translate(2, 5)" />
    <path d="M 56 30 C 56 22, 64 24, 60 12 C 57 4, 65 6, 63 0" transform="translate(0, 5)" />

    {/* Mug Body */}
    <rect x="28" y="38" width="44" height="38" rx="4" strokeWidth={strokeWidth + 0.5} />
    
    {/* Classic Round Handle */}
    <path d="M 72 44 C 83 44, 83 66, 72 66" strokeWidth={strokeWidth + 0.3} />
    <path d="M 72 49 C 78 49, 78 61, 72 61" strokeWidth={0.8} />

    {/* Decorative cozy horizontal stripes */}
    <line x1="32" y1="46" x2="68" y2="46" strokeWidth={1} strokeDasharray="2 2" />
    <line x1="32" y1="56" x2="68" y2="56" strokeWidth={1.5} />
    <line x1="32" y1="66" x2="68" y2="66" strokeWidth={1} strokeDasharray="2 2" />

    {/* Elegant long saucer */}
    <path d="M 16 80 H 84" strokeWidth={2} />
    <path d="M 24 84 H 76" strokeWidth={1} />
    
    {/* Floating tiny bubbles */}
    <circle cx="20" cy="30" r="1" fill="currentColor" stroke="none" />
    <circle cx="82" cy="34" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

export const MinimalistBeans: React.FC<SVGProps> = ({ size = 100, className = '', strokeWidth = 1.5, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Tiny espresso / Turkish coffee cup */}
    <path d="M 38 45 L 62 45 C 62 45, 60 68, 50 68 C 40 68, 38 45, 38 45 Z" strokeWidth={strokeWidth + 0.5} />
    
    {/* Saucer */}
    <path d="M 26 74 C 36 78, 64 78, 74 74" strokeWidth={1.5} />

    {/* Dainty Steam */}
    <path d="M 45 36 C 47 30, 43 28, 46 22 L 48 18" />
    <path d="M 52 36 C 54 29, 50 27, 53 20 L 55 16" strokeDasharray="1 1" />
    
    {/* Coffee Beans orbiting the cup */}
    {/* Bean 1 (Left top) */}
    <g transform="translate(14, 25) rotate(-35) scale(0.8)">
      <ellipse cx="10" cy="10" rx="6" ry="4" strokeWidth={1.2} />
      <path d="M 4 10 C 10 12, 10 8, 16 10" strokeWidth={0.8} />
    </g>
    
    {/* Bean 2 (Right bottom) */}
    <g transform="translate(74, 52) rotate(45) scale(0.8)">
      <ellipse cx="10" cy="10" rx="6" ry="4" strokeWidth={1.2} />
      <path d="M 4 10 C 10 12, 10 8, 16 10" strokeWidth={0.8} />
    </g>

    {/* Bean 3 (Top right) */}
    <g transform="translate(70, 16) rotate(15) scale(0.6)">
      <ellipse cx="10" cy="10" rx="6" ry="4" strokeWidth={1.2} fill="currentColor" />
    </g>

    {/* Small sparks / flower details */}
    <path d="M 18 58 L 22 62 M 22 58 L 18 62" strokeWidth={0.8} />
    <circle cx="34" cy="24" r="1" fill="currentColor" stroke="none" />
    <circle cx="62" cy="78" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

export const CoffeeBeanIcon: React.FC<SVGProps> = ({ size = 20, className = '', strokeWidth = 1.5, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <ellipse cx="12" cy="12" rx="9" ry="6" transform="rotate(-45 12 12)" />
    <path d="M 5.5 18.5 C 12 15, 12 9, 18.5 5.5" />
  </svg>
);

// Returns component by key
export const getCoffeeSVG = (
  style: string, 
  size: number = 100, 
  className: string = '', 
  customSvgOrPng?: string
) => {
  if (style === 'custom' && customSvgOrPng) {
    const isSvg = customSvgOrPng.trim().startsWith('<svg') || customSvgOrPng.trim().includes('<svg');
    if (isSvg) {
      // It's a raw SVG string! Render dangerously but sanitized with injected width/height.
      const customSvgWithSizes = customSvgOrPng
        .replace(/<svg([^>]*)>/i, `<svg$1 width="${size}" height="${size}">`);
      return (
        <div 
          className={`flex items-center justify-center ${className}`}
          style={{ width: size, height: size }}
          dangerouslySetInnerHTML={{ __html: customSvgWithSizes }}
        />
      );
    } else {
      // It's a PNG base64 data url or standard url
      return (
        <img 
          src={customSvgOrPng} 
          width={size} 
          height={size} 
          className={className} 
          style={{ objectFit: 'contain' }}
          alt="Custom Coffee Icon" 
          referrerPolicy="no-referrer"
        />
      );
    }
  }

  switch (style) {
    case 'cozy-heart':
      return <CozyHeartCup size={size} className={className} />;
    case 'elegant-line':
      return <ElegantLineCup size={size} className={className} />;
    case 'latte-art':
      return <LatteArtCup size={size} className={className} />;
    case 'steaming-cup':
      return <SteamingCup size={size} className={className} />;
    case 'minimalist-beans':
      return <MinimalistBeans size={size} className={className} />;
    default:
      return <CozyHeartCup size={size} className={className} />;
  }
};
