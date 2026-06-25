"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const pingVisit = async () => {
      try {
        await fetch('/api/visitors', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            screen: typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : 'Bilinmir',
            page: pathname || '/'
          })
        });
      } catch (e) {}
    };
    
    pingVisit();
    
    const interval = setInterval(pingVisit, 15000);
    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}
