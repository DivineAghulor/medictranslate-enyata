import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  size = 40,
  alt = "MedicTranslate",
}: {
  className?: string;
  size?: number;
  alt?: string;
}) {
  return (
    <Image
      src="/medictranslate-logo.svg"
      alt={alt}
      width={size}
      height={size}
      unoptimized
      className={cn("shrink-0", className)}
    />
  );
}
