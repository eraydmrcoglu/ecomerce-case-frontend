"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) return;

    try {
      setSubmitting(true);

      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name: fullName, email, password }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || "Register failed");
      }

      toast.success("Account created. You can sign in now.");
      router.push("/auth/login");
    } catch (err: any) {
      console.error("REGISTER ERROR", err);
      toast.error(err?.message || "Register failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <div className="hidden md:block w-1/2 h-full">
        <Image
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/leftSideImage.png"
          alt="Register illustration"
          width={600}
          height={600}
          className="w-full h-full object-cover object-center"
          priority
        />
      </div>

      <div className="flex flex-col items-center justify-center w-full md:w-1/2 px-6">
        <form
          className="w-80 md:w-96 flex flex-col items-center"
          onSubmit={handleSubmit}
        >
          <h2 className="text-4xl text-gray-900 font-bold">Sign up</h2>
          <p className="text-sm text-gray-500 mt-3">
            Create an account to start shopping.
          </p>

          <div className="mt-8 flex items-center w-full bg-white border border-gray-300 h-12 rounded-full overflow-hidden px-6 gap-2">
            <input
              type="text"
              placeholder="Full name"
              className="bg-transparent text-gray-600 placeholder-gray-500 outline-none text-sm w-full h-full"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="mt-4 flex items-center w-full bg-white border border-gray-300 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                fill="#6B7280"
              />
            </svg>
            <input
              type="email"
              placeholder="Email address"
              className="bg-transparent text-gray-600 placeholder-gray-500 outline-none text-sm w-full h-full"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mt-4 flex items-center w-full bg-white border border-gray-300 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <svg width="13" height="17" viewBox="0 0 13 17" fill="none">
              <path
                d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                fill="#6B7280"
              />
            </svg>
            <input
              type="password"
              placeholder="Password"
              className="bg-transparent text-gray-600 placeholder-gray-500 outline-none text-sm w-full h-full"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-8 w-full h-11 rounded-full text-white bg-indigo-500 hover:bg-indigo-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Creating..." : "Create account"}
          </button>

          <p className="text-gray-600 text-sm mt-4">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-indigo-500 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
