"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="pb-20 flex flex-col md:flex-row items-center justify-between gap-14 mt-20 px-4 md:px-16 lg:px-24 xl:px-32">
      <div className="flex flex-col items-center md:items-start max-w-xl">

        <h1 className="text-center md:text-left text-4xl md:text-5xl font-semibold leading-snug text-slate-900">
          Shop the latest products with a seamless cart & checkout experience.
        </h1>

        <p className="mt-4 text-center md:text-left text-base text-slate-600 leading-relaxed">
          Discover curated products from top categories. Compare prices, check reviews,
          add items to your cart, and enjoy a smooth and secure checkout process.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-4 text-sm">
          <Link
            href="/products"
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-7 h-11 flex items-center justify-center font-medium"
          >
            Start shopping
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Secure payments
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Fast delivery
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Easy returns
          </div>
        </div>
      </div>

      <div className="flex justify-center md:justify-end w-full">
        <Image
          width={800}
          height={800}
          src="https://img.freepik.com/free-photo/business-shopping-online-concept_1421-6.jpg?t=st=1763540622~exp=1763544222~hmac=5f9b28d849cb071c93215efef8da17d75d766d978e3ffc1f69f04ed779e0d8a5&w=2000"
          alt="Customer shopping online"
          className="w-full max-w-md lg:max-w-lg rounded-3xl shadow-lg object-cover"
        />
      </div>
    </section>
  );
}
