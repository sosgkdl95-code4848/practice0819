import React, { useState } from 'react';
import { useTerraformStore } from '../store/useTerraformStore';
import { useAuthStore } from '../store/useAuthStore';
import {
  Rocket,
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
  Volume2,
  VolumeX,
  Award,
  LogOut,
  Sparkles,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    isTeacherMode,
    toggleTeacherMode,
    isMuted,
    toggleMute,
    getClassTR,
    loadSampleData,
    resetAllData,
  } = useTerraformStore();

  const { currentUser, logoutUser } = useAuthStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const classTR = getClassTR();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-space-950/85 border-b border-white/10 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* 로고 및 서비스명 */}
        <div className="flex items-center gap-3 min-w-max">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-mars-600 via-mars-orange to-mars-gold p-0.5 shadow-neon-red flex items-center justify-center animate-pulse-slow">
              <div className="w-full h-full bg-space-900 rounded-[14px] flex items-center justify-center">
                <Rocket className="w-6 h-6 text-mars-500 transform -rotate-45" />
              </div>
            </div>
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-mars-cyan rounded-full border-2 border-space-950 animate-ping" />
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-mars-cyan rounded-full border-2 border-space-950" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-wider bg-gradient-to-r from-red-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                TERRAFORMING CLASS
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-mars-500/20 text-mars-500 border border-mars-500/30">
                v1.2
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">화성 개척 학급 경영 미션 컨트롤</p>
          </div>
        </div>

        {/* 중앙 TR 현황 */}
        <div className="hidden md:flex items-center gap-4 bg-space-850/80 px-4 py-2 rounded-2xl border border-white/10 shadow-inner">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">학급 합산 TR</div>
              <div className="text-lg font-black text-amber-300 leading-none flex items-baseline gap-1">
                <span>{classTR}</span>
                <span className="text-xs font-normal text-amber-400/70">TR</span>
              </div>
            </div>
          </div>
        </div>

        {/* 우측 컨트롤 도구들 */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 로그인 유저 프로필 뱃지 */}
          {currentUser && (
            <div className="flex items-center gap-2.5 bg-space-850 pl-3 pr-2 py-1.5 rounded-2xl border border-white/10 shadow-md">
              <div className="text-right">
                <div className="text-xs font-bold text-white leading-tight flex items-center gap-1.5 justify-end">
                  <span>{currentUser.displayName}</span>
                  {currentUser.role === 'admin' ? (
                    <span className="text-[9px] bg-purple-500/30 text-purple-300 border border-purple-500/40 px-1.5 py-0.2 rounded-full font-black">
                      교사
                    </span>
                  ) : (
                    <span className="text-[9px] bg-amber-500/30 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded-full font-black">
                      대원
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-amber-400 font-mono font-bold leading-tight">
                  🪙 {currentUser.coins} 코인 | TR {currentUser.tier}
                </div>
              </div>

              <button
                onClick={() => logoutUser()}
                className="p-2 rounded-xl bg-space-800 text-slate-400 hover:text-rose-400 hover:bg-space-700 transition"
                title="로그아웃 (로그인 화면으로 이동)"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 음소거 토글 */}
          <button
            onClick={toggleMute}
            className={`p-2.5 rounded-xl border transition-all ${
              isMuted
                ? 'bg-space-800 text-slate-500 border-white/5 hover:bg-space-700'
                : 'bg-space-800 text-cyan-400 border-cyan-500/30 hover:bg-space-700 shadow-neon-cyan'
            }`}
            title={isMuted ? '음소거 해제' : '효과음 끄기'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* 샘플 데이터 로드 */}
          <button
            onClick={loadSampleData}
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-space-800 text-slate-300 border border-white/10 hover:bg-space-700 hover:text-white transition-all hover:scale-105"
            title="실습용 기본 데이터 불러오기"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>샘플 데이터</span>
          </button>

          {/* 초기화 버튼 */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-space-800 text-slate-300 border border-white/10 hover:bg-red-950/40 hover:text-red-300 hover:border-red-500/30 transition-all"
            title="데이터 초기화"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-400" />
            <span>초기화</span>
          </button>

          {/* 교사 관리자 모드 스위치 */}
          <button
            onClick={toggleTeacherMode}
            className={`relative flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all duration-300 ${
              isTeacherMode
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400/50 shadow-neon-purple scale-105'
                : 'bg-space-800/90 text-slate-300 border-white/10 hover:bg-space-700 hover:text-white'
            }`}
          >
            {isTeacherMode ? (
              <>
                <ShieldCheck className="w-4 h-4 text-purple-200 animate-bounce" />
                <span>교사 모드</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4 text-slate-400" />
                <span>교사 모드</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 초기화 확인 모달 */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-space-900 border border-red-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <RotateCcw className="w-6 h-6 animate-spin" />
              <h3 className="text-lg font-bold text-white">모든 데이터를 초기화할까요?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              화성 91칸 그리드, 글로벌 지표, 학생 자원이 초기화됩니다.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-space-800 text-slate-300 hover:bg-space-700 transition"
              >
                취소
              </button>
              <button
                onClick={() => {
                  resetAllData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-red-600 text-white hover:bg-red-500 transition shadow-neon-red"
              >
                초기화 진행
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
