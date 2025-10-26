// app/(auth)/layout.tsx
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Mobile-first: altura total, centralizado
    <main className="flex items-center justify-center min-h-screen w-full bg-background p-4">
      {children}
    </main>
  );
}
