import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  Auth,
  User as FirebaseUser,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

export const ADMIN_EMAILS: string[] = (
  import.meta.env.VITE_ADMIN_EMAILS || 'teacher@school.kr,admin@school.kr,teacher@gmail.com'
)
  .split(',')
  .map((e: string) => e.trim().toLowerCase());

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

export const isFirebaseConfigured = (): boolean => {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
};

if (isFirebaseConfigured()) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
  } catch (error) {
    console.warn('Firebase 초기화 알림 (데모 지원 모드 활성화):', error);
  }
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * 학교 구글 계정으로 로그인
 */
export const signInWithGoogle = async (): Promise<{ user: FirebaseUser; isTeacher: boolean } | null> => {
  if (!auth) {
    return null;
  }
  const result = await signInWithPopup(auth, googleProvider);
  const email = (result.user.email || '').toLowerCase();
  const isTeacher = ADMIN_EMAILS.includes(email);
  return { user: result.user, isTeacher };
};

/**
 * 로그아웃
 */
export const logOut = async (): Promise<void> => {
  if (auth) {
    await signOut(auth);
  }
};
