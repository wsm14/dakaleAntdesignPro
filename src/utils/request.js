/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { notification } from 'antd';
import { extend } from 'umi-request';
import { encrypt } from './utils';

notification.config({
  duration: 2,
  placement: 'topRight',
});

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
  5005: '用户身份失效请重新登录',
};

/**
 * 异常处理程序
 */
const errorHandler = (error) => {
  const { response } = error;
  if (response && response.status !== 200) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    notification.error({
      message: `请求错误 ${status}`,
      description: errorText,
    });
    return false;
  } else if (!response) {
    notification.error({
      description: '无法连接服务器',
      message: '网络异常',
    });
    return false;
  }
  return response;
};
/**
 * 配置request请求时的默认参数
 */

const request = extend({
  errorHandler,
  // 默认错误处理
  credentials: 'same-origin', // 默认请求是否带上cookie 'include','same-origin'
});

// request拦截器, 改变url 或 options.
request.interceptors.request.use(async (url, options) => {
  let { data = {}, params = {}, method = 'get' } = options;
  switch (method) {
    case 'get':
      params = encrypt(params);
      break;
    default:
      data = encrypt(data);
      break;
  }

  options = { ...options, data: JSON.stringify(data), params };

  const headers = {
    'Content-Type': 'application/json;charset=utf-8',
    Accept: 'application/json',
    appType: 'admin',
  };

  return {
    url: `${url}`,
    options: { ...options, headers },
  };
});

// response拦截器, 处理response
request.interceptors.response.use(async (response) => {
  const data = await response.clone().json();
  const { success, resultCode = '', resultDesc = '' } = data;
  const errorCode = ['5005', '1014'];
  if (errorCode.includes(resultCode)) {
    // Modal.warning({
    //   title: resultDesc,
    //   okText: '去登录',
    //   onOk: () => {
    //     Modal.destroyAll();
    //     history.push('/user/login');
    //   },
    // });
    return false;
  }
  if (!success && response.status == 200) {
    notification.info({
      message: '提示',
      description: resultDesc || errorHandler(response),
    });
    return false;
  }
  return response;
});

export default request;
