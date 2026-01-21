/**
 * 计算基于时间的透明度衰减系数
 *
 * 时间规则（基于"当前时间"的平滑衰减）：
 * - ≤ 2 年：1.0（完全可见）
 * - 2–5 年：1.0 → 0.7（线性过渡）
 * - 5–10 年：0.7 → 0.45（线性过渡）
 * - > 10 年：0.45 → 0.25（线性过渡，最低 0.25）
 *
 * @param startTime - 旅行时间（ISO 字符串或时间戳毫秒）
 * @returns 透明度衰减系数 [0.25, 1.0]
 */
export function getOpacityByTime(startTime: string | number): number {
  // 转换为时间戳
  const timestamp = typeof startTime === 'string'
    ? new Date(startTime).getTime()
    : startTime;

  // 验证日期
  if (isNaN(timestamp)) {
    console.warn('[time-utils] Invalid date, using full opacity');
    return 1.0;
  }

  // 计算距今年数
  const now = Date.now();
  const yearsSince = (now - timestamp) / (1000 * 60 * 60 * 24 * 365.25);

  // 平滑线性插值
  if (yearsSince <= 2) return 1.0;
  if (yearsSince <= 5) return 1.0 - ((yearsSince - 2) / 3) * 0.3;      // 1.0 → 0.7
  if (yearsSince <= 10) return 0.7 - ((yearsSince - 5) / 5) * 0.25;    // 0.7 → 0.45
  return Math.max(0.45 - Math.min((yearsSince - 10) / 5, 1) * 0.2, 0.25); // 0.45 → 0.25
}
