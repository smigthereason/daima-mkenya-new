// components/AfricaDottedMap.tsx
"use client";

import { useMemo } from "react";
import DottedMap from "dotted-map";

export default function AfricaDottedMap() {
   const svgMap = useMemo(() => {
      const map = new DottedMap({
         height: 60,
         grid: "diagonal",
         // Full Africa view
         region: {
            lat: { min: -35, max: 37 },
            lng: { min: -20, max: 55 }
         }
      });

      // Add pin for Nairobi
      map.addPin({
         lat: -1.286389,
         lng: 36.817223,
         svgOptions: { 
            color: "#ef4444",
            radius: 0.6
         }
      });

      return map.getSVG({
         radius: 0.22,
         color: "#a3a3a3",
         shape: "circle",
         backgroundColor: "transparent",
         borderColor: "#eab308",  // Yellow for country borders
         borderWidth: 0.3
      });
   }, []);

   return (
      <div className="flex justify-center mt-20 bg-transparent">
         <img
            src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
            alt="Dotted map of Africa with Nairobi marked"
            className="w-[40%] h-[40%]"
         />
      </div>
   );
}