export type ParameterType = 'temperature' | 'oxygen' | 'ocean';

export type ProjectType = 'temperature' | 'oxygen' | 'ocean' | 'greenery' | 'city';

export type TileType = 'empty' | 'ocean' | 'greenery' | 'city' | 'reserved_ocean';

export type LogType = 'reward' | 'penalty' | 'investment' | 'system';

export type UserRole = 'admin' | 'student';

export interface UserDoc {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  classId: string;
  tier: number;
  coins: number;
  groupName?: string;
  createdAt: string;
}

export interface ClassDoc {
  classId: string;
  className: string;
  teacherUid: string;
  teacherEmail: string;
  teacherName: string;
  temperature: number;
  oxygen: number;
  ocean: number;
  greeneryCount: number;
  cityCount: number;
  hexTiles: HexTile[];
  students: Student[];
  groups: string[];
  logs: ActivityLog[];
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  name: string;
  groupName: string;
  coins: number;
  contributionTR: number;
  avatarSeed?: number;
  role?: UserRole;
}

export interface GroupSummary {
  groupName: string;
  totalCoins: number;
  groupTR: number;
  memberCount: number;
  students: Student[];
}

export interface HexTile {
  id: number;
  q: number;
  r: number;
  x: number;
  y: number;
  type: TileType;
  label?: string;
  ownerStudentId?: string;
  ownerStudentName?: string;
  placedAt?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: LogType;
  targetName: string;
  message: string;
  amount?: number;
  parameter?: ProjectType;
  reason?: string;
}

export interface ParameterConfig {
  name: string;
  code: ParameterType;
  unit: string;
  min: number;
  max: number;
  step: number;
  cost: number;
  totalSteps: number;
  description: string;
}

export const PARAMETER_CONFIGS: Record<ParameterType, ParameterConfig> = {
  temperature: {
    name: '화성 표면 온도',
    code: 'temperature',
    unit: '°C',
    min: -30,
    max: 8,
    step: 2,
    cost: 10,
    totalSteps: 19,
    description: '1회 투자(10 코인) 시 온도가 2°C 상승하고 기여 TR이 +1 증가합니다.',
  },
  oxygen: {
    name: '대기 산소 농도',
    code: 'oxygen',
    unit: '%',
    min: 0,
    max: 14,
    step: 1,
    cost: 12,
    totalSteps: 14,
    description: '1회 투자(12 코인) 시 산소 농도가 1% 상승하고 기여 TR이 +1 증가합니다.',
  },
  ocean: {
    name: '해수면 타일',
    code: 'ocean',
    unit: '개',
    min: 0,
    max: 9,
    step: 1,
    cost: 15,
    totalSteps: 9,
    description: '1회 투자(15 코인) 시 해수면 타일이 1개 건설되고 기여 TR이 +1 증가합니다.',
  },
};

export interface StandardProjectConfig {
  id: ProjectType;
  title: string;
  subTitle: string;
  cost: number;
  effect: string;
  icon: string;
  color: string;
}

export const STANDARD_PROJECTS: StandardProjectConfig[] = [
  {
    id: 'temperature',
    title: '소행성 충돌 (Asteroid)',
    subTitle: '온도 상승 프로젝트',
    cost: 10,
    effect: '온도 +2°C / TR +1',
    icon: '🌡️',
    color: 'from-orange-500 to-red-600',
  },
  {
    id: 'oxygen',
    title: '대기 방출 (Oxygen)',
    subTitle: '산소 농도 조성',
    cost: 12,
    effect: '산소 +1% / TR +1',
    icon: '💨',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'ocean',
    title: '대수층 개척 (Aquifer)',
    subTitle: '해수면 타일 배치',
    cost: 15,
    effect: '바다 타일 1개 / TR +1',
    icon: '🌊',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'greenery',
    title: '녹지 식생 조성 (Greenery)',
    subTitle: '숲 타일 및 산소 공급',
    cost: 20,
    effect: '녹지 타일 1개 / 산소 +1% / TR +1',
    icon: '🌲',
    color: 'from-green-500 to-emerald-700',
  },
  {
    id: 'city',
    title: '도시 건설 (City)',
    subTitle: '거주 돔 시티 건설',
    cost: 25,
    effect: '도시 타일 1개 / TR +1',
    icon: '🏙️',
    color: 'from-amber-400 to-yellow-600',
  },
];

export const BASE_TR = 20;

export interface ReasonPreset {
  id: string;
  label: string;
  amount: number;
  type: 'reward' | 'penalty';
}

export const REASON_PRESETS: ReasonPreset[] = [
  { id: 'pres-1', label: '적극적인 발표 및 질의응답', amount: 2, type: 'reward' },
  { id: 'pres-2', label: '과제 및 학습지 완벽 제출', amount: 3, type: 'reward' },
  { id: 'pres-3', label: '모둠 협동 및 팀워크 우수', amount: 2, type: 'reward' },
  { id: 'pres-4', label: '학급 환경 정화 및 봉사', amount: 2, type: 'reward' },
  { id: 'pres-5', label: '바른 학습 태도 및 경청', amount: 1, type: 'reward' },
  { id: 'pres-6', label: '특별 기여 / 미션 완료', amount: 5, type: 'reward' },
  { id: 'pres-7', label: '학급 규칙 위반 / 주의', amount: -1, type: 'penalty' },
  { id: 'pres-8', label: '과제 미제출 / 불성실', amount: -2, type: 'penalty' },
  { id: 'pres-9', label: '수업 방해 / 자리 이탈', amount: -2, type: 'penalty' },
];
