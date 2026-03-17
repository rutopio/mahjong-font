"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <div className="container flex min-h-dvh items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="mb-4 text-2xl font-bold text-balance">
          Page not found.
        </h1>
        <p>Redirecting...</p>
      </div>
    </div>
  );
}
