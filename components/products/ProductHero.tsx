// components/ProductHero.tsx
"use client";

interface ProductHeroProps {
  preTitle?: string;
  title?: string[];
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
}

export default function ProductHero({
  preTitle = 'COLLECTION 2026',
  title = [], // Provide default empty array
  ctaText = 'SHOP NOW →',
  ctaLink = '#',
  backgroundImage
}: ProductHeroProps) {
  // Ensure title is always an array
  const safeTitle = Array.isArray(title) ? title : [];

  return (
    <div className="relative h-screen bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
      {/* Background Image/Texture */}
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-3/4 bg-gradient-to-l from-gray-700 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="max-w-4xl px-8 text-center">
          {/* Pre-title */}
          {preTitle && (
            <div className="mb-8">
              <p className="text-xs md:text-sm tracking-[0.3em] mb-4 opacity-60 uppercase">
                {preTitle}
              </p>
            </div>
          )}

          {/* Main Title - Safe rendering */}
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 tracking-tight uppercase">
            {safeTitle.length > 0 ? (
              safeTitle.map((line, index) => (
                <span key={index}>
                  {line}
                  {index < safeTitle.length - 1 && <br />}
                </span>
              ))
            ) : (
              <span>COLLECTION</span> // Fallback if no title provided
            )}
          </h1>

          {/* CTA Button */}
          {ctaText && (
            <a
              href={ctaLink}
              className="inline-block mt-8 bg-white text-black px-8 py-3 font-bold tracking-wider text-sm hover:bg-gray-200 transition-colors uppercase"
            >
              {ctaText}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
