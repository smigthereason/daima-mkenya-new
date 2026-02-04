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
  name: "CAMILLE HENROT ARTWORK TROUSERS",
  price: "1.150,00€",
  description: [
    "Black Wide Leg Pants In Technical Nylon",
    "Elasticated Waist Band",
    "Side Slit Pockets With Zip",
    "Drawstring On Hem To Adjust The Leg",
    "Zip-Off System Below The Knee",
  ],
  details: {
    material: "100% Technical Nylon",
    care: "Dry Clean Only",
    origin: "Made in Italy",
  },
  colors: [
    { label: "BLACK", hex: "#000000" },
    { label: "WHITE", hex: "#f0f0f0" },
  ],
  sizes: ["36", "38", "40"],
  images: {
    thumbnails: [
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=160&h=280&fit=crop&crop=top",
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=160&h=280&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=160&h=280&fit=crop&crop=bottom",
    ],
    hero: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=680&h=900&fit=crop&crop=top",
  },
  category: "Trousers"
};

// Enhanced related products with full Product structure
export const relatedProducts: Product[] = [
  {
    id: 2,
    name: "ROYAL KITENGE MERMAID GOWN",
    price: "Ksh 15,000",
    description: [
      "Handcrafted African Kitenge Fabric Gown",
      "Mermaid Silhouette with Flared Hem",
      "Intricate Beadwork on Bodice",
      "Adjustable Corset Back Closure",
      "Side Slit for Elegant Movement",
    ],
    details: {
      material: "100% African Wax Print Cotton",
      care: "Hand Wash Cold, Line Dry",
      origin: "Handmade in Kenya",
    },
    colors: [
      { label: "MULTICOLOR", hex: "#8B4513" },
      { label: "BLUE/GOLD", hex: "#1E3A8A" },
      { label: "RED/BLACK", hex: "#DC2626" },
    ],
    sizes: ["S", "M", "L", "XL"],
    images: {
      thumbnails: [
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=160&h=280&fit=crop&crop=top",
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=160&h=280&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=160&h=280&fit=crop&crop=bottom",
      ],
      hero: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=680&h=900&fit=crop&crop=top",
    },
    category: "Dresses"
  },
  {
    id: 3,
    name: "MODERN SENATOR SUIT",
    price: "Ksh 21,000",
    description: [
      "Contemporary African Senator Style Suit",
      "Tailored Fit with Modern Silhouette",
      "Contrasting Ankara Fabric Lapels",
      "Four-Button Jacket with Notched Lapels",
      "Slim Fit Trousers with Pleated Detail",
    ],
    details: {
      material: "Wool Blend with Ankara Accents",
      care: "Dry Clean Only, Steam Press",
      origin: "Tailored in Nigeria",
    },
    colors: [
      { label: "NAVY/BLUE", hex: "#1E3A8A" },
      { label: "CHARCOAL/GOLD", hex: "#374151" },
      { label: "BURGUNDY", hex: "#7F1D1D" },
    ],
    sizes: ["38", "40", "42", "44", "46"],
    images: {
      thumbnails: [
        "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=160&h=280&fit=crop&crop=top",
        "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=160&h=280&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=160&h=280&fit=crop&crop=bottom",
      ],
      hero: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=680&h=900&fit=crop&crop=top",
    },
    category: "Suits"
  },
  {
    id: 4,
    name: "FUSCHIA GODDESS CORSET DRESS",
    price: "Ksh 10,000",
    description: [
      "Vibrant Fuschia Corset Style Dress",
      "Boneless Corset with Adjustable Lacing",
      "A-Line Skirt with Hidden Zipper",
      "Off-Shoulder Neckline with Puff Sleeves",
      "Silk-Lined for Comfort and Structure",
    ],
    details: {
      material: "Premium Satin with Silk Lining",
      care: "Dry Clean Only, Store in Garment Bag",
      origin: "Designed in Ghana, Made in Africa",
    },
    colors: [
      { label: "FUSCHIA", hex: "#DB2777" },
      { label: "EMERALD", hex: "#059669" },
      { label: "ROYAL BLUE", hex: "#2563EB" },
    ],
    sizes: ["XS", "S", "M", "L"],
    images: {
      thumbnails: [
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=160&h=280&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=160&h=280&fit=crop&crop=entropy",
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=160&h=280&fit=crop&crop=focalpoint",
      ],
      hero: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=680&h=900&fit=crop&crop=entropy",
    },
    category: "Dresses"
  },
  {
    id: 5,
    name: "KENTE WEAVE BLAZER JACKET",
    price: "Ksh 12,500",
    description: [
      "Traditional Kente Weave Modern Blazer",
      "Handwoven Kente Fabric Panels",
      "Single-Breasted with Notched Lapels",
      "Two Front Flap Pockets",
      "Lined with Contrasting African Print",
    ],
    details: {
      material: "Handwoven Kente Cotton Blend",
      care: "Professional Dry Clean Only",
      origin: "Handwoven in Ghana",
    },
    colors: [
      { label: "GOLD/YELLOW", hex: "#F59E0B" },
      { label: "RED/GREEN", hex: "#DC2626" },
      { label: "BLUE/WHITE", hex: "#1E40AF" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: {
      thumbnails: [
        "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=160&h=280&fit=crop&crop=top",
        "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=160&h=280&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=160&h=280&fit=crop&crop=bottom",
      ],
      hero: "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=680&h=900&fit=crop&crop=top",
    },
    category: "Jackets"
  },
  {
    id: 6,
    name: "ANKARA PRINT WRAP DRESS",
    price: "Ksh 8,500",
    description: [
      "Versatile Ankara Print Wrap Dress",
      "Adjustable Tie Waist for Custom Fit",
      "V-Neckline with Three-Quarter Sleeves",
      "Knee-Length with Side Slit",
      "Lightweight and Breathable Fabric",
    ],
    details: {
      material: "100% African Ankara Cotton",
      care: "Machine Wash Cold, Tumble Dry Low",
      origin: "Made in Tanzania",
    },
    colors: [
      { label: "PURPLE/YELLOW", hex: "#7C3AED" },
      { label: "GREEN/ORANGE", hex: "#10B981" },
      { label: "PINK/BLUE", hex: "#EC4899" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: {
      thumbnails: [
        "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=160&h=280&fit=crop&crop=top",
        "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=160&h=280&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=160&h=280&fit=crop&crop=bottom",
      ],
      hero: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=680&h=900&fit=crop&crop=top",
    },
    category: "Dresses"
  },
  {
    id: 7,
    name: "AFRICAN PRINT CASUAL SHIRT",
    price: "Ksh 6,800",
    description: [
      "Casual African Print Button-Down Shirt",
      "Short Sleeve with Button Cuffs",
      "Two Chest Pockets with Flap Detail",
      "Regular Fit for All-Day Comfort",
      "Perfect for Casual or Smart Casual Wear",
    ],
    details: {
      material: "African Print Cotton Poplin",
      care: "Machine Wash Gentle, Iron Medium Heat",
      origin: "Printed in Senegal, Sewn in Kenya",
    },
    colors: [
      { label: "BLUE PATTERN", hex: "#3B82F6" },
      { label: "RED PATTERN", hex: "#EF4444" },
      { label: "GREEN PATTERN", hex: "#10B981" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: {
      thumbnails: [
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=160&h=280&fit=crop&crop=top",
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=160&h=280&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=160&h=280&fit=crop&crop=bottom",
      ],
      hero: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=680&h=900&fit=crop&crop=top",
    },
    category: "Shirts"
  },
  {
    id: 8,
    name: "KANGA WRAP SKIRT SET",
    price: "Ksh 9,200",
    description: [
      "Traditional Kanga Fabric Wrap Skirt Set",
      "Includes Matching Head Wrap",
      "Adjustable Tie Closure",
      "Bold Swahili Proverb Print",
      "Versatile for Multiple Styling Options",
    ],
    details: {
      material: "100% Kanga Cotton",
      care: "Hand Wash Separate Colors, Line Dry",
      origin: "Traditional Kanga from Zanzibar",
    },
    colors: [
      { label: "RED/BLACK", hex: "#DC2626" },
      { label: "BLUE/WHITE", hex: "#1E40AF" },
      { label: "YELLOW/GREEN", hex: "#F59E0B" },
    ],
    sizes: ["One Size Fits Most"],
    images: {
      thumbnails: [
        "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=160&h=280&fit=crop&crop=top",
        "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=160&h=280&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=160&h=280&fit=crop&crop=bottom",
      ],
      hero: "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=680&h=900&fit=crop&crop=top",
    },
    category: "Skirts"
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