import React, { useState } from 'react';
import { useTerraformStore } from '../../store/useTerraformStore';
import { STANDARD_PROJECTS, ProjectType } from '../../types';
import { User, Check, AlertCircle, Sparkles } from 'lucide-react';

export const StandardProjectsCard: React.FC = () => {
  const { students, investStandardProject, isParameterMaxed } = useTerraformStore();
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  const handleInvest = (type: ProjectType) => {
    if (!selectedStudent) return;
    const result = investStandardProject(selectedStudent.id, type);
    setFeedback({
      type: result.success ? 'success' : 'error',
      message: result.message,
    });
    setTimeout(() => {
      setFeedback(null);
    }, 3500);
  };

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-[#2A2016] via-[#1E1710] to-[#120E0A] border-2 border-amber-500/50 p-3 sm:p-4 shadow-2xl space-y-3 flex flex-col justify-between select-none">
      {/* 골드 플레이트 상단 리벳 & 헤더 */}
      <div className="flex items-center justify-between pb-2 border-b border-amber-500/30">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-amber-400 shadow-sm" />
          <h3 className="text-xs sm:text-sm font-black tracking-wider text-amber-300 uppercase font-serif">
            STANDARD PROJECTS
          </h3>
        </div>
        <span className="text-[10px] text-amber-400/80 font-mono font-bold">표준 프로젝트</span>
      </div>

      {/* 대원 선택 바 */}
      <div className="bg-space-950/80 p-2 rounded-xl border border-amber-500/20 space-y-1">
        <div className="flex items-center justify-between text-[10px] font-bold text-amber-300">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3 text-amber-400" />
            <span>집행 대원</span>
          </span>
          {selectedStudent && (
            <span className="font-mono text-amber-300 font-black">
              🪙 {selectedStudent.coins}C | +{selectedStudent.contributionTR}TR
            </span>
          )}
        </div>
        <select
          value={selectedStudent?.id || ''}
          onChange={(e) => {
            setSelectedStudentId(e.target.value);
            setFeedback(null);
          }}
          className="w-full bg-space-850 text-white rounded-lg px-2 py-1 text-xs font-semibold border border-white/10 focus:border-amber-500 focus:outline-none cursor-pointer"
        >
          {students.map((st) => (
            <option key={st.id} value={st.id} className="bg-space-900 text-white">
              {st.name} ({st.groupName.split(' ')[0]}) - 🪙{st.coins}C
            </option>
          ))}
        </select>
      </div>

      {/* 피드백 메시지 */}
      {feedback && (
        <div
          className={`p-2 rounded-xl text-[11px] font-bold flex items-center gap-1.5 animate-fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
              : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
          }`}
        >
          {feedback.type === 'success' ? (
            <Check className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-rose-400" />
          )}
          <span className="truncate">{feedback.message}</span>
        </div>
      )}

      {/* 5대 표준 프로젝트 골드 버튼 리스트 */}
      <div className="space-y-1.5 flex-1 overflow-y-auto pr-0.5 custom-scrollbar">
        {STANDARD_PROJECTS.map((proj) => {
          const isMax =
            (proj.id === 'temperature' && isParameterMaxed('temperature')) ||
            (proj.id === 'oxygen' && isParameterMaxed('oxygen')) ||
            (proj.id === 'ocean' && isParameterMaxed('ocean'));

          const canAfford = (selectedStudent?.coins || 0) >= proj.cost;

          return (
            <button
              key={proj.id}
              onClick={() => handleInvest(proj.id)}
              disabled={isMax || !canAfford || !selectedStudent}
              className={`w-full p-2 rounded-xl border text-left transition-all duration-200 flex items-center justify-between gap-2 group ${
                isMax
                  ? 'bg-space-950/50 border-white/5 opacity-50 cursor-not-allowed text-slate-500'
                  : canAfford
                  ? 'bg-gradient-to-r from-[#382C1B] via-[#2A1F13] to-[#20170D] border-amber-500/60 hover:border-amber-400 hover:scale-[1.02] active:scale-95 shadow-md'
                  : 'bg-space-900/60 border-white/5 text-slate-400 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base sm:text-lg flex-shrink-0">{proj.icon}</span>
                <div className="min-w-0">
                  <div className="font-black text-[11px] sm:text-xs text-amber-200 truncate group-hover:text-amber-100">
                    {proj.title}
                  </div>
                  <div className="text-[9px] text-amber-400/70 truncate">{proj.effect}</div>
                </div>
              </div>

              <div className="flex-shrink-0 text-right">
                <div
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-black font-mono flex items-center gap-1 ${
                    isMax
                      ? 'bg-space-800 text-slate-500'
                      : canAfford
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-neon-orange'
                      : 'bg-space-800 text-slate-500'
                  }`}
                >
                  <span>🪙</span>
                  <span>{proj.cost}C</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 하단 안내 텍스트 */}
      <div className="pt-1 text-[10px] text-center text-amber-400/60 flex items-center justify-center gap-1 font-serif">
        <Sparkles className="w-3 h-3 text-amber-400" />
        <span>집행 즉시 글로벌 지수 및 TR 반영</span>
      </div>
    </div>
  );
};
