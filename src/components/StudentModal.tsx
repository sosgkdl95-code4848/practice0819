import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { useTerraformStore } from '../store/useTerraformStore';
import { X, UserPlus, UserCheck, Plus } from 'lucide-react';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentToEdit?: Student | null;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  studentToEdit,
}) => {
  const { groups, addStudent, updateStudent, addGroup } = useTerraformStore();

  const [name, setName] = useState('');
  const [groupName, setGroupName] = useState(groups[0] || '1모둠');
  const [isAddingNewGroup, setIsAddingNewGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  useEffect(() => {
    if (studentToEdit) {
      setName(studentToEdit.name);
      setGroupName(studentToEdit.groupName);
    } else {
      setName('');
      setGroupName(groups[0] || '1모둠');
    }
    setIsAddingNewGroup(false);
    setNewGroupName('');
  }, [studentToEdit, isOpen, groups]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    let targetGroup = groupName;
    if (isAddingNewGroup && newGroupName.trim()) {
      targetGroup = newGroupName.trim();
      addGroup(targetGroup);
    }

    if (studentToEdit) {
      updateStudent(studentToEdit.id, trimmedName, targetGroup);
    } else {
      addStudent(trimmedName, targetGroup);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-space-900 border border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-space-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400">
            {studentToEdit ? <UserCheck className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-xl font-black text-white">
              {studentToEdit ? '대원 정보 수정' : '신규 대원(학생) 등록'}
            </h3>
            <p className="text-xs text-slate-400">화성 테라포밍 탐사 대원을 관리합니다.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              학생 이름 *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 홍길동"
              className="w-full bg-space-800 text-white rounded-2xl px-4 py-3 border border-white/10 focus:border-purple-500 focus:outline-none text-sm font-semibold"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                소속 모둠 *
              </label>
              <button
                type="button"
                onClick={() => setIsAddingNewGroup(!isAddingNewGroup)}
                className="text-xs text-purple-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3 h-3" />
                <span>{isAddingNewGroup ? '기존 모둠 선택' : '새 모둠 추가'}</span>
              </button>
            </div>

            {!isAddingNewGroup ? (
              <select
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full bg-space-800 text-white rounded-2xl px-4 py-3 border border-white/10 focus:border-purple-500 focus:outline-none text-sm font-semibold"
              >
                {groups.map((grp) => (
                  <option key={grp} value={grp}>
                    {grp}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="예: 5모둠 (올림푸스)"
                className="w-full bg-space-800 text-white rounded-2xl px-4 py-3 border border-purple-500/50 focus:border-purple-500 focus:outline-none text-sm font-semibold"
              />
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-space-800 text-slate-300 hover:bg-space-700 transition"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-neon-purple transition hover:scale-105"
            >
              {studentToEdit ? '수정 완료' : '등록 완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
