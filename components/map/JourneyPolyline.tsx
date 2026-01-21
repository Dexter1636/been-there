'use client';

import { useEffect, useRef, useState } from 'react';
import type { Trip } from '@/types/trip';
import { getPolylineStyle } from '@/lib/map-style-config';
import { routeService } from '@/lib/route-service';

interface JourneyPolylineProps {
  map: any;
  trip: Trip;
  onPolylineReady?: (polyline: any) => void;
}

export function JourneyPolyline({ map, trip, onPolylineReady }: JourneyPolylineProps) {
  const polylineRef = useRef<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (!map || typeof window === 'undefined') return;

    let isMounted = true;

    // 清除旧的轨迹
    if (polylineRef.current) {
      map.remove(polylineRef.current);
      polylineRef.current = null;
    }

    const styleConfig = getPolylineStyle(trip.transportMode);
    const AMap = (window as any).AMap;

    // 初始化 RouteService（仅首次）
    if (isInitializing) {
      routeService.initialize(AMap);
      setIsInitializing(false);
    }

    // 异步获取路径
    const fetchAndDrawRoute = async () => {
      try {
        const { path } = await routeService.getRoute(
          trip.origin,
          trip.destination,
          trip.transportMode
        );

        // 检查组件是否已卸载
        if (!isMounted) return;

        const polyline = new AMap.Polyline({
          path: path,
          strokeColor: styleConfig.color,
          strokeWeight: styleConfig.weight,
          strokeOpacity: styleConfig.opacity,
          lineJoin: 'round',
          lineCap: 'round',
        });

        map.add(polyline);
        polylineRef.current = polyline;

        // 通知父组件该轨迹已准备好
        onPolylineReady?.(polyline);
      } catch (error) {
        console.error('Failed to draw route:', error);

        // 降级：绘制直线
        if (isMounted) {
          const fallbackPath = [
            [trip.origin.lng, trip.origin.lat],
            [trip.destination.lng, trip.destination.lat],
          ];

          const polyline = new AMap.Polyline({
            path: fallbackPath,
            strokeColor: styleConfig.color,
            strokeWeight: styleConfig.weight,
            strokeOpacity: styleConfig.opacity,
            lineJoin: 'round',
            lineCap: 'round',
          });

          map.add(polyline);
          polylineRef.current = polyline;
          // 通知父组件该轨迹已准备好（降级情况）
          onPolylineReady?.(polyline);
        }
      }
    };

    fetchAndDrawRoute();

    return () => {
      isMounted = false;
      if (polylineRef.current) {
        map.remove(polylineRef.current);
        polylineRef.current = null;
      }
    };
  }, [map, trip, isInitializing]);

  return null;
}
