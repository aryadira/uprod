/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

export default function withAuth(Component: any) {
  return function ProtectedComponent(props: any) {
    const { token } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
      if (!token) {
        router.replace("/unauthorized");
      }
    }, [token]);

    if (!token) return null;

    return <Component {...props} />;
  };
}
