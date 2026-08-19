import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { isFirebaseConfigured } from '../../services/firebase';
import { FirebaseConfigModal } from './FirebaseConfigModal';
import {
  Rocket,
  ShieldCheck,
  UserCheck,
  Sparkles,
  Globe,
  ChevronRight,
  Flame,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const {
    loginGoogle,
    loginAsDemoTeacher,
    loginAsDemoStudent,
    isAuthenticating,
    error,
  } = useAuthStore();

  const [studentName, setStudentName] = useState('');
  const [studentGroup, setStudentGroup] = useState('1모둠 (아레스)');
  const [showConfigModal, setShowConfigModal] = useState(false);

  const hasFirebase = isFirebaseConfigured();

  const handleCustomStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;
    loginAsDemoStudent(studentName.trim(), studentGroup);
  };

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 flex flex-col justify-between selection:bg-mars-500 selection:text-white relative overflow-hidden">
      {/* 우주 공간 배경 성운 & 별빛 조명 */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(229,62,62,0.15),rgba(0,0,0,0))] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,181,216,0.1),rgba(0,0,0,0))] pointer-events-none" />

      {/* 최상단 미니 헤더 */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-mars-600 to-amber-400 p-0.5 shadow-neon-red flex items-center justify-center">
            <div className="w-full h-full bg-space-950 rounded-[14px] flex items-center justify-center">
              <Rocket className="w-5 h-5 text-mars-500 transform -rotate-45" />
            </div>
          </div>
          <div>
            <span className="font-black text-lg tracking-wider bg-gradient-to-r from-red-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
              TERRAFORMING CLASS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowConfigModal(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              hasFirebase
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-space-850 border-orange-500/40 text-orange-300 hover:bg-space-800 shadow-neon-orange animate-pulse'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>{hasFirebase ? 'Firebase 연결됨' : 'Firebase 키 설정'}</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-semibold">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>학급 경영 미션 컨트롤</span>
          </div>
        </div>
      </header>

      {/* 중앙 메인 로그인 섹션 */}
      <main className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 flex-1 flex flex-col lg:flex-row items-center justify-center gap-12">
        {/* 좌측: 서비스 비전 및 그래픽 */}
        <div className="flex-1 space-y-6 text-center lg:text-left max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-mars-500/10 border border-mars-500/20 text-mars-500 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>화성 개척 게이미피케이션 학급 경영</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            붉은 행성 화성을{' '}
            <span className="bg-gradient-to-r from-red-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
              우리 학급의 무대로!
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            학교 구글 계정으로 로그인하여 나만의 탐사 대원 자원을 관리하고,
            수업 발표와 협력 활동으로 획득한 코인으로 화성 테라포밍 미션에 참여하세요.
          </p>

          {/* 3대 핵심 특징 피처 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
            <div className="p-3.5 rounded-2xl bg-space-900/80 border border-white/10 text-left">
              <div className="text-lg mb-1">🪐</div>
              <div className="font-bold text-xs text-white">91칸 헥사곤 보드</div>
              <div className="text-[11px] text-slate-400 mt-0.5">실시간 타일 개척</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-space-900/80 border border-white/10 text-left">
              <div className="text-lg mb-1">🪙</div>
              <div className="font-bold text-xs text-white">자원 & 코인 관리</div>
              <div className="text-[11px] text-slate-400 mt-0.5">활동 보상 및 투자</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-space-900/80 border border-white/10 text-left">
              <div className="text-lg mb-1">🏆</div>
              <div className="font-bold text-xs text-white">1~100 TR 트랙</div>
              <div className="text-[11px] text-slate-400 mt-0.5">모둠 명예의 전당</div>
            </div>
          </div>
        </div>

        {/* 우측: 구글 로그인 카드 */}
        <div className="w-full max-w-md">
          <div className="rounded-3xl backdrop-blur-2xl bg-gradient-to-b from-space-900/95 via-space-900/90 to-space-950/95 border border-amber-500/30 p-6 sm:p-8 shadow-2xl space-y-6 relative">
            {/* 상단 카드 헤더 */}
            <div className="text-center space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-black text-white">미션 센터 로그인</h2>
              <p className="text-xs text-slate-400">구글 계정으로 접속하면 학급 데이터가 자동 동기화됩니다.</p>
            </div>

            {/* 에러 메시지 알림 */}
            {error && (
              <div className="p-3 rounded-2xl bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* 1. 메인 구글 로그인 버튼 */}
            <button
              onClick={() => loginGoogle()}
              disabled={isAuthenticating}
              className="w-full py-4 px-5 rounded-2xl bg-white hover:bg-slate-100 text-space-950 font-bold text-sm shadow-xl transition-all duration-200 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 group"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>학교 구글 계정으로 시작하기</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-space-900 px-3 text-[11px] text-slate-500 font-semibold absolute">
                또는 실습용 빠른 로그인
              </span>
            </div>

            {/* 2. 교실 수업 실습용 빠른 데모 로그인 버튼 */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => loginAsDemoTeacher('teacher@school.kr')}
                  className="p-3.5 rounded-2xl bg-purple-950/50 hover:bg-purple-900/70 border border-purple-500/40 text-purple-200 text-xs font-bold transition flex items-center justify-center gap-2 hover:scale-[1.02]"
                >
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>선생님(Admin)</span>
                </button>

                <button
                  onClick={() => loginAsDemoStudent('김민준', '1모둠 (아레스)')}
                  className="p-3.5 rounded-2xl bg-space-850 hover:bg-space-800 border border-white/10 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-2 hover:scale-[1.02]"
                >
                  <UserCheck className="w-4 h-4 text-amber-400" />
                  <span>김민준 (대원)</span>
                </button>
              </div>

              {/* 학생 이름 직접 입력 간편 로그인 */}
              <form onSubmit={handleCustomStudentLogin} className="space-y-2 pt-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="학생 이름 입력 (예: 이서연)"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="flex-1 bg-space-800 text-white rounded-xl px-3.5 py-2.5 text-xs border border-white/10 focus:border-amber-500 focus:outline-none"
                  />
                  <select
                    value={studentGroup}
                    onChange={(e) => setStudentGroup(e.target.value)}
                    className="w-32 bg-space-800 text-slate-200 rounded-xl px-2 py-2.5 text-xs border border-white/10 focus:outline-none"
                  >
                    <option value="1모둠 (아레스)">1모둠</option>
                    <option value="2모둠 (헬라스)">2모둠</option>
                    <option value="3모둠 (엘리시움)">3모둠</option>
                    <option value="4모둠 (타르시스)">4모둠</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-space-950 font-bold text-xs shadow-neon-orange transition"
                >
                  이름으로 대원 접속하기
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="relative z-10 py-6 text-center text-xs text-slate-500">
        <p>Terraforming Class • Google Firebase Realtime Authentication System</p>
      </footer>

      {/* Firebase 연동 설정 모달 */}
      <FirebaseConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
      />
    </div>
  );
};
