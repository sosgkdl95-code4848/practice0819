import React, { useState } from 'react';
import { useTerraformStore } from '../../store/useTerraformStore';
import { HexTile, TileType } from '../../types';
import { Droplets, Trees, Building2, X } from 'lucide-react';

export const MarsHexMap: React.FC = () => {
  const { hexTiles, placeTile, isTeacherMode } = useTerraformStore();
  const [selectedTile, setSelectedTile] = useState<HexTile | null>(null);

  // 육각형 꼭짓점 계산 함수 (Pointy-topped hexagon, radius = 30)
  const getHexPoints = (cx: number, cy: number, r: number = 30) => {
    const points: string[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  };

  const handleTileClick = (tile: HexTile) => {
    setSelectedTile(tile);
  };

  const handleManualPlace = (type: TileType) => {
    if (!selectedTile) return;
    placeTile(selectedTile.id, type);
    setSelectedTile(null);
  };

  return (
    <div className="relative w-full max-w-[500px] aspect-square mx-auto flex items-center justify-center select-none my-2">
      {/* 1. 화성 행성 구체 배경 (3D 렌더링 스타일 글로브) */}
      <div className="absolute inset-2 sm:inset-4 rounded-full bg-gradient-to-tr from-[#5C1D11] via-[#C84B25] to-[#E27D48] shadow-2xl overflow-hidden border-2 border-orange-500/30">
        {/* 화성 대기권 외부 림 라이트 (Atmospheric Glow) */}
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,200,150,0.4),rgba(0,0,0,0.8))]" />
        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_60px_rgba(0,0,0,0.9)] pointer-events-none" />

        {/* 화성 크레이터 및 표면 지형 질감 */}
        <div className="absolute top-[15%] left-[20%] w-32 h-16 rounded-full bg-orange-950/40 blur-sm transform -rotate-12 pointer-events-none" />
        <div className="absolute bottom-[25%] right-[20%] w-40 h-24 rounded-full bg-orange-950/50 blur-sm pointer-events-none" />
        <div className="absolute top-[45%] left-[35%] w-48 h-8 rounded-full bg-amber-950/40 blur-[2px] transform rotate-6 pointer-events-none" />
      </div>

      {/* 2. SVG 육각 격자망 오버레이 */}
      <svg
        viewBox="0 0 480 480"
        className="relative z-10 w-full h-full overflow-visible filter drop-shadow-lg"
      >
        <defs>
          {/* 바다 타일 패턴 */}
          <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00B5D8" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>
          {/* 녹지 타일 패턴 */}
          <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#065F46" />
          </linearGradient>
          {/* 도시 타일 패턴 */}
          <linearGradient id="cityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
        </defs>

        {/* 타일 렌더링 */}
        {hexTiles.map((tile) => {
          const points = getHexPoints(tile.x, tile.y, 29);
          const isOcean = tile.type === 'ocean';
          const isGreenery = tile.type === 'greenery';
          const isCity = tile.type === 'city';
          const isReservedOcean = tile.type === 'reserved_ocean';

          let fillColor = 'rgba(255, 255, 255, 0.05)';
          let strokeColor = 'rgba(255, 255, 255, 0.25)';
          let strokeWidth = '1';

          if (isOcean) {
            fillColor = 'url(#oceanGrad)';
            strokeColor = '#67E8F9';
            strokeWidth = '2';
          } else if (isGreenery) {
            fillColor = 'url(#greenGrad)';
            strokeColor = '#6EE7B7';
            strokeWidth = '2';
          } else if (isCity) {
            fillColor = 'url(#cityGrad)';
            strokeColor = '#FDE68A';
            strokeWidth = '2';
          } else if (isReservedOcean) {
            fillColor = 'rgba(0, 181, 216, 0.15)';
            strokeColor = 'rgba(0, 181, 216, 0.4)';
            strokeWidth = '1.5';
          }

          return (
            <g
              key={tile.id}
              onClick={() => handleTileClick(tile)}
              className="cursor-pointer transition-transform duration-200 hover:scale-105"
              style={{ transformOrigin: `${tile.x}px ${tile.y}px` }}
            >
              {/* 육각형 메쉬 */}
              <polygon
                points={points}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                className="transition-all duration-300 hover:stroke-white hover:stroke-2"
              />

              {/* 타일 중앙 아이콘 / 라벨 */}
              {isOcean && (
                <g transform={`translate(${tile.x - 9}, ${tile.y - 9})`}>
                  <text fontSize="15" fill="#FFFFFF" textAnchor="middle" dx="9" dy="13">
                    🌊
                  </text>
                </g>
              )}
              {isGreenery && (
                <g transform={`translate(${tile.x - 9}, ${tile.y - 9})`}>
                  <text fontSize="15" fill="#FFFFFF" textAnchor="middle" dx="9" dy="13">
                    🌲
                  </text>
                </g>
              )}
              {isCity && (
                <g transform={`translate(${tile.x - 9}, ${tile.y - 9})`}>
                  <text fontSize="15" fill="#FFFFFF" textAnchor="middle" dx="9" dy="13">
                    🏙️
                  </text>
                </g>
              )}

              {/* 빈 타일 라벨 */}
              {!isOcean && !isGreenery && !isCity && (
                <text
                  x={tile.x}
                  y={tile.y + 3}
                  textAnchor="middle"
                  fontSize="7.5"
                  fontWeight="600"
                  fill={isReservedOcean ? '#67E8F9' : '#E2E8F0'}
                  opacity={isReservedOcean ? '0.9' : '0.6'}
                  className="pointer-events-none select-none font-sans"
                >
                  {tile.label}
                </text>
              )}

              {/* 타일 소유자 이름 (건설되었을 때) */}
              {(isOcean || isGreenery || isCity) && tile.ownerStudentName && (
                <text
                  x={tile.x}
                  y={tile.y + 18}
                  textAnchor="middle"
                  fontSize="6.5"
                  fontWeight="900"
                  fill="#FFFFFF"
                  className="pointer-events-none select-none shadow-sm"
                >
                  {tile.ownerStudentName}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* 3. 타일 상세 확인 및 수동 배치 팝오버 모달 */}
      {selectedTile && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm rounded-full animate-fade-in">
          <div className="bg-space-900 border border-amber-500/40 rounded-3xl p-5 max-w-xs w-full text-center space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedTile(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                화성 섹터 정보
              </div>
              <h4 className="text-base font-black text-white">{selectedTile.label}</h4>
              <p className="text-xs text-slate-300 mt-1">
                현재 상태:{' '}
                <strong className="text-amber-300">
                  {selectedTile.type === 'ocean'
                    ? '해수면 타일 (Ocean)'
                    : selectedTile.type === 'greenery'
                    ? '녹지 타일 (Greenery)'
                    : selectedTile.type === 'city'
                    ? '도시 타일 (City)'
                    : selectedTile.type === 'reserved_ocean'
                    ? '해수면 예정 구역'
                    : '미개발 화성 표면'}
                </strong>
              </p>
              {selectedTile.ownerStudentName && (
                <div className="mt-1 text-xs text-cyan-300 font-semibold">
                  개척 대원: {selectedTile.ownerStudentName}
                </div>
              )}
            </div>

            {/* 교사 모드일 때 수동 타일 배치 가능 */}
            {isTeacherMode && (
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="text-[10px] font-bold text-purple-400">교사 수동 타일 배치</div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => handleManualPlace('ocean')}
                    className="p-2 rounded-xl bg-cyan-600/30 hover:bg-cyan-600 text-cyan-200 text-xs font-bold transition flex flex-col items-center gap-1"
                  >
                    <Droplets className="w-4 h-4" />
                    <span>바다</span>
                  </button>
                  <button
                    onClick={() => handleManualPlace('greenery')}
                    className="p-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 text-emerald-200 text-xs font-bold transition flex flex-col items-center gap-1"
                  >
                    <Trees className="w-4 h-4" />
                    <span>녹지</span>
                  </button>
                  <button
                    onClick={() => handleManualPlace('city')}
                    className="p-2 rounded-xl bg-amber-600/30 hover:bg-amber-600 text-amber-200 text-xs font-bold transition flex flex-col items-center gap-1"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>도시</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
