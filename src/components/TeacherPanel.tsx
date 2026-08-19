import React, { useState } from 'react';
import { useTerraformStore } from '../store/useTerraformStore';
import { Student } from '../types';
import { QuickRewardModal } from './QuickRewardModal';
import { StudentModal } from './StudentModal';
import {
  ShieldCheck,
  UserPlus,
  Users,
  Edit2,
  Trash2,
  Gift,
  Coins,
  Search,
} from 'lucide-react';

export const TeacherPanel: React.FC = () => {
  const { students, groups, isTeacherMode, adjustStudentCoins, deleteStudent } =
    useTerraformStore();

  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  // 모달 상태
  const [rewardModalState, setRewardModalState] = useState<{
    isOpen: boolean;
    targetType: 'student' | 'group';
    student?: Student;
    groupName?: string;
  }>({
    isOpen: false,
    targetType: 'student',
  });

  const [studentModalState, setStudentModalState] = useState<{
    isOpen: boolean;
    studentToEdit: Student | null;
  }>({
    isOpen: false,
    studentToEdit: null,
  });

  if (!isTeacherMode) {
    return (
      <div className="rounded-3xl backdrop-blur-xl bg-space-900/40 border border-white/5 p-6 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-space-800 border border-white/5 mx-auto flex items-center justify-center text-slate-500">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-400">교사 관리자 모드가 비활성화되어 있습니다</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          상단 우측의 <strong className="text-purple-400">[교사 모드]</strong> 스위치를 켜면 학생 등록/수정, 코인 사유별 지급 및 일괄 관리 기능을 사용할 수 있습니다.
        </p>
      </div>
    );
  }

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.groupName.toLowerCase().includes(search.toLowerCase());
    const matchesGroup = selectedGroup === 'all' || s.groupName === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  return (
    <section className="rounded-3xl backdrop-blur-xl bg-space-900/90 border border-purple-500/30 p-6 sm:p-8 shadow-2xl space-y-6">
      {/* 헤더 바 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-purple-500/20">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-neon-purple">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">교사 전용 학급 관리 패널</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                ACTIVE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              대원 코인 지급/차감, 사유 태그 관리, 모둠별 일괄 보상 및 학생 명단 관리
            </p>
          </div>
        </div>

        {/* 대원 추가 및 모둠 일괄 버튼 */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setStudentModalState({ isOpen: true, studentToEdit: null })}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-neon-purple hover:scale-105 transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>신규 대원 등록</span>
          </button>
        </div>
      </div>

      {/* 모둠별 빠른 일괄 보상 툴바 */}
      <div className="bg-space-850 p-4 rounded-2xl border border-white/5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <Users className="w-4 h-4 text-purple-400" />
          <span>모둠별 일괄 코인 지급 / 차감</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {groups.map((group) => {
            const memberCount = students.filter((s) => s.groupName === group).length;
            return (
              <div
                key={group}
                className="flex items-center justify-between p-3 rounded-xl bg-space-800/80 border border-white/5 hover:border-purple-500/30 transition"
              >
                <div>
                  <div className="font-bold text-xs text-white">{group}</div>
                  <div className="text-[11px] text-slate-400">{memberCount}명</div>
                </div>
                <button
                  onClick={() =>
                    setRewardModalState({
                      isOpen: true,
                      targetType: 'group',
                      groupName: group,
                    })
                  }
                  className="px-2.5 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-bold transition flex items-center gap-1"
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>일괄 관리</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 검색 및 필터 컨트롤 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="학생 이름 또는 모둠 검색..."
            className="w-full bg-space-800 text-white pl-10 pr-4 py-2 rounded-xl border border-white/10 text-xs focus:border-purple-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setSelectedGroup('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 ${
              selectedGroup === 'all'
                ? 'bg-purple-600 text-white shadow-neon-purple'
                : 'bg-space-800 text-slate-400 hover:text-white'
            }`}
          >
            전체 보기 ({students.length})
          </button>
          {groups.map((grp) => (
            <button
              key={grp}
              onClick={() => setSelectedGroup(grp)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 ${
                selectedGroup === grp
                  ? 'bg-purple-600 text-white shadow-neon-purple'
                  : 'bg-space-800 text-slate-400 hover:text-white'
              }`}
            >
              {grp.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* 학생 테이블 리스트 */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-space-850/60">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-space-800/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="p-3.5 pl-5">대원 정보</th>
              <th className="p-3.5 text-center">보유 코인</th>
              <th className="p-3.5 text-center">기여 TR</th>
              <th className="p-3.5 text-center">원클릭 코인 조정</th>
              <th className="p-3.5 text-center">사유별 지급</th>
              <th className="p-3.5 pr-5 text-right">대원 관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs">
            {filteredStudents.map((st) => (
              <tr key={st.id} className="hover:bg-space-800/50 transition">
                {/* 대원 정보 */}
                <td className="p-3.5 pl-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-space-800 border border-white/10 flex items-center justify-center font-bold text-white shadow-inner">
                      {st.name.slice(0, 1)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white">{st.name}</div>
                      <div className="text-[11px] text-slate-400 font-medium">{st.groupName}</div>
                    </div>
                  </div>
                </td>

                {/* 보유 코인 */}
                <td className="p-3.5 text-center">
                  <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    {st.coins}C
                  </span>
                </td>

                {/* 기여 TR */}
                <td className="p-3.5 text-center">
                  <span className="font-mono font-bold text-cyan-300">+{st.contributionTR} TR</span>
                </td>

                {/* 원클릭 코인 조정 */}
                <td className="p-3.5 text-center">
                  <div className="inline-flex items-center gap-1 bg-space-800 p-1 rounded-xl border border-white/5">
                    <button
                      onClick={() => adjustStudentCoins(st.id, 1, '빠른 지급 (+1)')}
                      className="px-2 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white font-mono font-bold text-[11px] transition"
                      title="+1 코인"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => adjustStudentCoins(st.id, 2, '빠른 지급 (+2)')}
                      className="px-2 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white font-mono font-bold text-[11px] transition"
                      title="+2 코인"
                    >
                      +2
                    </button>
                    <button
                      onClick={() => adjustStudentCoins(st.id, 5, '빠른 지급 (+5)')}
                      className="px-2 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white font-mono font-bold text-[11px] transition"
                      title="+5 코인"
                    >
                      +5
                    </button>
                    <span className="w-px h-4 bg-white/10 mx-0.5" />
                    <button
                      onClick={() => adjustStudentCoins(st.id, -1, '빠른 차감 (-1)')}
                      className="px-2 py-1 rounded-lg bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white font-mono font-bold text-[11px] transition"
                      title="-1 코인"
                    >
                      -1
                    </button>
                    <button
                      onClick={() => adjustStudentCoins(st.id, -2, '빠른 차감 (-2)')}
                      className="px-2 py-1 rounded-lg bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white font-mono font-bold text-[11px] transition"
                      title="-2 코인"
                    >
                      -2
                    </button>
                  </div>
                </td>

                {/* 사유별 지급 모달 버튼 */}
                <td className="p-3.5 text-center">
                  <button
                    onClick={() =>
                      setRewardModalState({
                        isOpen: true,
                        targetType: 'student',
                        student: st,
                      })
                    }
                    className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 font-bold text-xs transition inline-flex items-center gap-1.5"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>사유 선택</span>
                  </button>
                </td>

                {/* 대원 수정/삭제 */}
                <td className="p-3.5 pr-5 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        setStudentModalState({ isOpen: true, studentToEdit: st })
                      }
                      className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-space-800 transition"
                      title="대원 정보 수정"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`정말 '${st.name}' 대원을 삭제하시겠습니까?`)) {
                          deleteStudent(st.id);
                        }
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-space-800 transition"
                      title="대원 삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 모달 연동 */}
      <QuickRewardModal
        isOpen={rewardModalState.isOpen}
        onClose={() => setRewardModalState({ ...rewardModalState, isOpen: false })}
        targetType={rewardModalState.targetType}
        student={rewardModalState.student}
        groupName={rewardModalState.groupName}
      />

      <StudentModal
        isOpen={studentModalState.isOpen}
        onClose={() => setStudentModalState({ ...studentModalState, isOpen: false })}
        studentToEdit={studentModalState.studentToEdit}
      />
    </section>
  );
};
