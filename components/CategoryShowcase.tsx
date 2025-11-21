"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/api";

type ApiCategory = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount?: number;
};

type ApiProduct = {
  _id: string;
  name: string;
  category?:
    | {
        _id?: string;
        slug?: string;
        name?: string;
      }
    | string
    | null;
};

type Category = {
  slug: string;
  name: string;
  description: string;
  productCount: number;
  image: string;
};

const mapApiCategory = (api: ApiCategory): Category => ({
  slug: api.slug,
  name: api.name,
  description: api.description ?? "Category description",
  productCount: api.productCount ?? 0,
  image:
    api.image ??
    "https://images.unsplash.com/photo-1585687501004-615dfdfde7f1?q=80&h=800&w=800&auto=format&fit=crop",
});

export default function CategoryShowcase() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [catRes, prodRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/categories`, {
            cache: "no-store",
          }),
          fetch(`${API_BASE_URL}/api/products`, {
            cache: "no-store",
          }),
        ]);

        if (!catRes.ok) {
          throw new Error("Failed to load categories");
        }
        if (!prodRes.ok) {
          throw new Error("Failed to load products for counts");
        }

        const catJson = await catRes.json();
        const prodJson = await prodRes.json();

        if (cancelled) return;

        const catItems: ApiCategory[] = Array.isArray(catJson?.items)
          ? catJson.items
          : Array.isArray(catJson)
          ? catJson
          : [];

        const prodItems: ApiProduct[] = Array.isArray(prodJson?.items)
          ? prodJson.items
          : Array.isArray(prodJson)
          ? prodJson
          : [];

        const mappedCategories = catItems.map(mapApiCategory);
        const counts = new Map<string, number>();

        for (const p of prodItems) {
          let slug: string | undefined;

          if (p.category && typeof p.category === "object") {
            slug = p.category.slug;
          } else if (typeof p.category === "string") {
            slug = p.category;
          }

          if (slug) {
            counts.set(slug, (counts.get(slug) ?? 0) + 1);
          }
        }

        const withRealCounts: Category[] = mappedCategories.map((c) => ({
          ...c,
          productCount: counts.get(c.slug) ?? c.productCount ?? 0,
        }));

        setCategories(withRealCounts);
      } catch (err: any) {
        if (cancelled) return;
        console.error("CATEGORY SHOWCASE FETCH ERROR", err);
        setError(err?.message || "Categories could not be loaded.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="mt-2 px-4 md:px-16 lg:px-24 xl:px-32">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base md:text-lg font-semibold text-slate-900">
            Shop by category
          </h2>
          <p className="text-[11px] md:text-xs text-slate-500 mt-1">
            Hover a category to see details and click to open filtered products.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 h-[360px] w-full max-w-6xl mt-8 mx-auto">
        {loading ? (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="grow w-40 h-[360px] rounded-xl bg-slate-100 animate-pulse"
              />
            ))}
          </>
        ) : error ? (
          <div className="w-full text-center text-sm text-red-500">
            {error}
          </div>
        ) : categories.length === 0 ? (
          <div className="w-full text-center text-sm text-slate-500">
            No categories found.
          </div>
        ) : (
          categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="relative group grow transition-all w-40 rounded-xl overflow-hidden h-[360px] duration-500 hover:w-full"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover object-center"
              />

              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 via-black/30 to-transparent px-4 py-4">
                <h3 className="text-sm md:text-base font-semibold text-white">
                  {cat.name}
                </h3>
              </div>

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute inset-0 bg-black/45" />

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-[11px] uppercase tracking-wide text-slate-200/90">
                    {cat.productCount} products
                  </p>
                  <h3 className="text-lg font-semibold">{cat.name}</h3>
                  <p className="text-[11px] mt-1 text-slate-200 line-clamp-2">
                    {cat.description}
                  </p>

                  <span className="mt-3 inline-flex items-center text-[11px] px-3 py-1 rounded-full bg-white/15 backdrop-blur group-hover:bg-indigo-500/80 group-hover:text-white transition-colors">
                    Browse category →
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
