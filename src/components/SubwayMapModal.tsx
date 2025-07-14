import { useState } from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';

interface SubwayMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStationSelect: (station: SubwayStation) => void;
}

interface SubwayStation {
  id: string;
  name: string;
  line: string;
  lineColor: string;
  x: number;
  y: number;
  connections?: string[];
}

interface SubwayLine {
  id: string;
  name: string;
  color: string;
  stations: SubwayStation[];
}

// 수도권 지하철 데이터 (주요 역들만 포함)
const seoulSubwayData: SubwayLine[] = [
  {
    id: 'line1',
    name: '1호선',
    color: '#0052A4',
    stations: [
      { id: 'seoul-station', name: '서울역', line: '1호선', lineColor: '#0052A4', x: 150, y: 300 },
      { id: 'jonggak', name: '종각', line: '1호선', lineColor: '#0052A4', x: 200, y: 280 },
      { id: 'jongro3ga', name: '종로3가', line: '1호선', lineColor: '#0052A4', x: 220, y: 260, connections: ['3호선', '5호선'] },
      { id: 'dongdaemun', name: '동대문', line: '1호선', lineColor: '#0052A4', x: 250, y: 240 },
      { id: 'dongmyo', name: '동묘앞', line: '1호선', lineColor: '#0052A4', x: 270, y: 220 },
    ]
  },
  {
    id: 'line2',
    name: '2호선',
    color: '#00A84D',
    stations: [
      { id: 'gangnam', name: '강남역', line: '2호선', lineColor: '#00A84D', x: 300, y: 400 },
      { id: 'seocho', name: '서초역', line: '2호선', lineColor: '#00A84D', x: 280, y: 380 },
      { id: 'samsung', name: '삼성역', line: '2호선', lineColor: '#00A84D', x: 320, y: 420 },
      { id: 'hongik-univ', name: '홍대입구역', line: '2호선', lineColor: '#00A84D', x: 100, y: 300, connections: ['6호선'] },
      { id: 'sinchon', name: '신촌역', line: '2호선', lineColor: '#00A84D', x: 120, y: 290 },
      { id: 'ewha-womans-univ', name: '이대역', line: '2호선', lineColor: '#00A84D', x: 110, y: 295 },
      { id: 'myeongdong', name: '을지로입구', line: '2호선', lineColor: '#00A84D', x: 180, y: 300 },
    ]
  },
  {
    id: 'line3',
    name: '3호선',
    color: '#EF7C1C',
    stations: [
      { id: 'gangnam-3', name: '압구정역', line: '3호선', lineColor: '#EF7C1C', x: 320, y: 350 },
      { id: 'apgujeong', name: '신사역', line: '3호선', lineColor: '#EF7C1C', x: 310, y: 360 },
      { id: 'sinsa', name: '잠원역', line: '3호선', lineColor: '#EF7C1C', x: 300, y: 370 },
      { id: 'jongro3ga-3', name: '종로3가', line: '3호선', lineColor: '#EF7C1C', x: 220, y: 260, connections: ['1호선', '5호선'] },
      { id: 'anguk', name: '안국역', line: '3호선', lineColor: '#EF7C1C', x: 210, y: 250 },
    ]
  },
  {
    id: 'line4',
    name: '4호선', 
    color: '#00A5DE',
    stations: [
      { id: 'myeongdong-4', name: '명동역', line: '4호선', lineColor: '#00A5DE', x: 190, y: 320 },
      { id: 'hoehyeon', name: '회현역', line: '4호선', lineColor: '#00A5DE', x: 180, y: 330 },
      { id: 'seoul-station-4', name: '서울역', line: '4호선', lineColor: '#00A5DE', x: 150, y: 300, connections: ['1호선'] },
      { id: 'dongdaemun-4', name: '동대문역사문화공원', line: '4호선', lineColor: '#00A5DE', x: 240, y: 280, connections: ['2호선', '5호선'] },
    ]
  },
  {
    id: 'line5',
    name: '5호선',
    color: '#996CAC',
    stations: [
      { id: 'yeouido', name: '여의도역', line: '5호선', lineColor: '#996CAC', x: 120, y: 350 },
      { id: 'mapo', name: '마포역', line: '5호선', lineColor: '#996CAC', x: 110, y: 330 },
      { id: 'dongdaemun-5', name: '동대문역사문화공원', line: '5호선', lineColor: '#996CAC', x: 240, y: 280, connections: ['2호선', '4호선'] },
      { id: 'jongro3ga-5', name: '종로3가', line: '5호선', lineColor: '#996CAC', x: 220, y: 260, connections: ['1호선', '3호선'] },
    ]
  },
];

// 부산 지하철 데이터
const busanSubwayData: SubwayLine[] = [
  {
    id: 'busan-line1',
    name: '1호선',
    color: '#F06A00',
    stations: [
      { id: 'seomyeon', name: '서면역', line: '1호선', lineColor: '#F06A00', x: 200, y: 250, connections: ['2호선'] },
      { id: 'busan-station', name: '부산역', line: '1호선', lineColor: '#F06A00', x: 280, y: 200 },
      { id: 'nampo', name: '남포역', line: '1호선', lineColor: '#F06A00', x: 250, y: 220 },
      { id: 'jagalchi', name: '자갈치역', line: '1호선', lineColor: '#F06A00', x: 240, y: 210 },
      { id: 'haeundae', name: '해운대역', line: '1호선', lineColor: '#F06A00', x: 350, y: 300 },
    ]
  },
  {
    id: 'busan-line2',
    name: '2호선',
    color: '#81C841',
    stations: [
      { id: 'seomyeon-2', name: '서면역', line: '2호선', lineColor: '#81C841', x: 200, y: 250, connections: ['1호선'] },
      { id: 'centum-city', name: '센텀시티역', line: '2호선', lineColor: '#81C841', x: 320, y: 280 },
      { id: 'gwangan', name: '광안역', line: '2호선', lineColor: '#81C841', x: 300, y: 320 },
      { id: 'munhyeon', name: '문현역', line: '2호선', lineColor: '#81C841', x: 220, y: 270 },
    ]
  },
  {
    id: 'busan-line3',
    name: '3호선',
    color: '#BB8C00',
    stations: [
      { id: 'yeonsan', name: '연산역', line: '3호선', lineColor: '#BB8C00', x: 250, y: 300 },
      { id: 'minam', name: '미남역', line: '3호선', lineColor: '#BB8C00', x: 240, y: 290 },
      { id: 'bujeon', name: '부전역', line: '3호선', lineColor: '#BB8C00', x: 230, y: 280 },
      { id: 'deokcheon', name: '덕천역', line: '3호선', lineColor: '#BB8C00', x: 180, y: 200 },
    ]
  },
  {
    id: 'busan-line4',
    name: '4호선',
    color: '#5E9BDF',
    stations: [
      { id: 'minam-4', name: '미남역', line: '4호선', lineColor: '#5E9BDF', x: 240, y: 290, connections: ['3호선'] },
      { id: 'dongnae', name: '동래역', line: '4호선', lineColor: '#5E9BDF', x: 280, y: 250 },
      { id: 'myeongnyun', name: '명륜역', line: '4호선', lineColor: '#5E9BDF', x: 290, y: 240 },
    ]
  }
];

// 대구 지하철 데이터
const daeguSubwayData: SubwayLine[] = [
  {
    id: 'daegu-line1',
    name: '1호선',
    color: '#D93A49',
    stations: [
      { id: 'daegu-station', name: '대구역', line: '1호선', lineColor: '#D93A49', x: 200, y: 300 },
      { id: 'jungangno', name: '중앙로역', line: '1호선', lineColor: '#D93A49', x: 220, y: 280, connections: ['2호선'] },
      { id: 'banwoldang', name: '반월당역', line: '1호선', lineColor: '#D93A49', x: 240, y: 260, connections: ['2호선'] },
      { id: 'myeongdeok', name: '명덕역', line: '1호선', lineColor: '#D93A49', x: 260, y: 240 },
      { id: 'half-moon', name: '반월당역', line: '1호선', lineColor: '#D93A49', x: 240, y: 260 },
    ]
  },
  {
    id: 'daegu-line2',
    name: '2호선',
    color: '#00A651',
    stations: [
      { id: 'jungangno-2', name: '중앙로역', line: '2호선', lineColor: '#00A651', x: 220, y: 280, connections: ['1호선'] },
      { id: 'banwoldang-2', name: '반월당역', line: '2호선', lineColor: '#00A651', x: 240, y: 260, connections: ['1호선'] },
      { id: 'kyungpook-univ', name: '경북대입구역', line: '2호선', lineColor: '#00A651', x: 180, y: 200 },
      { id: 'daegu-bank', name: '대구은행역', line: '2호선', lineColor: '#00A651', x: 200, y: 240 },
    ]
  },
  {
    id: 'daegu-line3',
    name: '3호선',
    color: '#F99D1C',
    stations: [
      { id: 'chilgok-stadium', name: '칠곡경대병원역', line: '3호선', lineColor: '#F99D1C', x: 160, y: 180 },
      { id: 'manpyeong', name: '만평역', line: '3호선', lineColor: '#F99D1C', x: 180, y: 200 },
      { id: 'dongcheon', name: '동천역', line: '3호선', lineColor: '#F99D1C', x: 200, y: 220 },
    ]
  }
];

export function SubwayMapModal({ isOpen, onClose, onStationSelect }: SubwayMapModalProps) {
  const [selectedRegion, setSelectedRegion] = useState('seoul');

  const getCurrentSubwayData = () => {
    switch (selectedRegion) {
      case 'seoul': return seoulSubwayData;
      case 'busan': return busanSubwayData;
      case 'daegu': return daeguSubwayData;
      default: return seoulSubwayData;
    }
  };

  const handleStationClick = (station: SubwayStation) => {
    onStationSelect(station);
    onClose();
  };

  const getMapDimensions = () => {
    switch (selectedRegion) {
      case 'seoul': return { width: 500, height: 600 };
      case 'busan': return { width: 450, height: 400 };
      case 'daegu': return { width: 400, height: 350 };
      default: return { width: 500, height: 600 };
    }
  };

  const subwayData = getCurrentSubwayData();
  const { width, height } = getMapDimensions();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl w-full max-h-[90vh] p-0 gap-0">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900">
                지하철 노선도
              </DialogTitle>
              <p className="text-sm text-gray-600 mt-1">
                역을 클릭하면 근처 숙소를 검색할 수 있습니다
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={selectedRegion} onValueChange={setSelectedRegion} className="h-full flex flex-col">
            {/* Region Tabs */}
            <div className="border-b border-gray-200 px-4 sm:px-6 pt-4">
              <TabsList className="grid w-full grid-cols-3 max-w-md">
                <TabsTrigger value="seoul" className="text-sm">수도권</TabsTrigger>
                <TabsTrigger value="busan" className="text-sm">부산</TabsTrigger>
                <TabsTrigger value="daegu" className="text-sm">대구</TabsTrigger>
              </TabsList>
            </div>

            {/* Map Content */}
            <TabsContent value={selectedRegion} className="flex-1 m-0">
              <ScrollArea className="h-[calc(90vh-180px)]">
                <div className="p-6 flex justify-center">
                  <div className="relative">
                    <svg
                      width={width}
                      height={height}
                      viewBox={`0 0 ${width} ${height}`}
                      className="border border-gray-200 rounded-lg bg-white"
                    >
                      {/* Draw lines between connected stations */}
                      {subwayData.map((line) => (
                        <g key={line.id}>
                          {line.stations.map((station, index) => {
                            if (index < line.stations.length - 1) {
                              const nextStation = line.stations[index + 1];
                              return (
                                <line
                                  key={`${station.id}-${nextStation.id}`}
                                  x1={station.x}
                                  y1={station.y}
                                  x2={nextStation.x}
                                  y2={nextStation.y}
                                  stroke={line.color}
                                  strokeWidth="4"
                                  strokeLinecap="round"
                                />
                              );
                            }
                            return null;
                          })}
                        </g>
                      ))}

                      {/* Draw stations */}
                      {subwayData.map((line) =>
                        line.stations.map((station) => (
                          <g key={station.id}>
                            {/* Station circle */}
                            <circle
                              cx={station.x}
                              cy={station.y}
                              r="8"
                              fill="white"
                              stroke={station.lineColor}
                              strokeWidth="3"
                              className="cursor-pointer hover:r-10 transition-all"
                              onClick={() => handleStationClick(station)}
                            />
                            
                            {/* Connection indicator for transfer stations */}
                            {station.connections && station.connections.length > 0 && (
                              <circle
                                cx={station.x}
                                cy={station.y}
                                r="12"
                                fill="none"
                                stroke="#666"
                                strokeWidth="2"
                                strokeDasharray="2,2"
                              />
                            )}

                            {/* Station name */}
                            <text
                              x={station.x}
                              y={station.y - 18}
                              textAnchor="middle"
                              fontSize="11"
                              fontWeight="500"
                              fill="#374151"
                              className="pointer-events-none select-none"
                            >
                              {station.name}
                            </text>

                            {/* Invisible clickable area for better UX */}
                            <circle
                              cx={station.x}
                              cy={station.y}
                              r="20"
                              fill="transparent"
                              className="cursor-pointer"
                              onClick={() => handleStationClick(station)}
                            />
                          </g>
                        ))
                      )}
                    </svg>

                    {/* Legend */}
                    <div className="mt-6 space-y-2">
                      <h4 className="font-medium text-gray-900 mb-3">노선 안내</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {subwayData.map((line) => (
                          <div key={line.id} className="flex items-center space-x-2">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: line.color }}
                            />
                            <span className="text-gray-700">{line.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}