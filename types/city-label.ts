/**
 * 城市级别
 */
export type CityLevel = 'capital' | 'normal';

/**
 * 城市标注数据结构
 */
export interface CityLabel {
  name: string; // 城市名，如 "杭州"
  lng: number; // 经度
  lat: number; // 纬度
  level: CityLevel; // 城市级别
}
