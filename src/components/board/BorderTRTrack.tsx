import React from 'react';
import { useTerraformStore } from '../../store/useTerraformStore';

// 모둠별 대표 색상 매핑
const GROUP_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  '1모둠 (아레스)': { bg: 'bg-red-500', text: 'text-white', border: 'border-red-300', glow: 'shadow-neon-red' },
  '2모둠 (헬라스)': { bg: 'bg-cyan-500', text: 'text-space-950', border: 'border-cyan-300', glow: 'shadow-neon-cyan' },
  '3모둠 (엘리시움)': { bg: 'bg-emerald-500', text: 'text-space-950', border: 'border-emerald-300', glow: 'shadow-neon-emerald' },
  '4모둠 (타르시스)': { bg: 'bg-amber-400', text: 'text-space-950', border: 'border-amber-200', glow: 'shadow-neon-orange' },
};

interface BorderTRTrackProps {
  children: React.ReactNode;
}

export const BorderTRTrack: React.FC<BorderTRTrackProps> = ({ children }) => {
  const { students, groups, getClassTR } = useTerraformStore();
  const classTR = getClassTR();

  // 모둠별 합산 TR 계산
  const groupTRMap = groups.reduce((acc, grp) => {
    const grpStudents = students.filter((s) => s.groupName === grp);
    const tr = grpStudents.reduce((sum, s) => sum + s.contributionTR, 20); // 기본 20TR 시작
    acc[grp] = tr;
    return acc;
  }, {} as Record<string, number>);

  // 특정 번호 칸에 위치한 모둠 및 학생 탐색
  const getMarkersForNumber = (num: number) => {
    const markers: { type: 'class' | 'group' | 'student'; name: string; color: string; label: string }[] = [];

    // 학급 전체 TR
    if (classTR === num) {
      markers.push({
        type: 'class',
        name: '학급 전체 TR',
        color: 'bg-gradient-to-tr from-amber-400 to-yellow-200 text-space-950 ring-2 ring-yellow-400',
        label: '🚀',
      });
    }

    // 모둠 TR (20 + 모둠 기여 TR)
    Object.entries(groupTRMap).forEach(([grpName, tr]) => {
      if (tr === num) {
        const color = GROUP_COLORS[grpName] || { bg: 'bg-purple-500', text: 'text-white' };
        markers.push({
          type: 'group',
          name: grpName,
          color: `${color.bg} ${color.text} ring-1 ring-white/60`,
          label: grpName.slice(0, 1),
        });
      }
    });

    return markers;
  };

  const renderTRCell = (num: number) => {
    const isSpecial = num % 5 === 0;
    const isMajor = num % 10 === 0;
    const markers = getMarkersForNumber(num);

    return (
      <div
        key={num}
        className={`relative flex items-center justify-center font-mono font-black select-none transition-all ${
          isMajor
            ? 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-space-950 border border-amber-300 font-extrabold shadow-sm'
            : isSpecial
            ? 'bg-gradient-to-b from-orange-400 to-orange-600 text-space-950 border border-orange-300'
            : 'bg-gradient-to-b from-amber-600/90 to-amber-800/90 text-amber-100 border border-amber-500/30 hover:bg-amber-600'
        } text-[10px] sm:text-xs w-full h-full min-w-0 min-h-0 aspect-square group`}
        title={`TR ${num}번 트랙`}
      >
        <span className="leading-none">{num}</span>

        {/* TR 핀 / 마커 렌더링 */}
        {markers.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="flex -space-x-1 items-center justify-center">
              {markers.slice(0, 2).map((m, idx) => (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center text-[9px] font-black shadow-lg animate-bounce ${m.color}`}
                  title={`${m.name} (TR: ${num})`}
                >
                  {m.label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 호버 툴팁 */}
        {markers.length > 0 && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:flex flex-col bg-space-950 border border-amber-500/40 px-2 py-1 rounded-lg text-[10px] text-white whitespace-nowrap z-50 shadow-2xl">
            <span className="font-bold text-amber-300">TR {num} 위치</span>
            {markers.map((m, i) => (
              <span key={i} className="text-slate-300">
                • {m.name}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  // 1 ~ 100 분할
  // Top: 25 ~ 50 (26 cells)
  // Right: 51 ~ 74 (24 cells)
  // Bottom: 100 down to 75 (26 cells)
  // Left: 24 down to 1 (24 cells)
  const topRow = Array.from({ length: 26 }, (_, i) => 25 + i); // 25..50
  const rightCol = Array.from({ length: 24 }, (_, i) => 51 + i); // 51..74
  const bottomRow = Array.from({ length: 26 }, (_, i) => 100 - i); // 100..75
  const leftCol = Array.from({ length: 24 }, (_, i) => 24 - i); // 24..1

  return (
    <div className="relative rounded-3xl border-4 border-amber-800/80 bg-space-950 p-2 sm:p-3 shadow-2xl overflow-hidden">
      {/* 우주 공간 질감 및 보드게임 프레임 */}
      <div className="relative w-full">
        {/* 상단 TR 행 */}
        <div className="grid grid-cols-[repeat(26,minmax(0,1fr))] gap-0.5 mb-1 sm:mb-1.5 h-6 sm:h-7">
          {topRow.map((num) => renderTRCell(num))}
        </div>

        {/* 좌측 + 중앙 + 우측 중간 영역 */}
        <div className="flex w-full gap-1 sm:gap-1.5">
          {/* 좌측 TR 열 */}
          <div className="grid grid-rows-[repeat(24,minmax(0,1fr))] gap-0.5 w-6 sm:w-7 flex-shrink-0">
            {leftCol.map((num) => renderTRCell(num))}
          </div>

          {/* 중앙 화성 보드 영역 (Children) */}
          <div className="flex-1 min-w-0 bg-gradient-to-b from-[#130E1E] via-[#1A1226] to-[#0D0914] rounded-2xl border border-white/10 p-2 sm:p-4 overflow-hidden relative">
            {children}
          </div>

          {/* 우측 TR 열 */}
          <div className="grid grid-rows-[repeat(24,minmax(0,1fr))] gap-0.5 w-6 sm:w-7 flex-shrink-0">
            {rightCol.map((num) => renderTRCell(num))}
          </div>
        </div>

        {/* 하단 TR 행 */}
        <div className="grid grid-cols-[repeat(26,minmax(0,1fr))] gap-0.5 mt-1 sm:mt-1.5 h-6 sm:h-7">
          {bottomRow.map((num) => renderTRCell(num))}
        </div>
      </div>
    </div>
  );
};
