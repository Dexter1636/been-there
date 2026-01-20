'use client';

import { useEffect, useRef } from 'react';
import { CITY_LABELS } from '@/lib/city-label-data';
import type { CityLabel, CityLevel } from '@/types/city-label';

interface CityLabelLayerProps {
  map: any;
}

/**
 * 城市名标注层组件
 *
 * 用于在地图上显示极简风格的城市名标注
 * 根据地图缩放级别动态显示/隐藏城市名
 */
export function CityLabelLayer({ map }: CityLabelLayerProps) {
  const markersRef = useRef<Array<{ marker: any; city: CityLabel }>>([]);

  useEffect(() => {
    if (!map || typeof window === 'undefined') return;

    const AMap = (window as any).AMap;
    if (!AMap) {
      console.error('CityLabelLayer: AMap not found on window');
      return;
    }

    // 创建城市标注的样式
    const createMarkerContent = (cityName: string): string => {
      return `<div style="
        font-family: Inter, system-ui, -apple-system, sans-serif;
        font-size: 11px;
        font-weight: 400;
        color: rgba(130, 136, 145, 0.7);
        pointer-events: none;
        white-space: nowrap;
      ">${cityName}</div>`;
    };

    // 初始化所有城市标记
    const markers: Array<{ marker: any; city: CityLabel }> = [];

    try {
      for (const city of CITY_LABELS) {
        const marker = new AMap.Marker({
          position: [city.lng, city.lat],
          content: createMarkerContent(city.name),
          zIndex: 10,
        });

        map.add(marker);
        markers.push({ marker, city });
      }
      console.log('CityLabelLayer: Created', markers.length, 'markers');
    } catch (error) {
      console.error('CityLabelLayer: Error creating markers:', error);
      return;
    }

    markersRef.current = markers;

    // 根据缩放级别和城市级别判断是否显示
    const getVisibleLabels = (zoom: number, cityLevel: CityLevel): boolean => {
      if (zoom < 5) return false; // 不显示任何城市名
      if (zoom >= 5 && zoom < 7) return cityLevel === 'capital'; // 只显示 capital
      if (zoom >= 7 && zoom <= 9) return true; // 显示全部城市
      return false; // zoom > 9 全部隐藏
    };

    // 更新标注显隐
    const updateLabelVisibility = () => {
      const zoom = map.getZoom();
      for (const { marker, city } of markersRef.current) {
        const visible = getVisibleLabels(zoom, city.level);
        if (visible) {
          marker.show();
        } else {
          marker.hide();
        }
      }
    };

    // 初始化时更新一次显隐状态
    updateLabelVisibility();

    // 监听缩放变化事件
    map.on('zoomchange', updateLabelVisibility);

    // 清理函数
    return () => {
      map.off('zoomchange', updateLabelVisibility);
      for (const { marker } of markersRef.current) {
        map.remove(marker);
      }
      markersRef.current = [];
    };
  }, [map]);

  return null;
}
