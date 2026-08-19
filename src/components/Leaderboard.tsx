import React, { useState } from 'react';
import { useTerraformStore } from '../store/useTerraformStore';
import { Trophy, Users, User, Award } from 'lucide-react';
import { GroupSummary } from '../types';

export const Leaderboard: React.FC = () => {
  const { students, groups } = useTerraformStore();
  const [tab, setTab] = useState<'individual' | 'group'>('individual');
  const [sortBy, setSortBy] = useState<'tr' | 'coins'>('tr');

  // 학생 정렬
  const sortedStudents = [...students].sort((a, b) => {
    if (sortBy === 'tr') {
      if (b.contributionTR !== a.contributionTR) {
        return b.contributionTR - a.contributionTR;
      }
      return b.coins - a.coins;
    }
    if (b.coins !== a.coins) {
      return b.coins - a.coins;
    }
    return b.contributionTR - a.contributionTR;
  });

  // 모둠별 집계 및 정렬
  const groupSummaries: GroupSummary[] = groups.map((groupName) => {
    const groupStudents = students.filter((s) => s.groupName === groupName);
    const totalCoins = groupStudents.reduce((acc, cur) => acc + cur.coins, 0);
    const groupTR = groupStudents.reduce((acc, cur) => acc + cur.contributionTR, 0);
    return {
      groupName,
      totalCoins,
      groupTR,
      memberCount: groupStudents.length,
      students: groupStudents,
    };
  });

  const sortedGroups = groupSummaries.sort((a, b) => {
    if (sortBy === 'tr') {
      if (b.groupTR !== a.groupTR) {
        return b.groupTR - a.groupTR;
      }
      return b.totalCoins - a.totalCoins;
    }
    if (b.totalCoins !== a.totalCoins) {
      return b.totalCoins - a.totalCoins;
    }
    return b.groupTR - a.groupTR;
  });

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-space-950 flex items-center justify-center font-black text-sm shadow-neon-orange">
          🥇
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-400 to-slate-200 text-space-950 flex items-center justify-center font-black text-sm">
          🥈
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-700 to-amber-600 text-white flex items-center justify-center font-black text-sm">
          🥉
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-space-800 text-slate-400 border border-white/5 flex items-center justify-center font-bold text-xs">
        {rank}
      </div>
    );
  };

  return (
    <div className="rounded-3xl backdrop-blur-xl bg-space-900/90 border border-white/10 p-6 shadow-2xl flex flex-col h-[520px]">
      {/* 리더보드 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">화성 개척 명예의 전당</h3>
            <p className="text-xs text-slate-400">최고의 기여도를 자랑하는 대원과 모둠</p>
          </div>
        </div>

        {/* 탭 & 정렬 버튼 */}
        <div className="flex items-center gap-2">
          {/* 탭 토글 */}
          <div className="bg-space-800 p-1 rounded-xl flex items-center border border-white/5">
            <button
              onClick={() => setTab('individual')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                tab === 'individual'
                  ? 'bg-amber-500 text-space-950 shadow-neon-orange'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>개인</span>
            </button>
            <button
              onClick={() => setTab('group')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                tab === 'group'
                  ? 'bg-amber-500 text-space-950 shadow-neon-orange'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>모둠</span>
            </button>
          </div>

          {/* 정렬 기준 */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'tr' | 'coins')}
            className="bg-space-800 text-slate-200 text-xs rounded-xl px-2.5 py-2 border border-white/10 focus:outline-none focus:border-amber-500 font-semibold"
          >
            <option value="tr">기여 TR 순</option>
            <option value="coins">보유 코인 순</option>
          </select>
        </div>
      </div>

      {/* 리더보드 리스트 바디 */}
      <div className="flex-1 overflow-y-auto pr-1 py-3 space-y-2.5 custom-scrollbar">
        {tab === 'individual' ? (
          sortedStudents.map((st, idx) => (
            <div
              key={st.id}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                idx === 0
                  ? 'bg-gradient-to-r from-amber-950/40 via-space-850 to-space-850 border-amber-500/40 shadow-lg'
                  : idx === 1
                  ? 'bg-space-850/90 border-slate-400/30'
                  : idx === 2
                  ? 'bg-space-850/80 border-amber-700/30'
                  : 'bg-space-850/50 border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                {getRankBadge(idx + 1)}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{st.name}</span>
                    {idx === 0 && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500/20 text-amber-300 font-black border border-amber-500/30">
                        MVP
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">{st.groupName}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-right">
                <div>
                  <div className="text-[10px] text-slate-400">기여 TR</div>
                  <div className="text-sm font-black text-cyan-300 font-mono flex items-center justify-end gap-1">
                    <Award className="w-3.5 h-3.5 text-cyan-400" />
                    +{st.contributionTR}
                  </div>
                </div>
                <div className="min-w-[60px]">
                  <div className="text-[10px] text-slate-400">보유 코인</div>
                  <div className="text-sm font-black text-amber-300 font-mono flex items-center justify-end gap-1">
                    <span>🪙</span>
                    {st.coins}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          sortedGroups.map((grp, idx) => (
            <div
              key={grp.groupName}
              className={`p-4 rounded-2xl border transition-all ${
                idx === 0
                  ? 'bg-gradient-to-r from-amber-950/40 via-space-850 to-space-850 border-amber-500/40 shadow-lg'
                  : 'bg-space-850/60 border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {getRankBadge(idx + 1)}
                  <div>
                    <h4 className="font-black text-white text-base">{grp.groupName}</h4>
                    <span className="text-xs text-slate-400">대원 {grp.memberCount}명</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="text-[10px] text-slate-400">모둠 총 기여 TR</div>
                    <div className="text-base font-black text-cyan-300 font-mono flex items-center justify-end gap-1">
                      <Award className="w-4 h-4 text-cyan-400" />
                      +{grp.groupTR}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">모둠 총 코인</div>
                    <div className="text-base font-black text-amber-300 font-mono flex items-center justify-end gap-1">
                      <span>🪙</span>
                      {grp.totalCoins}
                    </div>
                  </div>
                </div>
              </div>

              {/* 모둠 멤버 아바타 리스트 */}
              <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-white/5">
                {grp.students.map((s) => (
                  <span
                    key={s.id}
                    className="px-2 py-0.5 rounded-lg bg-space-800 text-slate-300 text-[11px] font-medium border border-white/5"
                  >
                    {s.name} ({s.coins}C / {s.contributionTR}TR)
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
