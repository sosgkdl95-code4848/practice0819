import React, { useState } from 'react';
import { REASON_PRESETS, ReasonPreset, Student } from '../types';
import { useTerraformStore } from '../store/useTerraformStore';
import { X, Gift, AlertTriangle, Sparkles, Check } from 'lucide-react';

interface QuickRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'student' | 'group';
  student?: Student;
  groupName?: string;
}

export const QuickRewardModal: React.FC<QuickRewardModalProps> = ({
  isOpen,
  onClose,
  targetType,
  student,
  groupName,
}) => {
  const { adjustStudentCoins, adjustGroupCoins } = useTerraformStore();

  const [selectedPreset, setSelectedPreset] = useState<ReasonPreset | null>(REASON_PRESETS[0]);
  const [customAmount, setCustomAmount] = useState<number>(2);
  const [customReason, setCustomReason] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);

  if (!isOpen) return null;

  const targetTitle =
    targetType === 'student' ? `${student?.name} (${student?.groupName})` : `[${groupName}] 모둠 전체`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let amount = 0;
    let reason = '';

    if (isCustom) {
      amount = customAmount;
      reason = customReason.trim() || (amount >= 0 ? '기타 보상' : '기타 차감');
    } else if (selectedPreset) {
      amount = selectedPreset.amount;
      reason = selectedPreset.label;
    }

    if (targetType === 'student' && student) {
      adjustStudentCoins(student.id, amount, reason);
    } else if (targetType === 'group' && groupName) {
      adjustGroupCoins(groupName, amount, reason);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-space-900 border border-purple-500/30 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-6 relative overflow-hidden">
        {/* 상단 닫기 */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-space-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 타이틀 */}
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>교사 전용 코인 제어</span>
          </div>
          <h3 className="text-xl font-black text-white">{targetTitle}</h3>
          <p className="text-xs text-slate-400 mt-1">
            사유 프리셋을 선택하거나 직접 입력하여 코인을 지급/차감합니다.
          </p>
        </div>

        {/* 프리셋 선택 탭 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300">사유 프리셋 선택</label>
            <button
              type="button"
              onClick={() => setIsCustom(!isCustom)}
              className="text-xs text-purple-400 hover:underline font-semibold"
            >
              {isCustom ? '프리셋에서 선택' : '직접 입력하기'}
            </button>
          </div>

          {!isCustom ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
              {REASON_PRESETS.map((preset) => {
                const isSelected = selectedPreset?.id === preset.id;
                const isReward = preset.type === 'reward';
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedPreset(preset)}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? isReward
                          ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-neon-emerald scale-[1.02]'
                          : 'bg-rose-950/60 border-rose-500 text-white shadow-neon-red scale-[1.02]'
                        : 'bg-space-800/80 border-white/5 text-slate-300 hover:bg-space-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {isReward ? (
                        <Gift className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      )}
                      <span className="text-xs font-bold truncate">{preset.label}</span>
                    </div>
                    <span
                      className={`text-xs font-black font-mono ml-2 ${
                        isReward ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {preset.amount > 0 ? `+${preset.amount}` : preset.amount}C
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3 bg-space-850 p-4 rounded-2xl border border-white/5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  코인 변동 수량 (양수는 지급, 음수는 차감)
                </label>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(parseInt(e.target.value) || 0)}
                  className="w-full bg-space-800 text-white rounded-xl px-4 py-2.5 border border-white/10 focus:border-purple-500 focus:outline-none text-sm font-mono font-bold"
                  placeholder="예: 3 또는 -2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  지급/차감 사유 입력
                </label>
                <input
                  type="text"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="w-full bg-space-800 text-white rounded-xl px-4 py-2.5 border border-white/10 focus:border-purple-500 focus:outline-none text-sm"
                  placeholder="예: 방과후 특별 미션 수행"
                />
              </div>
            </div>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-space-800 text-slate-300 hover:bg-space-700 transition"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-neon-purple hover:scale-105 transition flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>반영하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
