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

      // Get sections
      const heroSection = document.querySelector("#hero-section");
      const newArrivalsSection = document.querySelector(".new-arrivals-section");
      
      if (heroSection && newArrivalsSection) {
        // Set initial state for NewArrivals - hidden behind hero
        gsap.set(newArrivalsSection, {
          opacity: 0,
          y: 100,
          scale: 0.95,
        });

        // Hero fade backward (push to back) animation
        ScrollTrigger.create({
          trigger: heroSection,
          start: "top top",
          end: "bottom top", // End when hero bottom reaches viewport top
          scrub: true,
          markers: false,
          id: "hero-fade-backward",
          onUpdate: (self) => {
            const progress = self.progress;
            
            // Hero fades backward (pushes to back) with scale and opacity
            gsap.to(heroSection, {
              opacity: 1 - (progress * 1.5), // Faster fade out
              scale: 1 - (progress * 0.2), // Scale down to go backward
              filter: `blur(${progress * 5}px)`, // Add blur for depth effect
              duration: 0,
            });
            
            // Hero background elements also fade
            const heroBackgrounds = heroSection.querySelectorAll(".bg-left-animated, .bg-right-animated");
            gsap.to(heroBackgrounds, {
              opacity: 1 - (progress * 1.8),
              duration: 0,
            });
            
            // Hero content elements fade faster - COMPLETELY FADE OUT FIRST
            const heroContent = heroSection.querySelectorAll(".hero-title-left, .hero-title-right, .model-image, .hero-copy, .shop-now-btn");
            gsap.to(heroContent, {
              opacity: Math.max(0, 1 - (progress * 3)), // Complete fade by 33%
              y: -progress * 40,
              duration: 0,
            });
            
            // New Arrivals section comes up from behind - DELAYED START
            // Only start appearing when hero is 40% faded
            const newArrivalsProgress = Math.max(0, (progress - 0.4) * 1.67); // Scale to 0-1 range
            gsap.to(newArrivalsSection, {
              opacity: Math.min(newArrivalsProgress * 3, 1),
              y: 100 - (newArrivalsProgress * 100),
              scale: 0.95 + (newArrivalsProgress * 0.05),
              duration: 0,
            });

            // New Arrivals header animation - DELAYED START
            const newArrivalsHeader = document.querySelector(".new-arrivals-header");
            const seeAllButton = document.querySelector(".see-all-button");
            
            if (newArrivalsHeader) {
              // Header appears slightly after section starts appearing
              const headerOpacity = Math.max(0, (progress - 0.45) * 2.5);
              gsap.to(newArrivalsHeader, {
                opacity: Math.min(headerOpacity, 1),
                y: 50 - (progress * 100),
                duration: 0,
              });
            }
            
            if (seeAllButton) {
              // Button appears last
              const buttonOpacity = Math.max(0, (progress - 0.5) * 2.5);
              gsap.to(seeAllButton, {
                opacity: Math.min(buttonOpacity, 1),
                y: 20 - (progress * 40),
                duration: 0,
              });
            }
          },
          onLeave: () => {
            // Ensure everything is fully visible when hero animation ends
            gsap.to(newArrivalsSection, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
            });
            
            gsap.to(".new-arrivals-header", {
              opacity: 1,
              y: 0,
              duration: 0.5,
            });
            
            gsap.to(".see-all-button", {
              opacity: 1,
              y: 0,
              duration: 0.5,
            });
            
            // Ensure hero content is completely gone
            gsap.to("#hero-section .hero-title-left, #hero-section .hero-title-right, #hero-section .model-image, #hero-section .hero-copy, #hero-section .shop-now-btn", {
              opacity: 0,
              duration: 0,
            });
          }
        });
      }

      // KEEP ALL EXISTING INITIAL ANIMATIONS FOR OTHER COMPONENTS
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