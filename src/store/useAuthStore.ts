import { create } from 'zustand';
import { UserDoc } from '../types';
import {
  signInWithGoogle,
  logOut,
  isFirebaseConfigured,
  syncUserProfileFirestore,
} from '../services/firebase';
import { soundFX } from '../utils/sound';

interface AuthState {
  currentUser: UserDoc | null;
  isAuthenticating: boolean;
  error: string | null;

  // Actions
  loginGoogle: () => Promise<boolean>;
  loginAsDemoTeacher: (email?: string) => void;
  loginAsDemoStudent: (name: string, groupName: string) => void;
  logoutUser: () => Promise<void>;
  clearError: () => void;
  setUser: (user: UserDoc | null) => void;
}

// persist 미들웨어를 제거하여 첫 접속 시 무조건 LoginPage가 나타나도록 보장
export const useAuthStore = create<AuthState>()((set, get) => ({
  currentUser: null, // 첫 화면은 항상 로그인 페이지
  isAuthenticating: false,
  error: null,

  loginGoogle: async () => {
    set({ isAuthenticating: true, error: null });
    try {
      if (!isFirebaseConfigured()) {
        set({
          error: 'Firebase 환경변수가 설정되지 않아 데모 관리자로 연결합니다.',
          isAuthenticating: false,
        });
        get().loginAsDemoTeacher('teacher@school.kr');
        return true;
      }

      const res = await signInWithGoogle();
      if (!res) {
        set({ isAuthenticating: false });
        return false;
      }

      // 1. 구글 인증 정보로 유저 객체 생성
      const role = res.isTeacher ? 'admin' : 'student';
      const baseUser: UserDoc = {
        uid: res.user.uid,
        email: res.user.email || '',
        displayName: res.user.displayName || (role === 'admin' ? '선생님' : '학생 대원'),
        photoURL: res.user.photoURL || undefined,
        role,
        classId: 'class-mars-01',
        tier: role === 'admin' ? 35 : 20,
        coins: role === 'admin' ? 100 : 20,
        groupName: role === 'admin' ? '교사 관리' : '1모둠 (아레스)',
        createdAt: new Date().toISOString(),
      };

      // 2. 로그인 성공 시 화면을 대시보드로 즉시 전환
      set({ currentUser: baseUser, isAuthenticating: false, error: null });
      soundFX.playCoinSound();

      // 3. 백그라운드에서 Firestore 프로필 동기화
      try {
        const syncedUser = await syncUserProfileFirestore(
          {
            uid: res.user.uid,
            email: res.user.email,
            displayName: res.user.displayName,
            photoURL: res.user.photoURL,
          },
          res.isTeacher
        );
        set({ currentUser: syncedUser });
      } catch (syncErr) {
        console.warn('Firestore 동기화 지연 알림:', syncErr);
      }

      return true;
    } catch (err: unknown) {
      console.error('구글 로그인 오류:', err);
      const message = err instanceof Error ? err.message : '구글 로그인 중 오류가 발생했습니다.';
      set({ error: message, isAuthenticating: false });
      soundFX.playErrorSound();
      return false;
    }
  },

  loginAsDemoTeacher: (email: string = 'teacher@school.kr') => {
    const teacherDoc: UserDoc = {
      uid: `teacher-${Date.now()}`,
      email,
      displayName: '선생님 (관리자)',
      role: 'admin',
      classId: 'class-mars-01',
      tier: 35,
      coins: 100,
      groupName: '교사 관리',
      createdAt: new Date().toISOString(),
    };

    set({ currentUser: teacherDoc, error: null, isAuthenticating: false });
    soundFX.playCoinSound();
  },

  loginAsDemoStudent: (name: string, groupName: string) => {
    const studentDoc: UserDoc = {
      uid: `std-${Date.now()}`,
      email: `${name.toLowerCase()}@school.kr`,
      displayName: name,
      groupName,
      role: 'student',
      classId: 'class-mars-01',
      tier: 20,
      coins: 20,
      createdAt: new Date().toISOString(),
    };

    set({ currentUser: studentDoc, error: null, isAuthenticating: false });
    soundFX.playCoinSound();
  },

  logoutUser: async () => {
    try {
      await logOut();
    } catch (e) {
      console.warn('로그아웃 에러:', e);
    }
    set({ currentUser: null, error: null, isAuthenticating: false });
  },

  clearError: () => {
    set({ error: null });
  },

  setUser: (user: UserDoc | null) => {
    set({ currentUser: user });
  },
}));
