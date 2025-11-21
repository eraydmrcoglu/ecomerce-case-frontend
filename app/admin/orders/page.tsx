"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { API_BASE_URL } from "@/lib/api";

type OrderItem = {
  productName: string;
  quantity: number;
};

type AdminOrder = {
  id: string;
  items: OrderItem[];
  customerName: string;
  customerEmail: string;
  address: string;
  amount: number;
  paymentMethod: string;
  isPaid: boolean;
  status: string;
  createdAt: string;
};

export default function AdminOrdersPage() {
  const router = useRouter();

  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const boxIcon =
    "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/boxIcon.svg";

  // LocalStorage'dan admin kontrolü
  useEffect(() => {
    const checkAuth = () => {
      try {
        const raw = localStorage.getItem("authUser");
        if (!raw) {
          setIsAdmin(false);
        } else {
          const u = JSON.parse(raw);
          const adminFlag = u.role === "admin" || u.isAdmin === true;
          setIsAdmin(adminFlag);
        }
      } catch {
        setIsAdmin(false);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!authChecked) return;

    if (!isAdmin) {
      router.replace("/auth/login?redirect=/admin/orders");
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        setError(null);

        // 🔐 TOKEN'I LOCALSTORAGE'DAN ÇEK
        let storedToken: string | null = null;
        if (typeof window !== "undefined") {
          storedToken = localStorage.getItem("authToken");
        }

        if (!storedToken) {
          setError("You must be logged in as admin to view orders.");
          return;
        }

        // JSON.stringify ile kaydedildiyse aç
        let tokenRaw = storedToken;
        try {
          const parsed = JSON.parse(storedToken);
          if (typeof parsed === "string") {
            tokenRaw = parsed;
          } else if (parsed && typeof parsed === "object") {
            if (typeof parsed.token === "string") {
              tokenRaw = parsed.token;
            } else if (typeof parsed.accessToken === "string") {
              tokenRaw = parsed.accessToken;
            }
          }
        } catch {
          tokenRaw = storedToken;
        }

        tokenRaw = tokenRaw.trim();
        if (tokenRaw.toLowerCase().startsWith("bearer ")) {
          tokenRaw = tokenRaw.slice(7).trim();
        }

        const res = await fetch(`${API_BASE_URL}/api/orders/admin`, {
          headers: {
            Authorization: `Bearer ${tokenRaw}`,
          },
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          let msg = "Failed to load orders";
          try {
            const errJson = await res.json();
            if (errJson?.message) msg = errJson.message;
          } catch {}
          throw new Error(msg);
        }

        const json = await res.json();
        const raw = Array.isArray(json) ? json : [];

        const mapped: AdminOrder[] = raw.map((o: any) => ({
          id: o.id || o._id,
          items: (o.items ?? []).map((i: any) => ({
            productName:
              i.product?.name ||
              (typeof i.product === "string" ? i.product : "Unknown product"),
            quantity: i.quantity ?? 1,
          })),
          customerName:
            o.user?.name || o.address?.fullName || "Customer",
          customerEmail: o.user?.email || "unknown",
          address: o.address
            ? [
                o.address.fullName,
                o.address.line1,
                o.address.line2,
                o.address.city,
                o.address.country,
                o.address.zip,
              ]
                .filter(Boolean)
                .join(", ")
            : "No address",
          amount: o.amount ?? 0,
          paymentMethod: o.paymentType || "Card",
          isPaid: o.status === "paid" || o.status === "completed",
          status: o.status || "pending",
          createdAt: o.createdAt
            ? new Date(o.createdAt).toLocaleDateString()
            : "",
        }));

        setOrders(mapped);
      } catch (err) {
        console.error("ADMIN ORDERS ERROR", err);
        setError("Orders could not be loaded.");
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [authChecked, isAdmin, router]);

  if (!authChecked) {
    return (
      <div className="py-20 text-center text-sm text-slate-500">
        Loading...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="py-20 text-center text-sm text-slate-500">
        Redirecting...
      </div>
    );
  }

  return (
    <section className="md:p-10 p-4 space-y-5 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Admin · Orders</h2>
        <p className="text-xs text-slate-500">
          Total orders: <span className="font-medium">{orders.length}</span>
        </p>
      </div>

      {loadingOrders ? (
        <div className="py-10 text-center text-sm text-slate-500">
          Loading orders...
        </div>
      ) : error ? (
        <div className="py-10 text-center text-sm text-red-500">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="py-10 text-center text-sm text-slate-500">
          No orders yet.
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="border border-slate-200 p-5 rounded-xl grid md:grid-cols-[2fr_1.5fr_1fr_1fr] gap-5 items-center bg-white"
          >
            <div className="flex items-start gap-4">
              <Image
                src={boxIcon}
                width={48}
                height={48}
                alt="package"
                className="opacity-60 mt-1"
              />
              <div className="space-y-1 text-sm">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">
                  Order ID
                </p>
                <p className="font-semibold text-slate-900">
                  {order.id}
                </p>

                <p className="text-[11px] uppercase tracking-wide text-slate-400 mt-2">
                  Items
                </p>
                {order.items.map((item, i) => (
                  <p key={i} className="text-slate-700">
                    {item.productName}{" "}
                    {item.quantity > 1 && (
                      <span className="text-indigo-500">
                        × {item.quantity}
                      </span>
                    )}
                  </p>
                ))}
              </div>
            </div>

            <div className="text-sm text-slate-700">
              <p className="font-medium mb-1">{order.customerName}</p>
              <p className="text-xs text-slate-500">
                {order.customerEmail}
              </p>
              <p className="text-slate-500 text-xs leading-snug mt-1">
                {order.address}
              </p>
            </div>

            <div className="text-sm space-y-1">
              <p className="text-xs text-slate-400 uppercase">Amount</p>
              <p className="text-base font-semibold text-slate-900">
                ${order.amount.toFixed(2)}
              </p>
              <p className="text-xs mt-2 text-slate-500">
                Method:{" "}
                <span className="font-medium">
                  {order.paymentMethod}
                </span>
              </p>
              <p className="text-xs text-slate-500">
                Date:{" "}
                <span className="font-medium">
                  {order.createdAt}
                </span>
              </p>
            </div>

            <div className="text-sm space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 uppercase">
                  Payment
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    order.isPaid
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {order.isPaid ? "Paid" : "Pending"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 uppercase">
                  Status
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-50 text-indigo-600">
                  {order.status}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </section>
  );
}
