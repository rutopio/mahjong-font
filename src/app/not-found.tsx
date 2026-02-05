"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <div className="container flex min-h-screen items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center gap-4">
        <p>Page not found.</p>
        <h2 className="mb-4 text-2xl font-bold">Redirecting...</h2>
      </div>
    </div>
  );
}
