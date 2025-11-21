"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, CheckCircle2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

type DetailProduct = {
  id: string;
  name: string;
  categoryName: string;
  price: number;
  offerPrice?: number;
  rating: number;
  images: string[];
  description: string;
};

export default function ProductDetailPage() {
  const params = useParams<{ id: string | string[] }>();
  const idParam = params?.id;
  const productId = Array.isArray(idParam) ? idParam[0] : idParam;

  const [product, setProduct] = useState<DetailProduct | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addItem } = useCart();

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${API_BASE_URL}/api/products/${productId}`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          setError("Product not found.");
          return;
        }

        const data = await res.json();
        const p: any = data.item ?? data;

        const images: string[] =
          Array.isArray(p.images) && p.images.length > 0
            ? p.images
            : [
                p.image ||
                  p.mainImage ||
                  "/placeholder-product.jpg",
              ];

        const mapped: DetailProduct = {
          id: p.id || p._id,
          name: p.name,
          categoryName:
            p.category?.name ||
            p.category?.slug ||
            p.category ||
            "Category",
          price: p.price ?? 0,
          offerPrice: p.discountPrice ?? p.offerPrice,
          rating: typeof p.rating === "number" ? p.rating : 4.5,
          images,
          description: p.description || "",
        };

        setProduct(mapped);
        setThumbnail(images[0] ?? null);
      } catch (err) {
        setError("Something went wrong while loading the product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;

    const priceToUse = product.offerPrice ?? product.price;

    addItem({
      id: product.id,
      name: product.name,
      price: priceToUse,
      image: thumbnail ?? product.images[0] ?? "",
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  if (!productId) {
    return (
      <div className="py-16 flex items-center justify-center text-sm text-slate-500">
        Loading product...
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-16 flex items-center justify-center text-sm text-slate-500">
        Loading product...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-16 flex items-center justify-center text-sm text-red-500">
        {error || "Product not found."}
      </div>
    );
  }

  const savedAmount =
    product.offerPrice && product.offerPrice < product.price
      ? product.price - product.offerPrice
      : 0;

  const descriptionLines = product.description
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="py-10">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 font-poppins">
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 mt-4">
          <div className="flex gap-3 md:gap-4 w-full md:w-[45%]">
            <div className="flex flex-col gap-3">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setThumbnail(img)}
                  className={`border rounded-xl overflow-hidden cursor-pointer transition-all w-20 h-20 md:w-24 md:h-24
                    ${
                      thumbnail === img
                        ? "border-indigo-500 shadow-sm"
                        : "border-slate-200 hover:border-indigo-300"
                    }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>

            <div className="flex-1 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm flex items-center justify-center">
              {thumbnail && (
                <Image
                  src={thumbnail}
                  alt={product.name}
                  width={480}
                  height={480}
                  className="object-cover w-full h-full max-h-[420px]"
                />
              )}
            </div>
          </div>

          <div className="w-full md:w-[55%] text-sm text-slate-700 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                  In stock
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {product.categoryName}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array(5)
                  .fill("")
                  .map((_, i) =>
                    product.rating > i ? (
                      <svg
                        key={i}
                        width="16"
                        height="15"
                        viewBox="0 0 18 17"
                        fill="#6366f1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z" />
                      </svg>
                    ) : (
                      <svg
                        key={i}
                        width="16"
                        height="15"
                        viewBox="0 0 18 17"
                        fill="#6366f166"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z" />
                      </svg>
                    )
                  )}
              </div>
              <span className="text-sm text-slate-600">
                ({product.rating.toFixed(1)})
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span className="text-xs text-slate-500">
                120+ verified reviews
              </span>
            </div>

            <div className="space-y-1">
              {product.offerPrice && product.offerPrice < product.price && (
                <p className="text-slate-500 line-through text-sm">
                  MRP: ${product.price.toFixed(2)}
                </p>
              )}

              <div className="flex items-end gap-3">
                <p className="text-2xl font-semibold text-slate-900">
                  ${(
                    product.offerPrice ?? product.price
                  ).toFixed(2)}
                </p>
                {savedAmount > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                    You save ${savedAmount.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500">
                Prices in USD • free shipping over $100
              </p>
            </div>

            <div>
              <p className="text-base font-medium text-slate-900 mb-1">
                About product
              </p>
              {descriptionLines.length > 0 ? (
                <ul className="list-disc ml-4 text-slate-600 text-sm space-y-1">
                  {descriptionLines.map((line, index) => (
                    <li key={index}>{line}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500">
                  No description available yet.
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`w-full flex items-center justify-center gap-2 rounded-full py-3 text-sm font-medium 
                  border transition-all shadow-sm
                  ${
                    isAdded
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "border-indigo-200 bg-white text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 hover:-translate-y-[1px]"
                  }`}
              >
                {isAdded ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Added to cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    Add to cart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
