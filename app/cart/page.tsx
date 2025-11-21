"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, totalPrice, changeQuantity, removeItem } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    if (cart.length === 0) return;
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-6 mx-auto gap-10">
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6 flex items-center gap-2">
          <ShoppingBag className="w-7 h-7 text-indigo-500" />
          <span>Shopping Cart</span>{" "}
          <span className="text-sm text-indigo-500">
            {cart.length} {cart.length === 1 ? "item" : "items"}
          </span>
        </h1>

        {cart.length === 0 ? (
          <div className="text-sm text-slate-500 bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6">
            <p>Your cart is empty.</p>
            <Link
              href="/products"
              className="inline-flex mt-3 text-indigo-600 hover:underline text-sm font-medium"
            >
              Browse products →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => {
              const lineTotal = item.price * item.quantity;
              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-4 md:px-5 md:py-5 flex flex-col md:grid md:grid-cols-[minmax(0,3fr)_minmax(0,1fr)_minmax(0,1fr)] md:items-center gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center bg-slate-50 shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          No image
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="font-medium text-sm md:text-base text-slate-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Unit price:{" "}
                        <span className="font-medium text-slate-800">
                          ${item.price.toFixed(2)}
                        </span>
                      </p>

                      <div className="mt-2 inline-flex items-center rounded-full border border-slate-200 bg-slate-50 text-xs overflow-hidden">
                        <button
                          type="button"
                          onClick={() => changeQuantity(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 active:scale-95 transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-[11px] font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => changeQuantity(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 active:scale-95 transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex md:justify-center">
                    <p className="text-sm md:text-base font-medium text-slate-900">
                      ${lineTotal.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex md:justify-end">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600 active:scale-95 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              );
            })}

            <button
              className="group cursor-pointer flex items-center mt-4 gap-2 text-indigo-500 font-medium text-sm"
              onClick={() => (window.location.href = "/products")}
            >
              <svg
                width="15"
                height="11"
                viewBox="0 0 15 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1"
                  stroke="#615fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Continue shopping
            </button>
          </div>
        )}
      </div>

      <div className="max-w-[360px] w-full bg-slate-50 p-5 max-md:mt-4 border border-slate-200 rounded-2xl">
        <h2 className="text-xl font-medium">Order Summary</h2>
        <hr className="border-slate-200 my-4" />

        <div className="text-gray-500 mt-2 space-y-2 text-sm">
          <p className="flex justify-between">
            <span>Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600">Free</span>
          </p>
        </div>

        <div className="flex justify-between items-center mt-4 text-sm font-medium text-slate-900">
          <span>Total</span>
          <span className="text-lg">${totalPrice.toFixed(2)}</span>
        </div>

        <button
          onClick={handleCheckout}
          disabled={cart.length === 0}
          className={`w-full py-3 mt-6 cursor-pointer rounded-full text-sm font-medium flex items-center justify-center gap-2 transition ${
            cart.length === 0
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-indigo-500 text-white hover:bg-indigo-600 active:scale-95"
          }`}
        >
          <span>Go to checkout</span>
        </button>
      </div>
    </div>
  );
}
