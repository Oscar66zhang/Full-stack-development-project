import { get } from '@/utils/request';
import type { ReportData, RadarData } from '@/types/dashBoardManage/dashBoard';

export const dashBoardApi = {
  getReportData: () => get<ReportData>('/dashboard/getReportData'),
  getLineData: () =>
    get<{ label: string[]; order: number[]; money: number[] }>(
      '/dashboard/getLineData'
    ),
  getPieCityData: () =>
    get<Array<{ name: string; value: number }>>('/dashboard/getPieCityData'),
  getPieAgeData: () =>
    get<Array<{ name: string; value: number }>>('/dashboard/getPieAgeData'),
  getRadarData: () => get<RadarData>('/dashboard/getRadarData'),
};


