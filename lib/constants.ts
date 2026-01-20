/**
 * 高德地图配置常量
 */
export const AMAP_CONFIG = {
  KEY: process.env.NEXT_PUBLIC_AMAP_KEY || '',
  SECRET_KEY: process.env.NEXT_PUBLIC_AMAP_SECRET_KEY || '',
  VERSION: '2.0',
  DEFAULT_CENTER: { lng: 104.1954, lat: 35.8617 }, // 中国中心
  DEFAULT_ZOOM: 4,
  // 地图样式配置
  MAP_STYLE: 'amap://styles/whitesmoke', // 极简样式
  MAP_FEATURES: ['bg', 'road', 'boundary'], // 显示背景、道路、边界（省界包含在 road 中）
} as const;
