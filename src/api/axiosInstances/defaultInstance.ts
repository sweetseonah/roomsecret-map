import axios from 'axios';

import config from '@/config/apiConfig';

const instance = axios.create({
  baseURL: `${config.url}`,
  timeout: 6 * 1000 * 10 * 10 * 2, // 20분
  headers: {
    'x-token':
      typeof window !== 'undefined'
        ? localStorage.getItem(config.keyToken)
        : '',
    gwtoken:
      typeof window !== 'undefined'
        ? localStorage.getItem(config.gwKeyToken)
        : '',
  },
});

export default instance;
