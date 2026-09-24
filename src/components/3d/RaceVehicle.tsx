import React, { useRef, useEffect, useMemo } from 'react';
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

interface DustParticle {
  pos: THREE.Vector3;
  scale: number;
  opacity: number;
  life: number;
  maxLife: number;
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
  const chassisRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Group[]>([]);
  const nitroRef = useRef<THREE.Mesh>(null);
  const dustGroupRef = useRef<THREE.Group>(null);
  
  // Interpolation progress along curve: [0, 1]
  const currentT = useRef(checkpoint / 15);
  const targetT = useRef(checkpoint / 15);

  useEffect(() => {
    targetT.current = Math.min(1.0, Math.max(0.0, checkpoint / 15));
  }, [checkpoint]);

  // Dust particles state
  const dustParticles = useMemo<DustParticle[]>(() => {
    return Array.from({ length: 12 }, () => ({
      pos: new THREE.Vector3(0, -10, 0),
      scale: 0.05,
      opacity: 0,
      life: 0,
      maxLife: 0.6 + Math.random() * 0.4
    }));
  }, []);

  const dustMeshRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;

    // Smooth movement interpolation
    const speed = isBoosting ? 2.8 : 1.7;
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

    const isActuallyMoving = Math.abs(currentT.current - targetT.current) > 0.0015;
    const elapsedTime = clock.getElapsedTime();

    // Suspension bounce and off-road roll
    if (chassisRef.current) {
      if (isActuallyMoving) {
        chassisRef.current.position.y = Math.sin(elapsedTime * 24) * 0.025;
        chassisRef.current.rotation.z = Math.sin(elapsedTime * 12) * 0.035;
        chassisRef.current.rotation.x = Math.sin(elapsedTime * 18) * 0.025;
      } else {
        chassisRef.current.position.y = Math.sin(elapsedTime * 3) * 0.008; // Gentle idle engine purr
        chassisRef.current.rotation.z = 0;
        chassisRef.current.rotation.x = 0;
      }
    }

    // Spin wheels if moving
    if (isActuallyMoving) {
      wheelsRef.current.forEach((wheel) => {
        if (wheel) wheel.rotation.x += delta * (isBoosting ? 30 : 18);
      });
    }

    // Nitro exhaust flame flicker
    if (nitroRef.current) {
      if (isBoosting) {
        nitroRef.current.visible = true;
        const scaleZ = 0.8 + Math.random() * 0.6;
        nitroRef.current.scale.set(1 + Math.random() * 0.3, 1 + Math.random() * 0.3, scaleZ);
      } else {
        nitroRef.current.visible = false;
      }
    }

    // Update dust particle clouds behind rear tires
    dustParticles.forEach((particle, idx) => {
      const mesh = dustMeshRefs.current[idx];
      if (!mesh) return;

      if (isActuallyMoving) {
        particle.life += delta;
        if (particle.life > particle.maxLife) {
          // Respawn near left or right rear tire
          particle.life = 0;
          const isLeft = Math.random() > 0.5;
          particle.pos.set(
            (isLeft ? -0.2 : 0.2) + (Math.random() - 0.5) * 0.08,
            0.05 + Math.random() * 0.04,
            -0.38 - Math.random() * 0.15
          );
          particle.scale = 0.06;
          particle.opacity = isBoosting ? 0.75 : 0.45;
        } else {
          // Expand and drift upward / backward
          const progress = particle.life / particle.maxLife;
          particle.pos.y += delta * 0.22;
          particle.pos.z -= delta * (isBoosting ? 0.8 : 0.4);
          particle.scale = THREE.MathUtils.lerp(0.06, isBoosting ? 0.24 : 0.16, progress);
          particle.opacity = (1 - progress) * (isBoosting ? 0.7 : 0.4);
        }

        mesh.position.copy(particle.pos);
        mesh.scale.setScalar(particle.scale);
        const mat = mesh.material as THREE.MeshBasicMaterial;
        if (mat) {
          mat.opacity = particle.opacity;
        }
      } else {
        // Hide dust when parked
        const mat = mesh.material as THREE.MeshBasicMaterial;
        if (mat) {
          mat.opacity = 0;
        }
      }
    });
  });

  const bodyColor = color === 'blue' ? '#0284c7' : '#ea580c';
  const accentColor = color === 'blue' ? '#38bdf8' : '#fb923c';
  const underglowColor = color === 'blue' ? '#0ea5e9' : '#f97316';

  return (
    <group ref={groupRef}>
      {/* Team Nametag floating above SUV */}
      <Html position={[0, 0.95, 0]} center distanceFactor={14}>
        <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xl pointer-events-none select-none border border-white/80 whitespace-nowrap transition-transform ${
          color === 'blue' ? 'bg-sky-600 shadow-sky-600/40' : 'bg-orange-600 shadow-orange-600/40'
        } ${isBoosting ? 'ring-4 ring-yellow-400 scale-110 animate-bounce' : ''}`}>
          {teamName}
        </div>
      </Html>

      {/* Underglow Ground Light */}
      <pointLight
        position={[0, 0.05, 0]}
        color={underglowColor}
        intensity={isBoosting ? 2.5 : 1.2}
        distance={1.4}
      />

      {/* Boost Aura Glow */}
      {isBoosting && (
        <mesh position={[0, 0.25, 0]}>
          <sphereGeometry args={[0.75, 16, 16]} />
          <meshBasicMaterial
            color="#facc15"
            wireframe
            transparent
            opacity={0.5}
          />
        </mesh>
      )}

      {/* Dynamic Dust Particles Trailing Chassis */}
      <group ref={dustGroupRef}>
        {dustParticles.map((_, idx) => (
          <mesh
            key={idx}
            ref={(el) => {
              dustMeshRefs.current[idx] = el;
            }}
          >
            <sphereGeometry args={[1, 7, 7]} />
            <meshBasicMaterial
              color={isBoosting ? '#fed7aa' : '#cbd5e1'}
              transparent
              opacity={0}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* Main Chassis Group (affected by suspension bounce) */}
      <group ref={chassisRef}>
        {/* Main SUV Body Base */}
        <mesh position={[0, 0.18, 0]} castShadow>
          <boxGeometry args={[0.42, 0.18, 0.72]} />
          <meshStandardMaterial color={bodyColor} roughness={0.25} metalness={0.25} />
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

        {/* Front Headlights & Forward Spot Lights */}
        <mesh position={[-0.14, 0.19, 0.38]}>
          <boxGeometry args={[0.07, 0.05, 0.02]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
        <mesh position={[0.14, 0.19, 0.38]}>
          <boxGeometry args={[0.07, 0.05, 0.02]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>

        {/* Forward Headlight Beam Cones */}
        <spotLight
          position={[-0.14, 0.19, 0.4]}
          target-position={[-0.14, 0, 2.5]}
          angle={0.4}
          penumbra={0.6}
          intensity={1.2}
          color="#fef9c3"
          distance={4}
        />
        <spotLight
          position={[0.14, 0.19, 0.4]}
          target-position={[0.14, 0, 2.5]}
          angle={0.4}
          penumbra={0.6}
          intensity={1.2}
          color="#fef9c3"
          distance={4}
        />

        {/* Rear Exhaust Pipes & Nitro Flame */}
        <mesh position={[-0.13, 0.12, -0.37]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.04, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.9} />
        </mesh>
        <mesh position={[0.13, 0.12, -0.37]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.04, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.9} />
        </mesh>

        {/* Nitro Flame Mesh */}
        <mesh
          ref={nitroRef}
          position={[0, 0.12, -0.48]}
          rotation={[Math.PI / 2, 0, 0]}
          visible={false}
        >
          <coneGeometry args={[0.09, 0.28, 8]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.85} />
        </mesh>
      </group>

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
