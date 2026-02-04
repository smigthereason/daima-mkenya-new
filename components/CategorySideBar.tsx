"use client";

export default function ExactCategorySidebar() {
  return (
    <div className="w-full bg-white p-8" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      {/* Title Section */}
      <div className="mb-12">
        <h1 
          className="text-black uppercase text-6xl font-black leading-none tracking-tight mb-6"
          style={{ 
            fontFamily: "'Playfair Display', serif",
            letterSpacing: "-2px",
            lineHeight: "0.9"
          }}
        >
          Discover the Popular Products
        </h1>
        
        {/* Category List */}
        <div className="flex gap-12 mt-10">
          {["PARFUMS", "SKINCARE", "MEDICAL COSMETIC"].map((category, index) => (
            <div key={category} className="relative">
              <span 
                className="text-black text-2xl font-bold uppercase tracking-[0.2em] block"
                style={{ 
                  fontFamily: "'Playfair Display', serif",
                  letterSpacing: "0.15em"
                }}
              >
                {category}
              </span>
              <div className="h-0.5 bg-black mt-2" />
              <div className="absolute -left-4 top-0 text-gray-400 text-sm">
                0{index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gray-300 mb-12" />

      {/* Main Product - Tom Ford */}
      <div className="mb-16">
        <div className="mb-8">
          <h2 
            className="text-black text-3xl font-bold uppercase tracking-[0.25em] mb-2"
            style={{ 
              fontFamily: "'Playfair Display', serif",
              letterSpacing: "0.2em"
            }}
          >
            TOMFORD
          </h2>
        </div>
        
        <div className="mb-6">
          <h3 
            className="text-black text-5xl font-black uppercase leading-none mb-4"
            style={{ 
              fontFamily: "'Playfair Display', serif",
              letterSpacing: "-1.5px",
              lineHeight: "0.9"
            }}
          >
            VANILLA SEX
          </h3>
        </div>
        
        <p 
          className="text-gray-700 text-sm uppercase tracking-[0.2em] mb-12"
          style={{ 
            fontSize: "14px",
            letterSpacing: "0.15em"
          }}
        >
          EAU DE PARFUM 250 ML
        </p>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gray-300 mb-12" />

      {/* Other Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Miller Harris */}
        <div>
          <div className="mb-6">
            <h3 
              className="text-black text-2xl font-bold uppercase mb-4"
              style={{ 
                fontFamily: "'Playfair Display', serif",
                letterSpacing: "0.5px"
              }}
            >
              Miller Harris
            </h3>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-600 text-sm leading-relaxed">
              An elegant, sophisticated fragrance for women.
            </p>
            
            <p className="text-gray-600 text-sm leading-relaxed">
              Scented with patchouli and vanilla.
            </p>
            
            <div className="pt-6">
              <p className="text-gray-700 text-sm uppercase tracking-[0.1em] mb-3">
                50 ML
              </p>
            </div>
          </div>
        </div>

        {/* Gucci Guilty */}
        <div>
          <div className="mb-6">
            <h3 
              className="text-black text-2xl font-bold uppercase mb-4"
              style={{ 
                fontFamily: "'Playfair Display', serif",
                letterSpacing: "0.5px"
              }}
            >
              Gucci Guilty
            </h3>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-600 text-sm leading-relaxed">
              A fragrance that celebrates life.
            </p>
            
            <p className="text-gray-600 text-sm leading-relaxed">
              Scented with patchouli and vanilla.
            </p>
            
            <div className="pt-6">
              <p className="text-gray-700 text-sm uppercase tracking-[0.1em] mb-3">
                50 ML
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="mt-12 pt-8 border-t border-gray-300 flex justify-end">
        <button 
          className="text-black text-sm uppercase tracking-[0.2em] hover:opacity-70 transition-opacity flex items-center gap-2"
          style={{ 
            fontFamily: "'Playfair Display', serif",
          }}
        >
          <span>View All Products</span>
          <span className="text-lg">→</span>
        </button>
      </div>
    </div>
  );
}