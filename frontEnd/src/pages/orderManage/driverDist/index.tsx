import { Select } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { message } from '@/utils/AntdGlobal';
import { loadAmapMap } from '@/utils/loadAmapMap';

type CityId = 10001 | 20001 | 30001 | 40001 | 50001;

type DriverPoint = {
  lng: number;
  lat: number;
  title?: string;
};

const cityMap: Record<CityId, { name: string; center: [number, number] }> = {
  10001: { name: '长沙', center: [112.938814, 28.228209] },
  20001: { name: '武汉', center: [114.305392, 30.593098] },
  30001: { name: '杭州', center: [120.15507, 30.274084] },
  40001: { name: '惠州', center: [114.416196, 23.111847] },
  50001: { name: '昆明', center: [102.832891, 24.880095] },
};

const cityOptions = [
  { value: 10001, label: '长沙' },
  { value: 20001, label: '武汉' },
  { value: 30001, label: '杭州' },
  { value: 40001, label: '惠州' },
  { value: 50001, label: '昆明' },
] satisfies Array<{ value: CityId; label: string }>;

function createMockMarkers(cityId: CityId): DriverPoint[] {
  const city = cityMap[cityId];
  const [lng, lat] = city.center;

  return Array.from({ length: 120 }, (_, index) => {
    const lngOffset = (Math.random() - 0.5) * 0.28;
    const latOffset = (Math.random() - 0.5) * 0.2;

    return {
      lng: Number((lng + lngOffset).toFixed(6)),
      lat: Number((lat + latOffset).toFixed(6)),
      title: `${city.name}司机${index + 1}`,
    };
  });
}

export default function DriverDist() {
  const [cityId, setCityId] = useState<CityId>(10001);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    getCityData();

    return () => {
      mapRef.current?.destroy();
      mapRef.current = null;
    };
  }, [cityId]);

  const getCityData = async () => {
    const AMap = await loadAmapMap();

    if (!AMap) {
      message.warning('请先在 .env.development 配置 VITE_AMAP_KEY');
      return;
    }

    const data = createMockMarkers(cityId);

    setTimeout(() => {
      renderMap(AMap, data);
    });
  };

  const renderMap = (AMap: any, data: DriverPoint[]) => {
    mapRef.current?.destroy();

    const city = cityMap[cityId];

    const map = new AMap.Map('clusterMap', {
      zoom: 12,
      center: city.center,
      viewMode: '2D',
    });

    mapRef.current = map;

    map.addControl(new AMap.Scale());
    map.addControl(new AMap.ToolBar());

    const clusterData = data.map(item => ({
      lnglat: [item.lng, item.lat],
      name: item.title,
    }));

    new AMap.MarkerCluster(map, clusterData, {
      gridSize: 60,
    });
  };

  return (
    <div className="rounded bg-white p-3">
      <Select
        style={{
          width: 112,
          margin: 24,
        }}
        value={cityId}
        onChange={setCityId}
        options={cityOptions}
      />

      <div className="w-full flex justify-center items-center">
        <div
          id="clusterMap"
          className="w-[95%]"
           style={{ height: 'calc(100vh - 240px)' }}
        />
      </div>
    </div>
  );
}
