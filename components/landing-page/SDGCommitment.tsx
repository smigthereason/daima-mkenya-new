import React from 'react';
import { Briefcase, Factory, Recycle, Leaf } from 'lucide-react';

const SdgCommitment = () => {
   const commitments = [
      {
         id: 8,
         title: "SDG 8: Decent Work",
         description: "Promoting sustained, inclusive economic growth, full and productive employment, and decent work for all.",
         icon: <Briefcase className="w-8 h-8" strokeWidth={1.5} />,
      },
      {
         id: 9,
         title: "SDG 9: Innovation",
         description: "Building resilient infrastructure, promoting inclusive and sustainable industrialization and fostering innovation.",
         icon: <Factory className="w-8 h-8" strokeWidth={1.5} />,
      },
      {
         id: 12,
         title: "SDG 12: Responsible Production",
         description: "Ensuring sustainable consumption and production patterns through resource efficiency and waste reduction.",
         icon: <Recycle className="w-8 h-8" strokeWidth={1.5} />,
      },
      {
         id: 13,
         title: "SDG 13: Climate Action",
         description: "Taking urgent action to combat climate change and its impacts through sustainable practices and advocacy.",
         icon: <Leaf className="w-8 h-8" strokeWidth={1.5} />,
      },
   ];

   return (
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
         <div className="max-w-7xl mx-auto">
            {/* Main Title */}
            <div className="text-center mb-16">
               <h2 className="text-2xl md:text-3xl font-light tracking-widest uppercase text-gray-800">
                  Our Commitment to Sustainable Development Goals
               </h2>
            </div>

            {/* Commitment Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
               {commitments.map((item) => (
                  <div key={item.id} className="flex flex-col items-center group">
                     {/* Icon Container */}
                     <div className="mb-6 text-gray-700 transition-transform duration-300 group-hover:scale-110">
                        {item.icon}
                     </div>

                     {/* Title */}
                     <h3 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">
                        {item.title}
                     </h3>

                     {/* Description */}
                     <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                        {item.description}
                     </p>
                  </div>
               ))}
            </div>

            {/* Sub-footer Section (Optional based on "NEW ARRIVALS" style in image) */}
            <div className="mt-20 pt-8 border-t border-gray-100 text-center">
               <span className="text-sm tracking-[0.3em] uppercase text-gray-400 font-medium">
                  Building a Better Future
               </span>
            </div>
         </div>
      </section>
   );
};

export default SdgCommitment
