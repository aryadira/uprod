"use client"
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
  setToken: (token: string | null) => void,
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => { },
  currentUser: null,
  setCurrentUser: () => { }
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window != "undefined") {
      return localStorage.getItem('token');
    }
    return null;
  })

  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // Simpan/remove token ke localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token])

  // current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/user/current', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCurrentUser(res.data.data)
      } catch (err) {
        console.error('Failed to fetch user', err);
        setCurrentUser(null)
      }
    }

    if (token) {
      fetchUser()
    }

  }, [token])

  return (
    <AuthContext.Provider value={{ token, setToken, currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)