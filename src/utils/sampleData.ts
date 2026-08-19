import { Student, ActivityLog } from '../types';

export const INITIAL_STUDENTS: Student[] = [
  { id: 'std-1', name: '김민준', groupName: '1모둠 (아레스)', coins: 18, contributionTR: 4, avatarSeed: 1 },
  { id: 'std-2', name: '이서연', groupName: '1모둠 (아레스)', coins: 22, contributionTR: 5, avatarSeed: 2 },
  { id: 'std-3', name: '박도윤', groupName: '1모둠 (아레스)', coins: 14, contributionTR: 3, avatarSeed: 3 },
  { id: 'std-4', name: '정예은', groupName: '1모둠 (아레스)', coins: 20, contributionTR: 4, avatarSeed: 4 },

  { id: 'std-5', name: '최시우', groupName: '2모둠 (헬라스)', coins: 16, contributionTR: 3, avatarSeed: 5 },
  { id: 'std-6', name: '강지유', groupName: '2모둠 (헬라스)', coins: 25, contributionTR: 6, avatarSeed: 6 },
  { id: 'std-7', name: '조하준', groupName: '2모둠 (헬라스)', coins: 12, contributionTR: 2, avatarSeed: 7 },
  { id: 'std-8', name: '윤하은', groupName: '2모둠 (헬라스)', coins: 19, contributionTR: 4, avatarSeed: 8 },

  { id: 'std-9', name: '장주원', groupName: '3모둠 (엘리시움)', coins: 30, contributionTR: 7, avatarSeed: 9 },
  { id: 'std-10', name: '임수아', groupName: '3모둠 (엘리시움)', coins: 15, contributionTR: 3, avatarSeed: 10 },
  { id: 'std-11', name: '한지호', groupName: '3모둠 (엘리시움)', coins: 21, contributionTR: 5, avatarSeed: 11 },
  { id: 'std-12', name: '오서아', groupName: '3모둠 (엘리시움)', coins: 17, contributionTR: 3, avatarSeed: 12 },

  { id: 'std-13', name: '신은우', groupName: '4모둠 (타르시스)', coins: 14, contributionTR: 2, avatarSeed: 13 },
  { id: 'std-14', name: '배서윤', groupName: '4모둠 (타르시스)', coins: 26, contributionTR: 6, avatarSeed: 14 },
  { id: 'std-15', name: '송유준', groupName: '4모둠 (타르시스)', coins: 18, contributionTR: 4, avatarSeed: 15 },
  { id: 'std-16', name: '유채원', groupName: '4모둠 (타르시스)', coins: 15, contributionTR: 3, avatarSeed: 16 },
];

export const INITIAL_GROUPS: string[] = [
  '1모둠 (아레스)',
  '2모둠 (헬라스)',
  '3모둠 (엘리시움)',
  '4모둠 (타르시스)',
];

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    type: 'system',
    targetName: '화성 개척 본부',
    message: '테라포밍 클래스 미션이 개시되었습니다. 기본 TR 20점이 부여되었습니다.',
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    type: 'reward',
    targetName: '강지유',
    message: '적극적인 발표 및 질의응답으로 +2 코인을 획득했습니다.',
    amount: 2,
    reason: '적극적인 발표 및 질의응답',
  },
  {
    id: 'log-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    type: 'investment',
    targetName: '장주원',
    message: '화성 표면 온도에 10코인을 투자하여 온도가 2°C 상승하고 기여 TR이 +1 되었습니다.',
    amount: 10,
    parameter: 'temperature',
  },
  {
    id: 'log-4',
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    type: 'investment',
    targetName: '배서윤',
    message: '대기 산소 농도에 12코인을 투자하여 산소가 1% 상승하고 기여 TR이 +1 되었습니다.',
    amount: 12,
    parameter: 'oxygen',
  },
];
