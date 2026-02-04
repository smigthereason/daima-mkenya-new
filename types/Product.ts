// types/Product.ts
export interface ProductColor {
  label: string;
  hex: string;
}

export interface ProductImages {
  thumbnails: string[];
  hero: string;
}

export interface ProductDetails {
  material: string;
  care: string;
  origin: string;
}

export interface Product {
  id: number;
  name: string;
  price: string;
  description: string[];
  details: ProductDetails;
  colors: ProductColor[];
  sizes: string[];
  images: ProductImages;
  category?: string;
}

// Sample product data
export const sampleProduct: Product = {
  id: 1,
  name: "MAASAI HERITAGE WRAP PASHMINA",
  price: "Ksh 8,500",
  description: [
    "Traditional Kenyan Maasai Shuka Wrap",
    "Vibrant Geometric Pattern in National Colors",
    "Versatile Styling for Headwear or Shoulder Drape",
    "Hand-Finished Tassel Edges",
  ],
  details: {
    material: "Heavyweight Acrylic Blend",
    care: "Hand Wash Cold, Dry Flat",
    origin: "Ethically Sourced in Kenya",
  },
  colors: [
    { label: "NATIONAL RED", hex: "#BB1D2C" },
    { label: "FOREST GREEN", hex: "#006600" },
  ],
  sizes: ["One Size"],
  images: {
    thumbnails: [
      "/assets/1.jpg",
      "/assets/1.12.png",
    ],
    hero: "/assets/1.12.png",
  },
  category: "Accessories"
};

// Enhanced related products with full Product structure
export const relatedProducts: Product[] = [
  {
    id: 2,
    name: "SHIELD EMBLEM OVERSIZED HOODIE",
    price: "Ksh 7,200",
    description: [
      "Oversized Boxy Fit for Modern Silhouette",
      "Hand-Painted Maasai Shield Graphic on Back",
      "Drop Shoulder Design with Ribbed Cuffs",
      "Premium Heavyweight Fleece Lining",
    ],
    details: {
      material: "80% Organic Cotton, 20% Polyester",
      care: "Machine Wash Cold, Iron on Reverse",
      origin: "Crafted in Nairobi",
    },
    colors: [
      { label: "PITCH BLACK", hex: "#000000" },
    ],
    sizes: ["S", "M", "L", "XL"],
    images: {
      thumbnails: [
        "/assets/2.webp",
        "/assets/2.12.png",
      ],
      hero: "/assets/2.12.png",
    },
    category: "Streetwear"
  },
  {
    id: 3,
    name: "RUNWAY POPLIN SHIRT & SHORT SET",
    price: "Ksh 12,500",
    description: [
      "Crisp White Poplin Over-Shirt",
      "Elasticated High-Waisted Relaxed Shorts",
      "Includes Striped Ribbed Crop Inner",
      "Designed for High-Fashion Versatility",
    ],
    details: {
      material: "100% Cotton Poplin",
      care: "Machine Wash Cold, Steam Iron",
      origin: "Tailored in Kenya",
    },
    colors: [
      { label: "OPTIC WHITE", hex: "#FFFFFF" },
    ],
    sizes: ["36", "38", "40", "42"],
    images: {
      thumbnails: [
        "/assets/3.jpg",
        "/assets/3.32.png",
      ],
      hero: "/assets/3.32.png",
    },
    category: "Sets"
  },
  {
    id: 4,
    name: "STRIPED NATIONAL BUTTON-DOWN",
    price: "Ksh 6,800",
    description: [
      "Vertical Stripe Motif in National Colors",
      "Classic Button-Down Collar",
      "Contrasting Cuff Detail",
      "Tailored Modern Fit",
    ],
    details: {
      material: "Premium Cotton Twill",
      care: "Dry Clean Recommended",
      origin: "Nairobi Workshop",
    },
    colors: [
      { label: "STRIPED MULTI", hex: "#BB1D2C" },
    ],
    sizes: ["M", "L", "XL", "XXL"],
    images: {
      thumbnails: [
        "/assets/4.jpg",
        "/assets/4.42.png",
      ],
      hero: "/assets/4.42.png",
    },
    category: "Shirts"
  },
  {
    id: 5,
    name: "UNITY RIBBED TANK TOP",
    price: "Ksh 3,500",
    description: [
      "Signature Ribbed Stretch Fabric",
      "Horizontal National Stripe Pattern",
      "Embroidered Logo Detail on Chest",
      "Form-Fitting Athletic Cut",
    ],
    details: {
      material: "95% Cotton, 5% Elastane",
      care: "Machine Wash Cold",
      origin: "Made in Kenya",
    },
    colors: [
      { label: "STRIPED MULTI", hex: "#BB1D2C" },
    ],
    sizes: ["S", "M", "L", "XL"],
    images: {
      thumbnails: [
        "/assets/5.jpg",
        "/assets/5.5.jpg",
      ],
      hero: "/assets/5.5.jpg",
    },
    category: "Tops"
  },
  {
    id: 6,
    name: "SHIELD STRIPE MAXI SKIRT",
    price: "Ksh 9,500",
    description: [
      "Full-Length High-Waisted Maxi Skirt",
      "Bold Vertical Stripe Heritage Print",
      "Internal Drawstring for Custom Fit",
      "Side Hidden Pockets",
    ],
    details: {
      material: "Lightweight Cotton Canvas",
      care: "Gentle Machine Wash",
      origin: "Hand-finished in Kenya",
    },
    colors: [
      { label: "STRIPED MULTI", hex: "#BB1D2C" },
    ],
    sizes: ["XS", "S", "M", "L"],
    images: {
      thumbnails: [
        "/assets/6.6.jpg",
        "/assets/6.62.png",
      ],
      hero: "/assets/6.62.png",
    },
    category: "Skirts"
  },
  {
    id: 7,
    name: "SAFARI CHECK FRINGE SCARF",
    price: "Ksh 4,800",
    description: [
      "Oversized Checkered Winter Scarf",
      "Multi-color Grid Pattern with Fringed Edges",
      "Extra Long for Layered Styling",
      "Brushed Soft-Touch Fabric",
    ],
    details: {
      material: "Soft Wool Blend",
      care: "Hand Wash Only",
      origin: "Artisanal Weave",
    },
    colors: [
      { label: "CHECKERED MULTI", hex: "#BB1D2C" },
    ],
    sizes: ["One Size"],
    images: {
      thumbnails: [
        "/assets/7.jpg",
        "/assets/7.72.png",
      ],
      hero: "/assets/7.72.png",
    },
    category: "Accessories"
  },
  {
    id: 8,
    name: "TRADITIONAL KANGA WRAP SET",
    price: "Ksh 9,200",
    description: [
      "Traditional Kanga Fabric Wrap Set",
      "Includes Matching Head Wrap",
      "Adjustable Tie Closure",
      "Bold Swahili Proverb Print",
    ],
    details: {
      material: "100% Kanga Cotton",
      care: "Hand Wash Separate Colors",
      origin: "Zanzibar Heritage Print",
    },
    colors: [
      { label: "RED/BLACK", hex: "#DC2626" },
      { label: "BLUE/WHITE", hex: "#1E40AF" },
    ],
    sizes: ["One Size Fits Most"],
    images: {
      thumbnails: [
        "/assets/8.jpg",
        "/assets/8.82.png",
      ],
      hero: "/assets/8.82.png",
    },
    category: "Skirts"
  },
  {
    id: 9,
    name: "HERITAGE STRIPE KAFTAN GOWN",
    price: "Ksh 11,500",
    description: [
      "Floor-Length Kaftan Silhouette",
      "Bold Vertical Heritage Stripes",
      "Flowing Lightweight Fabric",
      "Matching Headwrap Included",
    ],
    details: {
      material: "Silk Blend",
      care: "Dry Clean Only",
      origin: "Made in Kenya",
    },
    colors: [
      { label: "HERITAGE STRIPE", hex: "#BB1D2C" },
    ],
    sizes: ["Free Size"],
    images: {
      thumbnails: [
        "/assets/9.jpg",
        "/assets/9.92.png",
      ],
      hero: "/assets/9.92.png",
    },
    category: "Dresses"
  },
  {
    id: 10,
    name: "MAASAI SHIELD GRAPHIC TEE",
    price: "Ksh 4,500",
    description: [
      "Premium Cotton Graphic T-Shirt",
      "Hand-Screened Maasai Shield Design",
      "Ribbed Crew Neckline",
      "Standard Fit",
    ],
    details: {
      material: "100% Organic Cotton",
      care: "Machine Wash Cold",
      origin: "Made in Nairobi",
    },
    colors: [
      { label: "BLACK", hex: "#000000" },
    ],
    sizes: ["M", "L", "XL"],
    images: {
      thumbnails: ["/assets/10.jpg", "/assets/10.102.png"],
      hero: "/assets/10.102.png",
    },
    category: "Shirts"
  },
  {
    id: 11,
    name: "URBAN SAFARI UTILITY VEST",
    price: "Ksh 8,000",
    description: [
      "Functional Safari Vest with Multi-pockets",
      "Lightweight and Durable Construction",
      "Adjustable Side Straps",
      "Perfect for Layering",
    ],
    details: {
      material: "Technical Twill",
      care: "Machine Washable",
      origin: "Nairobi Workshop",
    },
    colors: [
      { label: "OLIVE", hex: "#556B2F" },
      { label: "TAN", hex: "#D2B48C" },
    ],
    sizes: ["S", "M", "L", "XL"],
    images: {
      thumbnails: ["/assets/11.jpg", "/assets/11.11.jpg"],
      hero: "/assets/11.11.jpg",
    },
    category: "Jackets"
  },
  {
    id: 12,
    name: "SAVANNAH PLEATED TROUSERS",
    price: "Ksh 7,500",
    description: [
      "High-Waisted Trousers with Front Pleats",
      "Tapered Leg for a Sharp Look",
      "Concealed Zip Fastening",
      "Breathable Summer Fabric",
    ],
    details: {
      material: "Linen Blend",
      care: "Dry Clean Only",
      origin: "Made in Kenya",
    },
    colors: [
      { label: "SAND", hex: "#C2B280" },
    ],
    sizes: ["30", "32", "34", "36"],
    images: {
      thumbnails: ["/assets/12.jpg", "/assets/12.122.png"],
      hero: "/assets/12.122.png",
    },
    category: "Trousers"
  },
  {
    id: 13,
    name: "RIFT VALLEY KNIT SWEATER",
    price: "Ksh 6,200",
    description: [
      "Chunk Knit Sweater with Traditional Patterns",
      "Warm and Cozy for Cooler Evenings",
      "Relaxed Fit Silhouette",
    ],
    details: {
      material: "Soft Wool Blend",
      care: "Hand Wash Cold",
      origin: "Hand-knit in Kenya",
    },
    colors: [
      { label: "EARTH TONES", hex: "#704214" },
    ],
    sizes: ["S", "M", "L"],
    images: {
      thumbnails: ["/assets/13.jpg", "/assets/13.132.png"],
      hero: "/assets/13.132.png",
    },
    category: "Knitwear"
  },
  {
    id: 14,
    name: "NATIONAL PRIDE STRIPED SHIRT",
    price: "Ksh 5,800",
    description: [
      "Modern Vertical Stripe Design",
      "Button-Down Front with Wooden Buttons",
      "Lightweight Cotton for Comfort",
    ],
    details: {
      material: "100% Kenyan Cotton",
      care: "Machine Wash Cold",
      origin: "Made in Mombasa",
    },
    colors: [
      { label: "STRIPED MULTI", hex: "#BB1D2C" },
    ],
    sizes: ["M", "L", "XL", "XXL"],
    images: {
      thumbnails: ["/assets/14.jpg", "/assets/14.142.png"],
      hero: "/assets/14.142.png",
    },
    category: "Shirts"
  },
  {
    id: 15,
    name: "LEOPARD SHIELD PRINT VEST",
    price: "Ksh 3,500",
    description: [
      "Abstract Leopard and Shield Fusion Print",
      "Sleeveless Graphic Muscle Tee",
      "Signature Ribbed Neckline",
    ],
    details: {
      material: "95% Cotton, 5% Elastane",
      care: "Machine Wash Cold",
      origin: "Designed in Nairobi",
    },
    colors: [
      { label: "SAFARI GOLD", hex: "#C5B358" },
    ],
    sizes: ["S", "M", "L"],
    images: {
      thumbnails: ["/assets/15.jpg", "/assets/15.152.png"],
      hero: "/assets/15.152.png",
    },
    category: "Streetwear"
  },
];

// Utility function to get all products
export const getAllProducts = (): Product[] => {
  return [sampleProduct, ...relatedProducts];
};

// Utility function to get product by ID
export const getProductById = (id: number): Product | undefined => {
  return getAllProducts().find(product => product.id === id);
};

// Utility function to get products by category
export const getProductsByCategory = (category: string): Product[] => {
  return getAllProducts().filter(product => product.category === category);
};