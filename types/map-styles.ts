/**
 * 交通方式类型
 */
export enum TransportMode {
  AIRPLANE = 'airplane',
  TRAIN = 'train',
  CAR = 'car',
}

/**
 * 轨迹样式配置接口
 */
export interface PolylineStyleConfig {
  color: string;
  weight: number;
  opacity: number;
  lineStyle?: 'solid' | 'dashed';
  isCurved?: boolean; // 飞机使用弧线
  strokeDasharray?: number[]; // 自定义虚线模式，如 [20, 10, 5, 10] 表示点划线
  // Halo 外边框配置（类似 Google Maps 铁路线）
  haloColor?: string; // 外边框颜色
  haloWeight?: number; // 外边框粗细
  haloOpacity?: number; // 外边框透明度（固定，不随时间衰减）
}
