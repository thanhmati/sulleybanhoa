interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: number;
  variant?: 'tulip' | 'geometric';
}

export function Logo({ className = '', showText = true, size = 36, variant = 'tulip' }: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-3 group cursor-pointer ${className}`}>
      {/* Emblem SVG: Delicate Tulip Line-Art */}
      {variant === 'tulip' && (
        <div className="relative shrink-0 flex items-center justify-center">
          <svg
            width={size}
            height={size}
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform duration-300 group-hover:scale-105"
          >
            {/* Outer Fine Ring */}
            <circle
              cx="22"
              cy="22"
              r="20"
              stroke="var(--primary)"
              strokeWidth="1.5"
              fill="var(--background)"
            />

            {/* Stem */}
            <path
              d="M22 31V19"
              stroke="var(--foreground)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />

            {/* Left Leaf */}
            <path
              d="M22 27C18 25 16 21 17 18C19 18.5 21 21 22 24"
              stroke="var(--foreground)"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="var(--secondary)"
              fillOpacity="0.4"
            />

            {/* Right Leaf */}
            <path
              d="M22 25C25 23 27 19 26 16C24 16.5 22.5 19 22 22"
              stroke="var(--foreground)"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="var(--secondary)"
              fillOpacity="0.4"
            />

            {/* Tulip Main Petal */}
            <path
              d="M17 14C17 18 22 20 22 20C22 20 27 18 27 14C27 11 24.5 11 22 13C19.5 11 17 11 17 14Z"
              fill="var(--primary)"
              fillOpacity="0.9"
              stroke="var(--foreground)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Center Petal Line */}
            <path
              d="M22 13V18"
              stroke="var(--foreground)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}

      {/* Geometric Emblem Variant */}
      {variant === 'geometric' && (
        <div className="relative shrink-0 flex items-center justify-center">
          <svg
            width={size}
            height={size}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform duration-300 group-hover:rotate-45"
          >
            <path
              d="M20 6C20 13.732 13.732 20 6 20C13.732 20 20 26.268 20 34C20 26.268 26.268 20 34 20C26.268 20 20 13.732 20 6Z"
              fill="var(--primary)"
              stroke="var(--foreground)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <circle cx="20" cy="20" r="3" fill="var(--foreground)" />
          </svg>
        </div>
      )}

      {/* Wordmark Text */}
      {showText && (
        <div className="flex flex-col text-left leading-tight">
          <span className="text-lg md:text-xl font-serif font-bold tracking-[0.12em] text-foreground uppercase">
            SULLEY<span className="text-primary">.</span>
          </span>
          <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary-dark">
            FLORAL STUDIO
          </span>
        </div>
      )}
    </div>
  );
}
