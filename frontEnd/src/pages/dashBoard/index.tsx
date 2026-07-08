import { useEffect, useRef, useState } from 'react';
import { Card, Col, Empty, Row, Statistic, Typography, message } from 'antd';
import * as echarts from 'echarts';
import type { EChartsOption, EChartsType } from 'echarts';
import { dashBoardApi } from '@/api/dashBoardManage';
import type {
  LineData,
  PieData,
  RadarData,
  ReportData,
} from '@/types/dashBoardManage/dashBoard';
import { formatMoney, formatNum } from '@/utils/format';

const { Title, Text } = Typography;

//Dashboard 统计卡片的默认数据
const defaultReportData: ReportData = {
  driverCount: 0,
  totalMoney: 0,
  orderCount: 0,
  cityNum: 0,
};

const chartHeight = 340;

// Dashboard 页面组件
const DashBoard = () => {
  // Dashboard 顶部统计卡片数据
  const [reportData, setReportData] = useState<ReportData>(defaultReportData);

  // 是否存在图表数据，用于控制暂无数据提示的显示
  const [hasChartData, setHasChartData] = useState(true);

  // 近 7 日订单趋势折线图的 DOM 容器
  const lineRef = useRef<HTMLDivElement>(null);

  // 城市订单分布饼图的 DOM 容器
  const cityPieRef = useRef<HTMLDivElement>(null);

  // 司机年龄分布饼图的 DOM 容器
  const agePieRef = useRef<HTMLDivElement>(null);

  // 司机能力模型雷达图的 DOM 容器
  const radarRef = useRef<HTMLDivElement>(null);

  // 保存所有 ECharts 图表实例，方便统一 resize 和销毁
  const chartListRef = useRef<EChartsType[]>([]);

  // 页面初始化时获取 Dashboard 数据，并监听窗口变化重置图表大小
  useEffect(() => {
    const handleResize = () => {
      chartListRef.current.forEach(chart => chart.resize());
    };

    fetchDashBoardData();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartListRef.current.forEach(chart => chart.dispose());
      chartListRef.current = [];
    };
  }, []);

  // 创建 ECharts 图表实例，并保存到 chartListRef 中
  const createChart = (
    dom: HTMLDivElement | null,
    option: EChartsOption
  ): EChartsType | null => {
    if (!dom) return null;

    const chart = echarts.init(dom);
    chart.setOption(option);
    chartListRef.current.push(chart);

    return chart;
  };

  // 获取 Dashboard 页面所需的统计数据和图表数据
  const fetchDashBoardData = async () => {
    try {
      const [reportRes, lineRes, cityRes, ageRes, radarRes] = await Promise.all(
        [
          dashBoardApi.getReportData(),
          dashBoardApi.getLineData(),
          dashBoardApi.getPieCityData(),
          dashBoardApi.getPieAgeData(),
          dashBoardApi.getRadarData(),
        ]
      );

      const lineData = lineRes.data;
      const cityData = cityRes.data;
      const ageData = ageRes.data;
      const radarData = radarRes.data;

      setReportData(reportRes.data);

      setHasChartData(
        lineData.order.some(Boolean) ||
          lineData.money.some(Boolean) ||
          cityData.some(item => item.value > 0) ||
          ageData.some(item => item.value > 0)
      );

      renderCharts(lineData, cityData, ageData, radarData);
    } catch (error) {
      console.error('获取Dashboard数据失败:', error);
      message.error('获取Dashboard数据失败');
    }
  };

  // 渲染所有图表，重新渲染前会先销毁旧的图表实例
  const renderCharts = (
    lineData: LineData,
    cityData: PieData[],
    ageData: PieData[],
    radarData: RadarData
  ) => {
    chartListRef.current.forEach(chart => chart.dispose());
    chartListRef.current = [];

    createChart(lineRef.current, getLineOption(lineData));
    createChart(cityPieRef.current, getPieOption('城市订单分布', cityData));
    createChart(agePieRef.current, getPieOption('司机年龄分布', ageData));
    createChart(radarRef.current, getRadarOption(radarData));
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Title level={4} style={{ marginBottom: 4 }}>
          运营数据总览
        </Title>
        <Text type="secondary">实时查看平台订单、流水、司机和城市运营情况</Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="司机总数"
              value={formatNum(reportData.driverCount)}
              suffix="人"
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总流水"
              value={formatMoney(reportData.totalMoney)}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="订单总数"
              value={formatNum(reportData.orderCount)}
              suffix="单"
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="覆盖城市"
              value={formatNum(reportData.cityNum)}
              suffix="个"
            />
          </Card>
        </Col>
      </Row>

      <Card title="近7日订单趋势">
        <div ref={lineRef} style={{ height: 380 }} />
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title="城市订单分布">
            <div ref={cityPieRef} style={{ height: chartHeight }} />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="司机年龄分布">
            <div ref={agePieRef} style={{ height: chartHeight }} />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="司机能力模型">
            <div ref={radarRef} style={{ height: chartHeight }} />
          </Card>
        </Col>
      </Row>

      {!hasChartData && (
        <Card>
          <Empty description="暂无可视化数据" />
        </Card>
      )}
    </div>
  );
};

// 生成近 7 日订单趋势折线图配置
const getLineOption = (data: LineData): EChartsOption => ({
  color: ['#1677ff', '#52c41a'],
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    top: 0,
    data: ['订单量', '流水金额'],
  },
  grid: {
    top: 48,
    left: 40,
    right: 48,
    bottom: 36,
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: data.label,
  },
  yAxis: [
    {
      type: 'value',
      name: '订单量',
    },
    {
      type: 'value',
      name: '金额',
      axisLabel: {
        formatter: '{value}',
      },
    },
  ],
  series: [
    {
      name: '订单量',
      type: 'line',
      smooth: true,
      areaStyle: {
        opacity: 0.12,
      },
      data: data.order,
    },
    {
      name: '流水金额',
      type: 'line',
      smooth: true,
      yAxisIndex: 1,
      areaStyle: {
        opacity: 0.1,
      },
      data: data.money,
    },
  ],
});

// 生成饼图配置，可用于城市订单分布和司机年龄分布
const getPieOption = (title: string, data: PieData[]): EChartsOption => ({
  color: ['#1677ff', '#52c41a', '#faad14', '#ff4d4f', '#13c2c2', '#722ed1'],
  tooltip: {
    trigger: 'item',
  },
  legend: {
    bottom: 0,
    type: 'scroll',
  },
  series: [
    {
      name: title,
      type: 'pie',
      radius: ['42%', '66%'],
      center: ['50%', '43%'],
      avoidLabelOverlap: true,
      label: {
        formatter: '{b}\n{d}%',
      },
      data,
    },
  ],
});

// 生成司机能力模型雷达图配置
const getRadarOption = (data: RadarData): EChartsOption => ({
  color: ['#1677ff'],
  tooltip: {},
  radar: {
    indicator: data.indicator,
    radius: '64%',
  },
  series: [
    {
      name: data.data.name,
      type: 'radar',
      areaStyle: {
        opacity: 0.16,
      },
      data: [
        {
          value: data.data.value,
          name: data.data.name,
        },
      ],
    },
  ],
});

export default DashBoard;
