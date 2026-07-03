import AMapLoader from '@amap/amap-jsapi-loader';

let loadingPromise: Promise<any> | null = null;

declare global {
  interface Window {
    AMap?: any;
    _AMapSecurityConfig?: {
      securityJsCode: string;
    };
  }
}

export async function loadAmapMap() {
  if (window.AMap) return window.AMap;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    const key = import.meta.env.VITE_AMAP_KEY;
    const securityCode = import.meta.env.VITE_AMAP_SECURITY_CODE;

    if (!key) {
      return null;
    }

    if (securityCode) {
      window._AMapSecurityConfig = {
        securityJsCode: securityCode,
      };
    }

    const AMap = await AMapLoader.load({
      key,
      version: '2.0',
      plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.MarkerCluster'],
    });

    return AMap;
  })();

  return loadingPromise;
}