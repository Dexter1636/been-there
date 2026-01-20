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
          plugins: ['AMap.Driving'], // 添加驾车插件，用于真实路径规划
        });

        if (mapRef.current && !mapInstanceRef.current) {
          // 使用双重 requestAnimationFrame 确保 DOM 完全渲染后再初始化地图
          // 这可以避免在 React 水合完成前获取到错误的容器尺寸
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              if (!mapRef.current || mapInstanceRef.current) return;

              // 仅记录尺寸用于诊断，不强制设置固定像素值
              // 让 CSS 的 width: '100%', height: '100vh' 保持生效
              const containerWidth = mapRef.current.offsetWidth;
              const containerHeight = mapRef.current.offsetHeight;
              console.log('Initial container size:', { width: containerWidth, height: containerHeight });

              const map = new AMap.Map(mapRef.current, {
                center: [center.lng, center.lat],
                zoom: zoom,
                showLabel: false, // 隐藏文字标签
                viewMode: '2D', // 使用 2D 视图
                zoomEnable: true, // 保留滚轮缩放
                doubleClickZoom: false, // 禁用双击缩放
                keyboardEnable: false, // 禁用键盘控制
                // 极简样式配置
                mapStyle: AMAP_CONFIG.MAP_STYLE,
                features: AMAP_CONFIG.MAP_FEATURES,
                resizeEnable: true, // 启用自动调整大小
              });

              // 等待地图加载完成后调整视图
              map.on('complete', () => {
                console.log('Map loaded, container size:', mapRef.current?.offsetWidth, mapRef.current?.offsetHeight);
                // 显式调用 resize() 确保地图完全渲染
                map.resize();
                console.log('Map size after resize:', map.getSize());
              });

              mapInstanceRef.current = map;
              setIsReady(true);
              onMapReady?.(map);
            });
          });
        }
      } catch (error) {
        console.error('Failed to load AMap:', error);
      }
    }

    initMap();

    // 添加窗口大小改变监听器
    const handleResize = () => {
      if (mapInstanceRef.current && mapRef.current) {
        // 显式调用 map.resize() 让 AMap 自动调整
        mapInstanceRef.current.resize();
        console.log('Map resized, new size:', mapInstanceRef.current.getSize());
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
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
      className={className}
      style={{ width: '100%', height: '100vh', margin: 0, padding: 0 }}
    />
  );
}
