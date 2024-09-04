import request from '../utils/request';

// 异常分析
export const detectResultService = () => request.get('/detect/result');
export const detectResultListService = () => request.get('/detect/resultlist');
export const detectAllService = () => request.get('/detect/all');

export const detectIDService = (data) => request.post('/detect/id', data)

// 溯源
export const traceSourceService = (data) => request.post('/trace/source', data);
