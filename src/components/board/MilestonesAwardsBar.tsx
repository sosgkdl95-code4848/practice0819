import React from 'react';
import { useTerraformStore } from '../../store/useTerraformStore';
import { Compass, Trees, Building2, Globe, Shield } from 'lucide-react';

export const MilestonesAwardsBar: React.FC = () => {
  const { getClassTR, greeneryCount, cityCount, ocean } = useTerraformStore();
  const classTR = getClassTR();

  const milestones = [
    { title: '테라포머 (35 TR)', icon: Globe, achieved: classTR >= 35, current: `${classTR}/35 TR` },
    { title: '원예가 (녹지 3개)', icon: Trees, achieved: greeneryCount >= 3, current: `${greeneryCount}/3` },
    { title: '시장 (도시 2개)', icon: Building2, achieved: cityCount >= 2, current: `${cityCount}/2` },
    { title: '해양 탐사 (바다 5개)', icon: Compass, achieved: ocean >= 5, current: `${ocean}/5` },
  ];

  return (
    <div className="w-full bg-gradient-to-r from-[#20182C] via-[#2A1F3D] to-[#20182C] border-t border-amber-500/30 rounded-xl p-2 sm:p-2.5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs select-none">
      {/* 마일스톤 플레이트 헤더 */}
      <div className="flex items-center gap-2 text-amber-300 font-bold uppercase tracking-wider">
        <Shield className="w-4 h-4 text-amber-400" />
        <span className="font-serif text-sm">MILESTONES & AWARDS</span>
      </div>

      {/* 마일스톤 달성 뱃지 리스트 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full md:w-auto">
        {milestones.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition ${
                m.achieved
                  ? 'bg-amber-500/20 border-amber-400/60 text-amber-200 shadow-neon-orange'
                  : 'bg-space-950/60 border-white/5 text-slate-400'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${m.achieved ? 'text-amber-400 animate-bounce' : 'text-slate-500'}`} />
              <div className="min-w-0">
                <div className="font-bold text-[10px] sm:text-[11px] truncate">{m.title}</div>
                <div className="text-[9px] text-slate-400 font-mono">
                  {m.achieved ? '✓ 달성 완료 (+5 VP)' : m.current}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
