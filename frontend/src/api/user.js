import request from '../utils/request';

// 登录接口，只有返回值的get请求,如请求验证码接口
export const userLoginService = (data) => request.post('/user/register', data);
