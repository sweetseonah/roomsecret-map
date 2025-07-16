import { useState } from 'react';
import { Search, User, Heart, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { SearchModal } from './SearchModal';

interface HeaderProps {
  onMotelSelect?: (motelId: string) => void;
  onLoginClick?: () => void;
}

export function Header({ onMotelSelect, onLoginClick }: HeaderProps = {}) {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const handleSearchClick = () => {
    setIsSearchModalOpen(true);
  };

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-xl sm:text-2xl font-bold text-primary-600 bg-clip-text">NODA</span>
              </div>
            </div>

            {/* Search Bar - Hidden on mobile, shown on desktop */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="지역, 지하철역, 모텔명"
                  className="pl-4 pr-12 py-2 w-full border-gray-300 rounded-full focus:border-primary-500 focus:ring-primary-500 cursor-pointer"
                  onClick={handleSearchClick}
                  readOnly
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Button 
                    size="sm" 
                    className="bg-primary-600 hover:bg-primary-700 rounded-full px-4"
                    onClick={handleSearchClick}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Right side buttons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button variant="ghost" size="sm" className="hidden sm:flex items-center space-x-2 hover:bg-primary-50 hover:text-primary-700">
                <Heart className="h-4 w-4" />
                <span className="hidden md:inline">찜</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center space-x-2 hover:bg-primary-50 hover:text-primary-700"
                onClick={handleLoginClick}
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">로그인</span>
              </Button>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-3">
            <div className="relative">
              <Input
                type="text"
                placeholder="지역, 지하철역, 모텔명"
                className="pl-4 pr-10 py-2 w-full border-gray-300 rounded-full text-sm focus:border-primary-500 focus:ring-primary-500 cursor-pointer"
                onClick={handleSearchClick}
                readOnly
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                <Button 
                  size="sm" 
                  className="bg-primary-600 hover:bg-primary-700 rounded-full px-3 h-8"
                  onClick={handleSearchClick}
                >
                  <Search className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)}
        onMotelSelect={onMotelSelect}
      />
    </>
  );
}