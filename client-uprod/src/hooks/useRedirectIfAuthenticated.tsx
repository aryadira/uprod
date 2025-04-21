import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useRedirectIfAuthenticated() {
  const { authToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authToken) {
      router.back();
    }
  }, [authToken, router]);
}
