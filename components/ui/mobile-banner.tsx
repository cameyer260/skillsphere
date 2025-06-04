"use client";

import { useGlobal } from "@/app/context/GlobalContext";

export default function MobileBanner() {
  const { isMobile } = useGlobal();

  return isMobile ? (
    <div className="bg-green-600 w-full">
      <h1 className="text-center">
        Important: This website is designed for desktop use. Some features may
        be unavailable on mobile devices.
      </h1>
    </div>
  ) : null;
}
