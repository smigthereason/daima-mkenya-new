// components/landing-page/FloatingWhatsApp.tsx
"use client";

import React from "react";
import { FaWhatsapp } from "react-icons/fa6";

const FloatingWhatsApp = () => {
  const phoneNumber = "254721888887";
  const message = "Hello, I'm interested in your products!";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 p-3 md:p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110 hover:shadow-xl group animate-bounce-slow"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={24} className="md:w-7 md:h-7" />

      {/* Optional tooltip that appears on hover */}
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
        Chat with us
      </span>
    </a>
  );
};

export default FloatingWhatsApp;
