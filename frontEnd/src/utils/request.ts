import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import { message } from 'antd';
import { showLoading, hideLoading } from './loading';

interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  message?: string;
}

let loadingCount = 0;

function startLoading() {
  if (loadingCount === 0) {
    showLoading();
  }
  loadingCount += 1;
}

function endLoading() {
  loadingCount = Math.max(loadingCount - 1, 0);

  if (loadingCount === 0) {
    hideLoading();
  }
}

const request = axios.create({
  baseURL: '/api',
  timeout: 50000,
});

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    startLoading();

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    endLoading();
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    endLoading();
    return response.data;
  },
  (error: AxiosError<{ message?: string }>) => {
    endLoading();

    if (!error.response) {
      message.error('网络连接失败');
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    const errorMessage = data?.message || error.message || '请求失败';

    switch (status) {
      case 401:
        message.error('未授权，请重新登录');
        localStorage.removeItem('token');
        window.location.href = '/login';
        break;
      case 403:
        message.error('拒绝访问');
        break;
      case 500:
        message.error('服务器错误');
        break;
      default:
        message.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export const get = <T = unknown>(
  url: string,
  params?: object,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  return request.get(url, { params, ...config });
};

export const post = <T = unknown>(
  url: string,
  data?: object,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  return request.post(url, data, config);
};

export const put = <T = unknown>(
  url: string,
  data?: object,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  return request.put(url, data, config);
};

export const del = <T = unknown>(
  url: string,
  params?: object,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  return request.delete(url, { params, ...config });
};

export default request;