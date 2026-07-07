// 格式化时间
export const formatDate = (
  value?: string | number | Date,
  defaultValue = '-'
) => {
  if (!value) return defaultValue;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return defaultValue;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

// 格式化金额
export const formatMoney = (
  value?: number | string,
  prefix = '￥',
  defaultValue = '-'
) => {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }

  const num = Number(value);

  if (Number.isNaN(num)) {
    return defaultValue;
  }

  return `${prefix}${num.toFixed(2)}`;
};

// 格式化手机号：138****5678
export const formatMobile = (value?: string | number, defaultValue = '-') => {
  if (!value) return defaultValue;

  const mobile = String(value);

  if (!/^1[1-9]\d{9}$/.test(mobile)) {
    return mobile;
  }

  return mobile.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2');
};

// 如果你已经写成 formateMobile，也可以暂时保留这个别名
export const formateMobile = formatMobile;

// 格式化数字（千分位）
export const formatNum = (value?: number, defaultValue = '0') => {
  if (value === undefined || value === null) return defaultValue;
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// 格式化状态
export const formatState = (state?: number, defaultValue = '-') => {
  const map: Record<number, string> = {
    0: '禁用',
    1: '正常',
    2: '待审核',
  };
  return state !== undefined ? map[state] ?? defaultValue : defaultValue;
};