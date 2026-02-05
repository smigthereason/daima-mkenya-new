// components/CrossingBanners.tsx
"use client";

interface CrossingBannersProps {
  topText?: string[];
  bottomText?: string[];
  speed?: "slow" | "medium" | "fast";
}

export default function CrossingBanners({
  topText = ["✱ 60% OFF ON OLDER COLLECTION", "✱ NEW'S ARCHIVE SALE"],
  bottomText = ["✱ 60% OFF ON OLDER COLLECTION", "✱ MEN'S ARCHIVE SALE"],
  speed = "slow",
}: CrossingBannersProps) {
  const speedClass = {
    slow: "animate-scroll-slow",
    medium: "animate-scroll-medium",
    fast: "animate-scroll-fast",
  }[speed];

  return (
    <>
      <div className="relative h-60 bg-white overflow-hidden my-12 max-w-full">
        <div className="absolute inset-0">
          {/* First Banner - Diagonal top (starts from left, moves right) */}
          <div className="absolute top-0 left-0 w-[200%] h-16">
            <div className="flex items-center h-full bg-black text-white transform -rotate-9 origin-center whitespace-nowrap">
              <div
                className={`flex ${speedClass}`}
                style={{ transform: "translateX(-25%)" }}
              >
                {[...Array(15)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    {topText.map((text, idx) => (
                      <span
                        key={idx}
                        className="text-xl md:text-2xl font-black tracking-wider px-8"
                      >
                        {text}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Second Banner - Diagonal bottom (starts from right, moves left) */}
          <div className="absolute -bottom-6/12 right-0 w-full h-16">
            <div className="flex items-center h-full bg-black text-white transform rotate-9 origin-bottom-right whitespace-nowrap">
              <div className={`flex ${speedClass}-reverse`}>
                {[...Array(15)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    {bottomText.map((text, idx) => (
                      <span
                        key={idx}
                        className="text-xl md:text-2xl font-black tracking-wider px-8"
                      >
                        {text}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-slow {
          0% {
            transform: translateX(-25%);
          }
          100% {
            transform: translateX(-75%);
          }
        }

        @keyframes scroll-slow-reverse {
          0% {
            transform: translateX(25%);
          }
          100% {
            transform: translateX(-25%);
          }
        }

        @keyframes scroll-medium {
          0% {
            transform: translateX(-25%);
          }
          100% {
            transform: translateX(-75%);
          }
        }

        @keyframes scroll-medium-reverse {
          0% {
            transform: translateX(25%);
          }
          100% {
            transform: translateX(-25%);
          }
        }

        @keyframes scroll-fast {
          0% {
            transform: translateX(-25%);
          }
          100% {
            transform: translateX(-75%);
          }
        }

        @keyframes scroll-fast-reverse {
          0% {
            transform: translateX(25%);
          }
          100% {
            transform: translateX(-25%);
          }
        }

        .animate-scroll-slow {
          animation: scroll-slow 80s linear infinite;
        }

        .animate-scroll-slow-reverse {
          animation: scroll-slow-reverse 80s linear infinite;
        }

        .animate-scroll-medium {
          animation: scroll-medium 50s linear infinite;
        }

        .animate-scroll-medium-reverse {
          animation: scroll-medium-reverse 50s linear infinite;
        }

        .animate-scroll-fast {
          animation: scroll-fast 30s linear infinite;
        }

        .animate-scroll-fast-reverse {
          animation: scroll-fast-reverse 30s linear infinite;
        }
      `}</style>
    </>
  );
}
