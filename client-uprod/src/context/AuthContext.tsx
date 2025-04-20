"use client";
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: number;
  userRoleId: number;
  name: string;
  email: string;
}

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isLoading: boolean;
  signup: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  signin: (email: string, password: string) => Promise<void>;
  signout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  currentUser: null,
  setCurrentUser: () => {},
  isLoading: false,
  signup: () => Promise.resolve(),
  signin: () => Promise.resolve(),
  signout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Simpan/hapus token dari localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // Ambil current user berdasarkan token
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("/user/current", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCurrentUser(res.data.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchUser();
    }
  }, [token]);

  const signin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await axios.post("/auth/signin", { email, password });
      const { token } = res.data;
      setToken(token);
    } catch (err) {
      console.error("Sign in failed", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ) => {
    setIsLoading(true);
    try {
      await axios.post("/auth/signup", {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
    } catch (err) {
      console.error("Signup failed", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signout = () => {
    setToken(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        currentUser,
        setCurrentUser,
        isLoading,
        signin,
        signup,
        signout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
