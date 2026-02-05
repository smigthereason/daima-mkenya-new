// components/landing-page/SdgCommitment.tsx
"use client";

import React, { useRef, useEffect } from 'react';
import { Briefcase, Factory, Recycle, Leaf, Target, Eye, Heart, Award } from 'lucide-react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(SplitText, ScrollTrigger);
}

const SdgCommitment = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const aboutTitleRef = useRef<HTMLHeadingElement>(null);
  const visionRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const descriptionRefs = useRef<HTMLParagraphElement[]>([]);
  const sdgTitleRefs = useRef<HTMLHeadingElement[]>([]);
  const sdgDescRefs = useRef<HTMLParagraphElement[]>([]);
  
  // Kenyan colors
  const kenyanColors = [
    '#000000', // Black - represents the people
    '#BB0000', // Red - symbolizes the struggle for freedom
    '#008000', // Green - celebrates land and natural wealth
    '#FFFFFF', // White - stands for peace and unity
    '#FFD700', // Gold - additional color for accent
  ];

  const commitments = [
    {
      id: 8,
      title: "SDG 8: Decent Work",
      description: "Promoting sustained, inclusive economic growth, full and productive employment, and decent work for all.",
      icon: <Briefcase className="w-8 h-8" strokeWidth={1.5} />,
      color: kenyanColors[0], // Black
    },
    {
      id: 9,
      title: "SDG 9: Innovation",
      description: "Building resilient infrastructure, promoting inclusive and sustainable industrialization and fostering innovation.",
      icon: <Factory className="w-8 h-8" strokeWidth={1.5} />,
      color: kenyanColors[1], // Red
    },
    {
      id: 12,
      title: "SDG 12: Responsible Production",
      description: "Ensuring sustainable consumption and production patterns through resource efficiency and waste reduction.",
      icon: <Recycle className="w-8 h-8" strokeWidth={1.5} />,
      color: kenyanColors[2], // Green
    },
    {
      id: 13,
      title: "SDG 13: Climate Action",
      description: "Taking urgent action to combat climate change and its impacts through sustainable practices and advocacy.",
      icon: <Leaf className="w-8 h-8" strokeWidth={1.5} />,
      color: kenyanColors[4], // Gold (accent)
    },
  ];

  const aboutUsItems = [
    {
      title: "Vision",
      description: "To give identity elegance and presence, locally and globally.",
      icon: <Target className="w-6 h-6" strokeWidth={1.5} />,
      color: kenyanColors[1], // Red
    },
    {
      title: "Mission",
      description: "To curate timeless natural fiber apparel that endure, and reflect pride.",
      icon: <Eye className="w-6 h-6" strokeWidth={1.5} />,
      color: kenyanColors[2], // Green
    },
    {
      title: "Values",
      description: "Authenticity, innovation, sustainability, craftsmanship, integrity.",
      icon: <Heart className="w-6 h-6" strokeWidth={1.5} />,
      color: kenyanColors[0], // Black
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate About Us title with lines
      if (aboutTitleRef.current) {
        const splitAbout = new SplitText(aboutTitleRef.current, { type: 'lines' });
        
        gsap.from(splitAbout.lines, {
          y: 80,
          opacity: 0,
          rotationX: -50,
          transformOrigin: "50% 50% -100px",
          duration: 1.2,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: aboutTitleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          }
        });
      }

      // Animate SDG title with lines
      if (titleRef.current) {
        const splitTitle = new SplitText(titleRef.current, { type: 'lines' });
        
        gsap.from(splitTitle.lines, {
          y: 80,
          opacity: 0,
          rotationX: -50,
          transformOrigin: "50% 50% -100px",
          duration: 1.2,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          }
        });
      }

      // Animate Vision, Mission, Values with word animations
      [visionRef, missionRef, valuesRef].forEach((ref, index) => {
        if (ref.current) {
          const container = ref.current;
          const title = container.querySelector('h3');
          const desc = container.querySelector('p');
          
          if (title && desc) {
            // Animate title with characters
            const splitTitle = new SplitText(title, { type: 'chars' });
            gsap.from(splitTitle.chars, {
              y: 30,
              opacity: 0,
              duration: 0.8,
              ease: "back.out(1.7)",
              stagger: 0.03,
              delay: index * 0.2,
              scrollTrigger: {
                trigger: container,
                start: "top 85%",
                toggleActions: "play none none reverse",
              }
            });
            
            // Animate description with words
            const splitDesc = new SplitText(desc, { type: 'words' });
            gsap.from(splitDesc.words, {
              y: 20,
              opacity: 0,
              rotation: "random(-10, 10)",
              duration: 0.7,
              ease: "power2.out",
              stagger: 0.05,
              delay: (index * 0.2) + 0.3,
              scrollTrigger: {
                trigger: container,
                start: "top 85%",
                toggleActions: "play none none reverse",
              }
            });
          }
        }
      });

      // Animate brand story paragraphs with lines
      descriptionRefs.current.forEach((paragraph, index) => {
        if (paragraph) {
          const splitLines = new SplitText(paragraph, { type: 'lines' });
          
          gsap.from(splitLines.lines, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.1,
            delay: index * 0.1,
            scrollTrigger: {
              trigger: paragraph,
              start: "top 90%",
              toggleActions: "play none none reverse",
            }
          });
        }
      });

      // Animate SDG cards with word animations
      sdgTitleRefs.current.forEach((title, index) => {
        if (title) {
          const splitTitle = new SplitText(title, { type: 'words' });
          
          gsap.from(splitTitle.words, {
            y: 30,
            opacity: 0,
            duration: 0.7,
            ease: "back.out(1.7)",
            stagger: 0.05,
            delay: index * 0.1,
            color: kenyanColors[index % kenyanColors.length],
            scrollTrigger: {
              trigger: title,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            onComplete: () => {
              gsap.to(splitTitle.words, {
                color: '#1f2937', // gray-900
                duration: 0.5,
              });
            }
          });
        }
      });

      // Animate SDG descriptions with characters
      sdgDescRefs.current.forEach((desc, index) => {
        if (desc) {
          const splitDesc = new SplitText(desc, { type: 'chars' });
          
          gsap.from(splitDesc.chars, {
            y: 10,
            opacity: 0,
            duration: 0.4,
            ease: "power2.out",
            stagger: 0.01,
            delay: (index * 0.15) + 0.3,
            scrollTrigger: {
              trigger: desc,
              start: "top 85%",
              toggleActions: "play none none reverse",
            }
          });
        }
      });

      // Animate CTA button
      const ctaButton = document.querySelector('.cta-button');
      if (ctaButton) {
        gsap.from(ctaButton, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ctaButton,
            start: "top 90%",
            toggleActions: "play none none reverse",
          }
        });
      }

      // Animate final tagline
      const tagline = document.querySelector('.tagline');
      if (tagline) {
        const splitTagline = new SplitText(tagline, { type: 'chars' });
        
        gsap.from(splitTagline.chars, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.02,
          scrollTrigger: {
            trigger: tagline,
            start: "top 90%",
            toggleActions: "play none none reverse",
          }
        });
      }

      // Transition animation to footer
      const footerSection = document.querySelector('.footer-section');
      if (sectionRef.current && footerSection) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "bottom bottom",
          end: "+=100%",
          pin: true,
          pinSpacing: false,
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            
            // Fade out SDG content
            gsap.to(sectionRef.current, {
              opacity: 1 - (progress * 1.5),
              y: progress * -100,
              scale: 1 - (progress * 0.2),
              duration: 0,
            });
            
            // Fade in footer content
            gsap.to(footerSection, {
              opacity: progress * 1.5,
              y: (1 - progress) * 50,
              duration: 0,
            });
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="scroll-section sdg-section bg-white py-16 px-4 sm:px-6 lg:px-8 sdg-section-wrapper"
      id="sdg-section"
    >
      <div className="max-w-7xl mx-auto">
        {/* About Us Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 
              ref={aboutTitleRef}
              className="text-2xl md:text-3xl font-light tracking-widest uppercase text-gray-800 mb-4"
            >
              About Us
            </h2>
            <div className="flex justify-center mb-8">
              <Award className="w-10 h-10 text-gray-700" strokeWidth={1.5} />
            </div>
          </div>

          {/* Vision, Mission, Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {aboutUsItems.map((item, index) => (
              <div 
                key={index} 
                ref={index === 0 ? visionRef : index === 1 ? missionRef : valuesRef}
                className="flex flex-col items-center text-center p-6 rounded-lg transition-all duration-300 hover:bg-gray-50 group"
              >
                <div 
                  className="mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ color: item.color }}
                >
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Brand Story */}
          <div className="text-center max-w-4xl mx-auto">
            <p 
              ref={el => descriptionRefs.current[0] = el as HTMLParagraphElement}
              className="text-gray-700 mb-6 leading-relaxed"
            >
              Daima Mkenya Africa is a celebration of identity, crafted with intention. Our approach is deliberate: meaningful color, uncompromising quality, and considered design.
            </p>
            <p 
              ref={el => descriptionRefs.current[1] = el as HTMLParagraphElement}
              className="text-gray-700 mb-6 leading-relaxed"
            >
              Our color palette draws inspiration from the colors of the Kenyan flag - our symbol of unity and pride. Its colours are rich with meaning: black represents the people, red symbolizes the struggle for freedom, green celebrates our land and natural wealth, and white stands for peace and unity. Together, they reflect the spirit and pride of Kenya.
            </p>
            <p 
              ref={el => descriptionRefs.current[2] = el as HTMLParagraphElement}
              className="text-gray-700 mb-6 leading-relaxed"
            >
              We work exclusively with sustainable natural fibres, honoring the purity of material and the integrity of craft. Our fabrics are designed to endure. They are timeless in form, elevated in detail, and uncompromising in quality. They are simply worn with quiet confidence.
            </p>
            <p 
              ref={el => descriptionRefs.current[3] = el as HTMLParagraphElement}
              className="text-gray-700 leading-relaxed"
            >
              At Daima Mkenya Africa, we believe that identity is a story best worn. Born in Kenya, yet destined for the world, our collection carry pride, passion, and timeless elegance that transcend borders. Each design is thoughtfully conceived, drawing inspiration from the stories they carry, while balancing heritage with contemporary sophistication. We invite you to wear more than a design. Wear a connection, a legacy, a statement that is meaningful, considered, and enduring. Born here. Worn everywhere.
            </p>
          </div>
        </div>

        {/* Main Title for SDG Section */}
        <div className="text-center mb-16">
          <h2 
            ref={titleRef}
            className="text-2xl md:text-3xl font-light tracking-widest uppercase text-gray-800"
          >
            Our Commitment to Sustainable Development Goals
          </h2>
        </div>

        {/* Commitment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {commitments.map((item, index) => (
            <div 
              key={item.id} 
              className="sdg-card flex flex-col items-center group"
            >
              {/* Icon Container */}
              <div 
                className="mb-6 transition-transform duration-300 group-hover:scale-110"
                style={{ color: item.color }}
              >
                {item.icon}
              </div>

              {/* Title */}
              <h3 
                ref={el => sdgTitleRefs.current[index] = el as HTMLHeadingElement}
                className="text-lg font-bold text-gray-900 mb-4 tracking-tight"
              >
                {item.title}
              </h3>

              {/* Description */}
              <p 
                ref={el => sdgDescRefs.current[index] = el as HTMLParagraphElement}
                className="text-gray-500 text-sm leading-relaxed max-w-xs"
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Sub-footer Section */}
        <div className="mt-16 pt-8 border-t border-gray-100 text-center">
          <span className="tagline text-sm tracking-[0.3em] uppercase text-gray-400 font-medium">
            Building a Better Future
          </span>
        </div>
      </div>
    </section>
  );
};

export default SdgCommitment;