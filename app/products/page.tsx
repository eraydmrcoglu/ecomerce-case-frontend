"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/lib/api";
import { useCart } from "@/context/CartContext";

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
  price: number;
  offerPrice?: number;
  rating?: number;
  image?: string;
  images?: string[];
  category?: {
    _id: string;
    slug: string;
    name: string;
  };
  createdAt: string;
};

type Category = {
  slug: string;
  name: string;
  description: string;
  productCount: number;
  image: string;
};

type Product = {
  id: string;
  name: string;
  categoryName: string;
  categorySlug: string | null;
  price: number;
  offerPrice?: number;
  rating: number;
  image: string;
  createdAt: string;
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

const mapApiProduct = (api: ApiProduct): Product => ({
  id: api._id,
  name: api.name,
  categoryName: api.category?.name ?? "Other",
  categorySlug: api.category?.slug ?? null,
  price: api.price,
  offerPrice: api.offerPrice,
  rating: api.rating ?? 4.3,
  image:
    api.image ||
    api.images?.[0] ||
    "https://images.unsplash.com/photo-1585687501004-615dfdfde7f1?q=80&h=800&w=800&auto=format&fit=crop",
  createdAt: api.createdAt,
});

export default function ProductsPage() {
  const { addItem } = useCart();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | string>("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<
    "featured" | "price-asc" | "price-desc" | "rating" | "newest"
  >("featured");
  const [page, setPage] = useState(1);

  const pageSize = 12;

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const url = new URL(window.location.href);

      const categoryParam = url.searchParams.get("category");
      const searchParam = url.searchParams.get("search");

      if (categoryParam) {
        setSelectedCategory(categoryParam);
      }

      if (searchParam) {
        setSearch(searchParam);
      }
    } catch {
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [catRes, prodRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/categories`),
          fetch(`${API_BASE_URL}/api/products`),
        ]);

        if (!catRes.ok) {
          throw new Error("Failed to load categories");
        }
        if (!prodRes.ok) {
          throw new Error("Failed to load products");
        }

        const catJsonRaw: any = await catRes.json();
        const prodJsonRaw: any = await prodRes.json();

        if (cancelled) return;

        const catItems: ApiCategory[] = Array.isArray(catJsonRaw?.items)
          ? catJsonRaw.items
          : Array.isArray(catJsonRaw)
          ? catJsonRaw
          : [];

        const prodItems: ApiProduct[] = Array.isArray(prodJsonRaw?.items)
          ? prodJsonRaw.items
          : Array.isArray(prodJsonRaw)
          ? prodJsonRaw
          : [];

        const mappedCategories = catItems.map(mapApiCategory);
        const mappedProducts = prodItems.map(mapApiProduct);

        setCategories(mappedCategories);
        setProducts(mappedProducts);
      } catch (err: any) {
        if (cancelled) return;
        console.error("PRODUCTS PAGE FETCH ERROR", err);
        setError(err?.message || "Something went wrong while loading data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory !== "all") {
      list = list.filter((p) => p.categorySlug === selectedCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }

    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;

    if (min !== null) {
      list = list.filter((p) => (p.offerPrice ?? p.price) >= min);
    }
    if (max !== null) {
      list = list.filter((p) => (p.offerPrice ?? p.price) <= max);
    }

    if (minRating !== null) {
      list = list.filter((p) => p.rating >= minRating);
    }

    list.sort((a, b) => {
      if (sortBy === "price-asc") {
        return (a.offerPrice ?? a.price) - (b.offerPrice ?? b.price);
      }
      if (sortBy === "price-desc") {
        return (b.offerPrice ?? b.price) - (a.offerPrice ?? a.price);
      }
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

    return list;
  }, [products, selectedCategory, search, minPrice, maxPrice, minRating, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleCategoryChange = (slug: "all" | string) => {
    setSelectedCategory(slug);
    setPage(1);
  };

  const handleRatingChange = (rating: number | null) => {
    setMinRating(rating);
    setPage(1);
  };

  return (
    <section className="mt-8 px-4 md:px-16 lg:px-24 xl:px-32 pb-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
            All products
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse all items, filter by category, price and rating, or sort them
            as you like.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="flex items-center w-full sm:w-64 bg-white border border-slate-200 rounded-full px-3 h-10">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="h-10 rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-700"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to high</option>
            <option value="price-desc">Price: High to low</option>
            <option value="rating">Rating: High to low</option>
            <option value="newest">Newest first</option>
          </select>
        </div>
      </div>

      <div className="mt-8 flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 shrink-0 bg-white border border-slate-200 rounded-2xl p-4 space-y-6 text-sm">
          <div>
            <h3 className="font-semibold text-slate-800 mb-2">Category</h3>
            <div className="flex flex-wrap lg:flex-col gap-2">
              <button
                onClick={() => handleCategoryChange("all")}
                className={`px-3 py-1.5 rounded-full border text-xs transition ${
                  selectedCategory === "all"
                    ? "bg-indigo-50 border-indigo-400 text-indigo-600"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                All
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`px-3 py-1.5 rounded-full border text-xs transition ${
                    selectedCategory === cat.slug
                      ? "bg-indigo-50 border-indigo-400 text-indigo-600"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-800 mb-2">Price range</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                className="w-full h-9 rounded-md border border-slate-200 px-2 text-xs outline-none"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setPage(1);
                }}
              />
              <span className="text-slate-400 text-xs">—</span>
              <input
                type="number"
                placeholder="Max"
                className="w-full h-9 rounded-md border border-slate-200 px-2 text-xs outline-none"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-800 mb-2">Rating</h3>
            <div className="space-y-1.5">
              {[4, 3, 2].map((r) => (
                <button
                  key={r}
                  onClick={() => handleRatingChange(minRating === r ? null : r)}
                  className={`w-full flex items-center justify-between rounded-md border px-3 py-1.5 text-xs transition ${
                    minRating === r
                      ? "border-amber-400 bg-amber-50 text-amber-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>{r}★ & up</span>
                  <span className="text-[10px] text-slate-400">filter</span>
                </button>
              ))}

              <button
                onClick={() => handleRatingChange(null)}
                className="w-full mt-1 text-[11px] text-slate-500 underline"
              >
                Clear rating filter
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-4 text-xs text-slate-500">
            <p>
              Showing{" "}
              <span className="font-medium text-slate-700">
                {paginatedProducts.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-slate-700">
                {filteredProducts.length}
              </span>{" "}
              products
            </p>
          </div>

          {loading ? (
            <p className="text-sm text-slate-500 mt-6">Loading products...</p>
          ) : error ? (
            <p className="text-sm text-red-500 mt-6">{error}</p>
          ) : paginatedProducts.length === 0 ? (
            <p className="text-sm text-slate-500 mt-6">
              No products match your filters.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-items-center">
              {paginatedProducts.map((product) => {
                const displayPrice = product.offerPrice ?? product.price;
                const hasDiscount =
                  !!product.offerPrice && product.offerPrice < product.price;

                return (
                  <div
                    key={product.id}
                    className="group w-56 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-shadow duration-300"
                  >
                    <Link
                      href={`/product/${product.id}`}
                      className="block rounded-t-2xl overflow-hidden"
                    >
                      <div className="relative w-full h-64 bg-slate-50">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>

                    <div className="p-3 text-xs text-slate-500 flex flex-col justify-between min-h-[110px]">
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-slate-400">
                          {product.categoryName}
                        </p>
                        <Link
                          href={`/product/${product.id}`}
                          className="text-slate-900 font-medium text-sm mt-0.5 line-clamp-2 hover:text-indigo-600"
                        >
                          {product.name}
                        </Link>

                        <div className="flex items-center gap-0.5 mt-1">
                          {Array(5)
                            .fill("")
                            .map((_, i) =>
                              product.rating > i ? (
                                <svg
                                  key={i}
                                  width="14"
                                  height="13"
                                  viewBox="0 0 18 17"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z"
                                    fill="#615fff"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  key={i}
                                  width="14"
                                  height="13"
                                  viewBox="0 0 18 17"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M8.04894 0.927049C8.3483 0.00573802 9.6517 0.00574017 9.95106 0.927051L11.2451 4.90983C11.379 5.32185 11.763 5.60081 12.1962 5.60081H16.3839C17.3527 5.60081 17.7554 6.84043 16.9717 7.40983L13.5838 9.87132C13.2333 10.126 13.0866 10.5773 13.2205 10.9894L14.5146 14.9721C14.8139 15.8934 13.7595 16.6596 12.9757 16.0902L9.58778 13.6287C9.2373 13.374 8.7627 13.374 8.41221 13.6287L5.02426 16.0902C4.24054 16.6596 3.18607 15.8934 3.48542 14.9721L4.7795 10.9894C4.91338 10.5773 4.76672 10.126 4.41623 9.87132L1.02827 7.40983C0.244561 6.84043 0.647338 5.60081 1.61606 5.60081H5.8038C6.23703 5.60081 6.62099 5.32185 6.75486 4.90983L8.04894 0.927049Z"
                                    fill="#615fff"
                                    fillOpacity="0.35"
                                  />
                                </svg>
                              )
                            )}
                          <p className="ml-1 text-[11px] text-slate-500">
                            ({product.rating.toFixed(1)})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-end justify-between mt-3">
                        <p className="text-base font-semibold text-indigo-500">
                          ${displayPrice}{" "}
                          {hasDiscount && (
                            <span className="text-gray-400 text-xs line-through ml-1">
                              ${product.price}
                            </span>
                          )}
                        </p>

                        <button
                          type="button"
                          className="flex items-center justify-center gap-1 bg-indigo-50 border border-indigo-200 w-[76px] h-[30px] rounded-full text-[11px] text-indigo-600 font-medium hover:bg-indigo-100 active:scale-95 transition"
                          onClick={() => {
                            const priceToUse =
                              product.offerPrice ?? product.price;

                            addItem({
                              id: product.id,
                              name: product.name,
                              price: priceToUse,
                              image: product.image,
                            });

                            toast.success("Added to cart");
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
                              stroke="#615fff"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 text-xs">
              <button
                disabled={currentPage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={`px-3 py-1.5 rounded-full border ${
                  currentPage === 1
                    ? "border-slate-200 text-slate-300 cursor-default"
                    : "border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-full text-xs ${
                    p === currentPage
                      ? "bg-indigo-500 text-white"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={`px-3 py-1.5 rounded-full border ${
                  currentPage === totalPages
                    ? "border-slate-200 text-slate-300 cursor-default"
                    : "border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
