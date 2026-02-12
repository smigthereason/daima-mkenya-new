"use client";

interface ProductHeroProps {
  preTitle?: string;
  title?: string[];
  ctaText?: string;
  ctaLink?: string;
}

export default function ProductHero({
  preTitle = "COLLECTION 2026",
  title = ["THE SPIRIT", "OF KENYA"],
  ctaText = "DISCOVER THE SELECTION",
  ctaLink = "#",
}: ProductHeroProps) {
  const safeTitle = Array.isArray(title) ? title : [];

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black text-white">
      {/* ── CINEMATIC VIDEO BACKGROUND ── */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto" // Forces the browser to start downloading immediately
          className="h-full w-full object-cover opacity-100 grayscale-20% brightness-[0.7]"
        >
          <source src="/assets/Kenya_Flag.mp4" type="video/mp4" />
        </video>

        {/* Luxury Vignette Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/80" />
      </div>

      {/* ── CONTENT ── */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="max-w-5xl px-6 text-center">
          {/* Animated Pre-title */}
          {preTitle && (
            <div className="mb-6 overflow-hidden">
              <p className="animate-reveal text-[11px] md:text-[13px] font-bold tracking-[0.6em] uppercase text-zinc-300">
                {preTitle}
              </p>
            </div>
          )}
          
          {/* Bold Luxury Title */}
          <h1 className="mb-10 text-6xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tighter uppercase">
            {safeTitle.length > 0 ? (
              safeTitle.map((line, index) => (
                <span
                  key={index}
                  className={`block ${
                    index === 0
                      ? "text-transparent stroke-white [-webkit-text-stroke:1px_white]"
                      : "text-white"
                  }`}
                >
                  {line}
                </span>
              ))
            ) : (
              <span>KENYA</span>
            )}
          </h1>

          {/* CTA: Large & Bold */}
          {ctaText && (
            <div className="mt-12 flex flex-col items-center gap-6">
              <div className="h-16 w-px bg-white/50 mb-4 animate-bounce" />
              <a
                href={ctaLink}
                className="group relative overflow-hidden border-2 border-white bg-white px-12 py-5 text-[12px] font-black tracking-[0.4em] text-black transition-colors duration-300"
              >
                {/* The "Grow" Background Layer */}
                <span className="absolute inset-0 z-0 scale-x-0 bg-black transition-transform duration-500 ease-out origin-center group-hover:scale-x-100" />

                {/* The Text Layer */}
                <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
                  {ctaText}
                </span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* ── BOTTOM DECORATION ── */}
      <div className="absolute bottom-10 left-10 hidden lg:block">
        <span className="text-[10px] tracking-[0.5em] font-light opacity-50 uppercase">
          Maison Kenya &copy; 2026
        </span>
      </div>
    </div>
  );
}
