import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Separator } from './ui/separator';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
      onClose();
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // Simulate social login
    setTimeout(() => {
      onLoginSuccess();
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold">
            {isLogin ? '로그인' : '회원가입'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isLogin 
              ? 'NODA 계정으로 로그인하여 호텔 예약 서비스를 이용하세요. 소셜 로그인 또는 이메일로 로그인할 수 있습니다.'
              : 'NODA 새 계정을 만들어 호텔 예약 서비스를 시작하세요. 소셜 가입 또는 이메일로 가입할 수 있습니다.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          {/* Welcome message */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-600 to-primary-500 rounded-full mb-4">
              <span className="text-2xl font-bold text-white">N</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              NODA에 오신 것을 환영합니다
            </h2>
            <p className="text-sm text-secondary-600">
              {isLogin 
                ? '계속하려면 로그인해 주세요' 
                : '새 계정을 만들어 NODA를 시작하세요'
              }
            </p>
          </div>

          {/* Social login buttons */}
          <div className="space-y-3 mb-6">
            <Button
              variant="outline"
              className="w-full h-12 flex items-center justify-center space-x-3 hover:bg-gray-50 border-gray-300"
              onClick={() => handleSocialLogin('google')}
              aria-label={`Google로 ${isLogin ? '로그인' : '가입하기'}`}
            >
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">G</span>
              </div>
              <span>Google로 {isLogin ? '로그인' : '가입하기'}</span>
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 flex items-center justify-center space-x-3 hover:bg-gray-50 border-gray-300"
              onClick={() => handleSocialLogin('kakao')}
              aria-label={`카카오로 ${isLogin ? '로그인' : '가입하기'}`}
            >
              <div className="w-5 h-5 bg-accent-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">K</span>
              </div>
              <span>카카오로 {isLogin ? '로그인' : '가입하기'}</span>
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 flex items-center justify-center space-x-3 hover:bg-gray-50 border-gray-300"
              onClick={() => handleSocialLogin('naver')}
              aria-label={`네이버로 ${isLogin ? '로그인' : '가입하기'}`}
            >
              <div className="w-5 h-5 bg-success-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">N</span>
              </div>
              <span>네이버로 {isLogin ? '로그인' : '가입하기'}</span>
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-secondary-500">또는</span>
            </div>
          </div>

          {/* Email/Password form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  이름
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="홍길동"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 h-11 focus:border-primary-500 focus:ring-primary-500"
                  required={!isLogin}
                  aria-describedby="name-help"
                />
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                이메일
              </Label>
              <div className="relative mt-1">
                <Input
                  id="email"
                  type="email"
                  placeholder="example@noda.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 pl-10 focus:border-primary-500 focus:ring-primary-500"
                  required
                  aria-describedby="email-help"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-500" />
              </div>
            </div>

            {!isLogin && (
              <div>
                <Label htmlFor="phone" className="text-sm font-medium">
                  전화번호
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="010-1234-5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 h-11 focus:border-primary-500 focus:ring-primary-500"
                  required={!isLogin}
                  aria-describedby="phone-help"
                />
              </div>
            )}

            <div>
              <Label htmlFor="password" className="text-sm font-medium">
                비밀번호
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="8자 이상 입력해주세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pl-10 pr-10 focus:border-primary-500 focus:ring-primary-500"
                  required
                  aria-describedby="password-help"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-500" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-500 hover:text-secondary-700"
                  aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보이기'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  비밀번호 확인
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="비밀번호를 다시 입력해주세요"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-11 pl-10 focus:border-primary-500 focus:ring-primary-500"
                    required={!isLogin}
                    aria-describedby="confirm-password-help"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-500" />
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white"
              disabled={isLoading}
              aria-describedby="submit-help"
            >
              {isLoading ? '처리 중...' : (isLogin ? '로그인' : '가입하기')}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-600">
              {isLogin ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1 text-primary-600 hover:text-primary-700 font-medium"
                aria-label={isLogin ? '회원가입 폼으로 전환' : '로그인 폼으로 전환'}
              >
                {isLogin ? '회원가입' : '로그인'}
              </button>
            </p>
          </div>

          {isLogin && (
            <div className="mt-4 text-center">
              <button className="text-sm text-primary-600 hover:text-primary-700">
                비밀번호를 잊으셨나요?
              </button>
            </div>
          )}

          {/* Terms */}
          <div className="mt-6 text-xs text-secondary-500 text-center">
            {isLogin ? '로그인' : '가입'}하면 NODA의{' '}
            <span className="text-primary-600 underline cursor-pointer">서비스 약관</span> 및{' '}
            <span className="text-primary-600 underline cursor-pointer">개인정보 처리방침</span>에
            동의하는 것입니다.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}