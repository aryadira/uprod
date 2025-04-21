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
  token: string | null;
  setToken: (token: string | null) => void;
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
  token: null,
  setToken: () => { },
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

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = Cookies.get("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);


  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessages, setErrorMessages] = useState<ErrorMessageType>(null);

  // Simpan/hapus token dari cookie
  useEffect(() => {
    if (token) {
      Cookies.set("token", token, { expires: 7 });
    } else {
      Cookies.remove("token");
    }
  }, [token, isLoading]);

  // Ambil current user berdasarkan token
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await useAxios.get("/user/current", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCurrentUser(res.data.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
        setCurrentUser(null);
        setToken(null);
        router.replace("/signin");
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchUser();
    } else {
      router.replace("/signin");
      setIsLoading(false);
    }

  }, [token]);


  // signin
  const signin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await useAxios.post("/auth/signin", { email, password });
      const { token } = res.data.data;
      const { message } = res.data;

      if (token) {
        setToken(token);
        toast.success(message);
        router.push("/");
      } else {
        setToken(null);
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
          Authorization: `Bearer ${token}`,
        },
      });

      const { message } = res.data;
      toast.success(message);

    } catch (err: any) {
      setErrorMessages(err.response.data.message);
    } finally {
      setToken(null);
      setCurrentUser(null);
      router.push("/signin");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
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