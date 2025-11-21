"use client";

import { useEffect, useState, FormEvent } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/lib/api";

type AdminProduct = {
  id: string;
  name: string;
  categoryName: string;
  price: number;
  offerPrice?: number;
  inStock: boolean;
  image: string;
  isFeatured?: boolean;
  rating?: number;
};

type CategoryOption = {
  id: string;
  name: string;
};

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [rating, setRating] = useState("4.5");
  const [isFeatured, setIsFeatured] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setLoading(true);

        const [prodRes, catRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/products?limit=50`, {
            credentials: "include",
            cache: "no-store",
          }),
          fetch(`${API_BASE_URL}/api/categories`, {
            credentials: "include",
            cache: "no-store",
          }),
        ]);

        const prodJson = await prodRes.json().catch(() => ({}));
        const catJson = await catRes.json().catch(() => ({}));

        const rawProd = Array.isArray((prodJson as any).items)
          ? (prodJson as any).items
          : Array.isArray(prodJson)
          ? prodJson
          : [];

        const mappedProducts: AdminProduct[] = rawProd.map((p: any) => {
          const img =
            p.image ||
            p.mainImage ||
            (Array.isArray(p.images) ? p.images[0] : undefined) ||
            "/placeholder-product.jpg";

          return {
            id: p.id || p._id,
            name: p.name,
            categoryName:
              p.category?.name ||
              p.category?.slug ||
              p.category ||
              "Uncategorized",
            price: p.price ?? 0,
            offerPrice: p.offerPrice,
            inStock:
              typeof p.inStock === "boolean"
                ? p.inStock
                : typeof p.stock === "number"
                ? p.stock > 0
                : true,
            image: img,
            isFeatured: !!p.isFeatured,
            rating: typeof p.rating === "number" ? p.rating : undefined,
          };
        });

        setProducts(mappedProducts);

        const rawCat = Array.isArray((catJson as any).items)
          ? (catJson as any).items
          : Array.isArray(catJson)
          ? catJson
          : [];

        const mappedCategories: CategoryOption[] = rawCat.map((c: any) => ({
          id: c.id || c._id,
          name: c.name,
        }));

        setCategories(mappedCategories);
      } catch (err) {
        console.error("ADMIN DASHBOARD LOAD ERROR", err);
        toast.error("Admin data could not be loaded");
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  const handleAddProduct = async (e: FormEvent) => {
    e.preventDefault();

    if (!name || !price || !categoryId) {
      toast.error("Name, price and category are required");
      return;
    }

    try {
      setSubmitting(true);

      const body = {
        name,
        description: description || undefined,
        categoryId,
        price: Number(price),
        offerPrice: offerPrice ? Number(offerPrice) : undefined,
        image: imageUrl || undefined,
        rating: rating ? Number(rating) : undefined,
        isFeatured,
      };

      const res = await fetch(`${API_BASE_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || "Failed to add product");
      }

      const created = await res.json().catch(() => ({} as any));

      const img =
        created.image ||
        created.mainImage ||
        (Array.isArray(created.images) ? created.images[0] : undefined) ||
        imageUrl ||
        "/placeholder-product.jpg";

      const newProduct: AdminProduct = {
        id: created.id || created._id,
        name: created.name ?? name,
        categoryName:
          created.category?.name ||
          created.category?.slug ||
          created.category ||
          categories.find((c) => c.id === categoryId)?.name ||
          "Uncategorized",
        price: created.price ?? Number(price),
        offerPrice:
          created.offerPrice ??
          (offerPrice ? Number(offerPrice) : undefined),
        inStock:
          created.inStock ??
          (typeof created.stock === "number" ? created.stock > 0 : true),
        image: img,
        isFeatured: created.isFeatured ?? isFeatured,
        rating:
          typeof created.rating === "number"
            ? created.rating
            : rating
            ? Number(rating)
            : undefined,
      };

      setProducts((prev) => [newProduct, ...prev]);

      setName("");
      setDescription("");
      setCategoryId("");
      setPrice("");
      setOfferPrice("");
      setImageUrl("");
      setRating("4.5");
      setIsFeatured(false);

      toast.success("Product added");
    } catch (err: any) {
      console.error("ADD PRODUCT ERROR", err);
      toast.error(err?.message || "Failed to add product");
    } finally {
      setSubmitting(false);
    }
  };

  const totalFeatured = products.filter((p) => p.isFeatured).length;

  const formatCurrency = (value: number | undefined) => {
    const n = typeof value === "number" ? value : 0;
    return `$${n.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">
              Admin dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage your products, featured items and inventory from here.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex-1 min-w-[140px] rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                Total products
              </p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {products.length}
              </p>
            </div>

            <div className="flex-1 min-w-[140px] rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                Categories
              </p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {categories.length}
              </p>
            </div>

            <div className="flex-1 min-w-[140px] rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                Featured products
              </p>
              <p className="mt-1 text-2xl font-semibold text-indigo-600">
                {totalFeatured}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-12 items-start">
          <section className="lg:col-span-4">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 lg:p-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Add new product
              </h2>
              <p className="mt-1 mb-5 text-xs text-slate-500">
                Fill in the details below to create a new product. Prices are in USD ($).
              </p>

              <form onSubmit={handleAddProduct} className="space-y-5">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-slate-800">
                    Product image
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    {Array(4)
                      .fill("")
                      .map((_, index) => (
                        <label key={index} htmlFor={`image${index}`}>
                          <input
                            type="file"
                            id={`image${index}`}
                            hidden
                            accept="image/*"
                          />
                          <Image
                            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/uploadArea.png"
                            alt="Upload area"
                            width={96}
                            height={96}
                            className="w-20 h-20 rounded-lg border border-dashed border-slate-300 bg-slate-50 object-contain cursor-pointer"
                          />
                        </label>
                      ))}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="image-url"
                      className="text-xs font-medium text-slate-700"
                    >
                      Image URL (optional)
                    </label>
                    <input
                      id="image-url"
                      type="text"
                      placeholder="https://..."
                      className="h-9 rounded-md border border-slate-300 px-3 text-sm outline-none"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="product-name"
                      className="text-sm font-medium text-slate-800"
                    >
                      Product name
                    </label>
                    <input
                      id="product-name"
                      type="text"
                      placeholder="Type here"
                      required
                      className="h-9 rounded-md border border-slate-300 px-3 text-sm outline-none"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="category"
                      className="text-sm font-medium text-slate-800"
                    >
                      Category
                    </label>
                    <select
                      id="category"
                      className="h-9 rounded-md border border-slate-300 px-3 text-sm outline-none"
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                    >
                      <option value="">Select category</option>
                      {categories.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="product-description"
                    className="text-sm font-medium text-slate-800"
                  >
                    Product description
                  </label>
                  <textarea
                    id="product-description"
                    rows={4}
                    placeholder="Type here"
                    className="resize-none rounded-md border border-slate-300 px-3 py-2 text-sm outline-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="product-price"
                      className="text-sm font-medium text-slate-800"
                    >
                      Product price (USD)
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-xs text-slate-400">
                        $
                      </span>
                      <input
                        id="product-price"
                        type="number"
                        placeholder="0.00"
                        min={0}
                        step="0.01"
                        required
                        className="h-9 w-full rounded-md border border-slate-300 pl-6 pr-3 text-sm outline-none"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="offer-price"
                      className="text-sm font-medium text-slate-800"
                    >
                      Offer price (USD)
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-xs text-slate-400">
                        $
                      </span>
                      <input
                        id="offer-price"
                        type="number"
                        placeholder="0.00"
                        min={0}
                        step="0.01"
                        className="h-9 w-full rounded-md border border-slate-300 pl-6 pr-3 text-sm outline-none"
                        value={offerPrice}
                        onChange={(e) => setOfferPrice(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="rating"
                      className="text-sm font-medium text-slate-800"
                    >
                      Rating
                    </label>
                    <input
                      id="rating"
                      type="number"
                      placeholder="4.5"
                      min={1}
                      max={5}
                      step="0.1"
                      className="h-9 rounded-md border border-slate-300 px-3 text-sm outline-none"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm text-slate-800">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                  />
                  <span>Show as featured product on homepage</span>
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-7 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Adding..." : "Add product"}
                </button>
              </form>
            </div>
          </section>

          <section className="lg:col-span-8">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 lg:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  All products
                </h2>
                <p className="text-[11px] text-slate-500">
                  Showing {products.length} products
                </p>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3 text-left">Product</th>
                      <th className="px-4 py-3 text-left">Category</th>
                      <th className="hidden px-4 py-3 text-right md:table-cell">
                        Price (USD)
                      </th>
                      <th className="hidden px-4 py-3 text-center md:table-cell">
                        Featured
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-6 text-center text-xs text-slate-400"
                        >
                          Loading products...
                        </td>
                      </tr>
                    )}

                    {!loading && products.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-6 text-center text-xs text-slate-400"
                        >
                          No products found.
                        </td>
                      </tr>
                    )}

                    {!loading &&
                      products.map((product, index) => (
                        <tr
                          key={product.id || index}
                          className={`border-t border-slate-100 ${
                            index % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                          }`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-slate-900">
                                  {product.name}
                                </p>
                                {product.rating && (
                                  <p className="mt-0.5 text-[11px] text-amber-500">
                                    {product.rating.toFixed(1)}★
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3 text-slate-600">
                            {product.categoryName}
                          </td>

                          <td className="hidden px-4 py-3 text-right text-slate-700 md:table-cell">
                            {formatCurrency(
                              product.offerPrice ?? product.price
                            )}
                          </td>

                          <td className="hidden px-4 py-3 text-center md:table-cell">
                            {product.isFeatured ? (
                              <span className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-[11px] text-indigo-600">
                                Featured
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full border border-slate-100 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-400">
                                Normal
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
