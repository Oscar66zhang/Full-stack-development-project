import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Modal, message } from 'antd';
import type { OrderItem } from '@/types/orderManage/orderList';
import { loadAmapMap } from '@/utils/loadAmapMap';

export type OrderRouteModalRef = {
  open: (record: OrderItem) => void;
};

const OrderRouteModal = forwardRef<OrderRouteModalRef>((_, ref) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [visible, setVisible] = useState(false);
  const [order, setOrder] = useState<OrderItem | null>(null);
  const [routeText, setRouteText] = useState('');

  useImperativeHandle(ref, () => ({
    open: record => {
      setOrder(record);
      setRouteText('');
      setVisible(true);
    },
  }));

  useEffect(() => {
    if (!visible || !order) return;

    setTimeout(() => {
      renderMap();
    }, 0);

    return () => {
      mapRef.current?.destroy();
      mapRef.current = null;
    };
  }, [visible, order]);

  const getPoints = () => {
    return (order?.route || [])
      .map(item => {
        const lng = Number(item.lng);
        const lat = Number(item.lat);

        if (Number.isNaN(lng) || Number.isNaN(lat)) {
          return null;
        }

        return [lng, lat] as [number, number];
      })
      .filter(Boolean) as [number, number][];
  };

  const renderMap = async () => {
    const points = getPoints();
    const AMap = await loadAmapMap();

    if (!AMap) {
      message.warning('请先配置 VITE_AMAP_KEY');
      return;
    }

    if (!mapContainerRef.current) return;

    mapRef.current?.destroy();

    const map = new AMap.Map(mapContainerRef.current, {
      zoom: 14,
      center: points[0] || [121.473667, 31.230525],
      viewMode: '2D',
    });

    mapRef.current = map;

    map.addControl(new AMap.Scale());
    map.addControl(new AMap.ToolBar());

    if (points.length >= 2) {
      drawRouteByPoints(AMap, map, points);
      return;
    }

    await drawRouteByAddress(AMap, map);
  };

  const drawRouteByPoints = (
    AMap: any,
    map: any,
    points: [number, number][]
  ) => {
    const startMarker = new AMap.Marker({
      position: points[0],
      title: '起点',
      content: createEndpointMarker('起', '#16a34a'),
      offset: new AMap.Pixel(-16, -16),
    });

    const endMarker = new AMap.Marker({
      position: points[points.length - 1],
      title: '终点',
      content: createEndpointMarker('终', '#dc2626'),
      offset: new AMap.Pixel(-16, -16),
    });

    const polyline = new AMap.Polyline({
      path: points,
      strokeColor: '#1677ff',
      strokeWeight: 8,
      strokeOpacity: 0.95,
      lineJoin: 'round',
      lineCap: 'round',
      showDir: true,
    });

    startMarker.setMap(map);
    endMarker.setMap(map);
    polyline.setMap(map);
    setRouteText(`已绘制 ${points.length} 个轨迹点`);

    map.setFitView([startMarker, endMarker, polyline], false, [
      60,
      60,
      60,
      60,
    ]);
  };

  const createEndpointMarker = (text: string, color: string) => `
    <div style="
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: ${color};
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 700;
      border: 2px solid #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,.25);
    ">
      ${text}
    </div>
  `;

  const parseDrivingPoints = (result: any): [number, number][] => {
    const steps = result?.routes?.[0]?.steps || [];

    return steps
      .flatMap((step: any) => step.path || [])
      .map((point: any) => {
        const lng = Number(point.lng);
        const lat = Number(point.lat);

        if (Number.isNaN(lng) || Number.isNaN(lat)) {
          return null;
        }

        return [lng, lat] as [number, number];
      })
      .filter(Boolean) as [number, number][];
  };

  const getLocationByAddress = (
    AMap: any,
    address: string,
    cityName?: string
  ) => {
    return new Promise<[number, number]>((resolve, reject) => {
      const geocoder = new AMap.Geocoder({
        city: cityName || '全国',
      });

      geocoder.getLocation(address, (status: string, result: any) => {
        const location = result?.geocodes?.[0]?.location;

        if (status === 'complete' && location) {
          resolve([location.lng, location.lat]);
          return;
        }

        reject(new Error(`${address} 地址解析失败`));
      });
    });
  };

  const drawRouteByAddress = async (AMap: any, map: any) => {
    const startAddress = order?.startAddress?.trim();
    const endAddress = order?.endAddress?.trim();

    if (!startAddress || !endAddress) {
      message.warning('当前订单暂无起点或终点，无法绘制轨迹');
      return;
    }

    try {
      const startPoint = await getLocationByAddress(
        AMap,
        startAddress,
        order?.cityName
      );
      const endPoint = await getLocationByAddress(
        AMap,
        endAddress,
        order?.cityName
      );

      const driving = new AMap.Driving({
        policy: AMap.DrivingPolicy.LEAST_TIME,
      });

      driving.search(startPoint, endPoint, (status: string, result: any) => {
        if (status === 'complete' && result?.routes?.length) {
          const drivingPoints = parseDrivingPoints(result);

          if (drivingPoints.length >= 2) {
            drawRouteByPoints(AMap, map, drivingPoints);
            return;
          }

          drawRouteByPoints(AMap, map, [startPoint, endPoint]);
          return;
        }

        console.error('高德驾车路线规划失败:', result);
        setRouteText('路线规划失败，请检查起点和终点是否准确');
        message.warning('路线规划失败，请检查起点和终点是否准确');
      });
    } catch (err) {
      console.error('绘制订单轨迹失败:', err);
      const errorMessage =
        err instanceof Error ? err.message : '绘制订单轨迹失败';

      setRouteText(errorMessage);
      message.warning(errorMessage);
    }
  };

  const handleCancel = () => {
    setVisible(false);
    mapRef.current?.destroy();
    mapRef.current = null;
  };

  return (
    <Modal
      title="订单轨迹"
      width={900}
      open={visible}
      footer={null}
      onCancel={handleCancel}
    >
      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: 520,
        }}
      />
      {routeText && (
        <div
          style={{
            marginTop: 8,
            fontSize: 13,
            color: '#666',
          }}
        >
          {routeText}
        </div>
      )}
    </Modal>
  );
});

export default OrderRouteModal;
