'use client';

import { useEffect, useRef, useState } from 'react';
import { loadAMap } from '@/lib/amap-loader';
import { AMAP_CONFIG } from '@/lib/constants';
import type { Coordinate, Trip } from '@/types/trip';

interface AMapViewProps {
  trips?: Trip[];
  center?: Coordinate;
  zoom?: number;
  className?: string;
  onMapReady?: (map: any) => void;
}

export function AMapView({
  trips = [],
  center = AMAP_CONFIG.DEFAULT_CENTER,
  zoom = AMAP_CONFIG.DEFAULT_ZOOM,
  className = '',
  onMapReady,
}: AMapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    async function initMap() {
      try {
        // 设置安全密钥（必须在加载 AMap 之前）
        if (AMAP_CONFIG.SECRET_KEY) {
          (window as any)._AMapSecurityConfig = {
            securityJsCode: AMAP_CONFIG.SECRET_KEY,
          };
        }

        const AMap = await loadAMap({
          key: AMAP_CONFIG.KEY,
          version: AMAP_CONFIG.VERSION,
        });

        if (mapRef.current && !mapInstanceRef.current) {
          const map = new AMap.Map(mapRef.current, {
            center: [center.lng, center.lat],
            zoom: zoom,
          });

          mapInstanceRef.current = map;
          setIsReady(true);
          onMapReady?.(map);
        }
      } catch (error) {
        console.error('Failed to load AMap:', error);
      }
    }

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={mapRef}
      className={`w-full h-screen ${className}`}
      style={{ height: '100vh' }}
    />
  );
}
