import axios from 'axios';

import config from '@/config/apiConfig';

const instanceV4 = axios.create({
  baseURL: `${config.v4Url}`,
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
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0',
  },
});

export default instanceV4;
