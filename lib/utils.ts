import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createPageUrl(pageName: string) {
  // Remove extensão .js se existir
  const cleanPageName = pageName.replace(".js", "");

  // Retorna a URL formatada
  return `/app/${cleanPageName}`;
}
