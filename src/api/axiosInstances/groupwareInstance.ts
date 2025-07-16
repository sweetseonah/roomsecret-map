import axios from 'axios';

import config from '@/config/apiConfig';

const instanceGroupware = axios.create({
  baseURL: `${config.apiGwUrl}`,
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

export default instanceGroupware;
