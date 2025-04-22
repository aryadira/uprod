"use client"
import { useAuth } from "@/context/AuthContext";
import React from "react";

export default function Homepage () {
  const { currentUser } = useAuth();

  return <div>Welcome to home page {currentUser?.name}</div>;
};
