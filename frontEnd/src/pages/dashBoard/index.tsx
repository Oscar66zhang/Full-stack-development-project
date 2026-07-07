import { useStore } from '@/store';
import { formatNum, formatMoney, formatState } from '@/utils/format';
import { Descriptions, Card, Button } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { dashBoardApi } from '@/api';
import type { ReportData } from '@/types/dashBoardManage/dashBoard';
import { useCharts } from '@/hook/useCharts';

export default function DashBoard() {
  const userInfo = useStore(state => state.userInfo);
  const [report, setReport] = useState<ReportData>();
  const reportCards = [
    {
      title: '司机数量',
      value: `${formatNum(report?.driverCount)} 个`,
      className: 'bg-[#f4864f]',
    },
    {
      title: '总流水',
      value: `${formatMoney(report?.totalMoney)} 元`,
      className: 'bg-[#887edc]',
    },
    {
      title: '总订单',
      value: `${formatNum(report?.orderCount)} 单`,
      className: 'bg-[#4f95e5]',
    },
    {
      title: '开通城市',
      value: `${formatNum(report?.cityNum)} 座`,
      className: 'bg-[#6dc3d7]',
    },
  ];

  const [lineRef, lineChart] = useCharts();
  const [pieRef1, pieChart1] = useCharts();
  const [pieRef2, pieChart2] = useCharts();
  const [radarRef, radarChart] = useCharts();

  const renderLineChart = useCallback(async () => {
    if (!lineChart) return;
    const res = await dashBoardApi.getLineData();
    lineChart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['订单', '流水'] },
      grid: { left: 50, right: 50, bottom: 20 },
      xAxis: { data: res.data.label },
      yAxis: { type: 'value' },
      series: [
        { name: '订单', type: 'line', data: res.data.order },
        { name: '流水', type: 'line', data: res.data.money },
      ],
    });
  }, [lineChart]);

  const renderPieChart1 = useCallback(async () => {
    if (!pieChart1) return;
    const res = await dashBoardApi.getPieCityData();
    pieChart1.setOption({
      title: { text: '司机城市分布', left: 'center' },
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'left' },
      series: [
        { name: '城市分布', type: 'pie', radius: '50%', data: res.data },
      ],
    });
  }, [pieChart1]);

  const renderPieChart2 = useCallback(async () => {
    if (!pieChart2) return;
    const res = await dashBoardApi.getPieAgeData();
    pieChart2.setOption({
      title: { text: '司机年龄分布', left: 'center' },
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'left' },
      series: [
        {
          name: '年龄分布',
          type: 'pie',
          radius: '50%',
          data: res.data,
        },
      ],
    });
  }, [pieChart2]);

  const renderRadarChart = useCallback(async () => {
    if (!radarChart) return;
    const res = await dashBoardApi.getRadarData();
    radarChart.setOption({
      legend: { data: ['司机模型诊断'] },
      radar: { indicator: res.data.indicator },
      series: [{ name: '模型诊断', type: 'radar', data: res.data.data }],
    });
  }, [radarChart]);

  useEffect(() => {
    renderLineChart();
    renderPieChart1();
    renderPieChart2();
    renderRadarChart();
  }, [renderLineChart, renderPieChart1, renderPieChart2, renderRadarChart]);

  const handleRefresh = () => {
    renderPieChart1();
    renderPieChart2();
  };

  useEffect(() => {
    const getReportData = async () => {
      const res = await dashBoardApi.getReportData();
      setReport(res.data);
    };

    getReportData();
  }, []);

  const refreshButtonClass =
    '!h-10 !rounded-md !border-[#ff7900] !bg-[#ff7900] !px-5 !font-medium hover:!border-[#f06c00] hover:!bg-[#f06c00]';

  return (
    <div className="min-h-full bg-[#eef0f3] p-6">
      <div className="bg-white px-[25px] py-7">
        {/* 用户信息 */}
        <div className="flex items-center">
          <img
            src={userInfo.userImg}
            className="mr-[70px] h-20 w-20 shrink-0 rounded-full object-cover"
          />
          <Descriptions
            className="flex-1"
            title="欢迎新同学，每天都要开心！"
          >
            <Descriptions.Item label="用户ID">
              {userInfo.userId}
            </Descriptions.Item>
            <Descriptions.Item label="邮箱">
              {userInfo.userEmail}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              {formatState(userInfo.state)}
            </Descriptions.Item>
            <Descriptions.Item label="手机号">
              {userInfo.mobile}
            </Descriptions.Item>
            <Descriptions.Item label="岗位">{userInfo.job}</Descriptions.Item>
            <Descriptions.Item label="部门">
              {userInfo.deptName}
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* 统计卡片 */}
        <div className="mt-6 flex">
          {reportCards.map(item => (
            <div
              key={item.title}
              className={`mr-6 h-[125px] flex-1 rounded-[5px] p-3.5 text-base text-black last:mr-0 ${item.className}`}
            >
              <div className="font-semibold">{item.title}</div>
              <div className="mt-2 text-center text-[30px] leading-[64px]">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 折线图 */}
      <Card
        title="订单和流水走势图"
        className="mt-[50px]"
        extra={
          <Button
            type="primary"
            className={refreshButtonClass}
            onClick={renderLineChart}
          >
            刷新
          </Button>
        }
      >
        <div ref={lineRef} className="w-full h-[400px]" />
      </Card>

      {/* 饼图 */}
      <Card
        title="司机分布"
        className="mt-[50px]"
        extra={
          <Button
            type="primary"
            className={refreshButtonClass}
            onClick={handleRefresh}
          >
            刷新
          </Button>
        }
      >
        <div className="flex">
          <div ref={pieRef1} className="flex-1 h-[400px]" />
          <div ref={pieRef2} className="flex-1 h-[400px]" />
        </div>
      </Card>

      {/* 雷达图 */}
      <Card
        title="模型诊断"
        className="mt-[50px]"
        extra={
          <Button
            type="primary"
            className={refreshButtonClass}
            onClick={renderRadarChart}
          >
            刷新
          </Button>
        }
      >
        <div ref={radarRef} className="w-full h-[400px]" />
      </Card>
    </div>
  );
}
