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
}
