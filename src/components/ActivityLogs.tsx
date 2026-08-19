import React, { useState } from 'react';
import { useTerraformStore } from '../store/useTerraformStore';
import { LogType } from '../types';
import { History, TrendingUp, Gift, AlertTriangle, Info, Trash2 } from 'lucide-react';

export const ActivityLogs: React.FC = () => {
  const { logs, clearLogs } = useTerraformStore();
  const [filter, setFilter] = useState<LogType | 'all'>('all');

  const filteredLogs = filter === 'all' ? logs : logs.filter((l) => l.type === filter);

  const getLogIcon = (type: LogType) => {
    switch (type) {
      case 'reward':
        return <Gift className="w-4 h-4 text-emerald-400" />;
      case 'penalty':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'investment':
        return <TrendingUp className="w-4 h-4 text-cyan-400" />;
      case 'system':
      default:
        return <Info className="w-4 h-4 text-purple-400" />;
    }
  };

  const getLogBadge = (type: LogType) => {
    switch (type) {
      case 'reward':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            코인 지급
          </span>
        );
      case 'penalty':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            코인 차감
          </span>
        );
      case 'investment':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            테라포밍 투자
          </span>
        );
      case 'system':
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            시스템
          </span>
        );
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="rounded-3xl backdrop-blur-xl bg-space-900/90 border border-white/10 p-6 shadow-2xl flex flex-col h-[520px]">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">실시간 활동 타임라인</h3>
            <p className="text-xs text-slate-400">학급 코인 변동 및 테라포밍 투자 기록</p>
          </div>
        </div>

        {/* 로그 지우기 버튼 */}
        <button
          onClick={clearLogs}
          className="self-end sm:self-auto p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-space-800 transition"
          title="로그 기록 비우기"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* 필터 칩 */}
      <div className="flex items-center gap-1.5 py-3 border-b border-white/5 overflow-x-auto">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition flex-shrink-0 ${
            filter === 'all'
              ? 'bg-purple-600 text-white shadow-neon-purple'
              : 'bg-space-800 text-slate-400 hover:text-white'
          }`}
        >
          전체 ({logs.length})
        </button>
        <button
          onClick={() => setFilter('investment')}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition flex-shrink-0 ${
            filter === 'investment'
              ? 'bg-cyan-600 text-white shadow-neon-cyan'
              : 'bg-space-800 text-slate-400 hover:text-white'
          }`}
        >
          투자 내역
        </button>
        <button
          onClick={() => setFilter('reward')}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition flex-shrink-0 ${
            filter === 'reward'
              ? 'bg-emerald-600 text-white shadow-neon-emerald'
              : 'bg-space-800 text-slate-400 hover:text-white'
          }`}
        >
          코인 지급
        </button>
        <button
          onClick={() => setFilter('penalty')}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition flex-shrink-0 ${
            filter === 'penalty'
              ? 'bg-rose-600 text-white shadow-neon-red'
              : 'bg-space-800 text-slate-400 hover:text-white'
          }`}
        >
          코인 차감
        </button>
      </div>

      {/* 로그 타임라인 리스트 */}
      <div className="flex-1 overflow-y-auto pr-1 py-3 space-y-3 custom-scrollbar">
        {filteredLogs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <History className="w-10 h-10 mb-2 opacity-30" />
            <p className="text-sm">기록된 활동 로그가 없습니다.</p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-3 p-3 rounded-2xl bg-space-850/60 border border-white/5 hover:border-white/10 transition"
            >
              <div className="p-2 rounded-xl bg-space-800 border border-white/5 mt-0.5 flex-shrink-0">
                {getLogIcon(log.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    {getLogBadge(log.type)}
                    <span className="text-xs font-bold text-slate-200 truncate">
                      {log.targetName}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">
                    {formatTime(log.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-snug break-words">
                  {log.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
