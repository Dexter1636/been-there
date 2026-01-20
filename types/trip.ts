import { TransportMode } from './map-styles';

/**
 * 坐标点（GCJ-02 坐标系，高德地图使用）
 */
export interface Coordinate {
  lng: number; // 经度
  lat: number; // 纬度
}

/**
 * 一次旅程
 */
export interface Trip {
  id: string; // 唯一标识
  origin: Coordinate; // 起点
  destination: Coordinate; // 终点
  transportMode?: TransportMode; // 交通方式（可选，向后兼容）
  title?: string;
  date?: string;
  description?: string;
}

/**
 * Mock 数据示例
 */
export const MOCK_TRIPS: Trip[] = [
  {
    id: '1',
    title: '北京 → 上海 (飞机)',
    transportMode: TransportMode.AIRPLANE,
    origin: { lng: 116.4074, lat: 39.9042 },
    destination: { lng: 121.4737, lat: 31.2304 },
  },
  {
    id: '2',
    title: '上海 → 杭州 (火车)',
    transportMode: TransportMode.TRAIN,
    origin: { lng: 121.4737, lat: 31.2304 },
    destination: { lng: 120.1551, lat: 30.2741 },
  },
  {
    id: '3',
    title: '杭州 → 苏州 (汽车)',
    transportMode: TransportMode.CAR,
    origin: { lng: 120.1551, lat: 30.2741 },
    destination: { lng: 120.5853, lat: 31.2989 },
  },
];

/**
 * 向后兼容：保留旧的 MOCK_TRIP
 */
export const MOCK_TRIP: Trip = MOCK_TRIPS[0];
