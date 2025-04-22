// hooks/useProtectedRoute.ts
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function useProtectedRoute() {
  const { authToken, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !authToken) {
      router.replace("/signin");
    }
  }, [isLoading, authToken, router]);

  return
}
