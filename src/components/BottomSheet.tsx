import { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface BottomSheetProps {
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  snapPoints?: number[];
  initialSnap?: number;
  currentSnap?: number; // 외부에서 제어할 수 있도록 추가
  onSnapChange?: (snap: number) => void; // 스냅 변경 시 콜백 추가
}

export function BottomSheet({ 
  children, 
  isOpen, 
  onToggle, 
  snapPoints = [15, 45, 85], 
  initialSnap = 0,
  currentSnap: externalCurrentSnap,
  onSnapChange
}: BottomSheetProps) {
  const [internalCurrentSnap, setInternalCurrentSnap] = useState(initialSnap);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartSnap, setDragStartSnap] = useState(0);
  const [dragCurrentY, setDragCurrentY] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  // 외부에서 제어하는 경우 외부 값 사용, 아니면 내부 상태 사용
  const currentSnap = externalCurrentSnap !== undefined ? externalCurrentSnap : internalCurrentSnap;
  const setCurrentSnap = (snap: number) => {
    if (externalCurrentSnap !== undefined) {
      onSnapChange?.(snap);
    } else {
      setInternalCurrentSnap(snap);
    }
  };

  const currentHeight = snapPoints[currentSnap];

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStartY(touch.clientY);
    setDragStartSnap(currentSnap);
    setDragCurrentY(touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    setDragCurrentY(touch.clientY);
    
    const deltaY = dragStartY - touch.clientY;
    const viewportHeight = window.innerHeight;
    const deltaPercent = (deltaY / viewportHeight) * 100;
    
    const newHeight = Math.max(
      snapPoints[0], 
      Math.min(snapPoints[snapPoints.length - 1], snapPoints[dragStartSnap] + deltaPercent)
    );
    
    if (sheetRef.current) {
      sheetRef.current.style.height = `${newHeight}vh`;
      sheetRef.current.style.transition = 'none';
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (sheetRef.current) {
      const currentHeightPx = sheetRef.current.getBoundingClientRect().height;
      const viewportHeight = window.innerHeight;
      const currentPercent = (currentHeightPx / viewportHeight) * 100;
      
      // 드래그 속도 계산
      const dragVelocity = Math.abs(dragCurrentY - dragStartY);
      const isQuickDrag = dragVelocity > 50;
      
      // Find closest snap point
      let closestSnap = 0;
      let closestDistance = Math.abs(snapPoints[0] - currentPercent);
      
      snapPoints.forEach((point, index) => {
        const distance = Math.abs(point - currentPercent);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestSnap = index;
        }
      });
      
      // 빠른 드래그의 경우 방향에 따라 다음/이전 스냅 포인트로 이동
      if (isQuickDrag) {
        const dragDirection = dragCurrentY < dragStartY ? 'up' : 'down';
        if (dragDirection === 'up' && closestSnap < snapPoints.length - 1) {
          closestSnap += 1;
        } else if (dragDirection === 'down' && closestSnap > 0) {
          closestSnap -= 1;
        }
      }
      
      setCurrentSnap(closestSnap);
      sheetRef.current.style.transition = 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      sheetRef.current.style.height = `${snapPoints[closestSnap]}vh`;
    }
  };

  const handleHeaderClick = () => {
    if (sheetRef.current) {
      // 클릭 시 다음 스냅 포인트로 이동
      const nextSnap = currentSnap >= snapPoints.length - 1 ? 0 : currentSnap + 1;
      setCurrentSnap(nextSnap);
      sheetRef.current.style.transition = 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      sheetRef.current.style.height = `${snapPoints[nextSnap]}vh`;
    }
  };

  // 스냅 변경 시 높이 업데이트
  useEffect(() => {
    if (sheetRef.current) {
      sheetRef.current.style.height = `${snapPoints[currentSnap]}vh`;
    }
  }, [currentSnap, snapPoints]);

  // 초기 높이 설정
  useEffect(() => {
    if (sheetRef.current) {
      sheetRef.current.style.height = `${snapPoints[currentSnap]}vh`;
    }
  }, []);

  // isOpen이 변경될 때 처리
  useEffect(() => {
    if (!isOpen) {
      setCurrentSnap(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={sheetRef}
      className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl z-40 flex flex-col"
      style={{
        height: `${currentHeight}vh`,
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)',
        transition: isDragging ? 'none' : 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Handle */}
      <div
        className="flex-shrink-0 flex items-center justify-center py-3 px-4 bg-white cursor-grab active:cursor-grabbing"
        style={{
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleHeaderClick}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-1 bg-gray-300 rounded-full transition-colors duration-200 hover:bg-gray-400"></div>
          <div className="text-gray-400 transition-colors duration-200 hover:text-gray-600">
            {currentSnap < snapPoints.length - 1 ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 border-t border-gray-100">
        {children}
      </div>
    </div>
  );
}