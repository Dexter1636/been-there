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
  // 可选字段（预留扩展）
  title?: string;
  date?: string;
  description?: string;
}

/**
 * Mock 数据（北京到上海）
 */
export const MOCK_TRIP: Trip = {
  id: '1',
  title: '北京到上海',
  origin: { lng: 116.4074, lat: 39.9042 },
  destination: { lng: 121.4737, lat: 31.2304 },
};
