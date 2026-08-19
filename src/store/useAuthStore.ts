import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserDoc } from '../types';
import { signInWithGoogle, logOut, isFirebaseConfigured } from '../services/firebase';
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
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null, // 첫 화면이 로그인 페이지가 되도록 기본값 null
      isAuthenticating: false,
      error: null,

      loginGoogle: async () => {
        set({ isAuthenticating: true, error: null });
        try {
          if (!isFirebaseConfigured()) {
            // Firebase 키가 아직 없을 경우 친절한 안내 후 데모 교사로 연결
            set({
              error: 'Firebase 환경변수가 설정되지 않아 로컬 데모 모드로 연결합니다.',
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

          const role = res.isTeacher ? 'admin' : 'student';
          const userDoc: UserDoc = {
            uid: res.user.uid,
            email: res.user.email || '',
            displayName: res.user.displayName || (role === 'admin' ? '김선생님' : '학생 대원'),
            photoURL: res.user.photoURL || undefined,
            role,
            classId: 'class-mars-01',
            tier: 20,
            coins: 20,
            groupName: role === 'admin' ? '교사 관리' : '1모둠 (아레스)',
            createdAt: new Date().toISOString(),
          };

          set({ currentUser: userDoc, isAuthenticating: false });
          soundFX.playCoinSound();
          return true;
        } catch (err: unknown) {
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
          displayName: '김선생님 (관리자)',
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
        await logOut();
        set({ currentUser: null, error: null });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'terraforming-auth-session',
    }
  )
);
