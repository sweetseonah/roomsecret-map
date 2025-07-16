const isProduction = process.env.NODE_ENV === 'production';
const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

const real_url = isProduction ? process.env.NEXT_PUBLIC_REAL_URL : '';
const test_real_url = process.env.NEXT_PUBLIC_TEST_REAL_URL;
const test_url = process.env.NEXT_PUBLIC_TEST_URL;
const v4_test_url = process.env.NEXT_PUBLIC_V4_TEST_URL;
const gw_test_url = process.env.NEXT_PUBLIC_GW_TEST_URL;
const gw_real_url = process.env.NEXT_PUBLIC_GW_REAL_URL;
const gw_api_url = process.env.NEXT_PUBLIC_REAL_GW_API_URL;
const v1_api_url = process.env.NEXT_PUBLIC_REAL_API_V1_URL;
const gw_api_test_url = process.env.NEXT_PUBLIC_GW_TEST_API_URL;

let base = isProduction ? v1_api_url : v1_api_url;
let v4_base = isProduction ? real_url : v4_test_url;
let gw_base = isProduction ? gw_real_url : gw_test_url;
let api_gw_url = isProduction ? gw_api_url : gw_api_test_url;
let api_v1_url = isProduction ? v1_api_url : gw_test_url;

if (hostname === 'localhost') {
  base = test_real_url;
  gw_base = gw_test_url;
  v4_base = v4_test_url;
  api_gw_url = gw_api_test_url;
  api_v1_url = test_real_url;
} else if (hostname === '127.0.0.1') {
  // base = 'http://127.0.0.1:8081';
  base = v1_api_url;
  gw_base = gw_test_url;
  v4_base = v4_test_url;
  api_gw_url = gw_api_test_url;
  api_v1_url = test_real_url;
} else if (hostname === '221.151.187.148') {
  base = test_url;
  gw_base = gw_test_url;
  v4_base = v4_test_url;
  api_gw_url = gw_api_test_url;
  api_v1_url = test_url;
} else if (hostname === '54.180.76.88') {
  base = 'http://54.180.76.88';
  gw_base = gw_test_url;
  v4_base = v4_test_url;
} else if (hostname === '221.151.187.104') {
  base = 'http://221.151.187.104:9100';
  gw_base = gw_test_url;
  v4_base = v4_test_url;
} else if (hostname === '192.168.0.239') {
  base = test_real_url;
  gw_base = gw_test_url;
  v4_base = v4_test_url;
} else if (hostname === '192.168.0.124') {
  base = 'http://192.168.0.124:8081';
  v4_base = v4_test_url;
}

const config = {
  url: base,
  gwUrl: gw_base,
  v4Url: v4_base,
  apiGwUrl: api_gw_url,
  apiV1Url: api_v1_url,
  loginUrl: 'https://api.biznavi.co.kr/api/v1/member/m_access',
  testerIdx: '7IQDL4OVK90XKYDB',
  emailReg:
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
  // eslint-disable-next-line no-useless-escape
  idReg: /^[^\uAC00-\uD7A3!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?~`-]+$/,
  imgType: /^jpg$|^jpeg$|^gif$|^png$|^JPG$|^JPEG$|^PNG$|^GIF$/,
  imgTypeCheck: /(.*?)\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/,
  pdfTypeCheck: /(.*?)\.(pdf|PDF)$/,
  checkReg: /^(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*+-]).{8,16}$/,
  regxMsg: '8~16자 영문, 숫자, 특수문자를 하나 이상 포함해주세요.',
  introSessionKey: 'introViewIp',
  keyToken: process.env.NEXT_PUBLIC_KEY_TOKEN || '',
  gwKeyToken: process.env.NEXT_PUBLIC_GW_KEY_TOKEN || '',
  findbizFreeToken: process.env.NEXT_PUBLIC_FIND_BIZ_FREE_TOKEN,
};

export default config;
