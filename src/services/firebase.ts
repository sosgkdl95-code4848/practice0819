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
import { UserDoc, ClassDoc } from '../types';
import { INITIAL_HEX_TILES } from '../utils/mapData';
import { INITIAL_STUDENTS, INITIAL_GROUPS, INITIAL_LOGS } from '../utils/sampleData';

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
 * Firestore users 컬렉션 프로필 동기화
 */
export const syncUserProfileFirestore = async (
  fbUser: { uid: string; email: string | null; displayName: string | null; photoURL: string | null },
  isTeacher: boolean
): Promise<UserDoc> => {
  const role = isTeacher ? 'admin' : 'student';
  const classId = isTeacher
    ? `class_${fbUser.uid.replace(/[^a-zA-Z0-9_-]/g, '_')}`
    : 'class_default';

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
      const updated = { ...data, role: isTeacher ? 'admin' : data.role || role, classId: data.classId || classId };
      await setDoc(userRef, updated, { merge: true });
      return updated;
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
 * 교사 아이디별 독립된 반(Class) 데이터 가져오기 또는 새로 생성
 */
export const getOrCreateTeacherClass = async (
  teacherUid: string,
  teacherEmail: string,
  teacherName: string
): Promise<ClassDoc> => {
  const classId = `class_${teacherUid.replace(/[^a-zA-Z0-9_-]/g, '_')}`;

  const defaultClassDoc: ClassDoc = {
    classId,
    className: `${teacherName} 선생님의 화성 개척반`,
    teacherUid,
    teacherEmail,
    teacherName,
    temperature: -28,
    oxygen: 1,
    ocean: 1,
    greeneryCount: 1,
    cityCount: 1,
    hexTiles: INITIAL_HEX_TILES,
    students: INITIAL_STUDENTS,
    groups: INITIAL_GROUPS,
    logs: INITIAL_LOGS,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (!db) {
    return defaultClassDoc;
  }

  try {
    const classRef = doc(db, 'classes', classId);
    const snap = await getDoc(classRef);

    if (snap.exists()) {
      const data = snap.data() as ClassDoc;
      console.log(`📡 [${classId}] 기존 학급 보드판 데이터를 불러왔습니다.`);
      return data;
    } else {
      await setDoc(classRef, defaultClassDoc);
      console.log(`✨ [${classId}] 새 교사용 독립 화성 보드판이 생성되었습니다.`);
      return defaultClassDoc;
    }
  } catch (err) {
    console.warn('Firestore 반 생성/불러오기 지연:', err);
    return defaultClassDoc;
  }
};

/**
 * Firestore classes 컬렉션 실시간 구독
 */
export const subscribeToClassFirestore = (
  classId: string,
  callback: (data: ClassDoc) => void
): (() => void) => {
  if (!db) return () => {};

  const classRef = doc(db, 'classes', classId);
  return onSnapshot(classRef, (snap: DocumentSnapshot) => {
    if (snap.exists()) {
      const data = snap.data() as ClassDoc;
      callback(data);
    }
  });
};

/**
 * Firestore classes 컬렉션 게임판 업데이트
 */
export const updateClassBoardFirestore = async (classDoc: Partial<ClassDoc> & { classId: string }): Promise<void> => {
  if (!db) return;

  try {
    const classRef = doc(db, 'classes', classDoc.classId);
    await setDoc(
      classRef,
      {
        ...classDoc,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Firestore 보드판 저장 경고:', err);
  }
};
