import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useRedirectIfAuthenticated() {
  const { authToken, currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authToken && currentUser) {
      switch (currentUser.role) {
        case "customer":
          router.replace("/homepage");
          break;
        case "admin":
        case "superadmin":
          router.replace("/dashboard");
          break;
        default:
          router.replace("/404");
      }
    }
  }, [authToken, currentUser, router]);
}
