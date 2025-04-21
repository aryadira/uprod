// hooks/useProtectedRoute.ts
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function useProtectedRoute() {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/signin");
    }
  }, [isLoading, token]);
}
