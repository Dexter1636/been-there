import { TransportMode } from '@/types/map-styles';
import { Coordinate } from '@/types/trip';
import { calculateCurvePath, calculateTrainCurvePath } from '@/lib/curve-utils';

/**
 * 路径查询结果
 */
export interface RouteResult {
  path: [number, number][];
  isRealRoute: boolean; // 是否为真实路径（API 获取）
}

/**
 * 路径规划服务
 *
 * 职责：
 * 1. 封装高德驾车路径规划 API
 * 2. 提供统一的路径获取接口
 * 3. 处理错误和降级逻辑
 * 4. 缓存路径数据
 */
export class RouteService {
  private driving: any = null;
  private routeCache = new Map<string, [number, number][]>();

  /**
   * 初始化服务（必须在 AMap 加载后调用）
   */
  initialize(AMap: any) {
    try {
      this.driving = new AMap.Driving({
        policy: AMap.DrivingPolicy.LEAST_TIME,
      });
    } catch (error) {
      console.error('Failed to initialize Driving service:', error);
    }
  }

  /**
   * 获取路径（根据交通方式）
   */
  async getRoute(
    origin: Coordinate,
    destination: Coordinate,
    transportMode?: TransportMode
  ): Promise<RouteResult> {
    // 1. 汽车：使用驾车路径规划 API
    if (transportMode === TransportMode.CAR) {
      return this.getDrivingRoute(origin, destination);
    }

    // 2. 火车：使用平滑曲线
    if (transportMode === TransportMode.TRAIN) {
      return this.getTrainRoute(origin, destination);
    }

    // 3. 飞机：使用贝塞尔曲线
    return this.getAirplaneRoute(origin, destination);
  }

  /**
   * 获取驾车路径（异步 API 调用）
   */
  private async getDrivingRoute(
    origin: Coordinate,
    destination: Coordinate
  ): Promise<RouteResult> {
    const cacheKey = this.getCacheKey(origin, destination, TransportMode.CAR);

    // 检查缓存
    if (this.routeCache.has(cacheKey)) {
      return {
        path: this.routeCache.get(cacheKey)!,
        isRealRoute: true,
      };
    }

    // 如果 Driving 服务未初始化，降级到直线
    if (!this.driving) {
      console.warn('Driving service not initialized, fallback to straight line');
      return {
        path: [[origin.lng, origin.lat], [destination.lng, destination.lat]],
        isRealRoute: false,
      };
    }

    try {
      // 调用高德驾车路径规划 API
      const result = await new Promise<any>((resolve, reject) => {
        this.driving.search(
          [origin.lng, origin.lat],
          [destination.lng, destination.lat],
          (status: string, result: any) => {
            if (status === 'complete') {
              resolve(result);
            } else {
              reject(new Error(`Driving route failed: ${status}`));
            }
          }
        );
      });

      // 提取路径点
      if (!result.routes || result.routes.length === 0) {
        throw new Error('No routes found');
      }

      const path = result.routes[0].steps
        .flatMap((step: any) => step.path)
        .map((point: any) => [point.lng, point.lat] as [number, number]);

      // 缓存路径
      this.routeCache.set(cacheKey, path);

      return { path, isRealRoute: true };
    } catch (error) {
      console.error('Failed to fetch driving route:', error);
      // 降级：返回直线
      return {
        path: [[origin.lng, origin.lat], [destination.lng, destination.lat]],
        isRealRoute: false,
      };
    }
  }

  /**
   * 获取火车路径（平滑曲线）
   */
  private getTrainRoute(
    origin: Coordinate,
    destination: Coordinate
  ): Promise<RouteResult> {
    const path = calculateTrainCurvePath(
      [origin.lng, origin.lat],
      [destination.lng, destination.lat]
    );

    return Promise.resolve({ path, isRealRoute: false });
  }

  /**
   * 获取飞机路径（贝塞尔曲线）
   */
  private getAirplaneRoute(
    origin: Coordinate,
    destination: Coordinate
  ): Promise<RouteResult> {
    const path = calculateCurvePath(
      [origin.lng, origin.lat],
      [destination.lng, destination.lat]
    );

    return Promise.resolve({ path, isRealRoute: false });
  }

  /**
   * 生成缓存键
   */
  private getCacheKey(
    origin: Coordinate,
    destination: Coordinate,
    transportMode: TransportMode
  ): string {
    return `${origin.lng},${origin.lat}-${destination.lng},${destination.lat}-${transportMode}`;
  }

  /**
   * 清除缓存
   */
  clearCache() {
    this.routeCache.clear();
  }
}

// 单例实例
export const routeService = new RouteService();
