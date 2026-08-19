import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Student,
  ActivityLog,
  ParameterType,
  PARAMETER_CONFIGS,
  BASE_TR,
} from '../types';
import { INITIAL_STUDENTS, INITIAL_GROUPS, INITIAL_LOGS } from '../utils/sampleData';
import { triggerParameterConfetti, triggerGrandVictoryConfetti } from '../utils/confetti';
import { soundFX } from '../utils/sound';

interface TerraformState {
  // Global Parameters
  temperature: number; // -30 to 8
  oxygen: number; // 0 to 14
  ocean: number; // 0 to 9

  // Students and Groups
  students: Student[];
  groups: string[];

  // Activity Logs
  logs: ActivityLog[];

  // App Settings / State
  isTeacherMode: boolean;
  isMuted: boolean;
  showVictoryModal: boolean;
  lastMaxedParameter: ParameterType | null;

  // Computed / Getters
  getClassTR: () => number;
  getProgressPercent: (type: ParameterType) => number;
  getTotalProgressPercent: () => number;
  isParameterMaxed: (type: ParameterType) => boolean;
  isFullyTerraformed: () => boolean;

  // Actions
  investParameter: (studentId: string, type: ParameterType) => { success: boolean; message: string };
  adjustStudentCoins: (studentId: string, amount: number, reason: string) => void;
  adjustGroupCoins: (groupName: string, amount: number, reason: string) => void;
  addStudent: (name: string, groupName: string) => void;
  updateStudent: (id: string, name: string, groupName: string) => void;
  deleteStudent: (id: string) => void;
  addGroup: (groupName: string) => void;
  deleteGroup: (groupName: string) => void;
  toggleTeacherMode: () => void;
  setTeacherMode: (enabled: boolean) => void;
  toggleMute: () => void;
  closeVictoryModal: () => void;
  resetAllData: () => void;
  loadSampleData: () => void;
  clearLogs: () => void;
}

export const useTerraformStore = create<TerraformState>()(
  persist(
    (set, get) => ({
      temperature: -28, // Start with 1 step invested in sample
      oxygen: 1, // Start with 1 step invested in sample
      ocean: 0,
      students: INITIAL_STUDENTS,
      groups: INITIAL_GROUPS,
      logs: INITIAL_LOGS,
      isTeacherMode: false,
      isMuted: false,
      showVictoryModal: false,
      lastMaxedParameter: null,

      getClassTR: () => {
        const { temperature, oxygen, ocean } = get();
        const tempSteps = Math.round((temperature - PARAMETER_CONFIGS.temperature.min) / PARAMETER_CONFIGS.temperature.step);
        const oxygenSteps = Math.round((oxygen - PARAMETER_CONFIGS.oxygen.min) / PARAMETER_CONFIGS.oxygen.step);
        const oceanSteps = Math.round((ocean - PARAMETER_CONFIGS.ocean.min) / PARAMETER_CONFIGS.ocean.step);
        return BASE_TR + tempSteps + oxygenSteps + oceanSteps;
      },

      getProgressPercent: (type: ParameterType) => {
        const config = PARAMETER_CONFIGS[type];
        const currentVal = get()[type];
        const percent = ((currentVal - config.min) / (config.max - config.min)) * 100;
        return Math.min(100, Math.max(0, Math.round(percent)));
      },

      getTotalProgressPercent: () => {
        const pTemp = get().getProgressPercent('temperature');
        const pOxy = get().getProgressPercent('oxygen');
        const pOcean = get().getProgressPercent('ocean');
        return Math.round((pTemp + pOxy + pOcean) / 3);
      },

      isParameterMaxed: (type: ParameterType) => {
        const config = PARAMETER_CONFIGS[type];
        return get()[type] >= config.max;
      },

      isFullyTerraformed: () => {
        return (
          get().isParameterMaxed('temperature') &&
          get().isParameterMaxed('oxygen') &&
          get().isParameterMaxed('ocean')
        );
      },

      investParameter: (studentId: string, type: ParameterType) => {
        const state = get();
        const student = state.students.find((s) => s.id === studentId);
        if (!student) {
          soundFX.playErrorSound();
          return { success: false, message: '학생을 찾을 수 없습니다.' };
        }

        const config = PARAMETER_CONFIGS[type];
        const currentValue = state[type];

        if (currentValue >= config.max) {
          soundFX.playErrorSound();
          return { success: false, message: `${config.name} 지수가 이미 최고치(100%)에 도달했습니다!` };
        }

        if (student.coins < config.cost) {
          soundFX.playErrorSound();
          return {
            success: false,
            message: `코인이 부족합니다. (필요: ${config.cost}코인, 보유: ${student.coins}코인)`,
          };
        }

        const nextValue = Math.min(config.max, currentValue + config.step);
        const isNowMaxed = nextValue >= config.max;

        // 업데이트 학생 데이터
        const updatedStudents = state.students.map((s) =>
          s.id === studentId
            ? { ...s, coins: s.coins - config.cost, contributionTR: s.contributionTR + 1 }
            : s
        );

        // 새 로그 생성
        const newLog: ActivityLog = {
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          timestamp: new Date().toISOString(),
          type: 'investment',
          targetName: student.name,
          message: `${student.name} 학생이 [${config.name}]에 ${config.cost}코인을 투자했습니다. (+1 TR)`,
          amount: config.cost,
          parameter: type,
        };

        set({
          [type]: nextValue,
          students: updatedStudents,
          logs: [newLog, ...state.logs],
        });

        // 사운드 및 효과 연출
        soundFX.playInvestSound();

        if (isNowMaxed) {
          setTimeout(() => {
            soundFX.playFanfareSound();
            triggerParameterConfetti(type);
          }, 300);
        }

        // 전체 테라포밍 완료 체크
        setTimeout(() => {
          if (get().isFullyTerraformed()) {
            soundFX.playFanfareSound();
            triggerGrandVictoryConfetti();
            set({ showVictoryModal: true });
          }
        }, 600);

        return {
          success: true,
          message: `성공! ${student.name} 학생이 ${config.cost}코인을 투자하여 ${config.name}이(가) 상승했습니다. (+1 TR)`,
        };
      },

      adjustStudentCoins: (studentId: string, amount: number, reason: string) => {
        const state = get();
        const student = state.students.find((s) => s.id === studentId);
        if (!student) return;

        const newCoins = Math.max(0, student.coins + amount);
        const updatedStudents = state.students.map((s) =>
          s.id === studentId ? { ...s, coins: newCoins } : s
        );

        const isPositive = amount >= 0;
        const newLog: ActivityLog = {
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          timestamp: new Date().toISOString(),
          type: isPositive ? 'reward' : 'penalty',
          targetName: student.name,
          message: `${student.name} 학생에게 ${isPositive ? `+${amount}` : amount} 코인이 ${isPositive ? '지급' : '차감'}되었습니다. (사유: ${reason})`,
          amount: Math.abs(amount),
          reason,
        };

        set({
          students: updatedStudents,
          logs: [newLog, ...state.logs],
        });

        if (isPositive) {
          soundFX.playCoinSound();
        } else {
          soundFX.playErrorSound();
        }
      },

      adjustGroupCoins: (groupName: string, amount: number, reason: string) => {
        const state = get();
        const groupMembers = state.students.filter((s) => s.groupName === groupName);
        if (groupMembers.length === 0) return;

        const updatedStudents = state.students.map((s) => {
          if (s.groupName === groupName) {
            return { ...s, coins: Math.max(0, s.coins + amount) };
          }
          return s;
        });

        const isPositive = amount >= 0;
        const newLog: ActivityLog = {
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          timestamp: new Date().toISOString(),
          type: isPositive ? 'reward' : 'penalty',
          targetName: groupName,
          message: `[${groupName}] 전체 멤버(${groupMembers.length}명)에게 각각 ${isPositive ? `+${amount}` : amount} 코인이 ${isPositive ? '지급' : '차감'}되었습니다. (사유: ${reason})`,
          amount: Math.abs(amount),
          reason,
        };

        set({
          students: updatedStudents,
          logs: [newLog, ...state.logs],
        });

        if (isPositive) {
          soundFX.playCoinSound();
        } else {
          soundFX.playErrorSound();
        }
      },

      addStudent: (name: string, groupName: string) => {
        const state = get();
        const trimmedName = name.trim();
        if (!trimmedName) return;

        const newStudent: Student = {
          id: `std-${Date.now()}`,
          name: trimmedName,
          groupName,
          coins: 10,
          contributionTR: 0,
          avatarSeed: Math.floor(Math.random() * 20) + 1,
        };

        const newLog: ActivityLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'system',
          targetName: trimmedName,
          message: `신규 탐사 대원 [${trimmedName}](${groupName})이(가) 등록되었습니다. (초기 10 코인 지급)`,
        };

        set({
          students: [...state.students, newStudent],
          logs: [newLog, ...state.logs],
        });
      },

      updateStudent: (id: string, name: string, groupName: string) => {
        const state = get();
        const trimmedName = name.trim();
        if (!trimmedName) return;

        const updatedStudents = state.students.map((s) =>
          s.id === id ? { ...s, name: trimmedName, groupName } : s
        );

        set({ students: updatedStudents });
      },

      deleteStudent: (id: string) => {
        const state = get();
        const target = state.students.find((s) => s.id === id);
        if (!target) return;

        const updatedStudents = state.students.filter((s) => s.id !== id);
        const newLog: ActivityLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'system',
          targetName: target.name,
          message: `[${target.name}] 대원이 명단에서 제외되었습니다.`,
        };

        set({
          students: updatedStudents,
          logs: [newLog, ...state.logs],
        });
      },

      addGroup: (groupName: string) => {
        const state = get();
        const trimmed = groupName.trim();
        if (!trimmed || state.groups.includes(trimmed)) return;
        set({ groups: [...state.groups, trimmed] });
      },

      deleteGroup: (groupName: string) => {
        const state = get();
        set({
          groups: state.groups.filter((g) => g !== groupName),
          students: state.students.map((s) =>
            s.groupName === groupName ? { ...s, groupName: '미지정 모둠' } : s
          ),
        });
      },

      toggleTeacherMode: () => {
        set((state) => ({ isTeacherMode: !state.isTeacherMode }));
      },

      setTeacherMode: (enabled: boolean) => {
        set({ isTeacherMode: enabled });
      },

      toggleMute: () => {
        const nextMute = !get().isMuted;
        soundFX.setMuted(nextMute);
        set({ isMuted: nextMute });
      },

      closeVictoryModal: () => {
        set({ showVictoryModal: false });
      },

      resetAllData: () => {
        set({
          temperature: PARAMETER_CONFIGS.temperature.min,
          oxygen: PARAMETER_CONFIGS.oxygen.min,
          ocean: PARAMETER_CONFIGS.ocean.min,
          students: INITIAL_STUDENTS.map((s) => ({ ...s, coins: 10, contributionTR: 0 })),
          logs: [
            {
              id: `log-${Date.now()}`,
              timestamp: new Date().toISOString(),
              type: 'system',
              targetName: '화성 개척 본부',
              message: '모든 글로벌 지수 및 학생 코인이 초기화되었습니다.',
            },
          ],
          showVictoryModal: false,
        });
      },

      loadSampleData: () => {
        set({
          temperature: -24,
          oxygen: 3,
          ocean: 2,
          students: INITIAL_STUDENTS,
          groups: INITIAL_GROUPS,
          logs: INITIAL_LOGS,
          showVictoryModal: false,
        });
      },

      clearLogs: () => {
        set({
          logs: [
            {
              id: `log-${Date.now()}`,
              timestamp: new Date().toISOString(),
              type: 'system',
              targetName: '시스템',
              message: '활동 타임라인 기록이 정리되었습니다.',
            },
          ],
        });
      },
    }),
    {
      name: 'terraforming-class-storage',
    }
  )
);
