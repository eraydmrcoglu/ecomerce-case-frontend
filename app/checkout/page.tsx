"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";
import { API_BASE_URL } from "@/lib/api";

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState<"card" | "cod">("card");
    
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (!fullName || !email || !address || !city || !country) {
      toast.error("Please fill in all required fields.");
      return;
    }

    let storedToken: string | null = null;
    if (typeof window !== "undefined") {
      storedToken = localStorage.getItem("authToken");
    }

    if (!storedToken) {
      toast.error("You need to sign in to place an order.");
      router.push("/auth/login?redirect=/checkout");
      return;
    }

    let tokenRaw = storedToken;
    try {
      const parsed = JSON.parse(storedToken);
      if (typeof parsed === "string") {
        tokenRaw = parsed;
      }
    } catch {
    }

    tokenRaw = tokenRaw.trim();
    if (tokenRaw.toLowerCase().startsWith("bearer ")) {
      tokenRaw = tokenRaw.slice(7).trim();
    }

    if (!tokenRaw) {
      toast.error("You need to sign in to place an order.");
      router.push("/auth/login?redirect=/checkout");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        items: cart.map((item: any) => ({
          product: item.id,
          quantity: item.quantity ?? 1,
        })),
        amount: Number(totalPrice.toFixed(2)),
        paymentType:
          paymentMethod === "card" ? "Card" : "Cash on delivery",
        address: {
          fullName,
          line1: address,
          line2: "",
          city,
          country,
          zip: "",
        },
      };

      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenRaw}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let message = "Something went wrong. Please try again.";
        try {
          const errJson = await res.json();
          if (errJson?.message) message = errJson.message;
        } catch {
        }
        toast.error(message);
        return;
      }

      clearCart();
      toast.success("Your order has been placed!");
      router.push("/order-success");
    } catch (err) {
      console.error("CHECKOUT ERROR", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 md:px-8 py-12">
      <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-6">
        Checkout
      </h1>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 space-y-6"
      >
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-800">
            Contact information
          </h2>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-500">
                Full name *
              </label>
              <input
                type="text"
                className="h-9 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-500">
                Email *
              </label>
              <input
                type="email"
                className="h-9 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-800">
            Shipping address
          </h2>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-500">Address *</label>
            <textarea
              className="min-h-[70px] rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-500">City *</label>
              <input
                type="text"
                className="h-9 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-xs text-slate-500">
                Country *
              </label>
              <input
                type="text"
                className="h-9 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-800">
            Payment method
          </h2>
          <div className="flex flex-col gap-2 text-sm">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              <span>Credit / Debit card</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              <span>Cash on delivery</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="text-sm text-slate-600">
            <p>
              Total:{" "}
              <span className="font-semibold text-slate-900">
                ${totalPrice.toFixed(2)}
              </span>
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Shipping is free for this demo.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || cart.length === 0}
            className={`h-11 px-6 rounded-full text-sm font-medium flex items-center justify-center gap-2 transition
              ${
                isSubmitting || cart.length === 0
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
          >
            {isSubmitting ? "Placing order..." : "Place order"}
          </button>
        </div>
      </form>
    </section>
  );
}
