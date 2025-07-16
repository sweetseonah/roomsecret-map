export const getDevicePlatform = async (): Promise<string> => {
  if (navigator.userAgent) {
    const platform = navigator.userAgent;
    return platform;
  } else {
    return 'unknown';
  }

  // // Fallback to userAgent
  // const userAgent = navigator.userAgent.toLowerCase();
  // if (/android/.test(userAgent)) return 'Android';
  // if (/iphone|ipad|ipod/.test(userAgent)) return 'iOS';
  // if (/win/.test(userAgent)) return 'Windows';
  // if (/mac/.test(userAgent)) return 'macOS';
  // if (/linux/.test(userAgent)) return 'Linux';
  // return 'unknown';
};

export function isMobileUserAgent(userAgent: string): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}
