import request from '../utils/request';

// 设置属性列表
export const domainAttrService = (data) => request.post('/domain/attributeset/set', data);
// 设置属性映射矩阵
export const domainMapService = (data) => request.post('/domain/map/set', data);
