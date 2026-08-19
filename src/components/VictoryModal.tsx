import React from 'react';
import { useTerraformStore } from '../store/useTerraformStore';
import { triggerGrandVictoryConfetti } from '../utils/confetti';
import { Trophy, Sparkles, Award, RotateCcw, X, Rocket } from 'lucide-react';

export const VictoryModal: React.FC = () => {
  const { showVictoryModal, closeVictoryModal, getClassTR, students, resetAllData } =
    useTerraformStore();

  if (!showVictoryModal) return null;

  const classTR = getClassTR();
  const topStudents = [...students]
    .sort((a, b) => b.contributionTR - a.contributionTR)
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fade-in">
      <div className="relative bg-gradient-to-b from-space-850 via-space-900 to-space-950 border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-center space-y-6 overflow-hidden">
        {/* 닫기 버튼 */}
        <button
          onClick={closeVictoryModal}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-space-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 배경 빛나는 효과 */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* 메인 트로피 아이콘 */}
        <div className="relative inline-block">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 p-1 shadow-neon-orange animate-bounce">
            <div className="w-full h-full bg-space-950 rounded-[22px] flex items-center justify-center text-4xl">
              🏆
            </div>
          </div>
          <div className="absolute -top-2 -right-2 p-1.5 rounded-full bg-cyan-500 text-space-950">
            <Rocket className="w-4 h-4" />
          </div>
        </div>

        {/* 축하 문구 */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TERRAFORMING COMPLETED</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            화성 테라포밍 대성공! 🎉
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
            온도(+8°C), 산소(14%), 해수면(9개) 지수가 모두 100%를 달성하여 화성이 인류가 살 수 있는 푸른 행성으로 탈바꿈했습니다!
          </p>
        </div>

        {/* 최종 스코어 및 MVP */}
        <div className="bg-space-850 p-4 rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold border-b border-white/5 pb-2">
            <span>최종 학급 TR</span>
            <span className="text-base font-black text-amber-300 font-mono">
              {classTR} TR
            </span>
          </div>

          <div className="space-y-2 text-left">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>최고 기여 대원 (MVP TOP 3)</span>
            </div>
            <div className="space-y-1.5">
              {topStudents.map((st, idx) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-space-800 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</span>
                    <span className="font-bold text-white">{st.name}</span>
                    <span className="text-[11px] text-slate-400">({st.groupName})</span>
                  </div>
                  <span className="font-mono font-bold text-cyan-300">+{st.contributionTR} TR</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={triggerGrandVictoryConfetti}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-space-950 font-black text-xs shadow-neon-orange transition hover:scale-105 flex items-center justify-center gap-1.5"
          >
            <Trophy className="w-4 h-4" />
            <span>폭죽 다시 터뜨리기 🎊</span>
          </button>
          <button
            onClick={() => {
              if (confirm('새로운 학기/시즌을 위해 모든 지표를 초기화하시겠습니까?')) {
                resetAllData();
              }
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-space-800 hover:bg-space-700 text-slate-300 font-bold text-xs border border-white/10 transition flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>새 시즌 시작 (초기화)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
