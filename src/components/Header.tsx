'use client';

import { useState, useEffect } from 'react';
import { Search, Menu, Heart, User, Sun, Moon } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // 페이지 로드 시 다크 모드 상태 확인
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-card/80 backdrop-blur-sm border-b border-border' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-primary-600">
              RoomSecret
            </h1>
            <span className="text-lg text-foreground">Map</span>
          </div>

          {/* 네비게이션 */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-foreground hover:text-primary-600 transition-colors">
              숙소
            </a>
            <a href="#" className="text-foreground hover:text-primary-600 transition-colors">
              체험
            </a>
            <a href="#" className="text-foreground hover:text-primary-600 transition-colors">
              이벤트
            </a>
          </nav>

          {/* 우측 버튼들 */}
          <div className="flex items-center space-x-4">
            {/* 검색 버튼 */}
            <button className="p-2 rounded-full hover:bg-muted transition-colors">
              <Search className="h-5 w-5 text-foreground" />
            </button>

            {/* 다크 모드 토글 */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="다크 모드 토글"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-foreground" />
              ) : (
                <Moon className="h-5 w-5 text-foreground" />
              )}
            </button>

            {/* 위시리스트 */}
            <button className="p-2 rounded-full hover:bg-muted transition-colors">
              <Heart className="h-5 w-5 text-foreground" />
            </button>

            {/* 사용자 메뉴 */}
            <button className="flex items-center space-x-2 p-2 rounded-full border border-border hover:bg-muted transition-colors">
              <Menu className="h-4 w-4 text-foreground" />
              <User className="h-5 w-5 text-foreground" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}