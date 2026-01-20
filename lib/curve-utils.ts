/**
 * 计算两点之间的贝塞尔曲线路径（用于飞机轨迹）
 *
 * @param start - 起点坐标 [经度, 纬度]
 * @param end - 终点坐标 [经度, 纬度]
 * @param curvature - 曲线弯曲程度（0-1），默认 0.2
 * @returns 贝塞尔曲线路径点数组
 */
export function calculateCurvePath(
  start: [number, number],
  end: [number, number],
  curvature: number = 0.2
): [number, number][] {
  const [lng1, lat1] = start;
  const [lng2, lat2] = end;

  // 计算中点
  const midLng = (lng1 + lng2) / 2;
  const midLat = (lat1 + lat2) / 2;

  // 计算控制点（向东北方向偏移，形成弧线）
  const distance = Math.sqrt(Math.pow(lng2 - lng1, 2) + Math.pow(lat2 - lat1, 2));
  const controlLng = midLng + (lat2 - lat1) * curvature;
  const controlLat = midLat + (lng1 - lng2) * curvature + distance * curvature;

  // 生成贝塞尔曲线路径点
  const points: [number, number][] = [];
  const segments = 50; // 曲线分段数

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    // 二次贝塞尔曲线公式
    const lng =
      Math.pow(1 - t, 2) * lng1 +
      2 * (1 - t) * t * controlLng +
      Math.pow(t, 2) * lng2;
    const lat =
      Math.pow(1 - t, 2) * lat1 +
      2 * (1 - t) * t * controlLat +
      Math.pow(t, 2) * lat2;
    points.push([lng, lat]);
  }

  return points;
}

/**
 * 计算火车平滑曲线路径
 *
 * 特点：比飞机曲线更平缓，体现城市间方向的一致性
 *
 * @param start - 起点坐标 [经度, 纬度]
 * @param end - 终点坐标 [经度, 纬度]
 * @returns 平滑曲线路径点数组
 */
export function calculateTrainCurvePath(
  start: [number, number],
  end: [number, number]
): [number, number][] {
  // 火车曲线更平缓，curvature 为 0.1（飞机是 0.2）
  return calculateCurvePath(start, end, 0.1);
}
