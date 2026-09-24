import React from 'react';
import { BASE_CHECKPOINTS } from '../3d/pathCoordinates';
import { TeamProgress } from '@/types/game';
import { Compass, Flag, Mountain } from 'lucide-react';

interface TopographicMapViewProps {
  blueTeam: TeamProgress;
  orangeTeam: TeamProgress;
}

export const TopographicMapView: React.FC<TopographicMapViewProps> = ({
  blueTeam,
  orangeTeam,
}) => {
  // SVG coordinates: 800 x 700
  // Map 3D points (-12 to 12 in X, -12 to 12 in Z) into SVG 2D space
  const projectPoint = (x: number, z: number) => {
    const svgX = ((x + 12) / 24) * 700 + 50;
    const svgY = ((z + 12) / 24) * 600 + 50;
    return { x: svgX, y: svgY };
  };

  const routePath = BASE_CHECKPOINTS.map((cp, idx) => {
    const { x, y } = projectPoint(cp.position.x, cp.position.z);
    return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');

  const bluePos = BASE_CHECKPOINTS[Math.min(15, blueTeam.checkpoint)].position;
  const orangePos = BASE_CHECKPOINTS[Math.min(15, orangeTeam.checkpoint)].position;

  const blueSvg = projectPoint(bluePos.x - 0.4, bluePos.z);
  const orangeSvg = projectPoint(orangePos.x + 0.4, orangePos.z);

  return (
    <div className="w-full h-full relative rounded-3xl bg-[#f8fafc] border border-slate-200 overflow-hidden flex flex-col p-4 shadow-inner">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-sky-600 animate-spin-slow" />
          <h3 className="font-extrabold text-slate-800 text-sm tracking-wide">
            GEOGRAPHIC EXPEDITION TOPOGRAPHIC MAP (SCALE 1:25,000)
          </h3>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-sky-600"></span> Team North Star (Checkpoint {blueTeam.checkpoint})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-600"></span> Team Earth Explorers (Checkpoint {orangeTeam.checkpoint})
          </span>
        </div>
      </div>

      <div className="flex-1 relative w-full h-full">
        <svg viewBox="0 0 800 700" className="w-full h-full rounded-2xl bg-[#ecf4ec] select-none">
          {/* Background Topo Zones */}
          {/* Mountains High Alpine (Top) */}
          <path
            d="M 50,50 L 750,50 L 750,220 Q 500,260 300,220 Q 150,180 50,200 Z"
            fill="#cbd5e1"
            opacity="0.8"
          />
          {/* Mountains Snow Caps */}
          <circle cx="280" cy="110" r="70" fill="#f8fafc" opacity="0.9" />
          <circle cx="480" cy="90" r="85" fill="#f8fafc" opacity="0.9" />

          {/* Valley (Middle Left) */}
          <path
            d="M 120,200 Q 300,240 400,290 Q 250,380 140,320 Z"
            fill="#a7f3d0"
            opacity="0.7"
          />

          {/* Plateau (Middle Right Tableland) */}
          <path
            d="M 440,240 L 710,230 L 720,440 L 460,450 Z"
            fill="#fed7aa"
            stroke="#ea580c"
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity="0.85"
          />

          {/* Agricultural Plains (Lower Left) */}
          <path
            d="M 80,360 L 440,430 L 400,640 L 80,640 Z"
            fill="#d9f99d"
            opacity="0.75"
          />

          {/* Meandering River Stream */}
          <path
            d="M 280,120 Q 340,220 310,290 T 430,420 T 520,530 T 640,640"
            fill="none"
            stroke="#0284c7"
            strokeWidth="14"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Settlement / City Grid (Lower Right) */}
          <rect x="550" y="550" width="160" height="110" rx="8" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />

          {/* Topographic Contour Lines */}
          <circle cx="280" cy="110" r="95" fill="none" stroke="#94a3b8" strokeWidth="1" opacity="0.6" />
          <circle cx="280" cy="110" r="120" fill="none" stroke="#94a3b8" strokeWidth="1" opacity="0.4" />
          <circle cx="480" cy="90" r="110" fill="none" stroke="#94a3b8" strokeWidth="1" opacity="0.6" />

          {/* Zone Names / Labels */}
          <text x="240" y="75" fill="#334155" fontSize="14" fontWeight="800" letterSpacing="1">
            HIGHER MOUNTAIN SLOPES (2,400m - 4,800m)
          </text>
          <text x="210" y="270" fill="#047857" fontSize="13" fontWeight="800" letterSpacing="1">
            SHELTERED VALLEY FLOOR
          </text>
          <text x="510" y="320" fill="#c2410c" fontSize="13" fontWeight="800" letterSpacing="1">
            MINERAL-RICH TABLELAND (PLATEAU)
          </text>
          <text x="140" y="500" fill="#4d7c0f" fontSize="13" fontWeight="800" letterSpacing="1">
            ALLUVIAL FERTILE PLAINS
          </text>
          <text x="490" y="490" fill="#0369a1" fontSize="12" fontWeight="700">
            MEANDERING RIVER CORRIDOR
          </text>
          <text x="570" y="600" fill="#b45309" fontSize="13" fontWeight="800">
            FINAL SETTLEMENT
          </text>

          {/* The Race Expedition Route Line */}
          <path
            d={routePath}
            fill="none"
            stroke="#ffffff"
            strokeWidth="8"
            strokeDasharray="8 6"
            strokeLinecap="round"
          />
          <path
            d={routePath}
            fill="none"
            stroke="#475569"
            strokeWidth="3"
            strokeDasharray="8 6"
            strokeLinecap="round"
          />

          {/* Checkpoint Circles */}
          {BASE_CHECKPOINTS.map((cp) => {
            const { x, y } = projectPoint(cp.position.x, cp.position.z);
            const isBluePassed = blueTeam.checkpoint >= cp.id;
            const isOrangePassed = orangeTeam.checkpoint >= cp.id;

            return (
              <g key={cp.id} transform={`translate(${x}, ${y})`}>
                <circle
                  r="12"
                  fill={
                    isBluePassed && isOrangePassed
                      ? '#9333ea'
                      : isBluePassed
                      ? '#0284c7'
                      : isOrangePassed
                      ? '#ea580c'
                      : '#ffffff'
                  }
                  stroke="#334155"
                  strokeWidth="2"
                />
                <text
                  textAnchor="middle"
                  dy="4"
                  fill={isBluePassed || isOrangePassed ? '#ffffff' : '#334155'}
                  fontSize="10"
                  fontWeight="bold"
                >
                  {cp.id === 0 ? 'S' : cp.id === 15 ? 'F' : cp.id}
                </text>
              </g>
            );
          })}

          {/* Blue Vehicle Live Marker */}
          <g transform={`translate(${blueSvg.x}, ${blueSvg.y})`} className="transition-all duration-700">
            <circle r="18" fill="#0284c7" opacity="0.3" className="animate-ping" />
            <circle r="14" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" />
            <text textAnchor="middle" dy="4" fill="#ffffff" fontSize="9" fontWeight="900">
              BLUE
            </text>
          </g>

          {/* Orange Vehicle Live Marker */}
          <g transform={`translate(${orangeSvg.x}, ${orangeSvg.y})`} className="transition-all duration-700">
            <circle r="18" fill="#ea580c" opacity="0.3" className="animate-ping" />
            <circle r="14" fill="#ea580c" stroke="#ffffff" strokeWidth="2.5" />
            <text textAnchor="middle" dy="4" fill="#ffffff" fontSize="9" fontWeight="900">
              ORG
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};
