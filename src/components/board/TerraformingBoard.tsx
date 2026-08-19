import React from 'react';
import { BorderTRTrack } from './BorderTRTrack';
import { TopOxygenArc } from './TopOxygenArc';
import { MarsHexMap } from './MarsHexMap';
import { VerticalThermometer } from './VerticalThermometer';
import { StandardProjectsCard } from './StandardProjectsCard';
import { MilestonesAwardsBar } from './MilestonesAwardsBar';
import { Moon, Orbit } from 'lucide-react';

export const TerraformingBoard: React.FC = () => {
  return (
    <div className="w-full">
      <BorderTRTrack>
        {/* 우주 공간 배경 장식 요소들 (포보스, 데이모스 위성 및 성운) */}
        <div className="relative w-full h-full flex flex-col justify-between overflow-hidden">
          {/* 포보스 우주 정거장 (좌측 상단) */}
          <div className="absolute top-4 left-6 hidden lg:flex items-center gap-2 p-2 rounded-2xl bg-space-950/60 border border-white/10 backdrop-blur-sm select-none">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-600 to-slate-400 p-0.5 shadow-md flex items-center justify-center">
              <Moon className="w-4 h-4 text-slate-200" />
            </div>
            <div className="text-[10px]">
              <div className="font-bold text-slate-300">Phobos Station</div>
              <div className="text-slate-500 font-mono">제1 위성 기지</div>
            </div>
          </div>

          {/* 가니메데 콜로니 (좌측 중앙) */}
          <div className="absolute top-36 left-4 hidden xl:flex items-center gap-2 p-2 rounded-2xl bg-space-950/60 border border-white/10 backdrop-blur-sm select-none">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-700 to-indigo-500 p-0.5 shadow-md flex items-center justify-center">
              <Orbit className="w-4 h-4 text-purple-200" />
            </div>
            <div className="text-[10px]">
              <div className="font-bold text-purple-300">Ganymede Colony</div>
              <div className="text-slate-500 font-mono">목성 외곽 기지</div>
            </div>
          </div>

          {/* 1. 상단 산소 농도 아치 */}
          <div className="w-full pt-1 sm:pt-2">
            <TopOxygenArc />
          </div>

          {/* 2. 중앙 메인 보드 그리드 (좌측 표준 프로젝트 | 중앙 화성 헥스 맵 | 우측 수직 온도계) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center my-2">
            {/* 좌측 표준 프로젝트 패널 */}
            <div className="lg:col-span-4 xl:col-span-3 order-2 lg:order-1 h-full flex flex-col justify-center">
              <StandardProjectsCard />
            </div>

            {/* 중앙 화성 육각 지도 */}
            <div className="lg:col-span-6 xl:col-span-7 order-1 lg:order-2 flex items-center justify-center">
              <MarsHexMap />
            </div>

            {/* 우측 세로 온도계 */}
            <div className="lg:col-span-2 xl:col-span-2 order-3 h-[420px] sm:h-[480px] flex items-center justify-center">
              <VerticalThermometer />
            </div>
          </div>

          {/* 3. 하단 마일스톤 & 어워드 바 */}
          <div className="w-full mt-2">
            <MilestonesAwardsBar />
          </div>
        </div>
      </BorderTRTrack>
    </div>
  );
};
