import type { CityLabel } from '@/types/city-label';

/**
 * 城市标注示例数据
 *
 * 包含中国主要地级市，用于地图上的城市名标注层
 */
export const CITY_LABELS: CityLabel[] = [
  // 直辖市/省会城市 (capital)
  { name: '北京', lng: 116.4074, lat: 39.9042, level: 'capital' },
  { name: '上海', lng: 121.4737, lat: 31.2304, level: 'capital' },
  { name: '广州', lng: 113.2644, lat: 23.1291, level: 'capital' },
  { name: '成都', lng: 104.0665, lat: 30.5723, level: 'capital' },
  { name: '武汉', lng: 114.3055, lat: 30.5928, level: 'capital' },
  { name: '西安', lng: 108.9398, lat: 34.3416, level: 'capital' },
  { name: '南京', lng: 118.7969, lat: 32.0603, level: 'capital' },
  { name: '杭州', lng: 120.1551, lat: 30.2741, level: 'normal' },
  { name: '苏州', lng: 120.5853, lat: 31.2989, level: 'normal' },
  { name: '深圳', lng: 114.0579, lat: 22.5431, level: 'normal' },
  { name: '重庆', lng: 106.5516, lat: 29.5630, level: 'capital' },
  { name: '天津', lng: 117.2008, lat: 39.0842, level: 'capital' },
  { name: '沈阳', lng: 123.4315, lat: 41.8057, level: 'capital' },
  { name: '大连', lng: 121.6186, lat: 38.9140, level: 'normal' },
  { name: '青岛', lng: 120.3826, lat: 36.0671, level: 'normal' },
];
