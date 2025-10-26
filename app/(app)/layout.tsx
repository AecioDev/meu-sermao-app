// src/app/(app)/layout.tsx
"use client";

import MainLayout from "@/components/layout/MainLayout";
import React from "react";

// Este é o Layout do Next.js para o grupo (app)
export default function PrivateAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
