"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/api";

type PreviewProduct = {
  id: string;
  name: string;
  price: number;
  offerPrice?: number;
  image: string;
};

export default function AllProducts() {
  const [products, setProducts] = useState<PreviewProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_BASE_URL}/api/products?limit=4&sort=newest`,
          {
            cache: "no-store",
          }
        );

        if (!res.ok) {
          console.error("ALL PRODUCTS PREVIEW: bad response", res.status);
          setProducts([]);
          return;
        }

        const json = await res.json();
        const raw = Array.isArray(json.items) ? json.items : Array.isArray(json) ? json : [];

        const mapped: PreviewProduct[] = raw.map((p: any) => ({
          id: p.id || p._id,
          name: p.name,
          price: p.price ?? 0,
          offerPrice: p.offerPrice,
          image: p.images?.[0],
        }));

        setProducts(mapped);
      } catch (err) {
        console.error("ALL PRODUCTS PREVIEW ERROR", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <section className="mt-20 px-4 md:px-16 lg:px-24 xl:px-32 font-poppins">
      <div className="relative mb-10">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-800">
            All Products
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Explore our complete catalog of items.
          </p>
        </div>

        <Link
          href="/products"
          className="absolute right-0 top-0 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
        >
          View all products →
        </Link>
      </div>

      {loading && products.length === 0 ? (
        <p className="text-center text-xs text-slate-400">
          Loading products...
        </p>
      ) : products.length === 0 ? (
        <p className="text-center text-xs text-slate-400">
          No products found yet.
        </p>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-8">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="group w-56 font-poppins"
            >
              <div className="rounded-lg w-full h-72 overflow-hidden 
                              group-hover:shadow-xl group-hover:-translate-y-1 
                              transition-all duration-300 relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover object-center"
                />
              </div>

              <p className="text-sm text-slate-600 mt-2 truncate">
                {product.name}
              </p>
              <p className="text-xl font-medium text-slate-800">
                ${product.offerPrice ?? product.price}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
