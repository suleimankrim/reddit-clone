"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { SessionProvider } from "next-auth/react";

const client = new QueryClient();
const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={client}>
      <SessionProvider>{children}</SessionProvider>
    </QueryClientProvider>
  );
};
export default Provider;
