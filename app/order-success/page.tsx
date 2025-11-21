"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";

export default function OrderSuccessPage() {
  const router = useRouter();
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch("/animations/order-success.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data));

    const timeout = setTimeout(() => router.push("/"), 3000);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-52 h-52">
        {animationData && (
          <Lottie animationData={animationData} loop={false} />
        )}
      </div>

      <h1 className="text-2xl font-semibold text-slate-900 mt-4">
        Your order is completed!
      </h1>

      <p className="text-sm text-slate-500 mt-2">
        Thank you for shopping with us. Redirecting to homepage…
      </p>
    </section>
  );
}
