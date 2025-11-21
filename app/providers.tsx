"use client";

import { ReactNode } from "react";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
      <Toaster position="top-right" />
    </CartProvider>
  );
}