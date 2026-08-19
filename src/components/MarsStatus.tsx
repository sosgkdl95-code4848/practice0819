import React from 'react';
import { useTerraformStore } from '../store/useTerraformStore';
import { ParameterCard } from './ParameterCard';
import { Globe, Award, Sparkles } from 'lucide-react';

export const MarsStatus: React.FC = () => {
  const { getClassTR, getTotalProgressPercent, isFullyTerraformed } = useTerraformStore();
  const classTR = getClassTR();
  const totalProgress = getTotalProgressPercent();
  const fullyTerraformed = isFullyTerraformed();

  return (
    <section className="space-y-6">
      {/* 화성 종합 상태 상단 대시보드 배너 */}
      <div className="relative overflow-hidden rounded-3xl backdrop-blur-2xl bg-gradient-to-r from-space-900 via-space-850 to-space-900 border border-white/10 p-6 sm:p-8 shadow-2xl">
        {/* 화성 배경 일러스트 / 빛나는 원형 */}
        <div className="absolute top-1/2 -right-16 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-br from-mars-500/20 via-orange-500/10 to-transparent blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mars-500/10 border border-mars-500/20 text-mars-500 text-xs font-bold">
              <Globe className="w-3.5 h-3.5" />
              <span>화성 테라포밍 종합 프로젝트</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              붉은 행성을 우리의 새로운 보금자리로
              {fullyTerraformed && <span className="text-xl">🏆</span>}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              학생들이 학급 활동을 통해 획득한 코인을 투자하여 <strong className="text-red-400">온도</strong>,{' '}
              <strong className="text-emerald-400">산소</strong>,{' '}
              <strong className="text-cyan-400">해수면</strong>을 테라포밍합니다. 모든 파라미터가 100%에 도달하면 화성은 인간이 거주 가능한 행성이 됩니다!
            </p>
          </div>

          {/* 종합 진척도 & TR 대형 뱃지 */}
          <div className="w-full lg:w-auto flex flex-row sm:flex-row items-center gap-4 bg-space-950/70 p-4 sm:p-5 rounded-2xl border border-white/10 shadow-inner">
            {/* TR 뱃지 */}
            <div className="flex-1 sm:flex-initial text-center px-4">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>CLASS TR</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-amber-300 font-mono mt-1">
                {classTR}
              </div>
              <div className="text-[10px] text-slate-500">테라포밍 평점</div>
            </div>

            <div className="h-12 w-px bg-white/10" />

            {/* 전체 게이지 */}
            <div className="flex-1 sm:min-w-[180px]">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  종합 완성도
                </span>
                <span className="text-mars-cyan font-mono text-sm">{totalProgress}%</span>
              </div>
              <div className="w-full h-3.5 bg-space-900 rounded-full p-0.5 border border-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 to-cyan-400 transition-all duration-700 shadow-neon-cyan"
                  style={{ width: `${totalProgress}%` }}
                />
              </div>
              <div className="text-[10px] text-right text-slate-400 mt-1">
                {fullyTerraformed ? '🎉 테라포밍 성공!' : '목표: 전 지표 100%'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3대 핵심 글로벌 파라미터 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ParameterCard type="temperature" />
        <ParameterCard type="oxygen" />
        <ParameterCard type="ocean" />
      </div>
    </section>
  );
};
