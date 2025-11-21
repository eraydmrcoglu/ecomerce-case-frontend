"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState, FormEvent } from "react";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  Search,
  LogOut,
  ReceiptText,
  LayoutDashboard,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { API_BASE_URL } from "@/lib/api";

type NavProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  offerPrice?: number;
  image: string;
};

type AuthUser = {
  id: string;
  email: string;
  name?: string;
  role?: string;
  isAdmin?: boolean;
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hide, setHide] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [searchProducts, setSearchProducts] = useState<NavProduct[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const { totalCount } = useCart();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current > lastScroll && current > 80) {
        setHide(true);
      } else {
        setHide(false);
      }
      setLastScroll(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadUser = () => {
      const raw = localStorage.getItem("authUser");
      if (!raw) {
        setAuthUser(null);
        return;
      }
      try {
        const parsed = JSON.parse(raw) as AuthUser;
        setAuthUser(parsed);
      } catch {
        setAuthUser(null);
      }
    };

    loadUser();

    const handleAuthChanged = () => loadUser();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "authUser") loadUser();
    };

    window.addEventListener("auth:changed", handleAuthChanged as EventListener);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(
        "auth:changed",
        handleAuthChanged as EventListener
      );
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const isLoggedIn = !!authUser;
  const isAdmin =
    !!authUser && (authUser.role === "admin" || authUser.isAdmin === true);

  useEffect(() => {
    const fetchSearchProducts = async () => {
      try {
        setSearchLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/products?limit=50`, {
          cache: "no-store",
        });

        if (!res.ok) {
          console.error("NAV SEARCH PRODUCTS: BAD RESPONSE", res.status);
          return;
        }

        const data = await res.json();
        const rawItems = Array.isArray(data.items) ? data.items : data;

        const mapped: NavProduct[] = rawItems.map((p: any) => {
          const img =
            p.image ||
            p.mainImage ||
            (Array.isArray(p.images) ? p.images[0] : undefined) ||
            "/placeholder-product.jpg";

          return {
            id: p.id || p._id,
            name: p.name,
            category:
              p.category?.name ||
              p.category?.slug ||
              p.category ||
              "Category",
            price: p.price,
            offerPrice: p.offerPrice,
            image: img,
          };
        });

        setSearchProducts(mapped);
      } catch (err) {
        console.error("NAV SEARCH PRODUCTS ERROR", err);
      } finally {
        setSearchLoading(false);
      }
    };

    fetchSearchProducts();
  }, []);

  const filteredResults = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return [];
    return searchProducts
      .filter((p) => p.name.toLowerCase().includes(q))
      .slice(0, 4);
  }, [searchTerm, searchProducts]);

  const goSearchPage = (q: string) => {
    if (!q) return;
    router.push(`/products?search=${encodeURIComponent(q)}`);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (!q) return;
    goSearchPage(q);
    setSearchOpen(false);
  };

  const handleSearchIconClick = () => {
    if (!searchOpen) {
      setSearchOpen(true);
      return;
    }
    const q = searchTerm.trim();
    if (!q) {
      setSearchOpen(false);
      return;
    }
    goSearchPage(q);
    setSearchOpen(false);
  };

  const handleSelectProduct = (product: NavProduct) => {
    setSearchTerm("");
    setSearchOpen(false);
    router.push(`/product/${product.id}`);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      }).catch(() => {});
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authUser");
        localStorage.removeItem("authToken");
        window.dispatchEvent(new Event("auth:changed"));
      }
      setUserMenuOpen(false);
      router.push("/");
    }
  };

  const handleGoOrders = () => {
    setUserMenuOpen(false);
    if (isAdmin) {
      router.push("/admin/orders");
    } else {
      router.push("/orders");
    }
  };

  const displayName =
    authUser?.name ||
    (authUser?.email ? authUser.email.split("@")[0] : "Account");

  return (
    <nav
      className={`relative z-50 top-0 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-32 bg-white/90 backdrop-blur border-b border-slate-200 text-slate-800 text-xs md:text-sm transition-transform duration-300 ${
        hide ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <Link href="/" className="font-semibold text-lg tracking-tight">
        Ecommerce
      </Link>

      <div className="hidden md:flex items-center gap-8">
        <Link href="/" className="hover:text-slate-500 transition">
          Home
        </Link>

        <Link href="/products" className="hover:text-slate-500 transition">
          Products
        </Link>

        {isAdmin && (
          <>
            <Link
              href="/admin/dashboard"
              className="hover:text-slate-500 transition"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/orders"
              className="hover:text-slate-500 transition"
            >
              Orders
            </Link>
          </>
        )}
      </div>

      <div className="hidden md:flex items-center gap-3">
        <Link
          href="/cart"
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 transition"
        >
          <ShoppingCart size={18} />
          {totalCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-indigo-600 text-[10px] text-white flex items-center justify-center px-1">
              {totalCount}
            </span>
          )}
        </Link>

        <div className="relative flex items-center">
          <button
            type="button"
            onClick={handleSearchIconClick}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 transition active:scale-95 bg-white"
          >
            <Search size={16} />
          </button>

          <form
            onSubmit={handleSearchSubmit}
            className={`flex items-center overflow-hidden rounded-full border border-slate-200 bg-white ml-2 h-9 transition-all duration-300 ${
              searchOpen
                ? "w-64 px-3 opacity-100"
                : "w-0 px-0 opacity-0 pointer-events-none"
            }`}
          >
            <input
              autoFocus={searchOpen}
              type="text"
              placeholder="Search products..."
              className="w-full bg-transparent outline-none text-[11px] text-slate-800 placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          {searchOpen && searchTerm.trim() && (
            <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-slate-200 bg-white shadow-lg text-xs">
              <div className="max-h-64 overflow-y-auto py-2">
                {searchLoading && (
                  <p className="px-3 py-2 text-[11px] text-slate-400">
                    Loading...
                  </p>
                )}

                {!searchLoading && filteredResults.length === 0 && (
                  <p className="px-3 py-2 text-[11px] text-slate-400">
                    No products found.
                  </p>
                )}

                {!searchLoading &&
                  filteredResults.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => handleSelectProduct(product)}
                      className="w-full px-3 py-2 flex items-center gap-2 hover:bg-slate-50 text-left cursor-pointer"
                    >
                      <div className="relative w-9 h-9 rounded-md overflow-hidden shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <p className="text-[11px] font-medium text-slate-900 line-clamp-1">
                          {product.name}
                        </p>
                        <p className="text-[10px] text-slate-500 line-clamp-1">
                          {product.category}
                        </p>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {!isLoggedIn ? (
          <Link
            href="/auth/login"
            className="px-5 py-2 text-[11px] md:text-xs lg:text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all rounded-full flex items-center gap-1.5"
          >
            <User className="w-4 h-4" />
            <span>Sign in</span>
          </Link>
        ) : (
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen((v) => !v)}
              className="px-4 py-2 text-[11px] md:text-xs lg:text-sm bg-slate-900 text-white rounded-full flex items-center gap-2 hover:bg-slate-800 active:scale-95 transition-all"
            >
              <User className="w-4 h-4" />
              <span className="max-w-[120px] truncate">{displayName}</span>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white shadow-md text-xs py-1">
                <div className="px-3 py-2 text-[11px] text-slate-500 border-b border-slate-100">
                  Signed in as
                  <div className="font-medium text-slate-800 truncate">
                    {authUser?.email}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoOrders}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-slate-50 text-left"
                >
                  <span>My orders</span>
                  <ReceiptText className="w-3 h-3" />
                </button>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      router.push("/admin/dashboard");
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-slate-50 text-left"
                  >
                    <span>Admin dashboard</span>
                    <LayoutDashboard className="w-3 h-3" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between px-3 py-2 text-red-500 hover:bg-red-50 text-left"
                >
                  <span>Logout</span>
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <button
        onClick={() => setOpen(true)}
        className="md:hidden active:scale-90 transition"
      >
        <Menu className="w-7 h-7" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-white/90 text-slate-800 backdrop-blur flex flex-col items-center justify-center text-lg gap-6 md:hidden">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-md hover:bg-slate-200 transition"
          >
            <X className="w-7 h-7" />
          </button>

          <Link href="/" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link href="/products" onClick={() => setOpen(false)}>
            Products
          </Link>

          {isAdmin && (
            <>
              <Link href="/admin/dashboard" onClick={() => setOpen(false)}>
                Dashboard
              </Link>
              <Link href="/admin/orders" onClick={() => setOpen(false)}>
                Orders
              </Link>
            </>
          )}

          <Link
            href="/cart"
            onClick={() => setOpen(false)}
            className="relative mt-2"
          >
            <ShoppingCart className="w-7 h-7 text-slate-700" />
            {totalCount > 0 && (
              <span className="absolute -top-2 -right-2 text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded-full">
                {totalCount}
              </span>
            )}
          </Link>

          {!isLoggedIn ? (
            <Link
              href="/auth/login"
              onClick={() => setOpen(false)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-full text-sm hover:bg-indigo-700 transition flex items:center gap-2"
            >
              <User className="w-4 h-4" />
              Sign in
            </Link>
          ) : (
            <div className="flex flex-col gap-3 items-center">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  handleGoOrders();
                }}
                className="px-6 py-2 bg-slate-100 text-slate-800 rounded-full text-sm hover:bg-slate-200 transition flex items-center gap-2"
              >
                <ReceiptText className="w-4 h-4" />
                My orders
              </button>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    router.push("/admin/dashboard");
                  }}
                  className="px-6 py-2 bg-slate-100 text-slate-800 rounded-full text-sm hover:bg-slate-200 transition flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin dashboard
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="px-6 py-2 bg-slate-900 text-white rounded-full text-sm hover:bg-slate-800 transition flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
