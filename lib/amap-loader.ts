import AMapLoader from '@amap/amap-jsapi-loader';

/**
 * 高德地图配置
 */
export interface AMapLoadConfig {
  key: string;
  version?: string;
  plugins?: string[];
}

/**
 * 动态加载高德地图 JavaScript API
 * 必须在客户端上下文中调用
 */
export async function loadAMap(config: AMapLoadConfig): Promise<any> {
  return AMapLoader.load({
    key: config.key,
    version: config.version || '2.0',
    plugins: config.plugins || [],
  });
}
