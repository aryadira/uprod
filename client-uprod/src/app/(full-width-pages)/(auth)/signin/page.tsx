import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Uprod",
  description: "Let's sign in",
};

export default function SignIn() {
  return <SignInForm />;
}
