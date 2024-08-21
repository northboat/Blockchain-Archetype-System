import axios from 'axios';
import { contextType } from 'react-copy-to-clipboard';

//创建axios实例
const instance = axios.create({
  baseURL: '/api', //根路径，配置在 craco.config.js 中
  // baseURL: 'http://139.155.96.38:8080', //根路径
  timeout: 10000, //请求过期时间
  contextType: "application/json"
});

//请求拦截器
instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

//响应拦截器
instance.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default instance;
