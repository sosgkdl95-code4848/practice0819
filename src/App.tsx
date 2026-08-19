import React from 'react';
import { Header } from './components/Header';
import { MarsStatus } from './components/MarsStatus';
import { InvestmentMarket } from './components/InvestmentMarket';
import { Leaderboard } from './components/Leaderboard';
import { ActivityLogs } from './components/ActivityLogs';
import { TeacherPanel } from './components/TeacherPanel';
import { VictoryModal } from './components/VictoryModal';
import { Rocket, Heart } from 'lucide-react';

export const App: React.FC = () => {

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 flex flex-col selection:bg-mars-500 selection:text-white relative overflow-x-hidden">
      {/* 백그라운드 우주 별빛 효과 */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_90%,rgba(229,62,62,0.08),rgba(0,0,0,0))] pointer-events-none" />

      {/* 최상단 네비게이션 헤더 */}
      <Header />

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        {/* 1. 글로벌 마스 상태 현황판 */}
        <MarsStatus />

        {/* 2. 학생 테라포밍 투자 마켓 */}
        <InvestmentMarket />

        {/* 3. 명예의 전당(리더보드) & 실시간 활동 타임라인 2열 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Leaderboard />
          <ActivityLogs />
        </div>

        {/* 4. 교사 관리자 패널 (교사 모드 시 활성화) */}
        <div className="pt-2">
          <TeacherPanel />
        </div>
      </main>

      {/* 푸터 영역 */}
      <footer className="mt-12 border-t border-white/5 bg-space-900/50 backdrop-blur-md py-6 text-center text-xs text-slate-500 space-y-2 relative z-10">
        <div className="flex items-center justify-center gap-2">
          <Rocket className="w-4 h-4 text-mars-500" />
          <span className="font-bold text-slate-400">테라포밍 클래스 (Terraforming Class)</span>
          <span>•</span>
          <span>화성 개척 기반 학급 경영 시스템</span>
        </div>
        <p className="flex items-center justify-center gap-1 text-[11px]">
          Designed for Gamified Classroom Management with <Heart className="w-3 h-3 text-red-500 inline fill-red-500" />
        </p>
      </footer>

      {/* 100% 완료 축하 모달 */}
      <VictoryModal />
    </div>
  );
};

export default App;
