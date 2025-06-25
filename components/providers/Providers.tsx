"use client";

import { type ReactNode } from "react";
import AuthProvider from "./AuthProvider";
import TrpcProvider from "./TrpcProvider";
import ToastProvider from "./ToastProvider";

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
