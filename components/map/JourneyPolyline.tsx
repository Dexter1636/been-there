'use client';

import { useEffect, useRef, useState } from 'react';
import type { Trip } from '@/types/trip';
import { getPolylineStyle } from '@/lib/map-style-config';
import { routeService } from '@/lib/route-service';
import { TransportMode } from '@/types/map-styles';

interface TrainPolylinePair {
  halo: any;
  main: any;
}

function isTrainPolylinePair(obj: any): obj is TrainPolylinePair {
  return obj && 'halo' in obj && 'main' in obj;
}

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
      if (isTrainPolylinePair(polylineRef.current)) {
        map.remove(polylineRef.current.halo);
        map.remove(polylineRef.current.main);
      } else {
        map.remove(polylineRef.current);
      }
      polylineRef.current = null;
    }

    const styleConfig = getPolylineStyle(trip.transportMode, trip.date);
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

        // 判断是否使用 Halo 外边框（Google Maps 风格铁路线）
        if (trip.transportMode === TransportMode.TRAIN && styleConfig.haloColor) {
          // 创建 Halo 外边框线（底层）
          const halo = new AMap.Polyline({
            path: path,
            strokeColor: styleConfig.haloColor,
            strokeWeight: styleConfig.haloWeight!,
            strokeOpacity: styleConfig.haloOpacity!,
            lineJoin: 'round',
            lineCap: 'round',
            zIndex: 10,
          });

          // 创建主线（顶层）
          const main = new AMap.Polyline({
            path: path,
            strokeColor: styleConfig.color,
            strokeWeight: styleConfig.weight,
            strokeOpacity: styleConfig.opacity,
            lineJoin: 'round',
            lineCap: 'round',
            zIndex: 11,
          });

          map.add(halo);
          map.add(main);
          polylineRef.current = { halo, main };
          onPolylineReady?.(main);
        } else {
          // 普通单线
          const polyline = new AMap.Polyline({
            path: path,
            strokeColor: styleConfig.color,
            strokeWeight: styleConfig.weight,
            strokeOpacity: styleConfig.opacity,
            strokeStyle: styleConfig.lineStyle === 'dashed' ? 'dashed' : undefined,
            strokeDasharray: styleConfig.strokeDasharray,
            lineJoin: 'round',
            lineCap: 'round',
          });

          map.add(polyline);
          polylineRef.current = polyline;
          onPolylineReady?.(polyline);
        }
      } catch (error) {
        console.error('Failed to draw route:', error);

        // 降级：绘制直线
        if (isMounted) {
          const fallbackPath: [number, number][] = [
            [trip.origin.lng, trip.origin.lat],
            [trip.destination.lng, trip.destination.lat],
          ];

          // 判断是否使用 Halo 外边框
          if (trip.transportMode === TransportMode.TRAIN && styleConfig.haloColor) {
            const halo = new AMap.Polyline({
              path: fallbackPath,
              strokeColor: styleConfig.haloColor,
              strokeWeight: styleConfig.haloWeight!,
              strokeOpacity: styleConfig.haloOpacity!,
              lineJoin: 'round',
              lineCap: 'round',
              zIndex: 10,
            });

            const main = new AMap.Polyline({
              path: fallbackPath,
              strokeColor: styleConfig.color,
              strokeWeight: styleConfig.weight,
              strokeOpacity: styleConfig.opacity,
              lineJoin: 'round',
              lineCap: 'round',
              zIndex: 11,
            });

            map.add(halo);
            map.add(main);
            polylineRef.current = { halo, main };
            onPolylineReady?.(main);
          } else {
            const polyline = new AMap.Polyline({
              path: fallbackPath,
              strokeColor: styleConfig.color,
              strokeWeight: styleConfig.weight,
              strokeOpacity: styleConfig.opacity,
              strokeStyle: styleConfig.lineStyle === 'dashed' ? 'dashed' : undefined,
              strokeDasharray: styleConfig.strokeDasharray,
              lineJoin: 'round',
              lineCap: 'round',
            });

            map.add(polyline);
            polylineRef.current = polyline;
            onPolylineReady?.(polyline);
          }
        }
      }
    };

    fetchAndDrawRoute();

    return () => {
      isMounted = false;
      if (polylineRef.current) {
        if (isTrainPolylinePair(polylineRef.current)) {
          map.remove(polylineRef.current.halo);
          map.remove(polylineRef.current.main);
        } else {
          map.remove(polylineRef.current);
        }
        polylineRef.current = null;
      }
    };
  }, [map, trip, isInitializing]);

  return null;
}
