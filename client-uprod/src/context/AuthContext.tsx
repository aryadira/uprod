/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import useAxios from "@/hooks/useAxios";
import toast from "react-hot-toast";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

type ErrorMessageType = Record<string, string[]> | string | null;

interface AuthContextType {
  authToken: string | null;
  setAuthToken: (token: string | null) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isLoading: boolean;
  errorMessages: ErrorMessageType;
  setErrorMessages: (error: ErrorMessageType) => void;
  signup: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  signin: (email: string, password: string) => Promise<void>;
  signout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  authToken: null,
  setAuthToken: () => { },
  currentUser: null,
  setCurrentUser: () => { },
  isLoading: false,
  errorMessages: null,
  setErrorMessages: () => { },
  signup: () => Promise.resolve(),
  signin: () => Promise.resolve(),
  signout: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [authToken, setAuthToken] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessages, setErrorMessages] = useState<ErrorMessageType>(null);

  useEffect(() => {
    const storedToken = Cookies.get("authToken");
    if (storedToken) {
      setAuthToken(storedToken);
    }
  }, []);

  // Redirect ke halaman utama jika token ada dan tidak sedang loading
  useEffect(() => {
    if (authToken) {  
      Cookies.set('authToken', authToken, { expires: 7 });
    } else {
      Cookies.remove('authToken');
    }
  }, [authToken]);

  // Ambil current user berdasarkan token
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await useAxios.get("/user/current", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setCurrentUser(res.data.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
        setCurrentUser(null);
        setAuthToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (authToken) {
      fetchUser();
    }

  }, [authToken]);

  // signin
  const signin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await useAxios.post("/auth/signin", { email, password });
      const { token } = res.data.data;
      const { message } = res.data;

      if (token) {
        setAuthToken(token);
        toast.success(message);
      } else {
        setAuthToken(null);
        toast.error(message);
        router.push("/signin");
      }

    } catch (err: any) {
      const msg = err?.response?.data?.message || "Login failed";
      setErrorMessages(msg);
    }
    finally {
      setIsLoading(false);
    } 
  };

  // signup
  const signup = async (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ) => {
    setIsLoading(true);
    setErrorMessages(null);

    try {
      const res = await useAxios.post("/auth/signup", {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      const { message, status } = res.data;

      if (status == "success") {
        router.push('/signin')
        toast.success(message);
      }

    } catch (err: any) {
      const errs = err?.response?.data?.errors || "Signup failed";
      setErrorMessages(errs);
    }
    finally {
      setIsLoading(false);
    }
  };

  // signout
  const signout = async () => {
    try {
      const res = await useAxios.delete("/auth/signout", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const { message } = res.data;
      toast.success(message);

    } catch (err: any) {
      setErrorMessages(err.response.data.message);
    } finally {
      setAuthToken(null);
      setCurrentUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authToken,
        setAuthToken,
        currentUser,
        setCurrentUser,
        isLoading,
        errorMessages,
        setErrorMessages,
        signin,
        signup,
        signout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};