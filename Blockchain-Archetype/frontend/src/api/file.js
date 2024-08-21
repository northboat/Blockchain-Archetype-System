import request from '../utils/request';

// 文件上传
export const fileUploadService = (data) => request.post('/file/upload', data);
// 订阅外包服务
export const fileOutSourceService = (data) => request.post('/file/outsource/set', data);
// 域内文件下载
export const fileInDomainDlService = (data) => request.post('/file/indomain/download', data);
// 跨域访问服务（跨域文件下载）
export const fileCrossDomainDlService = (data) => request.post('/file/crossdomain/download', data);
// 密钥协商
export const getKeyService = () => request.get('/getKey');
