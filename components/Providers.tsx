"use client";

import { type ReactNode } from "react";
import AuthProvider from "./providers/AuthProvider";
import TrpcProvider from "./providers/TrpcProvider";
import ToastProvider from "./providers/ToastProvider";

interface ProvidersProps {
  children: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <AuthProvider>
      <TrpcProvider>
        <ToastProvider />
        {children}
      </TrpcProvider>
    </AuthProvider>
  );
};

export default Providers;
