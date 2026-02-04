// app/providers/GSAPProvider.tsx
"use client";

import { ReactNode, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
}

export default function GSAPProvider({ children }: { children: ReactNode }) {
  const main = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Initialize ScrollSmoother for overall smooth scrolling
      const smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.5,
        effects: true,
        smoothTouch: 0.1,
        normalizeScroll: true,
        ignoreMobileResize: true,
      });

      // Get sections for layered pinning
      const heroSection = document.querySelector("#hero-section");
      const newArrivalsSection = document.querySelector(".new-arrivals-section");
      
      if (heroSection && newArrivalsSection) {
        // DEBUG: Add markers to see what's happening
        ScrollTrigger.config({
          ignoreMobileResize: true,
          autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"
        });

        // Make NewArrivals initially hidden and positioned
        gsap.set(newArrivalsSection, {
          opacity: 0,
          y: 50,
          scale: 0.95,
        });

        // Create the layered pinning effect between Hero and New Arrivals
        ScrollTrigger.create({
          trigger: heroSection,
          start: "top top",
          end: "+=100%", // Scroll 100% of viewport height
          pin: true,
          pinSpacing: false,
          scrub: true,
          markers: true, // ENABLE THIS TO SEE WHAT'S HAPPENING
          id: "hero-pin",
          onEnter: () => {
            console.log("Hero pin started");
          },
          onUpdate: (self) => {
            const progress = self.progress;
            console.log("Hero progress:", progress);
            
            // Animate Hero fade out
            const heroOverlay = heroSection.querySelector(".hero-overlay");
            if (heroOverlay) {
              gsap.to(heroOverlay, {
                opacity: Math.min(progress * 1.5, 1),
                duration: 0,
              });
            }
            
            // Animate Hero background COLLAPSE to center
            const leftBg = heroSection.querySelector(".bg-left-animated");
            const rightBg = heroSection.querySelector(".bg-right-animated");
            
            if (leftBg && rightBg) {
              // Collapse backgrounds back to center
              const collapseProgress = Math.min(progress * 1.8, 1);
              
              gsap.to(leftBg, {
                clipPath: `polygon(0 0, ${50 - (30 * collapseProgress)}% 0, ${50 - (30 * collapseProgress)}% 100%, 0 100%)`,
                opacity: 1 - (collapseProgress * 0.8),
                duration: 0,
              });
              
              gsap.to(rightBg, {
                clipPath: `polygon(${50 + (30 * collapseProgress)}% 0, 100% 0, 100% 100%, ${50 + (30 * collapseProgress)}% 100%)`,
                opacity: 1 - (collapseProgress * 0.8),
                duration: 0,
              });
            }
            
            // Animate Hero content fade out and scale down
            const heroTitles = heroSection.querySelectorAll(".hero-title-left, .hero-title-right");
            const heroCopy = heroSection.querySelector(".hero-copy");
            const modelImage = heroSection.querySelector(".model-image");
            const shopBtn = heroSection.querySelector(".shop-now-btn");
            
            if (heroTitles.length > 0) {
              gsap.to(heroTitles, {
                opacity: 1 - (progress * 1.5),
                y: progress * 40,
                scale: 1 - (progress * 0.25),
                duration: 0,
              });
            }
            
            if (heroCopy) {
              gsap.to(heroCopy, {
                opacity: 1 - (progress * 2),
                y: progress * 50,
                duration: 0,
              });
            }
            
            if (modelImage) {
              gsap.to(modelImage, {
                opacity: 1 - (progress * 1.2),
                scale: 1 - (progress * 0.2),
                duration: 0,
              });
            }
            
            if (shopBtn) {
              gsap.to(shopBtn, {
                opacity: 1 - (progress * 2),
                y: progress * 40,
                duration: 0,
              });
            }
            
            // Animate New Arrivals coming IN FROM BELOW (layered above)
            // Start at y: 50, end at y: 0 (normal position)
            gsap.to(newArrivalsSection, {
              y: 50 - (progress * 50), // Start at 50px below, end at 0
              opacity: Math.min(progress * 3, 1), // Faster fade in
              scale: 0.95 + (progress * 0.05),
              duration: 0,
              ease: "power2.out",
            });

            // Animate New Arrivals header and see-all link
            const newArrivalsHeader = document.querySelector(".new-arrivals-header");
            const seeAllLink = document.querySelector(".see-all-link");
            
            if (newArrivalsHeader) {
              gsap.to(newArrivalsHeader, {
                opacity: Math.min(progress * 4, 1),
                y: 30 - (progress * 30),
                duration: 0,
              });
            }
            
            if (seeAllLink) {
              gsap.to(seeAllLink, {
                opacity: Math.min(progress * 4, 1),
                y: 30 - (progress * 30),
                duration: 0,
              });
            }
          },
          onLeave: () => {
            console.log("Hero pin ended");
            // Ensure NewArrivals is fully visible when Hero pin ends
            gsap.to(newArrivalsSection, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
            });
            
            gsap.to(".new-arrivals-header, .see-all-link", {
              opacity: 1,
              y: 0,
              duration: 0.5,
            });
          }
        });
      }

      // Initial split background animations
      gsap.from(".bg-left-animated", {
        x: -200,
        opacity: 0,
        duration: 1.8,
        ease: "power3.out",
        delay: 0.2,
      });

      gsap.from(".bg-right-animated", {
        x: 200,
        opacity: 0,
        duration: 1.8,
        delay: 0.4,
        ease: "power3.out",
      });

      // Hero title animations on page load
      gsap.from(".hero-title-left", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.8,
      });

      gsap.from(".hero-title-right", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        delay: 1.0,
        ease: "power3.out",
      });

      // Model image animation
      gsap.from(".model-image", {
        opacity: 0,
        scale: 0.9,
        duration: 1.5,
        delay: 1.2,
        ease: "power2.out",
      });

      gsap.from(".hero-copy", {
        y: 40,
        opacity: 0,
        duration: 1,
        delay: 1.4,
        ease: "power2.out",
      });

      // Shop button animation
      gsap.from(".shop-now-btn", {
        y: 40,
        opacity: 0,
        duration: 1,
        delay: 1.6,
        ease: "power2.out",
      });

      return () => {
        smoother.kill();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    }, main);

    return () => ctx.revert();
  }, []);

  return (
    <div id="smooth-wrapper" ref={main}>
      <div id="smooth-content">{children}</div>
    </div>
  );
}