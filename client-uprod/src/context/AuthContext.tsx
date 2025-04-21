/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import useAxios from "@/hooks/useAxios";

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

  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return Cookies.get("token") || null;
    }
    return null;
  });

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
  }, [token]);

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
        router.push("/signin");
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchUser();
      router.push('/')
    } else {
      router.push('/signin')
    }
    
  }, [token]);


  // signin
  const signin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await useAxios.post("/auth/signin", { email, password });
      const { token } = res.data.data;
      if (token){
        setToken(token)
        router.push('/');
      } else {
        setToken(null)
        router.push('/signin');
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

      if (res.data.data) {
        router.push('/signin')
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
      await useAxios.post("/auth/signout", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err:any) {
      if (err.response && err.response.data && err.response.data.errors) {
        setErrorMessages(err.response.data.errors);
      } else {
        throw err;
      }
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