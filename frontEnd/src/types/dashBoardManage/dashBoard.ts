export interface ReportData {
  driverCount: number;
  totalMoney: number;
  orderCount: number;
  cityNum: number;
}
export interface LineData {
  label: string[];
  order: number[];
  money: number[];
}
export interface PieData {
  value: number;
  name: string;
}
export interface RadarData {
  indicator: Array<{ name: string; max: number }>;
  data: {
    name: string;
    value: number[];
  };
}
