import axios from 'axios';

import config from '@/config/apiConfig';

const apiInstance = axios.create({
  baseURL: `${config.apiV1Url}`,
  timeout: 6 * 1000 * 10 * 10 * 2, // 20분
  headers: {
    'x-token':
      typeof window !== 'undefined'
        ? localStorage.getItem(config.keyToken)
        : '',
    'g-token':
      typeof window !== 'undefined'
        ? localStorage.getItem(config.gwKeyToken)
        : '',
  },
});

// apiInstance.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   (error: AxiosError<ErrorResponse>) => {
//     if (error.response) {
//       const { status, data } = error.response;
//       throw createApiError(
//         data.message || '서버 에러가 발생했습니다.',
//         status,
//         data.details || '',
//       );
//     } else if (error.request) {
//       throw createApiError('서버와 연결할 수 없습니다.', 0, error.message);
//     } else {
//       throw createApiError(
//         '알 수 없는 에러가 발생했습니다.',
//         500,
//         error.message,
//       );
//     }
//   },
// );

export default apiInstance;
