import axios from "axios";
import { message } from 'antd';
import { showLoading, hideLoading } from "./loading";


const request = axios.create({
  baseURL: '/api',
  timeout: 50000
})


request.interceptors.request.use((config) => {
  showLoading();
  return config;
}, (error) => {
  hideLoading();
  return Promise.reject(error)
})


request.interceptors.response.use(
  (response) => {
    hideLoading();
    return response.data;
  },
  (error) => {
    hideLoading();
    if (error.response) {
      const { status } = error.response;
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
          message.error(error.message || '请求失败');
      }
    } else {
      message.error('网络连接失败');
    }
    return Promise.reject(error);
  }
);


// 封装常用方法
export const get = <T>(url: string, params?: object, config?: object): Promise<T> => {
  return request.get(url, { params, ...config });
};

export const post = <T>(url: string, data?: object, config?: object): Promise<T> => {
  return request.post(url, data, config);
};

export const put = <T>(url: string, data?: object, config?: object): Promise<T> => {
  return request.put(url, data, config);
};

export const del = <T>(url: string, params?: object, config?: object): Promise<T> => {
  return request.delete(url, { params, ...config });
};

export default request