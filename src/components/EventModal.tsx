import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EventModal({ isOpen, onClose }: EventModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg w-full max-h-[80vh] p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            숙소 이벤트
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 mt-1">
            진행 중인 숙소 이벤트 정보를 확인하세요
          </DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {/* Event 1 */}
            <div className="space-y-3">
              <Badge className="bg-blue-100 text-blue-800 text-xs">
                Event 1
              </Badge>
              
              <h3 className="font-semibold text-gray-900">
                [유레카] 수영장 패키지] 이용 안내
              </h3>
              
              <div className="space-y-2 text-sm text-gray-700">
                <p className="font-medium text-blue-600">
                  [유레카 수영장 패키지] 객실 혜택
                </p>
                <p>• 조식 2인</p>
                <p>• 성인 2명 유레카 (아쿠아 수영장) 1회 무료</p>
                
                <p className="font-medium text-blue-600 mt-4">
                  [유레카 패키지 수영장 이용 안내]
                </p>
                <p>• 체크인 일 13시 30분 이후부터 이용 가능</p>
                <p>• 13시부터 대기번호 발급</p>
                <p>• 오전부/오후부 중 택 1, 1회 시용 가능</p>
                <p>• 종일 이용 및 휴식 후 재입장 불가</p>
                <p>• 수영장은 투숙 전 전용으로 운영되며, 투숙 외 업체 규정 초과 시 입장불가</p>
                <p>• 음식물 반입 금지</p>
                <p>• 규정된 물놀이 기구(120cm 이하의 휴식 튜브, 암링 등)만 이용 가능</p>
                <p>• 반영 등 사용금지 물품 및 사용금지 행위가 확인될 시 퇴장 처리</p>
                <p>• 타인에게 영향을 줄 수 있는 문신이 있는 고객님은 이용하실 수 없습니다</p>
                <p>• 오리발, 스노클링 등</p>
                <p>• 소인 (24개월 이상 초등학생 이하) 이하 보호자 동반 입장 필수</p>
                <p>• 36개월 미만 유아 방수 기저귀 착용 후 입장 가능</p>
                <p>• 수영복 착용 필수</p>
                <p>• 타인에게 영향을 줄 수 있는 문신이 있는 고객님은 이용하실 수 없습니다</p>
                <p>• 수영장 관련 용품 구입은 리셉션 데스크에서 가능합니다</p>
                <p>• 수영장 관련 용품 구입은 리셉션 데스크에서 가능합니다</p>
                <p>• 수영장 관련 용품 구입은 리셉션 데스크에서 가능합니다</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}