"use client";

import { AuthProvider } from "@/lib/AuthContext";

export default function Providers({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
