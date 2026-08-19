import React from 'react';
import { useTerraformStore } from '../../store/useTerraformStore';
import { PARAMETER_CONFIGS } from '../../types';
import { Flame, Droplets } from 'lucide-react';

export const VerticalThermometer: React.FC = () => {
  const { temperature, isParameterMaxed } = useTerraformStore();
  const config = PARAMETER_CONFIGS.temperature;
  const isMax = isParameterMaxed('temperature');

  // -30°C ~ +8°C 단계 생성 (2°C 단위)
  const steps: number[] = [];
  for (let t = config.max; t >= config.min; t -= config.step) {
    steps.push(t);
  }

  // 진척도 백분율 (0 ~ 100%)
  const fillPercent = Math.min(
    100,
    Math.max(0, ((temperature - config.min) / (config.max - config.min)) * 100)
  );

  return (
    <div className="flex flex-col items-center justify-between h-full py-2 px-1 sm:px-2 select-none">
      {/* 최상단 헤더 */}
      <div className="flex items-center gap-1 mb-1 text-[10px] sm:text-xs font-black text-red-400">
        <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
        <span className="hidden xl:inline">온도계</span>
      </div>

      {/* 온도계 본체 튜브 */}
      <div className="relative flex-1 w-9 sm:w-11 bg-space-950/90 rounded-full border-2 border-red-500/40 p-1 flex flex-col justify-end shadow-neon-red overflow-hidden">
        {/* 상승하는 액체 (Fluid) */}
        <div
          className="absolute bottom-0 left-0 right-0 rounded-b-full bg-gradient-to-t from-blue-700 via-purple-600 via-rose-500 to-red-500 transition-all duration-700 ease-out shadow-lg"
          style={{ height: `${fillPercent}%` }}
        >
          {/* 액체 상단 글래스 하이라이트 림 */}
          <div className="w-full h-2 bg-white/40 rounded-full blur-[1px] animate-pulse" />
        </div>

        {/* 눈금선 및 텍스트 레이어 */}
        <div className="relative z-10 flex flex-col justify-between h-full py-1 text-[9px] sm:text-[10px] font-mono font-black">
          {steps.map((temp) => {
            const isCurrent = temp === temperature;
            const isPassed = temp <= temperature;
            const isOceanBonus = temp === 0;

            return (
              <div
                key={temp}
                className="relative flex items-center justify-between px-1 group"
                title={`${temp > 0 ? `+${temp}` : temp}°C`}
              >
                {/* 눈금선 */}
                <div
                  className={`w-1.5 h-0.5 rounded-full ${
                    isPassed ? 'bg-white' : 'bg-slate-600'
                  }`}
                />

                {/* 온도 수치 */}
                <span
                  className={`leading-none font-bold ${
                    isCurrent
                      ? 'text-white scale-125 font-black bg-red-600/80 px-1 rounded shadow-md'
                      : isPassed
                      ? 'text-slate-100'
                      : 'text-slate-500'
                  }`}
                >
                  {temp > 0 ? `+${temp}` : temp}
                </span>

                {/* 0°C 해수면 보너스 뱃지 */}
                {isOceanBonus && (
                  <div className="absolute -left-6 sm:-left-7 bg-cyan-600 text-white p-0.5 rounded-full shadow-neon-cyan" title="0°C 달성 보너스: 바다 타일 1개 무료">
                    <Droplets className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 하단 수은 구 (Mercury Bulb) */}
      <div className="relative -mt-2 w-11 sm:w-13 h-11 sm:h-13 rounded-full bg-gradient-to-tr from-red-700 via-red-500 to-orange-400 p-0.5 shadow-neon-red flex items-center justify-center">
        <div className="w-full h-full rounded-full bg-space-950 flex flex-col items-center justify-center">
          <span className="text-[10px] sm:text-xs font-black text-red-400 font-mono">
            {temperature > 0 ? `+${temperature}` : temperature}°C
          </span>
          <span className="text-[7px] text-slate-400 leading-none">
            {isMax ? 'MAX' : 'TEMP'}
          </span>
        </div>
      </div>
    </div>
  );
};
