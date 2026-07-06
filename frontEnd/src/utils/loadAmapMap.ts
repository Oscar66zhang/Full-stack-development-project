import AMapLoader from '@amap/amap-jsapi-loader';

let loadingPromise: Promise<any> | null = null;

const amapPlugins = [
  'AMap.Scale',
  'AMap.ToolBar',
  'AMap.MarkerCluster',
  'AMap.Geocoder',
  'AMap.Driving',
];

declare global {
  interface Window {
    AMap?: any;
    _AMapSecurityConfig?: {
      securityJsCode: string;
    };
  }
}

export async function loadAmapMap() {
  if (window.AMap) {
    await loadPlugins(window.AMap);
    return window.AMap;
  }
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
      plugins: amapPlugins,
    });

    await loadPlugins(AMap);

    return AMap;
  })();

  return loadingPromise;
}

function loadPlugins(AMap: any) {
  return new Promise<void>((resolve) => {
    if (!AMap?.plugin) {
      resolve();
      return;
    }

    const timer = window.setTimeout(() => {
      resolve();
    }, 3000);

    AMap.plugin(amapPlugins, () => {
      window.clearTimeout(timer);
      resolve();
    });
  });
}
