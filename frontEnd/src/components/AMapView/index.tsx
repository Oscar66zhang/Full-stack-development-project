import AMapLoader from '@amap/amap-jsapi-loader';
import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    _AMapSecurityConfig?: {
      securityJsCode: string;
    };
  }
}

type AMapViewProps = {
  longitude?: number;
  latitude?: number;
  zoom?: number;
  height?: string;
  markers?: MapMarker[];
  cluster?: boolean;
};

export type MapMarker = {
  longitude: number;
  latitude: number;
  title?: string;
};

export default function AMapView({
  longitude = 116.397428,
  latitude = 39.90923,
  zoom = 14,
  height = '400px',
  markers,
  cluster = false,
}: AMapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let map: any = null;

    setErrorMessage('');

    const securityCode = import.meta.env.VITE_AMAP_SECURITY_CODE;
    const amapKey = import.meta.env.VITE_AMAP_KEY;

    if (!amapKey) {
      setErrorMessage('缺少 VITE_AMAP_KEY，请先在 .env.development 中配置高德地图 Key');
      return;
    }

    if (securityCode) {
      window._AMapSecurityConfig = {
        securityJsCode: securityCode,
      };
    }

    AMapLoader.load({
      key: amapKey,
      version: '2.0',
      plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.MarkerCluster'],
    })
      .then(AMap => {
        if (!mapRef.current) return;

        map = new AMap.Map(mapRef.current, {
          zoom,
          center: [longitude, latitude],
          viewMode: '2D',
        });

        map.addControl(new AMap.Scale());
        map.addControl(new AMap.ToolBar());

        const mapMarkers = markers?.length
          ? markers
          : [{ longitude, latitude, title: '当前位置' }];

        if (cluster && mapMarkers.length > 1 && AMap.MarkerCluster) {
          const clusterData = mapMarkers.map(item => ({
            lnglat: [item.longitude, item.latitude],
            name: item.title,
          }));

          new AMap.MarkerCluster(map, clusterData, {
            gridSize: 80,
          });
        } else {
          mapMarkers.forEach(item => {
            new AMap.Marker({
              position: [item.longitude, item.latitude],
              title: item.title,
              map,
            });
          });
        }
      })
      .catch(error => {
        console.error('高德地图加载失败:', error);
        setErrorMessage('高德地图加载失败，请检查 VITE_AMAP_KEY、SecurityCode 和高德控制台域名白名单');
      });

    return () => {
      map?.destroy();
    };
  }, [longitude, latitude, zoom, markers, cluster]);

  return (
    <div className="relative w-full rounded border border-gray-200" style={{ height }}>
      <div ref={mapRef} className="h-full w-full" />

      {errorMessage && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 px-4 text-center text-sm text-red-500">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
