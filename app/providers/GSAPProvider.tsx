// app/providers/GSAPProvider.tsx
"use client";
import { ReactNode, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

export default function GSAPProvider({ children }: { children: ReactNode }) {
  const main = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const paths = document.querySelectorAll(".shape-overlays__path");
      const overlaySvg = document.querySelector(".shape-overlays");
      const numPoints = 10;
      const numPaths = paths.length;
      const delayPerPath = 0.15;
      
      const allPoints: any[] = [];
      for (let i = 0; i < numPaths; i++) {
        const points = [];
        for (let j = 0; j < numPoints; j++) points.push(100); // Start at bottom (100)
        allPoints.push(points);
      }

      const renderPath = () => {
        for (let i = 0; i < numPaths; i++) {
          const path = paths[i];
          const points = allPoints[i];
          let d = `M 0 0 V ${points[0]} C`;
          for (let j = 0; j < numPoints - 1; j++) {
            const p = ((j + 1) / (numPoints - 1)) * 100;
            const cp = p - (1 / (numPoints - 1) * 100) / 2;
            d += ` ${cp} ${points[j]} ${cp} ${points[j + 1]} ${p} ${points[j + 1]}`;
          }
          d += ` V 100 H 0`;
          path.setAttribute("d", d);
        }
      };

      // CRITICAL: Render the initial state immediately
      renderPath();

      const heroSection = document.querySelector("#hero-section");
      
      if (heroSection) {
        ScrollTrigger.create({
          trigger: heroSection,
          start: "top top",
          end: "bottom top",
          scrub: 1, // Add a little smoothing to the liquid movement
          onUpdate: (self) => {
            const progress = self.progress;
            
            allPoints.forEach((points, pathIndex) => {
              // Create a staggered effect between the two color layers
              const pathDelay = pathIndex * delayPerPath;
              const adjustedProgress = Math.max(0, (progress - pathDelay) / (1 - delayPerPath));
              
              for (let j = 0; j < numPoints; j++) {
                // This formula drives the "y" points from 100 down to 0
                points[j] = 100 - (adjustedProgress * 120); // 120 ensures it clears the screen fully
              }
            });

            renderPath();

            // Toggle visibility to ensure it doesn't block clicks on content below
            if (progress > 0.95) {
              gsap.set(overlaySvg, { autoAlpha: 0 });
            } else {
              gsap.set(overlaySvg, { autoAlpha: 1 });
            }
          }
        });
      }

      ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.5,
      });

    }, main);
    return () => ctx.revert();
  }, []);

  return (
    <div id="smooth-wrapper" ref={main}>
      <div id="smooth-content">{children}</div>
    </div>
  );
}