"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const gatherIntelAndPing = async () => {
      if (typeof window === 'undefined') return;

      // 1. Ekran Kartı (GPU) Analizi - WebGL Fingerprinting Zirehləndi
      let gpu = "Bilinmir";
      try {
        const canvas = document.createElement("canvas");
        const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
        
        if (gl) {
          const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
          if (debugInfo) {
            gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string;
          }
        }
      } catch (e) {}

      // 2. RAM və CPU Nüvə Sayı
      const ram = (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : "Gizli";
      const cpu = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} Nüvə` : "Bilinmir";
      const isTouch = navigator.maxTouchPoints > 0 ? "Bəli" : "Xeyr";

      // 3. Şəbəkə Tipi (Network Connection)
      let netType = "Bilinmir";
      const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      if (conn) {
        netType = `${conn.effectiveType || '3G/4G'} (${conn.downlink || 0} Mbps)`;
      }

      // 4. Batareya Statusu (Battery API)
      let batteryInfo = "Bilinmir";
      try {
        if ('getBattery' in navigator) {
          const battery = await (navigator as any).getBattery();
          batteryInfo = `${Math.round(battery.level * 100)}% ${battery.charging ? '(Şarjda)' : '(Batareya)'}`;
        }
      } catch (e) {}

      // 5. Saat Qurşağı (Timezone) və Referrer (Gəldiyi yer)
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Bilinmir";
      const referrer = document.referrer || "Birbaşa Giriş";

      // 6. Android üçün Dəqiq Model (Client Hints API)
      let exactModel = "";
      if ((navigator as any).userAgentData && (navigator as any).userAgentData.getHighEntropyValues) {
        try {
          const hints = await (navigator as any).userAgentData.getHighEntropyValues(["model", "platformVersion"]);
          exactModel = hints.model || "";
        } catch(e) {}
      }

      // 7. GPS Dəqiq Konum (İcazə verilsə - 10 Metr Dəqiqlik)
      let exactGPS = "İcazə yoxdur";
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => { 
            exactGPS = `${position.coords.latitude}, ${position.coords.longitude}`; 
          },
          (error) => { 
            exactGPS = "Bloklandı / Yoxdur"; 
          },
          { timeout: 5000, enableHighAccuracy: true }
        );
      }

      // Məlumat paketini HTTPS üzərindən arxa plana kəşfiyyata göndəririk
      setTimeout(async () => {
        try {
          await fetch('/api/visitors', { 
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json', 
              'Cache-Control': 'no-cache' 
            },
            body: JSON.stringify({
              screen: `${window.screen.width}x${window.screen.height}`,
              page: pathname || '/',
              gpu, 
              ram, 
              cpu, 
              timezone, 
              referrer, 
              exactModel, 
              isTouch, 
              exactGPS,
              netType,
              batteryInfo
            })
          });
        } catch (e) {}
      }, 1500); // GPS pəncərəsinin açılıb bağlanma reaksiyasını qaçırmamaq üçün kiçik timer
    };
    
    gatherIntelAndPing();
    
    const interval = setInterval(gatherIntelAndPing, 15000);
    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}
