'use client';

import { useEffect, useRef } from 'react';
import type { Trip } from '@/types/trip';

interface JourneyPolylineProps {
  map: any;
  trip: Trip;
  strokeColor?: string;
  strokeWeight?: number;
}

export function JourneyPolyline({
  map,
  trip,
  strokeColor = '#3B82F6',
  strokeWeight = 3,
}: JourneyPolylineProps) {
  const polylineRef = useRef<any>(null);

  useEffect(() => {
    if (!map || typeof window === 'undefined') return;

    // 清除旧的轨迹
    if (polylineRef.current) {
      map.remove(polylineRef.current);
    }

    // 创建轨迹路径
    const path = [
      [trip.origin.lng, trip.origin.lat],
      [trip.destination.lng, trip.destination.lat],
    ];

    // 创建新的轨迹
    const AMap = (window as any).AMap;
    const polyline = new AMap.Polyline({
      path: path,
      strokeColor: strokeColor,
      strokeWeight: strokeWeight,
      strokeOpacity: 0.8,
    });

    map.add(polyline);
    polylineRef.current = polyline;

    return () => {
      if (polylineRef.current) {
        map.remove(polylineRef.current);
        polylineRef.current = null;
      }
    };
  }, [map, trip, strokeColor, strokeWeight]);

  return null;
}
