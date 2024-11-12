// QueryWrapper.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

const QueryWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const currentPath = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const excludedRoutes = ["/auth/login", "/auth/register", "/desktop"];
    const token = localStorage.getItem("access_token");

    // Don't redirect if we're on the desktop message page
    if (currentPath === "/desktop") {
      return;
    }

    // Handle auth redirects
    if (excludedRoutes.includes(currentPath) && token) {
      router.push("/");
    } else if (!excludedRoutes.includes(currentPath) && !token) {
      router.push("/auth/login");
    }
  }, [currentPath, router]);

  // Add mobile check on client side
  // useEffect(() => {
  //   if (!isMounted) return;

  //   const checkMobile = () => {
  //     const isMobile = window.innerWidth <= 450;
  //     if (!isMobile && currentPath !== "/desktop") {
  //       router.push("/desktop");
  //     }
  //   };

  //   checkMobile();
  //   window.addEventListener("resize", checkMobile);
  //   return () => window.removeEventListener("resize", checkMobile);
  // }, [isMounted, currentPath, router]);

  if (!isMounted) return null;

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryWrapper;
