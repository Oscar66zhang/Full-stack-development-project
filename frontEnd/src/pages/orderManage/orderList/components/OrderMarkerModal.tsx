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
import { orderListApi } from '@/api/orderManage';

export type OrderMarkerModalRef = {
  open: (record: OrderItem) => void;
};

type MarkerPoint = {
  lng: string;
  lat: string;
};

const cityCenterMap: Record<string, [number, number]> = {
  北京: [116.397428, 39.90923],
  上海: [121.473667, 31.230525],
  广州: [113.264385, 23.129112],
  深圳: [114.057868, 22.543099],
};

type OrderMarkerModalProps = {
  update?: () => void;
};

const OrderMarkerModal = forwardRef<
  OrderMarkerModalRef,
  OrderMarkerModalProps
>(({ update }, ref) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const AMapRef = useRef<any>(null);
  const markerOverlaysRef = useRef<any[]>([]);
  const pointsRef = useRef<MarkerPoint[]>([]);

  const [visible, setVisible] = useState(false);
  const [order, setOrder] = useState<OrderItem | null>(null);
  const [points, setPoints] = useState<MarkerPoint[]>([]);
  const [markerText, setMarkerText] = useState('');

  useImperativeHandle(ref, () => ({
    open: record => {
      setOrder(record);
      setPoints([]);
      pointsRef.current = [];
      setMarkerText('正在加载地图...');
      setVisible(true);
    },
  }));

  useEffect(() => {
    if (!visible || !order) return;

    setTimeout(() => {
      renderMap();
    }, 0);

    return () => {
      destroyMap();
    };
  }, [visible, order]);

  const destroyMap = () => {
    markerOverlaysRef.current = [];
    mapRef.current?.destroy();
    mapRef.current = null;
  };

  const syncPoints = (nextPoints: MarkerPoint[]) => {
    pointsRef.current = nextPoints;
    setPoints(nextPoints);
    setMarkerText(`已打 ${nextPoints.length} 个点。点击地图新增点，右键点位删除。`);
  };

  const getInitialPoints = (detail: OrderItem): MarkerPoint[] => {
    return (detail.route || [])
      .map(item => {
        const lng = String(item.lng || '').trim();
        const lat = String(item.lat || '').trim();

        if (!lng || !lat || Number.isNaN(Number(lng)) || Number.isNaN(Number(lat))) {
          return null;
        }

        return { lng, lat };
      })
      .filter(Boolean) as MarkerPoint[];
  };

  const getMapCenter = (
    detail: OrderItem,
    initialPoints: MarkerPoint[]
  ): [number, number] => {
    if (initialPoints.length) {
      return [Number(initialPoints[0].lng), Number(initialPoints[0].lat)];
    }

    return cityCenterMap[detail.cityName] || [121.473667, 31.230525];
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

  const createMarkerContent = (index: number) => `
    <div style="
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #f5222d;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      border: 2px solid #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,.25);
    ">
      ${index + 1}
    </div>
  `;

  const drawMarkers = (AMap: any, map: any, nextPoints: MarkerPoint[]) => {
    markerOverlaysRef.current.forEach(marker => map.remove(marker));
    markerOverlaysRef.current = [];

    const overlays = nextPoints.map((point, index) => {
      const marker = new AMap.Marker({
        position: [Number(point.lng), Number(point.lat)],
        content: createMarkerContent(index),
        offset: new AMap.Pixel(-14, -14),
      });

      marker.on('rightclick', () => {
        const currentPoints = pointsRef.current.filter((_, i) => i !== index);
        drawMarkers(AMap, map, currentPoints);
        syncPoints(currentPoints);
      });

      marker.setMap(map);
      return marker;
    });

    markerOverlaysRef.current = overlays;

    if (overlays.length) {
      map.setFitView(overlays, false, [60, 60, 60, 60]);
    }
  };

  const addPoint = (AMap: any, map: any, lng: number, lat: number) => {
    const nextPoints = [
      ...pointsRef.current,
      {
        lng: String(lng.toFixed(6)),
        lat: String(lat.toFixed(6)),
      },
    ];

    drawMarkers(AMap, map, nextPoints);
    syncPoints(nextPoints);
  };

  const renderMap = async () => {
    const AMap = await loadAmapMap();

    if (!AMap) {
      setMarkerText('请先配置 VITE_AMAP_KEY');
      message.warning('请先配置 VITE_AMAP_KEY');
      return;
    }

    if (!mapContainerRef.current || !order) return;

    AMapRef.current = AMap;
    destroyMap();

    try {
      setMarkerText('正在初始化打点地图...');

      const initialPoints = getInitialPoints(order);
      const center = getMapCenter(order, initialPoints);

      const map = new AMap.Map(mapContainerRef.current, {
        zoom: 13,
        center,
        viewMode: '2D',
      });

      mapRef.current = map;

      map.addControl(new AMap.Scale());
      map.addControl(new AMap.ToolBar());

      map.on('click', (event: any) => {
        const lng = event?.lnglat?.getLng?.() ?? event?.lnglat?.lng;
        const lat = event?.lnglat?.getLat?.() ?? event?.lnglat?.lat;

        if (typeof lng === 'number' && typeof lat === 'number') {
          addPoint(AMap, map, lng, lat);
        }
      });

      drawMarkers(AMap, map, initialPoints);
      syncPoints(initialPoints);
      moveToStartAddress(AMap, map, order, initialPoints);
    } catch (err) {
      console.error('初始化打点地图失败:', err);
      setMarkerText('地图初始化失败，请刷新后重试');
      message.warning('地图初始化失败，请刷新后重试');
    }
  };

  const moveToStartAddress = async (
    AMap: any,
    map: any,
    detail: OrderItem,
    initialPoints: MarkerPoint[]
  ) => {
    if (initialPoints.length || !detail.startAddress?.trim() || !AMap.Geocoder) {
      return;
    }

    try {
      const startPoint = await getLocationByAddress(
        AMap,
        detail.startAddress.trim(),
        detail.cityName
      );

      map.setCenter(startPoint);
    } catch (err) {
      console.warn('起点地址解析失败，保持城市中心点:', err);
    }
  };

  const handleOk = async () => {
    if (!order) return;

    const res = await orderListApi.updateOrderRoute({
      _id: order._id,
      route: pointsRef.current,
    });

    message.success(res.message || '打点保存成功');
    update?.();
    handleCancel();
  };

  const handleCancel = () => {
    setVisible(false);
    setOrder(null);
    setPoints([]);
    pointsRef.current = [];
    setMarkerText('');
    destroyMap();
  };

  return (
    <Modal
      title="订单打点"
      width={1100}
      open={visible}
      okText="确定"
      cancelText="取消"
      onOk={handleOk}
      onCancel={handleCancel}
    >
      {markerText && (
        <div
          style={{
            marginBottom: 8,
            fontSize: 13,
            color: '#666',
          }}
        >
          {markerText}
        </div>
      )}
      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: 520,
        }}
      />
      <div
        style={{
          marginTop: 8,
          fontSize: 13,
          color: '#999',
        }}
      >
        当前打点数：{points.length}
      </div>
    </Modal>
  );
});

export default OrderMarkerModal;
