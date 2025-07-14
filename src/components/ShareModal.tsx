import { useState } from 'react';
import { Copy, Check, QrCode, MessageCircle, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Separator } from './ui/separator';
import { toast } from 'sonner';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  motel: {
    id: string;
    name: string;
    category: string;
    rating: number;
    address: string;
    images: string[];
  };
}

export function ShareModal({ isOpen, onClose, motel }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  // Generate shareable URL (in real app, this would be the actual URL)
  const shareUrl = `https://noda.co.kr/motel/${motel.id}`;
  const shareTitle = `${motel.name} - NODA`;
  const shareDescription = `${motel.category} · ⭐ ${motel.rating} · ${motel.address}`;

  // Check if native sharing is available
  const isNativeShareAvailable = typeof navigator !== 'undefined' && navigator.share;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('링크가 복사되었습니다!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('링크 복사에 실패했습니다.');
    }
  };

  const handleKakaoShare = () => {
    // In real implementation, use Kakao SDK
    const kakaoUrl = `https://story.kakao.com/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
    window.open(kakaoUrl, '_blank', 'width=600,height=400');
    toast.success('카카오톡으로 공유합니다.');
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(shareTitle);
    const body = encodeURIComponent(`${shareDescription}\n\n${shareUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleNativeShare = async () => {
    if (isNativeShareAvailable) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDescription,
          url: shareUrl,
        });
        toast.success('공유가 완료되었습니다!');
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          toast.error('공유에 실패했습니다.');
        }
      }
    }
  };

  const generateQRCodeUrl = (url: string) => {
    // Using QR Server API for demo - in production, consider using a more robust solution
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl font-semibold flex items-center space-x-2">
            <Share2 className="h-5 w-5 text-primary-600" />
            <span>공유하기</span>
          </DialogTitle>
          <DialogDescription className="sr-only">
            {motel.name}의 정보를 다양한 방법으로 공유할 수 있습니다. 링크 복사, 소셜 미디어, QR 코드 등을 이용하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6">
          {/* Motel preview */}
          <div className="flex items-center space-x-3 mb-6 p-3 bg-primary-50 rounded-lg border border-primary-100">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={motel.images[0]}
                alt={motel.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{motel.name}</h3>
              <p className="text-sm text-secondary-600">{motel.category} · ⭐ {motel.rating}</p>
            </div>
          </div>

          {/* Link sharing */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                링크 공유
              </label>
              <div className="flex space-x-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="flex-1 bg-gray-50 border-gray-200 text-sm"
                  aria-label="공유 링크"
                />
                <Button
                  onClick={handleCopyLink}
                  className={`px-4 transition-all duration-200 ${
                    copied 
                      ? 'bg-success-500 hover:bg-success-600' 
                      : 'bg-primary-600 hover:bg-primary-700'
                  }`}
                  aria-label={copied ? '링크 복사됨' : '링크 복사'}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Native Share (Mobile) */}
          {isNativeShareAvailable && (
            <div className="mb-6">
              <Button
                onClick={handleNativeShare}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white h-12 flex items-center justify-center space-x-2"
              >
                <Share2 className="h-4 w-4" />
                <span>공유하기</span>
              </Button>
            </div>
          )}

          {/* Social sharing */}
          {!isNativeShareAvailable && (
            <div className="space-y-4 mb-6">
              <h4 className="text-sm font-medium text-gray-700">소셜 미디어로 공유</h4>
              <div className="grid grid-cols-2 gap-3">
              {/* KakaoTalk */}
              <Button
                variant="outline"
                onClick={handleKakaoShare}
                className="flex items-center justify-center space-x-2 h-12 hover:bg-accent-50 hover:border-accent-300"
              >
                <div className="w-5 h-5 bg-accent-500 rounded flex items-center justify-center">
                  <MessageCircle className="h-3 w-3 text-white" />
                </div>
                <span>카카오톡</span>
              </Button>

              {/* Facebook */}
              <Button
                variant="outline"
                onClick={handleFacebookShare}
                className="flex items-center justify-center space-x-2 h-12 hover:bg-blue-50 hover:border-blue-300"
              >
                <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">f</span>
                </div>
                <span>페이스북</span>
              </Button>

              {/* Twitter */}
              <Button
                variant="outline"
                onClick={handleTwitterShare}
                className="flex items-center justify-center space-x-2 h-12 hover:bg-sky-50 hover:border-sky-300"
              >
                <div className="w-5 h-5 bg-sky-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">T</span>
                </div>
                <span>트위터</span>
              </Button>

              {/* Email */}
              <Button
                variant="outline"
                onClick={handleEmailShare}
                className="flex items-center justify-center space-x-2 h-12 hover:bg-gray-50 hover:border-gray-300"
              >
                <div className="w-5 h-5 bg-gray-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs">@</span>
                </div>
                <span>이메일</span>
              </Button>
              </div>
            </div>
          )}

          <Separator className="mb-6" />

          {/* QR Code */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">QR 코드로 공유</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQRCode(!showQRCode)}
                className="text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                aria-expanded={showQRCode}
                aria-controls="qr-code-section"
              >
                <QrCode className="h-4 w-4 mr-1" />
                {showQRCode ? '숨기기' : '보기'}
              </Button>
            </div>

            {showQRCode && (
              <div id="qr-code-section" className="flex justify-center p-4 bg-white border border-gray-200 rounded-lg">
                <div className="text-center">
                  <img
                    src={generateQRCodeUrl(shareUrl)}
                    alt={`${motel.name} QR 코드`}
                    className="w-32 h-32 mx-auto mb-2"
                  />
                  <p className="text-xs text-secondary-600">
                    QR 코드를 스캔하여 페이지에 접속하세요
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Additional info */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-secondary-600 text-center">
              링크를 통해 접속한 사용자도 같은 정보를 볼 수 있습니다.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}