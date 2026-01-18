/**
 * 高德地图配置常量
 */
export const AMAP_CONFIG = {
  KEY: process.env.NEXT_PUBLIC_AMAP_KEY || '',
  SECRET_KEY: process.env.NEXT_PUBLIC_AMAP_SECRET_KEY || '',
  VERSION: '2.0',
  DEFAULT_CENTER: { lng: 104.1954, lat: 35.8617 }, // 中国中心
  DEFAULT_ZOOM: 4,
} as const;
