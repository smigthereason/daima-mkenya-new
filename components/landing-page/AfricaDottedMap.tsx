/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useEffect, useState } from "react";
import * as d3 from "d3-geo";
import { feature } from "topojson-client";

export default function AfricaDottedMap() {
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then((res) => res.json())
      .then((data) => {
        const world = feature(data, data.objects.countries) as any;
        const africanNations = [
          "Algeria",
          "Angola",
          "Benin",
          "Botswana",
          "Burkina Faso",
          "Burundi",
          "Cameroon",
          "Cape Verde",
          "Central African Rep.",
          "Chad",
          "Comoros",
          "Congo",
          "Democratic Republic of the Congo",
          "Djibouti",
          "Egypt",
          "Equatorial Guinea",
          "Eritrea",
          "Ethiopia",
          "Gabon",
          "Gambia",
          "Ghana",
          "Guinea",
          "Guinea-Bissau",
          "Ivory Coast",
          "Kenya",
          "Lesotho",
          "Liberia",
          "Libya",
          "Madagascar",
          "Malawi",
          "Mali",
          "Mauritania",
          "Mauritius",
          "Morocco",
          "Mozambique",
          "Namibia",
          "Niger",
          "Nigeria",
          "Rwanda",
          "Sao Tome and Principe",
          "Senegal",
          "Seychelles",
          "Sierra Leone",
          "Somalia",
          "South Africa",
          "South Sudan",
          "Sudan",
          "Swaziland",
          "Tanzania",
          "Togo",
          "Tunisia",
          "Uganda",
          "Zambia",
          "Zimbabwe",
          "Western Sahara",
        ];
        const africa = world.features.filter((f: any) =>
          africanNations.includes(f.properties.name),
        );
        setGeoData({ type: "FeatureCollection", features: africa });
      });
  }, []);

  const { projection, pathGenerator } = useMemo(() => {
    const projection = d3
      .geoMercator()
      .center([18, 5])
      .scale(420)
      .translate([400, 300]);
    const pathGenerator = d3.geoPath().projection(projection);
    return { projection, pathGenerator };
  }, []);

  const nairobi = useMemo(() => projection([36.8219, -1.2921]), [projection]);

  return (
    <section className="relative overflow-hidden flex flex-col items-center bg-linear-to-r from-[#BB0000] via-neutral-300 to-[#008000]">
      {/* ── MOBILE LAYOUT (flex column, no absolute positioning) ── */}
      <div className="flex flex-col items-center w-full md:hidden py-12 px-6 gap-8">
        {/* Header row */}
        <div className="flex justify-between w-full items-start">
          <div>
            <span className="text-[8px] tracking-[0.5em] text-neutral-400 uppercase block mb-1">
              The Source
            </span>
            <p className="text-[10px] font-medium tracking-[0.2em] text-white">
              IDENTITY • PRIDE
            </p>
            <div className="w-8 h-px bg-white/40 mt-2" />
          </div>
          <div className="text-right">
            <span className="text-[8px] tracking-[0.5em] text-neutral-200 uppercase block mb-1">
              Collection
            </span>
            <p className="text-[10px] font-medium tracking-[0.2em] text-white">
              CULTURE • HERITAGE
            </p>
          </div>
        </div>

        {/* Title */}
        <div className="text-center z-10 w-full">
          <h2 className="text-4xl font-serif tracking-tighter text-neutral-500 uppercase leading-[0.85] mb-4">
            Unity in Every <br />
            <span className="italic font-light">Thread</span>
          </h2>
          <div className="h-10 w-px bg-neutral-900 mx-auto" />
        </div>

        {/* Map */}
        <div className="relative w-full flex flex-col items-center">
          {geoData ? (
            <>
              <svg
                viewBox="0 0 800 600"
                className="w-full h-auto select-none drop-shadow-xl overflow-visible"
              >
                <defs>
                  <pattern
                    id="dotPatternMain"
                    x="0"
                    y="0"
                    width="10"
                    height="10"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="2" cy="2" r="1.2" fill="black" opacity="0.5" />
                  </pattern>
                </defs>
                <g>
                  {geoData.features.map((feature: any, i: number) => {
                    const isKenya = feature.properties.name === "Kenya";
                    return (
                      <path
                        key={i}
                        d={pathGenerator(feature) || ""}
                        fill="url(#dotPatternMain)"
                        stroke={isKenya ? "#BB0000" : "#000000"}
                        strokeWidth={isKenya ? "2" : "0.9"}
                        strokeOpacity={isKenya ? "1" : "0.8"}
                        className="transition-all duration-500"
                      />
                    );
                  })}
                </g>
                {nairobi && (
                  <g transform={`translate(${nairobi[0]}, ${nairobi[1]})`}>
                    <circle
                      r="12"
                      fill="#BB0000"
                      className="animate-ping opacity-20"
                    />
                    <circle
                      r="4"
                      fill="black"
                      stroke="white"
                      strokeWidth="1.5"
                    />
                  </g>
                )}
              </svg>

              {/* Nairobi label — below map on mobile */}
              <div className="mt-2 flex items-center justify-center">
                <div className="flex flex-col bg-linear-to-r from-[#BB0000] via-white/10 to-[#008000] backdrop-blur-md px-4 py-2 rounded-sm border border-white/20">
                  <span className="text-[9px] tracking-[0.4em] font-bold text-white uppercase">
                    Daima Mkenya HQ
                  </span>
                  <span className="text-[8px] text-neutral-900 font-mono tracking-tighter">
                    1.2921° S, 36.8219° E
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <span className="text-white tracking-[0.5em] text-[10px] uppercase animate-pulse">
                Mapping Identity...
              </span>
            </div>
          )}
        </div>

        {/* Quote */}
        <p className="text-[13px] leading-relaxed text-neutral-300 tracking-wide uppercase text-center px-2">
          &quot;A stitch that binds a continent, a design that speaks to the
          world.&quot;
        </p>

        {/* Footer coords */}
        <div className="text-center pb-4">
          <div className="w-12 h-px bg-white/20 mb-3 mx-auto" />
          <p className="text-[11px] font-mono text-neutral-800 tracking-[0.3em] uppercase">
            BORN HERE
          </p>
          <p className="text-[11px] text-neutral-800 uppercase tracking-[0.4em] mt-1 font-bold">
            WORN EVERYWHERE
          </p>
        </div>
      </div>

      {/* ── TABLET + DESKTOP LAYOUT (original absolute positioning) ── */}
      <div className="hidden md:flex flex-col items-center w-full min-h-screen py-40 relative justify-center">
        {/* Top-Left */}
        <div className="absolute top-24 left-10 md:left-24 z-10">
          <span className="text-[8px] md:text-[10px] tracking-[0.6em] text-neutral-400 uppercase block mb-2">
            The Source
          </span>
          <p className="text-xs font-medium tracking-[0.2em] text-white">
            IDENTITY • PRIDE
          </p>
          <div className="w-12 h-px bg-white/40 mt-2 md:mt-6" />
        </div>

        {/* Top-Right */}
        <div className="absolute top-24 right-10 md:right-24 z-10 text-right">
          <span className="text-[10px] tracking-[0.5em] text-neutral-200 uppercase block mb-2">
            Collection
          </span>
          <p className="text-xs font-medium tracking-[0.2em] text-white">
            CULTURE • HERITAGE
          </p>
        </div>

        {/* Center Branding */}
        <div className="text-center mb-16 z-10 px-6 relative">
          <h2 className="text-5xl md:text-8xl font-serif tracking-tighter text-neutral-500 uppercase leading-[0.85] mb-6">
            Unity in Every <br />
            <span className="italic font-light">Thread</span>
          </h2>
          <div className="h-20 w-px bg-neutral-900 mx-auto" />
        </div>

        {/* Map */}
        <div className="relative w-full max-w-6xl flex justify-center items-center z-10 mt-10">
          {geoData ? (
            <svg
              viewBox="0 0 800 600"
              className="w-[95%] md:w-[70%] h-auto select-none drop-shadow-8xl overflow-visible"
            >
              <defs>
                <pattern
                  id="dotPatternMainDesktop"
                  x="0"
                  y="0"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="2" cy="2" r="1.2" fill="black" opacity="0.5" />
                </pattern>
              </defs>
              <g>
                {geoData.features.map((feature: any, i: number) => {
                  const isKenya = feature.properties.name === "Kenya";
                  return (
                    <path
                      key={i}
                      d={pathGenerator(feature) || ""}
                      fill="url(#dotPatternMainDesktop)"
                      stroke={isKenya ? "#BB0000" : "#000000"}
                      strokeWidth={isKenya ? "2" : "0.9"}
                      strokeOpacity={isKenya ? "1" : "0.8"}
                      className="transition-all duration-500"
                    />
                  );
                })}
              </g>
              {nairobi && (
                <g transform={`translate(${nairobi[0]}, ${nairobi[1]})`}>
                  <circle
                    r="12"
                    fill="#BB0000"
                    className="animate-ping opacity-20"
                  />
                  <circle r="4" fill="black" stroke="white" strokeWidth="1.5" />
                </g>
              )}
            </svg>
          ) : (
            <div className="h-100 flex items-center justify-center">
              <span className="text-white tracking-[0.5em] text-[10px] uppercase animate-pulse">
                Mapping Identity...
              </span>
            </div>
          )}

          {/* Nairobi Marker Overlay */}
          <div
            className="absolute hidden md:flex items-center gap-6 pointer-events-none"
            style={{ left: "64%", top: "51.5%" }}
          >
            <div className="flex flex-col bg-linear-to-r from-[#BB0000] via-white/10 to-[#008000] backdrop-blur-md px-4 py-2 rounded-sm border border-white/20">
              <span className="text-[10px] tracking-[0.4em] font-bold text-white uppercase">
                Daima Mkenya HQ
              </span>
              <span className="text-[9px] text-neutral-900 font-mono tracking-tighter">
                1.2921° S, 36.8219° E
              </span>
            </div>
          </div>
        </div>

        {/* Bottom-Left Quote */}
        <div className="absolute bottom-24 left-10 md:left-24 z-10 max-w-lg hidden lg:block">
          <p className="text-[20px] leading-relaxed text-neutral-300 tracking-wide uppercase">
            &quot;A stitch that binds a continent, a design that speaks to the
            world.&quot;
          </p>
        </div>

        {/* Bottom-Right Coords */}
        <div className="absolute bottom-12 md:bottom-24 right-10 md:right-24 z-10 text-right">
          <div className="w-16 h-px bg-white/20 mb-4 md:mb-6 ml-auto" />
          <p className="text-[10px] md:text-[14px] font-mono text-neutral-800 tracking-[0.3em] uppercase">
            BORN HERE
          </p>
          <p className="text-[10px] md:text-[16px] text-neutral-800 uppercase tracking-[0.5em] mt-2 font-bold">
            WORN EVERYWHERE
          </p>
        </div>
      </div>
    </section>
  );
}
