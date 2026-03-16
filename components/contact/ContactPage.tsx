"use client";

import React from "react";
import Link from "next/link";

const ContactPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <section className="mb-16">
        <p className="text-[10px] md:text-[11px] tracking-[0.5em] text-neutral-500 uppercase mb-4">
          DMA Studios
        </p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-neutral-900">
          Contact & Support
        </h1>
        <p className="mt-3 text-[13px] md:text-sm text-neutral-600 max-w-2xl">
          Reach Daima Mkenya Africa for orders, shipments, registry support, and
          partnership enquiries. Born in Nairobi, crafted for Kenya and the
          world.
        </p>
      </section>

      {/* Two-column layout */}
      <section className="grid gap-10 lg:grid-cols-[1.6fr,1.1fr]">
        {/* Left: form */}
        <div className="bg-white border border-neutral-200/70  p-6 md:p-8 shadow-sm">
          <p className="text-[10px] tracking-[0.4em] text-neutral-400 uppercase mb-6">
            Send a message
          </p>

          <form
            className="space-y-5"
            action="https://formspree.io/f/your-id" // or your own API route
            method="POST"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="name"
                  className="text-[11px] tracking-[0.25em] uppercase text-neutral-500"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  className="h-11 px-3 border border-neutral-200 bg-[#FDFDFD] text-sm text-neutral-900 outline-none focus:border-neutral-900 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-[11px] tracking-[0.25em] uppercase text-neutral-500"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="h-11 px-3 border border-neutral-200 bg-[#FDFDFD] text-sm text-neutral-900 outline-none focus:border-neutral-900 transition-colors"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="subject"
                  className="text-[11px] tracking-[0.25em] uppercase text-neutral-500"
                >
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="h-11 px-3 border border-neutral-200 bg-[#FDFDFD] text-[13px] text-neutral-800 outline-none focus:border-neutral-900 transition-colors"
                  defaultValue="general"
                >
                  <option value="general">General enquiry</option>
                  <option value="order">Order / shipment</option>
                  {/*<option value="wholesale">Wholesale / bulk</option>*/}
                  {/*<option value="partnership">Partnership / media</option>*/}
                  {/*<option value="support">Account / support</option>*/}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="phone"
                  className="text-[11px] tracking-[0.25em] uppercase text-neutral-500"
                >
                  Phone (optional)
                </label>
                <input
                  id="phone"
                  name="phone"
                  className="h-11 px-3 border border-neutral-200 bg-[#FDFDFD] text-sm text-neutral-900 outline-none focus:border-neutral-900 transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="message"
                className="text-[11px] tracking-[0.25em] uppercase text-neutral-500"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full px-3 py-2.5 border border-neutral-200 bg-[#FDFDFD] text-sm text-neutral-900 outline-none focus:border-neutral-900 resize-none transition-colors"
              />
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4 border-t border-neutral-200/70 mt-6">
              <p className="text-[11px] text-neutral-500">
                We aim to respond within{" "}
                <span className="font-semibold">1–2 business days</span>.
              </p>

              <button
                type="submit"
                className="group relative inline-flex items-center gap-4 py-3 px-10 border border-neutral-900 bg-neutral-900 text-white text-[10px] md:text-[11px] font-bold uppercase tracking-[0.35em] overflow-hidden"
              >
                <span className="relative z-10">Send Message</span>
                <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]" />
              </button>
            </div>
          </form>
        </div>

        {/* Right: contact details & registry context */}
        <aside className="space-y-8">
          <div className="bg-white border border-neutral-200/70  p-6 md:p-7 shadow-sm">
            <p className="text-[10px] tracking-[0.4em] text-neutral-400 uppercase mb-4">
              Direct contact
            </p>
            <div className="space-y-3 text-sm text-neutral-800">
              <div>
                <p className="text-[11px] tracking-[0.25em] uppercase text-neutral-500">
                  Phone
                </p>
                <p className="mt-1">+254 721 888 887</p>
              </div>
              <div>
                <p className="text-[11px] tracking-[0.25em] uppercase text-neutral-500">
                  E-mail
                </p>
                <Link
                  href="mailto:info@daimamkenyaafrica.com"
                  className="mt-1 inline-block underline-offset-4 hover:underline"
                >
                  info@daimamkenyaafrica.com
                </Link>
              </div>
              <div>
                <p className="text-[11px] tracking-[0.25em] uppercase text-neutral-500">
                  Address
                </p>
                <p className="mt-1 leading-relaxed">
                  P.O Box 63023, 00200
                  <br />
                  Nairobi, Kenya
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-neutral-200/70  p-6 md:p-7 shadow-sm">
            <p className="text-[10px] tracking-[0.4em] text-neutral-400 uppercase mb-4">
              Registry & Orders
            </p>
            <p className="text-[13px] text-neutral-700 mb-4">
              For registry admin access, shipment queries, or financial
              reporting, log in to your dashboard or reach our support team with
              your registry ID.
            </p>
            <Link
              href="/login"
              className="text-[11px] tracking-[0.25em] uppercase font-semibold text-neutral-900 underline-offset-4 hover:underline"
            >
              Go to Registry Login
            </Link>
          </div>

          <div className="bg-[#F5F5F5] border border-neutral-200/70  p-6 md:p-7">
            <p className="text-[10px] tracking-[0.4em] text-neutral-500 uppercase mb-3">
              Unity in every thread
            </p>
            <p className="text-[13px] text-neutral-700">
              Born in Kenya and worn everywhere, Daima Mkenya Africa is a
              celebration of identity, meaningful color, and considered design.
              Every message you send helps us craft better experiences for our
              community.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default ContactPage;
