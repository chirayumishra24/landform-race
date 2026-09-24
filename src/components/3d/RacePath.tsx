import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { BASE_CHECKPOINTS } from './pathCoordinates';

interface RacePathProps {
  blueCurve: THREE.CatmullRomCurve3;
  orangeCurve: THREE.CatmullRomCurve3;
  blueCheckpoint: number;
  orangeCheckpoint: number;
}

export const RacePath: React.FC<RacePathProps> = ({
  blueCurve,
  orangeCurve,
  blueCheckpoint,
  orangeCheckpoint
}) => {
  // Generate smooth sampled line points for the center visual trail
  const trailGeometry = useMemo(() => {
    // Generate center curve directly between blue and orange
    const centerPoints = BASE_CHECKPOINTS.map((cp) => cp.position.clone().add(new THREE.Vector3(0, 0.08, 0)));
    const centerCurve = new THREE.CatmullRomCurve3(centerPoints, false, 'centripetal', 0.5);
    const sampled = centerCurve.getPoints(140);
    const geom = new THREE.BufferGeometry().setFromPoints(sampled);
    return geom;
  }, []);

  // Create Three.js Line object with dashed material
  const lineObject = useMemo(() => {
    const mat = new THREE.LineDashedMaterial({
      color: 0xffffff,
      dashSize: 0.35,
      gapSize: 0.2,
      linewidth: 3,
      transparent: true,
      opacity: 0.85,
    });
    const line = new THREE.Line(trailGeometry, mat);
    line.computeLineDistances();
    return line;
  }, [trailGeometry]);

  // Landmark Transition Arch Gate configurations
  const archCheckpoints = useMemo(() => {
    const archIds = [4, 7, 10, 13];
    return archIds.map((id) => {
      const idx = BASE_CHECKPOINTS.findIndex((cp) => cp.id === id);
      const cp = BASE_CHECKPOINTS[idx];
      const prev = BASE_CHECKPOINTS[idx - 1].position;
      const next = BASE_CHECKPOINTS[idx + 1].position;
      const dir = next.clone().sub(prev).normalize();
      const angle = Math.atan2(dir.x, dir.z);

      return {
        id,
        name: cp.name,
        zone: cp.zone,
        position: cp.position,
        angle
      };
    });
  }, []);

  return (
    <group>
      {/* Dashed white/luminous trail line matching screenshot */}
      <primitive object={lineObject} />

      {/* 3D Milestone Checkpoint Arches at Landform Transitions */}
      {archCheckpoints.map((arch) => {
        const isReachedByBlue = blueCheckpoint >= arch.id;
        const isReachedByOrange = orangeCheckpoint >= arch.id;
        const isCurrent = blueCheckpoint === arch.id || orangeCheckpoint === arch.id;

        const archColor =
          isReachedByBlue && isReachedByOrange
            ? '#a855f7'
            : isReachedByBlue
            ? '#0284c7'
            : isReachedByOrange
            ? '#ea580c'
            : '#475569';

        const glowColor =
          isReachedByBlue && isReachedByOrange
            ? '#d8b4fe'
            : isReachedByBlue
            ? '#38bdf8'
            : isReachedByOrange
            ? '#fb923c'
            : '#94a3b8';

        return (
          <group
            key={`arch-${arch.id}`}
            position={[arch.position.x, arch.position.y + 0.05, arch.position.z]}
            rotation={[0, arch.angle, 0]}
          >
            {/* Left structural pillar */}
            <mesh position={[-0.85, 0.65, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.06, 1.3, 10]} />
              <meshStandardMaterial color="#1e293b" metalness={0.7} />
            </mesh>
            {/* Left base footer */}
            <mesh position={[-0.85, 0.05, 0]}>
              <boxGeometry args={[0.18, 0.1, 0.18]} />
              <meshStandardMaterial color="#475569" />
            </mesh>

            {/* Right structural pillar */}
            <mesh position={[0.85, 0.65, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.06, 1.3, 10]} />
              <meshStandardMaterial color="#1e293b" metalness={0.7} />
            </mesh>
            {/* Right base footer */}
            <mesh position={[0.85, 0.05, 0]}>
              <boxGeometry args={[0.18, 0.1, 0.18]} />
              <meshStandardMaterial color="#475569" />
            </mesh>

            {/* Overhead Crossbar Truss */}
            <mesh position={[0, 1.32, 0]} castShadow>
              <boxGeometry args={[1.82, 0.12, 0.08]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} />
            </mesh>

            {/* Glowing Neon Crossbeam strip */}
            <mesh position={[0, 1.32, 0.045]}>
              <boxGeometry args={[1.74, 0.04, 0.015]} />
              <meshBasicMaterial color={glowColor} />
            </mesh>

            {/* Milestone Circular Badge on Overhead Truss */}
            <mesh position={[0, 1.32, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.16, 0.16, 0.02, 16]} />
              <meshStandardMaterial color={archColor} roughness={0.3} />
            </mesh>

            {/* Floating zone indicator tag */}
            <Html position={[0, 1.75, 0]} center distanceFactor={14}>
              <div
                className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider whitespace-nowrap shadow-md pointer-events-none select-none border transition-transform duration-300 ${
                  isCurrent
                    ? 'bg-amber-400 text-slate-900 border-white scale-110 ring-2 ring-amber-300'
                    : isReachedByBlue && isReachedByOrange
                    ? 'bg-purple-600 text-white border-purple-300'
                    : isReachedByBlue
                    ? 'bg-sky-600 text-white border-sky-300'
                    : isReachedByOrange
                    ? 'bg-orange-600 text-white border-orange-300'
                    : 'bg-slate-800/90 text-slate-300 border-slate-600'
                }`}
              >
                {arch.name}
              </div>
            </Html>
          </group>
        );
      })}

      {/* Checkpoint nodes (1 through 15) */}
      {BASE_CHECKPOINTS.map((cp) => {
        if (cp.id === 0) return null; // Start point has flag
        const isReachedByBlue = blueCheckpoint >= cp.id;
        const isReachedByOrange = orangeCheckpoint >= cp.id;
        const isCurrent = blueCheckpoint === cp.id || orangeCheckpoint === cp.id;

        return (
          <group key={cp.id} position={[cp.position.x, cp.position.y + 0.06, cp.position.z]}>
            {/* Outer ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.22, 0.32, 24]} />
              <meshBasicMaterial
                color={
                  isReachedByBlue && isReachedByOrange
                    ? "#a855f7" // Purple if both passed
                    : isReachedByBlue
                    ? "#0284c7"
                    : isReachedByOrange
                    ? "#ea580c"
                    : "#ffffff"
                }
                transparent
                opacity={0.9}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Inner disc */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.2, 24]} />
              <meshBasicMaterial
                color={
                  isCurrent
                    ? "#facc15"
                    : isReachedByBlue || isReachedByOrange
                    ? "#f8fafc"
                    : "rgba(255, 255, 255, 0.6)"
                }
                transparent
                opacity={0.95}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Floating Checkpoint Number Badge */}
            <Html position={[0, 0.28, 0]} center distanceFactor={14}>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shadow pointer-events-none select-none transition-transform duration-300 ${
                  isCurrent
                    ? 'bg-amber-400 text-slate-900 ring-2 ring-white scale-125'
                    : isReachedByBlue && isReachedByOrange
                    ? 'bg-purple-600 text-white'
                    : isReachedByBlue
                    ? 'bg-sky-600 text-white'
                    : isReachedByOrange
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-300'
                }`}
              >
                {cp.id}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
};
