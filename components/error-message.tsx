"use client"

import { useEffect, useState } from "react";

export default function ErrorBanner({ message }: { message: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (message) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 3000); // show for 3s
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div
      className={`
        w-full text-center bg-red-500 text-white py-2 fixed top-0 left-0 z-50
        transition-transform duration-500 ease-in-out
        ${show ? "translate-y-0" : "-translate-y-full"}
      `}
    >
      {message}
    </div>
  );
}
