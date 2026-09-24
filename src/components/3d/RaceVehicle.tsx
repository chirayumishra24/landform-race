import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

interface RaceVehicleProps {
  color: "blue" | "orange";
  teamName: string;
  checkpoint: number; // 0 to 15
  isMoving: boolean;
  isBoosting: boolean;
  curve: THREE.CatmullRomCurve3;
}

export const RaceVehicle: React.FC<RaceVehicleProps> = ({
  color,
  teamName,
  checkpoint,
  isMoving,
  isBoosting,
  curve
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Group[]>([]);
  
  // Interpolation progress along curve: [0, 1]
  const currentT = useRef(checkpoint / 15);
  const targetT = useRef(checkpoint / 15);

  useEffect(() => {
    targetT.current = Math.min(1.0, Math.max(0.0, checkpoint / 15));
  }, [checkpoint]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Smooth movement interpolation
    const speed = isBoosting ? 2.5 : 1.6;
    currentT.current = THREE.MathUtils.damp(
      currentT.current,
      targetT.current,
      speed,
      delta
    );

    // Get position and tangent from curve
    const t = Math.min(0.999, Math.max(0.001, currentT.current));
    const position = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t).normalize();

    // Position vehicle slightly above terrain
    groupRef.current.position.copy(position).add(new THREE.Vector3(0, 0.12, 0));

    // Orient vehicle towards tangent direction
    const up = new THREE.Vector3(0, 1, 0);
    const matrix = new THREE.Matrix4();
    const zAxis = tangent.clone().negate();
    const xAxis = new THREE.Vector3().crossVectors(up, zAxis).normalize();
    const yAxis = new THREE.Vector3().crossVectors(zAxis, xAxis).normalize();
    matrix.makeBasis(xAxis, yAxis, zAxis);
    groupRef.current.quaternion.setFromRotationMatrix(matrix);

    // Spin wheels if moving
    const isActuallyMoving = Math.abs(currentT.current - targetT.current) > 0.002;
    if (isActuallyMoving) {
      wheelsRef.current.forEach((wheel) => {
        if (wheel) wheel.rotation.x += delta * 15;
      });
    }
  });

  const bodyColor = color === 'blue' ? '#0284c7' : '#ea580c';
  const accentColor = color === 'blue' ? '#38bdf8' : '#fb923c';

  return (
    <group ref={groupRef}>
      {/* Team Nametag floating above SUV */}
      <Html position={[0, 0.9, 0]} center distanceFactor={14}>
        <div className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white shadow-lg pointer-events-none select-none border border-white/80 whitespace-nowrap ${
          color === 'blue' ? 'bg-sky-600' : 'bg-orange-600'
        } ${isBoosting ? 'ring-4 ring-yellow-400 animate-bounce' : ''}`}>
          {teamName}
        </div>
      </Html>

      {/* Boost Aura Glow */}
      {isBoosting && (
        <mesh position={[0, 0.25, 0]}>
          <sphereGeometry args={[0.7, 16, 16]} />
          <meshBasicMaterial
            color="#facc15"
            wireframe
            transparent
            opacity={0.45}
          />
        </mesh>
      )}

      {/* Main SUV Body Base */}
      <mesh position={[0, 0.18, 0]} castShadow>
        <boxGeometry args={[0.42, 0.18, 0.72]} />
        <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Cabin & Tinted Windows */}
      <mesh position={[0, 0.33, -0.04]} castShadow>
        <boxGeometry args={[0.38, 0.18, 0.44]} />
        <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.8} />
      </mesh>

      {/* Roof Panel */}
      <mesh position={[0, 0.43, -0.04]}>
        <boxGeometry args={[0.39, 0.03, 0.45]} />
        <meshStandardMaterial color={accentColor} roughness={0.4} />
      </mesh>

      {/* Roof Expedition Rack */}
      <group position={[0, 0.46, -0.04]}>
        <mesh>
          <boxGeometry args={[0.36, 0.04, 0.38]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} />
        </mesh>
        {/* Spare Tire on Roof */}
        <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.07, 12]} />
          <meshStandardMaterial color="#09090b" roughness={0.8} />
        </mesh>
      </group>

      {/* Front Bullbar / Grille */}
      <mesh position={[0, 0.15, 0.38]}>
        <boxGeometry args={[0.38, 0.12, 0.06]} />
        <meshStandardMaterial color="#334155" metalness={0.6} />
      </mesh>

      {/* Front Headlights */}
      <mesh position={[-0.14, 0.19, 0.38]}>
        <boxGeometry args={[0.07, 0.05, 0.02]} />
        <meshBasicMaterial color="#fef08a" />
      </mesh>
      <mesh position={[0.14, 0.19, 0.38]}>
        <boxGeometry args={[0.07, 0.05, 0.02]} />
        <meshBasicMaterial color="#fef08a" />
      </mesh>

      {/* 4 Chunky Off-road Wheels */}
      {[
        [-0.22, 0.08, 0.22],
        [0.22, 0.08, 0.22],
        [-0.22, 0.08, -0.22],
        [0.22, 0.08, -0.22]
      ].map(([wx, wy, wz], idx) => (
        <group
          key={idx}
          position={[wx, wy, wz]}
          ref={(el) => {
            if (el) wheelsRef.current[idx] = el;
          }}
        >
          {/* Tire */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.11, 0.11, 0.08, 12]} />
            <meshStandardMaterial color="#18181b" roughness={0.9} />
          </mesh>
          {/* Rim */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.06, 0.06, 0.085, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
