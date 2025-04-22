import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Uprod",
  description: "Let's sign up",
};

export default function SignUp() {
  return <SignUpForm />;
}
