import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Student,
  ActivityLog,
  ParameterType,
  ProjectType,
  TileType,
  HexTile,
  PARAMETER_CONFIGS,
  STANDARD_PROJECTS,
  BASE_TR,
} from '../types';
import { INITIAL_STUDENTS, INITIAL_GROUPS, INITIAL_LOGS } from '../utils/sampleData';
import { INITIAL_HEX_TILES } from '../utils/mapData';
import { triggerParameterConfetti, triggerGrandVictoryConfetti } from '../utils/confetti';
import { soundFX } from '../utils/sound';

interface TerraformState {
  // Global Parameters
  temperature: number; // -30 to 8
  oxygen: number; // 0 to 14
  ocean: number; // 0 to 9
  greeneryCount: number;
  cityCount: number;

  // Board Map State
  hexTiles: HexTile[];

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
  investStandardProject: (studentId: string, projectType: ProjectType) => { success: boolean; message: string };
  investParameter: (studentId: string, type: ParameterType) => { success: boolean; message: string };
  placeTile: (tileId: number, tileType: TileType, studentId?: string) => void;
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
      temperature: -28,
      oxygen: 1,
      ocean: 1,
      greeneryCount: 1,
      cityCount: 1,
      hexTiles: (() => {
        // 초기 샘플 타일 몇 개 활성화
        const tiles = [...INITIAL_HEX_TILES];
        // 1개 바다, 1개 녹지, 1개 도시
        const oceanSpot = tiles.find((t) => t.type === 'reserved_ocean');
        if (oceanSpot) {
          oceanSpot.type = 'ocean';
          oceanSpot.ownerStudentName = '장주원';
        }
        const emptySpot1 = tiles.find((t) => t.type === 'empty' && (t.label?.includes('Tharsis') || t.label?.includes('Olympus')));
        if (emptySpot1) {
          emptySpot1.type = 'greenery';
          emptySpot1.ownerStudentName = '배서윤';
        }
        const emptySpot2 = tiles.find((t) => t.type === 'empty' && t.label?.includes('Noctis'));
        if (emptySpot2) {
          emptySpot2.type = 'city';
          emptySpot2.ownerStudentName = '강지유';
        }
        return tiles;
      })(),
      students: INITIAL_STUDENTS,
      groups: INITIAL_GROUPS,
      logs: INITIAL_LOGS,
      isTeacherMode: false,
      isMuted: false,
      showVictoryModal: false,
      lastMaxedParameter: null,

      getClassTR: () => {
        const { temperature, oxygen, ocean, greeneryCount, cityCount } = get();
        const tempSteps = Math.round((temperature - PARAMETER_CONFIGS.temperature.min) / PARAMETER_CONFIGS.temperature.step);
        const oxygenSteps = Math.round((oxygen - PARAMETER_CONFIGS.oxygen.min) / PARAMETER_CONFIGS.oxygen.step);
        const oceanSteps = Math.round((ocean - PARAMETER_CONFIGS.ocean.min) / PARAMETER_CONFIGS.ocean.step);
        return BASE_TR + tempSteps + oxygenSteps + oceanSteps + Math.floor(greeneryCount / 2) + Math.floor(cityCount / 2);
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

      investStandardProject: (studentId: string, projectType: ProjectType) => {
        const state = get();
        const student = state.students.find((s) => s.id === studentId);
        if (!student) {
          soundFX.playErrorSound();
          return { success: false, message: '학생을 선택해 주세요.' };
        }

        const project = STANDARD_PROJECTS.find((p) => p.id === projectType);
        if (!project) return { success: false, message: '유효하지 않은 프로젝트입니다.' };

        if (student.coins < project.cost) {
          soundFX.playErrorSound();
          return {
            success: false,
            message: `코인이 부족합니다! (필요: ${project.cost}C, 보유: ${student.coins}C)`,
          };
        }

        // 개별 프로젝트 로직
        let newTemp = state.temperature;
        let newOxy = state.oxygen;
        let newOcean = state.ocean;
        let newGreenery = state.greeneryCount;
        let newCity = state.cityCount;
        const newTiles = [...state.hexTiles];

        if (projectType === 'temperature') {
          if (state.temperature >= PARAMETER_CONFIGS.temperature.max) {
            soundFX.playErrorSound();
            return { success: false, message: '온도가 이미 최고치(+8°C)에 도달했습니다!' };
          }
          newTemp = Math.min(PARAMETER_CONFIGS.temperature.max, state.temperature + 2);
        } else if (projectType === 'oxygen') {
          if (state.oxygen >= PARAMETER_CONFIGS.oxygen.max) {
            soundFX.playErrorSound();
            return { success: false, message: '산소 농도가 이미 최고치(14%)에 도달했습니다!' };
          }
          newOxy = Math.min(PARAMETER_CONFIGS.oxygen.max, state.oxygen + 1);
        } else if (projectType === 'ocean') {
          if (state.ocean >= PARAMETER_CONFIGS.ocean.max) {
            soundFX.playErrorSound();
            return { success: false, message: '해수면 타일이 이미 최대(9개) 배치되었습니다!' };
          }
          newOcean = state.ocean + 1;
          // 빈 바다 예약 슬롯 또는 일반 빈 슬롯 탐색
          const targetTile = newTiles.find((t) => t.type === 'reserved_ocean') || newTiles.find((t) => t.type === 'empty');
          if (targetTile) {
            targetTile.type = 'ocean';
            targetTile.ownerStudentId = student.id;
            targetTile.ownerStudentName = student.name;
            targetTile.placedAt = new Date().toISOString();
          }
        } else if (projectType === 'greenery') {
          newGreenery = state.greeneryCount + 1;
          if (newOxy < PARAMETER_CONFIGS.oxygen.max) {
            newOxy = Math.min(PARAMETER_CONFIGS.oxygen.max, newOxy + 1);
          }
          const targetTile = newTiles.find((t) => t.type === 'empty');
          if (targetTile) {
            targetTile.type = 'greenery';
            targetTile.ownerStudentId = student.id;
            targetTile.ownerStudentName = student.name;
            targetTile.placedAt = new Date().toISOString();
          }
        } else if (projectType === 'city') {
          newCity = state.cityCount + 1;
          const targetTile = newTiles.find((t) => t.type === 'empty');
          if (targetTile) {
            targetTile.type = 'city';
            targetTile.ownerStudentId = student.id;
            targetTile.ownerStudentName = student.name;
            targetTile.placedAt = new Date().toISOString();
          }
        }

        // 학생 코인 차감 및 TR 상승
        const updatedStudents = state.students.map((s) =>
          s.id === studentId
            ? { ...s, coins: s.coins - project.cost, contributionTR: s.contributionTR + 1 }
            : s
        );

        const newLog: ActivityLog = {
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          timestamp: new Date().toISOString(),
          type: 'investment',
          targetName: student.name,
          message: `${student.name} 대원이 [${project.title}]에 ${project.cost}코인을 집행했습니다. (${project.effect})`,
          amount: project.cost,
          parameter: projectType,
        };

        set({
          temperature: newTemp,
          oxygen: newOxy,
          ocean: newOcean,
          greeneryCount: newGreenery,
          cityCount: newCity,
          hexTiles: newTiles,
          students: updatedStudents,
          logs: [newLog, ...state.logs],
        });

        soundFX.playInvestSound();

        // 파라미터 달성 폭죽 체크
        if (projectType === 'temperature' && newTemp >= PARAMETER_CONFIGS.temperature.max) {
          setTimeout(() => triggerParameterConfetti('temperature'), 200);
        } else if ((projectType === 'oxygen' || projectType === 'greenery') && newOxy >= PARAMETER_CONFIGS.oxygen.max) {
          setTimeout(() => triggerParameterConfetti('oxygen'), 200);
        } else if (projectType === 'ocean' && newOcean >= PARAMETER_CONFIGS.ocean.max) {
          setTimeout(() => triggerParameterConfetti('ocean'), 200);
        }

        // 전체 테라포밍 성공 체크
        setTimeout(() => {
          if (get().isFullyTerraformed()) {
            soundFX.playFanfareSound();
            triggerGrandVictoryConfetti();
            set({ showVictoryModal: true });
          }
        }, 500);

        return {
          success: true,
          message: `[${project.title}] 완료! ${student.name} 대원에게 TR +1점이 부여되었습니다.`,
        };
      },

      investParameter: (studentId: string, type: ParameterType) => {
        return get().investStandardProject(studentId, type);
      },

      placeTile: (tileId: number, tileType: TileType, studentId?: string) => {
        const state = get();
        const student = studentId ? state.students.find((s) => s.id === studentId) : undefined;
        const updatedTiles = state.hexTiles.map((t) =>
          t.id === tileId
            ? {
                ...t,
                type: tileType,
                ownerStudentId: student?.id,
                ownerStudentName: student?.name,
                placedAt: new Date().toISOString(),
              }
            : t
        );
        set({ hexTiles: updatedTiles });
        soundFX.playInvestSound();
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
          greeneryCount: 0,
          cityCount: 0,
          hexTiles: INITIAL_HEX_TILES,
          students: INITIAL_STUDENTS.map((s) => ({ ...s, coins: 10, contributionTR: 0 })),
          logs: [
            {
              id: `log-${Date.now()}`,
              timestamp: new Date().toISOString(),
              type: 'system',
              targetName: '화성 개척 본부',
              message: '모든 글로벌 지수, 화성 타일 및 학생 코인이 초기화되었습니다.',
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
          greeneryCount: 3,
          cityCount: 2,
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
