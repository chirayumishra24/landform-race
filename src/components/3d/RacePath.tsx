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

  return (
    <group>
      {/* Dashed white/luminous trail line matching screenshot */}
      <primitive object={lineObject} />

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
