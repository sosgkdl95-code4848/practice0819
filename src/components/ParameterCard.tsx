import React from 'react';
import { ParameterType, PARAMETER_CONFIGS } from '../types';
import { useTerraformStore } from '../store/useTerraformStore';
import { Thermometer, Wind, Droplets, CheckCircle2, Sparkles } from 'lucide-react';

interface ParameterCardProps {
  type: ParameterType;
}

export const ParameterCard: React.FC<ParameterCardProps> = ({ type }) => {
  const config = PARAMETER_CONFIGS[type];
  const value = useTerraformStore((state) => state[type]);
  const getProgressPercent = useTerraformStore((state) => state.getProgressPercent);
  const isMaxed = useTerraformStore((state) => state.isParameterMaxed(type));

  const percent = getProgressPercent(type);

  // 파라미터별 테마 설정
  const themeConfig = {
    temperature: {
      icon: Thermometer,
      accentColor: 'text-red-400',
      barGradient: 'from-orange-500 via-red-500 to-rose-400',
      glowClass: 'shadow-neon-red',
      badgeBg: 'bg-red-500/20 text-red-400 border-red-500/30',
      bgGlow: 'bg-gradient-to-br from-red-950/30 to-space-900',
      borderGlow: isMaxed ? 'border-red-500/80' : 'border-red-500/20 hover:border-red-500/40',
      indicatorIcon: '🔥',
    },
    oxygen: {
      icon: Wind,
      accentColor: 'text-emerald-400',
      barGradient: 'from-emerald-600 via-teal-400 to-green-300',
      glowClass: 'shadow-neon-emerald',
      badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      bgGlow: 'bg-gradient-to-br from-emerald-950/30 to-space-900',
      borderGlow: isMaxed ? 'border-emerald-500/80' : 'border-emerald-500/20 hover:border-emerald-500/40',
      indicatorIcon: '🌱',
    },
    ocean: {
      icon: Droplets,
      accentColor: 'text-cyan-400',
      barGradient: 'from-blue-600 via-cyan-400 to-sky-300',
      glowClass: 'shadow-neon-cyan',
      badgeBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      bgGlow: 'bg-gradient-to-br from-cyan-950/30 to-space-900',
      borderGlow: isMaxed ? 'border-cyan-500/80' : 'border-cyan-500/20 hover:border-cyan-500/40',
      indicatorIcon: '🌊',
    },
  }[type];

  const Icon = themeConfig.icon;

  return (
    <div
      className={`relative rounded-3xl p-6 backdrop-blur-xl border transition-all duration-300 ${themeConfig.bgGlow} ${themeConfig.borderGlow} hover:scale-[1.02] overflow-hidden group`}
    >
      {/* 백그라운드 원형 블러 효과 */}
      <div
        className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none ${
          type === 'temperature' ? 'bg-red-500' : type === 'oxygen' ? 'bg-emerald-500' : 'bg-cyan-500'
        }`}
      />

      {/* 헤더 섹션 */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl bg-space-800 border border-white/10 ${themeConfig.accentColor} shadow-inner`}>
            <Icon className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              GLOBAL PARAMETER
            </span>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              {config.name}
              <span className="text-sm">{themeConfig.indicatorIcon}</span>
            </h3>
          </div>
        </div>

        {/* 상태 뱃지 */}
        {isMaxed ? (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold animate-pulse">
            <CheckCircle2 className="w-4 h-4" />
            <span>최적화 완료!</span>
          </div>
        ) : (
          <div className={`px-2.5 py-1 rounded-full border text-xs font-semibold ${themeConfig.badgeBg}`}>
            1회당 {config.cost} 코인
          </div>
        )}
      </div>

      {/* 현재 수치 & 진척도 */}
      <div className="flex items-baseline justify-between mb-3">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono">
            {value > 0 && type === 'temperature' ? `+${value}` : value}
          </span>
          <span className="text-lg font-bold text-slate-400">{config.unit}</span>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 font-medium">목표: </span>
          <span className="text-sm font-bold text-slate-200 font-mono">
            {config.max > 0 && type === 'temperature' ? `+${config.max}` : config.max}
            {config.unit}
          </span>
          <span className="ml-2 text-xs font-black text-amber-300">({percent}%)</span>
        </div>
      </div>

      {/* 커스텀 네온 프로그레스 바 */}
      <div className="relative w-full h-4 bg-space-950/80 rounded-full p-0.5 border border-white/10 overflow-hidden mb-4">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${themeConfig.barGradient} ${themeConfig.glowClass} transition-all duration-700 ease-out`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* 해수면 전용 타일 그리드 또는 단계 표시 */}
      {type === 'ocean' ? (
        <div className="grid grid-cols-9 gap-1.5 pt-1">
          {Array.from({ length: 9 }).map((_, idx) => (
            <div
              key={idx}
              className={`h-4 rounded-md transition-all duration-300 flex items-center justify-center text-[10px] font-bold ${
                idx < value
                  ? 'bg-cyan-500 text-space-950 shadow-neon-cyan'
                  : 'bg-space-800 border border-white/5 text-slate-600'
              }`}
            >
              {idx + 1}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>{config.min}{config.unit}</span>
          <span>{Math.round((config.min + config.max) / 2)}{config.unit}</span>
          <span>+{config.max}{config.unit}</span>
        </div>
      )}

      {/* 하단 요약 문구 */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
        <span>단계당 상승폭: +{config.step}{config.unit}</span>
        <span className="flex items-center gap-1 font-semibold text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          투자 보상: +1 TR
        </span>
      </div>
    </div>
  );
};
