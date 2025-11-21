"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";

type FeaturedProduct = {
  id: string;
  name: string;
  price: number;
  offerPrice?: number;
  image: string;
};

export default function FeaturedProducts() {
  const [stopScroll, setStopScroll] = useState(false);
  const [products, setProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_BASE_URL}/api/products?isFeatured=true&limit=8`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          console.error("FEATURED PRODUCTS BAD RESPONSE", res.status);
          return;
        }

        const json = await res.json().catch(() => ({} as any));
        const rawItems = Array.isArray((json as any).items)
          ? (json as any).items
          : Array.isArray(json)
          ? json
          : [];

        const mapped: FeaturedProduct[] = rawItems.map((p: any) => ({
          id: p.id || p._id,
          name: p.name,
          price: p.price ?? 0,
          offerPrice: p.offerPrice,
          image: p.images?.[0],
        }));

        setProducts(mapped);
      } catch (err) {
        console.error("FEATURED PRODUCTS ERROR", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const cardData = products;

  return (
    <section className="mt-20 px-4 md:px-16 lg:px-24 xl:px-32">
      <h2 className="text-2xl font-semibold text-slate-800 text-center mb-2">
        Featured products
      </h2>

      <p className="text-slate-500 text-center mb-10 text-sm">
        Hand-picked items selected specially for you.
      </p>

      <style>
        {`
          .featured-marquee-inner {
            animation: featuredMarqueeScroll linear infinite;
          }

          @keyframes featuredMarqueeScroll {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>

      <div
        className="overflow-hidden w-full relative max-w-6xl mx-auto"
        onMouseEnter={() => setStopScroll(true)}
        onMouseLeave={() => setStopScroll(false)}
      >
        <div className="absolute left-0 top-0 h-full w-16 md:w-24 pointer-events-none bg-linear-to-r from-slate-50 to-transparent" />

        {loading && (
          <div className="flex items-center justify-center h-40 text-xs text-slate-400">
            Loading featured products...
          </div>
        )}

        {!loading && cardData.length === 0 && (
          <div className="flex items-center justify-center h-40 text-xs text-slate-400">
            No featured products yet.
          </div>
        )}

        {!loading && cardData.length > 0 && (
          <div
            className="featured-marquee-inner flex w-fit"
            style={{
              animationPlayState: stopScroll ? "paused" : "running",
              animationDuration: cardData.length * 2500 + "ms",
            }}
          >
            <div className="flex">
              {[...cardData, ...cardData].map((card, index) => {
                const displayPrice = card.offerPrice ?? card.price;

                return (
                  <div
                    key={`${card.id}-${index}`}
                    className="w-56 mx-4 h-80 relative group transition-all duration-300 hover:scale-95 rounded-xl overflow-hidden shadow-sm"
                  >
                    <Image
                      width={300}
                      height={400}
                      src={card.image}
                      alt={card.name}
                      className="w-full h-full object-cover"
                    />

                    <div className="flex flex-col items-center justify-center px-4 text-center opacity-0 group-hover:opacity-100 transition-all duration-300 absolute inset-0 backdrop-blur-sm bg-black/35">
                      <p className="text-white text-base font-semibold">
                        {card.name}
                      </p>
                      <p className="text-slate-100 text-xs mt-1">
                        From ${displayPrice}
                      </p>

                      <Link
                        href={`/product/${card.id}`}
                        className="mt-3 px-4 py-1.5 rounded-full text-xs font-medium bg-white text-slate-900 hover:bg-slate-200 transition"
                      >
                        View product
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="absolute right-0 top-0 h-full w-16 md:w-24 pointer-events-none bg-linear-to-l from-slate-50 to-transparent" />
      </div>
    </section>
  );
}
