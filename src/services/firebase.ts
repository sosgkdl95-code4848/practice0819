import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  Auth,
  User as FirebaseUser,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  DocumentSnapshot,
} from 'firebase/firestore';
import { UserDoc, HexTile } from '../types';

export interface FirebaseConfigParams {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// 1. .env 환경변수 또는 브라우저 로컬스토리지에 저장된 설정 불러오기
const getInitialConfig = (): FirebaseConfigParams => {
  const localSaved = localStorage.getItem('terraforming_firebase_config');
  if (localSaved) {
    try {
      return JSON.parse(localSaved);
    } catch {
      // ignore
    }
  }

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  };
};

export const ADMIN_EMAILS: string[] = (
  import.meta.env.VITE_ADMIN_EMAILS || 'tmdcjf@asan.cnees.kr,dbghwns@asan.cnees.kr,teacher@school.kr'
)
  .split(',')
  .map((e: string) => e.trim().toLowerCase())
  .filter(Boolean);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

let currentConfig = getInitialConfig();

export const isFirebaseConfigured = (): boolean => {
  return Boolean(currentConfig.apiKey && currentConfig.projectId);
};

export const initFirebase = (config: FirebaseConfigParams = currentConfig) => {
  if (!config.apiKey || !config.projectId) return;

  try {
    currentConfig = config;
    app = getApps().length === 0 ? initializeApp(config) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('🔥 Firebase 초기화 완료 (Project:', config.projectId, ')');
  } catch (error) {
    console.error('Firebase 초기화 실패:', error);
  }
};

if (isFirebaseConfigured()) {
  initFirebase(currentConfig);
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * 학교 구글 계정으로 로그인 (Firebase Auth)
 */
export const signInWithGoogle = async (): Promise<{ user: FirebaseUser; isTeacher: boolean } | null> => {
  if (!auth) {
    throw new Error('Firebase Auth가 초기화되지 않았습니다.');
  }
  const result = await signInWithPopup(auth, googleProvider);
  const email = (result.user.email || '').toLowerCase();
  const isTeacher = ADMIN_EMAILS.some((admin) => admin && (email === admin || email.includes(admin)));
  return { user: result.user, isTeacher };
};

/**
 * Auth 상태 변경 실시간 구독
 */
export const subscribeToAuth = (
  callback: (user: FirebaseUser | null, isTeacher: boolean) => void
): (() => void) => {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      const email = (user.email || '').toLowerCase();
      const isTeacher = ADMIN_EMAILS.some((admin) => admin && (email === admin || email.includes(admin)));
      callback(user, isTeacher);
    } else {
      callback(null, false);
    }
  });
};

/**
 * 로그아웃
 */
export const logOut = async (): Promise<void> => {
  if (auth) {
    await signOut(auth);
  }
};

/**
 * Firestore users 컬렉션 프로필 동기화 (에러 발생 시에도 안전하게 유저 객체 반환)
 */
export const syncUserProfileFirestore = async (
  fbUser: { uid: string; email: string | null; displayName: string | null; photoURL: string | null },
  isTeacher: boolean,
  classId: string = 'class-mars-01'
): Promise<UserDoc> => {
  const role = isTeacher ? 'admin' : 'student';

  const defaultUserDoc: UserDoc = {
    uid: fbUser.uid,
    email: fbUser.email || '',
    displayName: fbUser.displayName || (role === 'admin' ? '선생님' : '학생 대원'),
    photoURL: fbUser.photoURL || undefined,
    role,
    classId,
    tier: role === 'admin' ? 35 : 20,
    coins: role === 'admin' ? 100 : 20,
    groupName: role === 'admin' ? '교사 관리' : '1모둠 (아레스)',
    createdAt: new Date().toISOString(),
  };

  if (!db) {
    return defaultUserDoc;
  }

  try {
    const userRef = doc(db, 'users', fbUser.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      const data = snap.data() as UserDoc;
      return { ...data, role: isTeacher ? 'admin' : data.role || role };
    } else {
      await setDoc(userRef, defaultUserDoc);
      return defaultUserDoc;
    }
  } catch (err) {
    console.warn('Firestore 접근 지연 / 로컬 프로필로 우선 연결:', err);
    return defaultUserDoc;
  }
};

/**
 * Firestore classes 컬렉션 실시간 구독
 */
export const subscribeToClassFirestore = (
  classId: string,
  callback: (data: { map: HexTile[]; globalParameters: { oxygen: number; temperature: number; oceans: number } }) => void
): (() => void) => {
  if (!db) return () => {};

  const classRef = doc(db, 'classes', classId);
  return onSnapshot(classRef, (snap: DocumentSnapshot) => {
    if (snap.exists()) {
      const data = snap.data() as { map: HexTile[]; globalParameters: { oxygen: number; temperature: number; oceans: number } };
      callback(data);
    }
  });
};

/**
 * Firestore classes 컬렉션 게임판 업데이트
 */
export const updateClassBoardFirestore = async (
  classId: string,
  map: HexTile[],
  globalParameters: { oxygen: number; temperature: number; oceans: number }
): Promise<void> => {
  if (!db) return;

  try {
    const classRef = doc(db, 'classes', classId);
    await setDoc(
      classRef,
      {
        classId,
        map,
        globalParameters,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Firestore 보드판 저장 경고:', err);
  }
};
