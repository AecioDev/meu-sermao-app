"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Props {
  width: number;
  heigth: number;
}

export default function ThemedLogo({ width, heigth }: Props) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) {
    return <div className="w-[120px] h-[120px] mx-auto bg-transparent" />;
  }

  return (
    <Image
      src={resolvedTheme === "dark" ? "/logo_dark_sf.png" : "/logo_sf.png"}
      alt="Logo Meu Sermão"
      width={width}
      height={heigth}
      className="mx-auto"
      priority
    />
  );
}
