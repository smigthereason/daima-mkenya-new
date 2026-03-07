"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Loader2, ArrowRight } from "lucide-react";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

interface OneOffArchiveProps {
  limit?: number;
  title?: string;
  subtitle?: string;
}

interface OneOffPiece {
  _id: string;
  name: string;
  image: any;
  editionInfo?: string;
  description: string[];
  status?: string;
}

export default function OneOffArchive({
  limit,
  title = "Singular Pieces",
  subtitle = "Excellence & Master Craftsmanship",
}: OneOffArchiveProps) {
  const [pieces, setPieces] = useState<OneOffPiece[]>([]);
  const [loading, setLoading] = useState(true);

  const CONTACT_EMAIL = "info@daimamkenyaafrica.com";

  useEffect(() => {
    const fetchArchive = async () => {
      setLoading(true);
      try {
        const query = limit
          ? `*[_type == "oneOff"] | order(_createdAt desc) [0...${limit}]`
          : `*[_type == "oneOff"] | order(_createdAt desc)`;

        // We use { useCdn: false } to get the most absolute recent data
        // and { cache: "no-store" } to tell Next.js not to save the result.
        const data = await client.withConfig({ useCdn: false }).fetch(
          query,
          {},
          {
            cache: "no-store",
            next: { revalidate: 0 },
          },
        );

        setPieces(data);
      } catch (error) {
        console.error("Sanity fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArchive();
  }, [limit]);

  const getGmailUrl = (pieceName: string) => {
    const subject = encodeURIComponent(`Inquiry: ${pieceName}`);
    const body = encodeURIComponent(
      `Hello,\n\nI am interested in inquiring about the archival piece: ${pieceName}.\n\nPlease provide more details regarding acquisition.\n\nThank you.`,
    );
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}&su=${subject}&body=${body}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-60 bg-[#F9F9F8]">
        <Loader2
          className="animate-spin text-[#1A1A1A] font-light"
          size={24}
          strokeWidth={1}
        />
      </div>
    );
  }

  // If we still see 0 items, we return a small debug message instead of null
  if (pieces.length === 0) {
    return (
      <div className="py-20 text-center bg-[#F9F9F8] text-[10px] uppercase tracking-widest text-neutral-400">
        No archival pieces found in database.
      </div>
    );
  }

  return (
    <section className="bg-[#F9F9F8] py-24 md:py-40 px-6 md:px-12 overflow-hidden">
      <div className="max-w-[1600px] mx-auto">
        <header className="mb-24 md:mb-32 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-black/10 pb-12">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.4em] text-[#868682] mb-6 font-medium">
              {subtitle}
            </p>
            <h2 className="text-5xl md:text-7xl font-light tracking-tight text-[#1A1A1A] leading-[1.1] family-serif">
              {title}
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-sm text-[#4D4D4D] leading-relaxed font-light">
              Discover a curated selection of singular creations. Each piece
              represents a pinnacle of craft, available only through our private
              client relations.
            </p>
          </div>
        </header>

        <div className="space-y-32 md:space-y-64">
          {pieces.map((piece, index) => (
            <div
              key={piece._id}
              className={`flex flex-col ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } items-center gap-12 md:gap-24`}
            >
              <div className="w-full md:w-3/5 relative group cursor-pointer overflow-hidden bg-white p-4 md:p-12 shadow-sm">
                <div className="relative aspect-[4/5] overflow-hidden">
                  {piece.image && (
                    <Image
                      src={urlFor(piece.image).url()}
                      alt={piece.name}
                      fill
                      className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
                      unoptimized
                    />
                  )}
                </div>
                <div className="absolute bottom-6 right-10 opacity-20 group-hover:opacity-100 transition-opacity">
                  <p className="text-[10px] tracking-[0.5em] uppercase font-bold italic">
                    Private Collection
                  </p>
                </div>
              </div>

              <div className="w-full md:w-2/5 flex flex-col items-start space-y-8">
                <div className="space-y-4">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#868682]">
                    {piece.editionInfo || "Edition 1/1"}
                  </span>
                  <h3 className="text-4xl md:text-5xl font-light text-[#1A1A1A] tracking-tight">
                    {piece.name}
                  </h3>
                  <div className="w-12 h-[1px] bg-[#1A1A1A]" />
                </div>

                <div className="space-y-2">
                  {Array.isArray(piece.description) ? (
                    piece.description.map((line: string, idx: number) => (
                      <p
                        key={idx}
                        className="text-[#4D4D4D] text-sm leading-loose font-light max-w-sm"
                      >
                        {line}
                      </p>
                    ))
                  ) : (
                    <p className="text-[#4D4D4D] text-sm leading-loose font-light max-w-sm">
                      A bespoke creation embodying the essence of contemporary
                      luxury and traditional artistry.
                    </p>
                  )}
                </div>
                {/*CTA BUTTON*/}
                <div className="pt-4">
                  {piece.status === "sold" ? (
                    <div className="pt-4">
                      <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#868682] border border-[#868682]/20 px-6 py-3">
                        Acquired
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="mt-6 md:mt-10">
                        <a
                          href={getGmailUrl(piece.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative inline-flex items-center gap-3 md:gap-4 lg:gap-6 xl:gap-8 py-4 md:py-5 lg:py-6 xl:py-8 px-8 md:px-10 lg:px-12 xl:px-16 border border-black/10 overflow-hidden transition-all hover:border-black"
                        >
                          <span className="relative z-10 text-[9px] md:text-[10px] lg:text-[11px] xl:text-[11px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] lg:tracking-[0.5em] xl:tracking-[0.8em] group-hover:text-white transition-colors duration-500">
                            Enquire on {piece.name}
                          </span>
                          <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                        </a>
                      </div>
                      <p className="text-[9px] text-gray-400 mt-6 uppercase tracking-widest">
                        Inquiries: {CONTACT_EMAIL}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
