import React from 'react';
import { Header } from './components/Header';
import { TerraformingBoard } from './components/board/TerraformingBoard';
import { Leaderboard } from './components/Leaderboard';
import { ActivityLogs } from './components/ActivityLogs';
import { TeacherPanel } from './components/TeacherPanel';
import { VictoryModal } from './components/VictoryModal';
import { LoginPage } from './components/auth/LoginPage';
import { useAuthStore } from './store/useAuthStore';
import { Rocket, Heart } from 'lucide-react';

export const App: React.FC = () => {
  const { currentUser } = useAuthStore();

  // 로그인하지 않은 상태이면 첫 페이지로 구글 로그인 화면 렌더링
  if (!currentUser) {
    return <LoginPage />;
  }

  // 로그인 후에는 기존의 완벽한 보드게임 판 메인 화면 렌더링
  return (
    <div className="min-h-screen bg-space-950 text-slate-100 flex flex-col selection:bg-mars-500 selection:text-white relative overflow-x-hidden">
      {/* 우주 공간 배경 별빛 및 성운 효과 */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_60%_60%_at_85%_85%,rgba(229,62,62,0.12),rgba(0,0,0,0))] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_15%_65%,rgba(0,181,216,0.08),rgba(0,0,0,0))] pointer-events-none" />

      {/* 최상단 네비게이션 헤더 */}
      <Header />

      {/* 메인 콘텐츠 영역 (보드게임 판 + 리더보드/타임라인 + 교사 관리 패널) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-4 lg:px-6 py-6 space-y-8 relative z-10">
        {/* 1. 실제 보드게임 판 (외곽 TR 트랙 1~100 + 중앙 91칸 화성 헥스 지도 + 산소 아치 + 수직 온도계 + 표준 프로젝트) */}
        <section>
          <TerraformingBoard />
        </section>

        {/* 2. 명예의 전당 (리더보드) & 실시간 활동 타임라인 2열 레이아웃 */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Leaderboard />
          <ActivityLogs />
        </section>

        {/* 3. 교사 전용 학급 관리 패널 */}
        <section className="pt-2">
          <TeacherPanel />
        </section>
      </main>

      {/* 푸터 영역 */}
      <footer className="mt-12 border-t border-white/5 bg-space-900/50 backdrop-blur-md py-6 text-center text-xs text-slate-500 space-y-2 relative z-10">
        <div className="flex items-center justify-center gap-2">
          <Rocket className="w-4 h-4 text-mars-500" />
          <span className="font-bold text-slate-400">TERRAFORMING CLASS</span>
          <span>•</span>
          <span>화성 개척 기반 게이미피케이션 학급 경영 시스템</span>
        </div>
        <p className="flex items-center justify-center gap-1 text-[11px]">
          Designed with <Heart className="w-3 h-3 text-red-500 inline fill-red-500" /> for classroom collaboration
        </p>
      </footer>

      {/* 화성 테라포밍 100% 완료 축하 모달 */}
      <VictoryModal />
    </div>
  );
};

export default App;
