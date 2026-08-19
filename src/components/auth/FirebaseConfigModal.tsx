import React, { useState } from 'react';
import { initFirebase, isFirebaseConfigured, FirebaseConfigParams } from '../../services/firebase';
import { Check, X, Flame, AlertCircle } from 'lucide-react';
import { soundFX } from '../../utils/sound';

interface FirebaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseConfigModal: React.FC<FirebaseConfigModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [authDomain, setAuthDomain] = useState('');
  const [projectId, setProjectId] = useState('');
  const [storageBucket, setStorageBucket] = useState('');
  const [messagingSenderId, setMessagingSenderId] = useState('');
  const [appId, setAppId] = useState('');
  const [rawJson, setRawJson] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePasteJson = () => {
    try {
      // Firebase 콘솔에서 복사한 객체(JSON 또는 JS Object 형식) 파싱 지원
      let text = rawJson.trim();
      if (text.startsWith('const firebaseConfig =')) {
        text = text.replace('const firebaseConfig =', '').replace(/;$/, '').trim();
      }
      // JSON 호환을 위해 키에 따옴표 붙이기
      const formatted = text.replace(/([a-zA-Z0-9_]+)\s*:/g, '"$1":');
      const parsed = JSON.parse(formatted);

      if (parsed.apiKey) setApiKey(parsed.apiKey);
      if (parsed.authDomain) setAuthDomain(parsed.authDomain);
      if (parsed.projectId) setProjectId(parsed.projectId);
      if (parsed.storageBucket) setStorageBucket(parsed.storageBucket);
      if (parsed.messagingSenderId) setMessagingSenderId(parsed.messagingSenderId);
      if (parsed.appId) setAppId(parsed.appId);
      setRawJson('');
    } catch {
      alert('올바른 Firebase 설정 객체 형식이 아닙니다. 각 항목에 직접 입력해 주세요.');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey || !projectId) {
      alert('API Key와 Project ID는 필수 입력값입니다.');
      return;
    }

    const config: FirebaseConfigParams = {
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim(),
      projectId: projectId.trim(),
      storageBucket: storageBucket.trim(),
      messagingSenderId: messagingSenderId.trim(),
      appId: appId.trim(),
    };

    initFirebase(config);
    soundFX.playCoinSound();
    setSaveSuccess(true);

    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
      window.location.reload(); // 새 설정 적용을 위한 리로드
    }, 1000);
  };

  const configured = isFirebaseConfigured();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="bg-space-900 border border-orange-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 헤더 */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">Firebase 연동 설정</h3>
            <p className="text-xs text-slate-400">Firebase 콘솔에서 발급받은 웹 앱 설정값을 등록합니다.</p>
          </div>
        </div>

        {/* 현재 상태 */}
        <div className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
          configured
            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
            : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
        }`}>
          {configured ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-amber-400" />}
          <span>{configured ? 'Firebase 연동이 활성화되어 있습니다.' : '아직 Firebase 설정이 등록되지 않았습니다.'}</span>
        </div>

        {/* 콘솔 객체 일괄 붙여넣기 */}
        <div className="bg-space-850 p-4 rounded-2xl border border-white/5 space-y-2">
          <label className="block text-xs font-bold text-slate-300">
            Firebase 콘솔 설정 객체 전체 붙여넣기
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="const firebaseConfig = { apiKey: ... } 붙여넣기"
              value={rawJson}
              onChange={(e) => setRawJson(e.target.value)}
              className="flex-1 bg-space-800 text-white rounded-xl px-3 py-2 text-xs border border-white/10 focus:outline-none"
            />
            <button
              type="button"
              onClick={handlePasteJson}
              className="px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition"
            >
              자동 파싱
            </button>
          </div>
        </div>

        {/* 개별 입력 폼 */}
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">API Key *</label>
            <input
              type="text"
              required
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-space-800 text-white rounded-xl px-3 py-2 text-xs border border-white/10 focus:border-orange-500 focus:outline-none font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Project ID *</label>
              <input
                type="text"
                required
                placeholder="my-mars-class"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-space-800 text-white rounded-xl px-3 py-2 text-xs border border-white/10 focus:border-orange-500 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Auth Domain</label>
              <input
                type="text"
                placeholder="my-mars-class.firebaseapp.com"
                value={authDomain}
                onChange={(e) => setAuthDomain(e.target.value)}
                className="w-full bg-space-800 text-white rounded-xl px-3 py-2 text-xs border border-white/10 focus:border-orange-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Storage Bucket</label>
              <input
                type="text"
                placeholder="my-mars-class.appspot.com"
                value={storageBucket}
                onChange={(e) => setStorageBucket(e.target.value)}
                className="w-full bg-space-800 text-white rounded-xl px-3 py-2 text-xs border border-white/10 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">App ID</label>
              <input
                type="text"
                placeholder="1:123456789:web:abcdef"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                className="w-full bg-space-800 text-white rounded-xl px-3 py-2 text-xs border border-white/10 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">Messaging Sender ID</label>
            <input
              type="text"
              placeholder="123456789012"
              value={messagingSenderId}
              onChange={(e) => setMessagingSenderId(e.target.value)}
              className="w-full bg-space-800 text-white rounded-xl px-3 py-2 text-xs border border-white/10 focus:outline-none font-mono"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-space-800 text-slate-300"
            >
              닫기
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-neon-orange transition hover:scale-105"
            >
              {saveSuccess ? '저장 완료! 새로고침 중...' : '설정 저장 및 연동'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
