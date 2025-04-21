import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useRedirectIfAuthenticated() {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, [token]);
}
