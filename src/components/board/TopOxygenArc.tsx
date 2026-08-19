import React from 'react';
import { useTerraformStore } from '../../store/useTerraformStore';
import { Wind } from 'lucide-react';

export const TopOxygenArc: React.FC = () => {
  const { oxygen, isParameterMaxed } = useTerraformStore();
  const isMax = isParameterMaxed('oxygen');

  const steps = Array.from({ length: 15 }, (_, i) => i); // 0..14

  // 완만한 호(Arc) 상의 점 좌표 계산
  // viewBox: width=500, height=80
  const width = 500;
  const centerX = width / 2;
  const centerY = 280; // 큰 원의 중심
  const radius = 240; // 호의 반지름

  // 각도 범위: -55도에서 +55도
  const startAngle = -55 * (Math.PI / 180);
  const endAngle = 55 * (Math.PI / 180);

  const getNodeCoords = (index: number) => {
    const t = index / 14;
    const angle = startAngle + t * (endAngle - startAngle);
    const x = centerX + radius * Math.sin(angle);
    const y = centerY - radius * Math.cos(angle);
    return { x, y };
  };

  return (
    <div className="relative w-full max-w-xl mx-auto flex flex-col items-center select-none">
      {/* 타이틀 및 현재 산소치 */}
      <div className="flex items-center gap-2 mb-1">
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-black shadow-neon-emerald">
          <Wind className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
          <span>산소 농도 아치</span>
          <span className="font-mono text-white ml-1 font-bold">{oxygen}%</span>
          {isMax && <span className="text-[10px] bg-emerald-600 text-white px-1 rounded">MAX</span>}
        </div>
      </div>

      {/* SVG 호(Arc) 렌더링 */}
      <div className="relative w-full h-16 sm:h-20">
        <svg viewBox="0 0 500 80" className="w-full h-full overflow-visible">
          <defs>
            {/* 호 그라디언트 */}
            <linearGradient id="oxygenArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#00B5D8" />
            </linearGradient>
            <filter id="arcGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          {/* 배경 곡선 레일 */}
          <path
            d="M 50 70 Q 250 -10 450 70"
            fill="none"
            stroke="#261E35"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* 활성화된 산소 진척도 곡선 */}
          <path
            d="M 50 70 Q 250 -10 450 70"
            fill="none"
            stroke="url(#oxygenArcGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="420"
            strokeDashoffset={420 - (420 * (oxygen / 14))}
            filter="url(#arcGlow)"
            className="transition-all duration-700 ease-out"
          />

          {/* 0 ~ 14% 각 단계별 원형 노드 */}
          {steps.map((val) => {
            const { x, y } = getNodeCoords(val);
            const isReached = val <= oxygen;
            const isCurrent = val === oxygen;
            const isBonus = val === 8; // 8% 온도 보너스

            return (
              <g key={val} className="cursor-pointer group" transform={`translate(${x}, ${y})`}>
                {/* 보너스 표시 아이콘 (8%일 때 온도 +2°C) */}
                {isBonus && (
                  <g transform="translate(0, -18)">
                    <circle r="7" fill="#E53E3E" className="animate-pulse" />
                    <text
                      textAnchor="middle"
                      dy="3.5"
                      fontSize="8"
                      fill="#FFFFFF"
                      fontWeight="900"
                    >
                      🔥
                    </text>
                  </g>
                )}

                {/* 노드 외곽 원 */}
                <circle
                  r={isCurrent ? '11' : isReached ? '9' : '7'}
                  fill={isCurrent ? '#10B981' : isReached ? '#059669' : '#1A1625'}
                  stroke={isCurrent ? '#FFFFFF' : isReached ? '#34D399' : '#4B5563'}
                  strokeWidth={isCurrent ? '2.5' : '1.5'}
                  className="transition-all duration-300"
                />

                {/* 수치 텍스트 */}
                <text
                  textAnchor="middle"
                  dy="3.5"
                  fontSize={isCurrent ? '9' : '8'}
                  fontWeight="900"
                  fontFamily="monospace"
                  fill={isReached ? '#FFFFFF' : '#9CA3AF'}
                  className="select-none pointer-events-none"
                >
                  {val}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
