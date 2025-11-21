"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";

type OrderItem = {
  productName: string;
  quantity: number;
};

type UserOrder = {
  id: string;
  items: OrderItem[];
  amount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
};

export default function UserOrdersPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const raw = localStorage.getItem("authUser");
        setIsLoggedIn(!!raw);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!authChecked) return;

    if (!isLoggedIn) {
      router.replace("/auth/login?redirect=/orders");
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        setError(null);

        let storedToken: string | null = null;
        if (typeof window !== "undefined") {
          storedToken = localStorage.getItem("authToken");
        }

        if (!storedToken) {
          setError("You must be logged in to view your orders.");
          return;
        }

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

        const res = await fetch(`${API_BASE_URL}/api/orders/my`, {
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
        const raw = Array.isArray(json) ? json : json.items ?? [];

        const mapped: UserOrder[] = raw.map((o: any) => ({
          id: o.id || o._id,
          items: (o.items ?? []).map((i: any) => {
            let productName = "Product";
            if (i.product?.name) {
              productName = i.product.name;
            } else if (typeof i.product === "string") {
              productName = `Product ${i.product.slice(-4)}`;
            } else if (i.name) {
              productName = i.name;
            }

            return {
              productName,
              quantity: i.quantity ?? 1,
            };
          }),
          amount: o.amount ?? 0,
          paymentMethod: o.paymentType || "Card",
          status: o.status || "pending",
          createdAt: o.createdAt
            ? new Date(o.createdAt).toLocaleDateString()
            : "",
        }));

        setOrders(mapped);
      } catch (err) {
        console.error("USER ORDERS ERROR", err);
        setError("Orders could not be loaded.");
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [authChecked, isLoggedIn, router]);

  if (!authChecked) {
    return (
      <div className="py-20 text-center text-sm text-slate-500">
        Loading...
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="py-20 text-center text-sm text-slate-500">
        Redirecting...
      </div>
    );
  }

  return (
    <section className="md:p-10 p-4 max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold mb-4">My orders</h2>

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
          You don&apos;t have any orders yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-slate-200 rounded-xl p-4 bg-white text-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    Order ID
                  </p>
                  <p className="font-semibold text-slate-900">
                    {order.id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    Date
                  </p>
                  <p className="text-xs text-slate-600">
                    {order.createdAt}
                  </p>
                </div>
              </div>

              <div className="mt-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-400 mb-1">
                  Items
                </p>
                <ul className="space-y-0.5">
                  {order.items.map((item, i) => (
                    <li key={i} className="text-slate-700">
                      {item.productName}{" "}
                      {item.quantity > 1 && (
                        <span className="text-indigo-500">
                          × {item.quantity}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-xs text-slate-600 space-y-1">
                  <p>
                    Method:{" "}
                    <span className="font-medium">
                      {order.paymentMethod}
                    </span>
                  </p>
                  <p>
                    Status:{" "}
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px]">
                      {order.status}
                    </span>
                  </p>
                </div>

                <p className="text-base font-semibold text-slate-900">
                  ${order.amount.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
