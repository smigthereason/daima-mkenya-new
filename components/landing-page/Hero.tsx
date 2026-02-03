import { HeroImage, HeroImage2, HeroImage3, HeroImage4 } from '@/public/assets'
import Image from 'next/image'
import React from 'react'

const Hero = () => {
   return (
      <div className="h-screen border-2 border-red-500 flex items-center justify-center px-20 pt-20 relative pb-0">
         {/* Top-left badge */}
         <div className="absolute top-6 left-6 bg-black text-white text-xs md:text-sm px-4 py-2 rounded-full">
            New Collection 2026
         </div>

         <div className="flex flex-col gap-5 justify-center lg:h-full">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold capitalize leading-tight">
               Unity in every <br />
               <span className="text-red-600">Thread</span>
            </h1>

            <p className="text-sm md:text-base text-gray-600 max-w-md">
               Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste commodi,
               nihil quae, modi molestiae a sequi nobis tempora qui amet et iure
               repellendus eveniet possimus earum ex magni repudiandae fuga.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-4">
               <button className="py-3 px-8 border-2 border-black bg-black text-white text-sm md:text-base">
                  For Women
               </button>
               <button className="py-3 px-8 border-2 border-black text-black text-sm md:text-base">
                  For Men
               </button>
            </div>
         </div>

         <div>
            <Image
               src={HeroImage}
               alt="Hero Image"
               draggable={false}
               priority
            />
         </div>

         <div className="col-span-3 flex flex-col justify-between h-[70vh] pl-10">
            <div className="relative group w-full aspect-4/5 bg-gray-100 rounded-2xl overflow-hidden shadow-sm">
               <Image
                  src={HeroImage2}
                  priority
                  alt="Sub feature"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
               />

               <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white mix-blend-difference">
                  <span className="text-xs font-medium">Host engaging</span>
                  <span className="text-sm font-bold">KES/USD</span>
               </div>
            </div>

            <div className="space-y-6 text-right">
               <div>
                  <h4 className="font-bold text-gray-900">Timeless Design</h4>
                  <p className="text-xs text-gray-500 leading-tight">
                     Crafted with clean lines and effortless style<br />
                     for every occasion.
                  </p>
               </div>

               <div>
                  <h4 className="font-bold text-gray-900">Sustainable Materials</h4>
                  <p className="text-xs text-gray-500 leading-tight">
                     Consciously sourced fabrics that feel as good<br />
                     as they look.
                  </p>
               </div>

               <div>
                  <h4 className="font-bold text-gray-900">Everyday Confidence</h4>
                  <p className="text-xs text-gray-500 leading-tight">
                     Wardrobe staples designed to move<br />
                     seamlessly with you.
                  </p>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Hero
