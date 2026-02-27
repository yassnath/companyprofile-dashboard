"use client";

import { useSession } from "next-auth/react";

export function useAuth() {
  const { data, status } = useSession();

  return {
    session: data,
    user: data?.user,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  };
}
