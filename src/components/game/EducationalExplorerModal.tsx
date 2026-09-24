import React, { useState } from 'react';
import { X, Mountain, Compass, ShieldAlert, Sparkles, Briefcase, Users, Eye } from 'lucide-react';
import { ZONE_CONFIGS } from '@/data/questions';
import { LandformZone, ZoneConfig } from '@/types/game';

interface EducationalExplorerModalProps {
  initialZone?: LandformZone;
  onSelectZone: (zone: LandformZone) => void;
  onClose: () => void;
}

export const EducationalExplorerModal: React.FC<EducationalExplorerModalProps> = ({
  initialZone = 'mountains',
  onSelectZone,
  onClose
}) => {
  const [activeZoneId, setActiveZoneId] = useState<LandformZone>(initialZone);
  const currentConfig = ZONE_CONFIGS.find((z) => z.id === activeZoneId) || ZONE_CONFIGS[0];

  const handleZoneClick = (zoneId: LandformZone) => {
    setActiveZoneId(zoneId);
    onSelectZone(zoneId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md select-none overflow-y-auto">
      <div className="w-full max-w-4xl clay-card rounded-4xl p-6 md:p-8 relative shadow-2xl border-4 border-white/95 my-auto max-h-[90vh] flex flex-col animate-fadeIn">
        {/* HEADER */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shadow-inner">
              <Mountain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black font-heading text-slate-800">
                EXPLORE THE LANDSCAPE
              </h2>
              <p className="text-xs font-semibold text-slate-500">
                Interactive Geography Guide: How Landscapes Shape Human Life & Adaptation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* HORIZONTAL ZONE SELECTOR TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 shrink-0 border-b border-slate-100">
          {ZONE_CONFIGS.map((z) => {
            const isSelected = z.id === activeZoneId;
            return (
              <button
                key={z.id}
                onClick={() => handleZoneClick(z.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-500/30 scale-105'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{z.title}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                    isSelected ? 'bg-sky-800 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {z.rangeText}
                </span>
              </button>
            );
          })}
        </div>

        {/* ZONE DETAILS BODY */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-xs">
          {/* Main Description Hero */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-100">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-600 block mb-1">
              WHAT IS A {currentConfig.title.toUpperCase()}?
            </span>
            <p className="text-slate-800 font-semibold text-sm leading-relaxed">
              {currentConfig.description}
            </p>
          </div>

          {/* 4 Informative Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Formation */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-slate-800 font-extrabold mb-1.5">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span className="uppercase tracking-wider">HOW IS IT FORMED?</span>
              </div>
              <p className="text-slate-600 leading-relaxed font-medium">
                {currentConfig.formation}
              </p>
            </div>

            {/* Human Settlement & Adaptation */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-slate-800 font-extrabold mb-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                <span className="uppercase tracking-wider">HOW DO PEOPLE LIVE HERE?</span>
              </div>
              <p className="text-slate-600 leading-relaxed font-medium">
                {currentConfig.humanLife}
              </p>
            </div>

            {/* Occupations */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-slate-800 font-extrabold mb-1.5">
                <Briefcase className="w-4 h-4 text-amber-600" />
                <span className="uppercase tracking-wider">COMMON OCCUPATIONS</span>
              </div>
              <p className="text-slate-600 leading-relaxed font-medium">
                {currentConfig.occupations}
              </p>
            </div>

            {/* Challenges & Opportunities */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-slate-800 font-extrabold mb-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span className="uppercase tracking-wider">CHALLENGES & OPPORTUNITIES</span>
              </div>
              <div className="space-y-1">
                <p className="text-slate-600 font-medium">
                  <span className="font-bold text-rose-700">Challenges:</span> {currentConfig.challenges}
                </p>
                <p className="text-slate-600 font-medium">
                  <span className="font-bold text-emerald-700">Opportunities:</span> {currentConfig.opportunities}
                </p>
              </div>
            </div>
          </div>

          {/* Distinct Visual Features Checklist */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block mb-2">
              DISTINCTIVE GEOGRAPHIC FEATURES (OBSERVE IN 3D WORLD)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {currentConfig.lookFor.map((feature, i) => (
                <div
                  key={i}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-center font-bold text-slate-700 text-[11px]"
                >
                  ✓ {feature}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs font-semibold text-slate-500">
            Class 6 Geography — “Landforms and Life”
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-black text-xs tracking-wider uppercase text-white clay-button-blue shadow-md"
          >
            RETURN TO RACE
          </button>
        </div>
      </div>
    </div>
  );
};
