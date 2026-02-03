// components/AfricaDottedMap.tsx
"use client";

import { useMemo } from "react";
import DottedMap from "dotted-map";

export default function AfricaDottedMap() {
   const svgMap = useMemo(() => {
      const map = new DottedMap({
         height: 60,
         grid: "diagonal",
         // approximate bounding box of Africa
         region: {
            lat: { min: -35, max: 37 },   // from South Africa up to Mediterranean
            lng: { min: -20, max: 55 }    // from West Africa to Horn of Africa
         }
      });

      // optional: example pins (Nairobi & Lagos)
      map.addPin({
         lat: -1.286389,
         lng: 36.817223,
         svgOptions: { color: "#171717", radius: 0.5 }
      });

      return map.getSVG({
         radius: 0.22,
         color: "#e5e5e5",
         shape: "circle",
         backgroundColor: "transparent"
      });
   }, []);

   return (
      <div className=" flex justify-center mt-20 bg-transparent">
         <img
            src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
            alt="Dotted map of Africa"
            className="w-[40%] h-[40%]"
         />
      </div>
   );
}
