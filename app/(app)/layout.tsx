// src/app/(app)/layout.tsx
"use client";

import AppLayout from "@/components/layout/AppLayout";
import React from "react";

// Este é o Layout do Next.js para o grupo (app)
export default function PrivateAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ele simplesmente "envolve" os filhos com o NOSSO componente de layout
  // que já tem a sidebar, o header, etc.
  return <AppLayout>{children}</AppLayout>;
}
