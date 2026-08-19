import React, { useState } from 'react';
import { useTerraformStore } from '../store/useTerraformStore';
import { PARAMETER_CONFIGS, ParameterType } from '../types';
import {
  Coins,
  TrendingUp,
  User,
  Check,
  AlertCircle,
  Thermometer,
  Wind,
  Droplets,
  Award,
} from 'lucide-react';

export const InvestmentMarket: React.FC = () => {
  const {
    students,
    groups,
    investParameter,
    isParameterMaxed,
  } = useTerraformStore();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    students[0]?.id || ''
  );
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('all');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  const filteredStudents =
    selectedGroupFilter === 'all'
      ? students
      : students.filter((s) => s.groupName === selectedGroupFilter);

  const handleInvest = (type: ParameterType) => {
    if (!selectedStudent) return;
    const result = investParameter(selectedStudent.id, type);
    setFeedback({
      type: result.success ? 'success' : 'error',
      message: result.message,
    });

    // 4초 후 피드백 자동 제거
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  return (
    <section className="rounded-3xl backdrop-blur-xl bg-space-900/90 border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">학생 테라포밍 투자 마켓</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              보유한 학급 코인으로 화성 환경을 개선하고 개인 기여 TR을 올리세요!
            </p>
          </div>
        </div>

        {/* 모둠 필터 칩스 */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setSelectedGroupFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedGroupFilter === 'all'
                ? 'bg-amber-500 text-space-950 shadow-neon-orange font-bold'
                : 'bg-space-800 text-slate-400 hover:text-white'
            }`}
          >
            전체 모둠
          </button>
          {groups.map((group) => (
            <button
              key={group}
              onClick={() => setSelectedGroupFilter(group)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedGroupFilter === group
                  ? 'bg-amber-500 text-space-950 shadow-neon-orange font-bold'
                  : 'bg-space-800 text-slate-400 hover:text-white'
              }`}
            >
              {group.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* 학생 선택 및 상태 카드 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* 학생 선택기 */}
        <div className="lg:col-span-1 space-y-3">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            투자할 대원(학생) 선택
          </label>
          <div className="relative">
            <select
              value={selectedStudent?.id || ''}
              onChange={(e) => {
                setSelectedStudentId(e.target.value);
                setFeedback(null);
              }}
              className="w-full bg-space-800 text-white rounded-2xl px-4 py-3.5 border border-white/10 focus:border-amber-500 focus:outline-none text-sm font-semibold appearance-none cursor-pointer hover:bg-space-700 transition shadow-inner"
            >
              {filteredStudents.map((st) => (
                <option key={st.id} value={st.id} className="bg-space-900 text-white py-2">
                  {st.name} ({st.groupName}) - 🪙 {st.coins}코인 | {st.contributionTR} TR
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              ▼
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span>선택된 모둠 내 대원 수: {filteredStudents.length}명</span>
          </div>
        </div>

        {/* 선택된 학생 상태 대형 뱃지 */}
        {selectedStudent && (
          <div className="lg:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-space-850 to-space-800 border border-amber-500/20 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 p-0.5 flex items-center justify-center shadow-neon-orange">
                <div className="w-full h-full bg-space-900 rounded-[14px] flex items-center justify-center text-xl font-black text-amber-300">
                  {selectedStudent.name.slice(0, 1)}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-white">{selectedStudent.name}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-space-700 text-slate-300 border border-white/10 font-medium">
                    {selectedStudent.groupName}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1">대원 ID: {selectedStudent.id}</div>
              </div>
            </div>

            <div className="flex items-center gap-6 w-full sm:w-auto justify-around sm:justify-end border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0">
              {/* 보유 코인 */}
              <div className="text-center sm:text-right">
                <div className="text-[11px] text-slate-400 font-semibold">보유 코인</div>
                <div className="text-2xl font-black text-amber-300 font-mono flex items-center gap-1">
                  <span>🪙</span>
                  <span>{selectedStudent.coins}</span>
                </div>
              </div>

              <div className="h-8 w-px bg-white/10" />

              {/* 기여 TR */}
              <div className="text-center sm:text-right">
                <div className="text-[11px] text-slate-400 font-semibold">개인 기여 TR</div>
                <div className="text-2xl font-black text-cyan-300 font-mono flex items-center gap-1">
                  <Award className="w-5 h-5 text-cyan-400" />
                  <span>+{selectedStudent.contributionTR}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 투자 피드백 메시지 알림 */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border flex items-center gap-3 animate-fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              : 'bg-red-950/60 border-red-500/40 text-red-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <Check className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
          )}
          <span className="text-sm font-semibold">{feedback.message}</span>
        </div>
      )}

      {/* 3가지 투자 프로젝트 액션 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
        {/* 1. 온도 투자 */}
        {(() => {
          const cfg = PARAMETER_CONFIGS.temperature;
          const isMax = isParameterMaxed('temperature');
          const canAfford = (selectedStudent?.coins || 0) >= cfg.cost;
          return (
            <div className="flex flex-col justify-between p-5 rounded-2xl bg-space-850/80 border border-red-500/20 hover:border-red-500/40 transition shadow-lg space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400">
                  <Thermometer className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-medium">필요 코인</span>
                  <div className="text-lg font-black text-red-400 font-mono">🪙 {cfg.cost}</div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-1">온도 상승 프로젝트</h3>
                <p className="text-xs text-slate-400">온도 +2°C 상승 및 기여 TR +1 획득</p>
              </div>

              <button
                onClick={() => handleInvest('temperature')}
                disabled={isMax || !canAfford || !selectedStudent}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 ${
                  isMax
                    ? 'bg-space-800 text-slate-500 cursor-not-allowed border border-white/5'
                    : canAfford
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-neon-red hover:opacity-95 hover:scale-[1.02] active:scale-95'
                    : 'bg-space-800 text-slate-400 border border-white/5 cursor-not-allowed opacity-60'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>
                  {isMax ? '목표 달성 완료' : canAfford ? '10코인 투자하기' : '코인 부족'}
                </span>
              </button>
            </div>
          );
        })()}

        {/* 2. 산소 투자 */}
        {(() => {
          const cfg = PARAMETER_CONFIGS.oxygen;
          const isMax = isParameterMaxed('oxygen');
          const canAfford = (selectedStudent?.coins || 0) >= cfg.cost;
          return (
            <div className="flex flex-col justify-between p-5 rounded-2xl bg-space-850/80 border border-emerald-500/20 hover:border-emerald-500/40 transition shadow-lg space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Wind className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-medium">필요 코인</span>
                  <div className="text-lg font-black text-emerald-400 font-mono">🪙 {cfg.cost}</div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-1">산소 농도 조성</h3>
                <p className="text-xs text-slate-400">산소 +1% 증가 및 기여 TR +1 획득</p>
              </div>

              <button
                onClick={() => handleInvest('oxygen')}
                disabled={isMax || !canAfford || !selectedStudent}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 ${
                  isMax
                    ? 'bg-space-800 text-slate-500 cursor-not-allowed border border-white/5'
                    : canAfford
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-neon-emerald hover:opacity-95 hover:scale-[1.02] active:scale-95'
                    : 'bg-space-800 text-slate-400 border border-white/5 cursor-not-allowed opacity-60'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>
                  {isMax ? '목표 달성 완료' : canAfford ? '12코인 투자하기' : '코인 부족'}
                </span>
              </button>
            </div>
          );
        })()}

        {/* 3. 해수면 투자 */}
        {(() => {
          const cfg = PARAMETER_CONFIGS.ocean;
          const isMax = isParameterMaxed('ocean');
          const canAfford = (selectedStudent?.coins || 0) >= cfg.cost;
          return (
            <div className="flex flex-col justify-between p-5 rounded-2xl bg-space-850/80 border border-cyan-500/20 hover:border-cyan-500/40 transition shadow-lg space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Droplets className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-medium">필요 코인</span>
                  <div className="text-lg font-black text-cyan-400 font-mono">🪙 {cfg.cost}</div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-1">해수면 타일 건설</h3>
                <p className="text-xs text-slate-400">바다 타일 +1개 건설 및 기여 TR +1 획득</p>
              </div>

              <button
                onClick={() => handleInvest('ocean')}
                disabled={isMax || !canAfford || !selectedStudent}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 ${
                  isMax
                    ? 'bg-space-800 text-slate-500 cursor-not-allowed border border-white/5'
                    : canAfford
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-neon-cyan hover:opacity-95 hover:scale-[1.02] active:scale-95'
                    : 'bg-space-800 text-slate-400 border border-white/5 cursor-not-allowed opacity-60'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>
                  {isMax ? '목표 달성 완료' : canAfford ? '15코인 투자하기' : '코인 부족'}
                </span>
              </button>
            </div>
          );
        })()}
      </div>
    </section>
  );
};
