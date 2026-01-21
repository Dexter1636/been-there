import { TransportMode, PolylineStyleConfig } from '@/types/map-styles';
import { getOpacityByTime } from '@/lib/time-utils';

/**
 * 极简回忆地图 - 轨迹样式配置
 *
 * 设计原则：
 * 1. 视觉层级：用户轨迹 > 城市名 > 陆地/水域 > 其他元素
 * 2. 颜色柔和，避免与底图冲突
 * 3. 交通方式通过颜色、粗细、线型区分
 */
export const TRANSPORT_MODE_STYLES: Record<TransportMode, PolylineStyleConfig> = {
  // 飞机：天空蓝，虚线，弧线
  [TransportMode.AIRPLANE]: {
    color: '#6B8FBF',
    weight: 2.5,
    opacity: 0.7,
    lineStyle: 'dashed',
    isCurved: true,
  },

  // 火车：石墨灰，实线，带浅灰蓝外边框（类似 Google Maps 铁路线）
  [TransportMode.TRAIN]: {
    color: '#6E7074',
    weight: 3.0, // 稍粗
    opacity: 0.7,
    lineStyle: 'solid',
    isCurved: false,
    // Google Maps 风格：浅灰蓝外边框 + 深色主线
    haloColor: '#FFFFFF', // 浅灰蓝，与主线形成冷暖对比
    haloWeight: 5.0,
    haloOpacity: 0.7,
  },

  // 汽车：鼠尾草绿，实线
  [TransportMode.CAR]: {
    color: '#7A8F85',
    weight: 2,
    opacity: 0.75,
    lineStyle: 'solid',
    isCurved: false,
  },
};

/**
 * 获取默认样式（当没有指定交通方式时）
 */
export const DEFAULT_POLYLINE_STYLE: PolylineStyleConfig = {
  color: '#E07A5F', // 橙色（当前默认色）
  weight: 2,
  opacity: 0.5,
  lineStyle: 'solid',
};

/**
 * 根据交通方式获取样式配置
 *
 * @param transportMode - 交通方式
 * @param tripDate - 旅行日期（可选，ISO 字符串格式）
 * @returns 样式配置
 */
export function getPolylineStyle(
  transportMode?: TransportMode,
  tripDate?: string
): PolylineStyleConfig {
  // 获取基础样式
  const baseStyle = !transportMode
    ? DEFAULT_POLYLINE_STYLE
    : TRANSPORT_MODE_STYLES[transportMode] || DEFAULT_POLYLINE_STYLE;

  // 无日期时返回基础样式（向后兼容）
  if (!tripDate) {
    return baseStyle;
  }

  // 应用时间衰减系数
  const timeMultiplier = getOpacityByTime(tripDate);

  return {
    ...baseStyle,
    opacity: baseStyle.opacity * timeMultiplier,
  };
}
