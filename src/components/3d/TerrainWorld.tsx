import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { LandformZone } from '@/types/game';

interface TerrainWorldProps {
  highlightZone: LandformZone | null;
  onSelectZone?: (zone: LandformZone) => void;
}

export const TerrainWorld: React.FC<TerrainWorldProps> = ({ highlightZone, onSelectZone }) => {
  const waterMeshRef = useRef<THREE.Mesh>(null);
  const waterfallRef = useRef<THREE.Mesh>(null);
  const foamRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Group>(null);
  const windmillRotorRef = useRef<THREE.Group>(null);
  const snowRef = useRef<THREE.Points>(null);

  // Generate summit snow particles
  const snowGeometry = useMemo(() => {
    const count = 35;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = -2.8 + (Math.random() - 0.5) * 5.5;
      positions[i * 3 + 1] = 4.2 + Math.random() * 3.5;
      positions[i * 3 + 2] = -8.8 + (Math.random() - 0.5) * 4.5;
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, []);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    // 1. Dynamic river water ripple animation
    if (waterMeshRef.current) {
      const geom = waterMeshRef.current.geometry;
      const pos = geom.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i);
        const v = pos.getY(i);
        pos.setZ(i, Math.sin(u * 1.3 + t * 2.4) * 0.04 + Math.cos(v * 1.6 + t * 3.0) * 0.035);
      }
      pos.needsUpdate = true;
    }

    // 2. Waterfall cascade shimmer
    if (waterfallRef.current) {
      const mat = waterfallRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.opacity = 0.82 + Math.sin(t * 9) * 0.12;
      }
    }

    // 3. Drifting atmospheric clouds
    if (cloudsRef.current) {
      cloudsRef.current.children.forEach((cloud, idx) => {
        cloud.position.x += delta * (0.25 + idx * 0.08);
        if (cloud.position.x > 15) {
          cloud.position.x = -15;
        }
      });
    }

    // 4. Waterfall base foam bubbling
    if (foamRef.current) {
      foamRef.current.rotation.z += delta * 1.8;
      foamRef.current.scale.setScalar(0.9 + Math.sin(t * 7) * 0.15);
    }

    // 5. Plains windmill rotation
    if (windmillRotorRef.current) {
      windmillRotorRef.current.rotation.z += delta * 2.2;
    }

    // 6. Summit snow flurries downward drift
    if (snowRef.current) {
      const pos = snowRef.current.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let y = pos.getY(i) - delta * 0.7;
        if (y < 4.0) y = 7.5;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
    }
  });
  // Generate terrain heightmap plane
  const { terrainGeometry, terrainColors } = useMemo(() => {
    const width = 30;
    const height = 30;
    const segments = 120;
    const geom = new THREE.PlaneGeometry(width, height, segments, segments);
    geom.rotateX(-Math.PI / 2);

    const pos = geom.attributes.position;
    const colors = new Float32Array(pos.count * 3);

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      let y = 0.2; // Base elevation

      // 1. High Mountain Ridge (Top section: z from -14 to -6)
      if (z < -4) {
        const mountainFactor = THREE.MathUtils.clamp((-z - 4) / 9, 0, 1);
        // Peak at top left & center
        const peak1 = Math.exp(-((x + 3) ** 2 + (z + 10) ** 2) / 22) * 8.2;
        const peak2 = Math.exp(-((x - 4) ** 2 + (z + 11) ** 2) / 26) * 7.4;
        const ridge = Math.cos(x * 0.45) * 1.5 + Math.sin(z * 0.5) * 1.2;
        const noise = Math.sin(x * 1.5) * Math.cos(z * 1.4) * 0.6;
        
        y += (peak1 + peak2 + ridge + noise) * mountainFactor;
      }

      // 2. Valley (z: -5 to 0, near x: -2 to 1)
      if (z >= -6 && z <= 1) {
        const distFromValleyCenter = Math.abs(x - (-1.5 + z * 0.25));
        if (distFromValleyCenter < 3.5) {
          const valleyDepth = (1 - distFromValleyCenter / 3.5) * 1.2;
          y = Math.max(0.4, y - valleyDepth);
        }
      }

      // 3. Plateau (z: -1 to 5, x: 2 to 7)
      if (z >= -1 && z <= 5 && x >= 1 && x <= 7.5) {
        const pDistX = THREE.MathUtils.clamp(1 - Math.abs(x - 4.2) / 3.2, 0, 1);
        const pDistZ = THREE.MathUtils.clamp(1 - Math.abs(z - 2.0) / 3.0, 0, 1);
        const plateauFactor = Math.min(pDistX, pDistZ);
        
        // Steep cliff transition with flat top
        const tableHeight = 2.7;
        const cliffSharpness = Math.pow(plateauFactor, 0.25);
        y = Math.max(y, tableHeight * cliffSharpness);
      }

      // 4. Meandering River Trench (Carving through valley & plains towards bottom right)
      // River path: x ~ -1.5 at z=-4 -> x ~ 0 at z=0 -> x ~ 1.5 at z=4 -> x ~ 2.5 at z=9
      const riverCenter = Math.sin(z * 0.5) * 2.2 + 0.8;
      const distToRiver = Math.abs(x - riverCenter);
      if (z > -6 && distToRiver < 1.4) {
        const riverTrench = (1 - distToRiver / 1.4) * 0.6;
        y = Math.max(0.12, y - riverTrench);
      }

      // 5. Plains smoothing (z > 3, x < 2)
      if (z > 2 && x < 2) {
        y = Math.min(y, 0.7 + Math.sin(x * 0.8) * 0.15 + Math.cos(z * 0.8) * 0.15);
      }

      // Clamp lowest point to water level
      if (y < 0.15) y = 0.15;

      pos.setY(i, y);

      // Color mapping based on height & location
      const color = new THREE.Color();
      if (y > 5.5) {
        // Snow peaks
        color.setRGB(0.96, 0.98, 1.0);
      } else if (y > 3.8) {
        // High rocky grey slopes
        color.setRGB(0.48, 0.49, 0.53);
      } else if (z >= -1 && z <= 5 && x >= 1 && x <= 7.5 && y > 2.0) {
        // Red rock plateau
        color.setRGB(0.78, 0.44, 0.28);
      } else if (y < 0.35 && z > -5) {
        // River bed / banks
        color.setRGB(0.24, 0.52, 0.68);
      } else if (z > 3 && x < 2) {
        // Plains agricultural green / golden patches
        const patch = Math.sin(x * 2.0) * Math.cos(z * 2.0);
        if (patch > 0.2) {
          color.setRGB(0.82, 0.72, 0.34); // Wheat golden
        } else if (patch > -0.3) {
          color.setRGB(0.38, 0.68, 0.24); // Lush grass green
        } else {
          color.setRGB(0.28, 0.55, 0.22); // Deep meadow green
        }
      } else if (z < 0) {
        // Valley & mountain base forest
        color.setRGB(0.26, 0.48, 0.22);
      } else {
        // Default warm ground
        color.setRGB(0.55, 0.62, 0.35);
      }

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geom.computeVertexNormals();

    return { terrainGeometry: geom, terrainColors: colors };
  }, []);

  // Pine trees on slopes
  const trees = useMemo(() => {
    const list: [number, number, number, number][] = [];
    const seed = [
      // Mountains/Valley slopes
      [-4.5, 3.8, -7.5, 0.9], [-2.5, 4.2, -6.8, 0.8], [-5.2, 3.2, -5.5, 1.1],
      [-3.0, 2.5, -4.5, 1.0], [0.8, 2.4, -4.0, 0.8], [-2.2, 1.8, -3.2, 0.9],
      [1.5, 1.9, -2.8, 0.85], [-0.5, 1.4, -2.0, 1.0], [-3.8, 1.2, -1.5, 1.2],
      // Plains trees
      [-4.0, 0.6, 4.0, 0.9], [-3.2, 0.5, 6.2, 1.0], [-1.8, 0.55, 8.5, 0.8],
      // Plateau boundary bushes
      [5.5, 2.7, 1.2, 0.7], [6.2, 2.7, 3.0, 0.8], [3.8, 2.7, -0.5, 0.75]
    ];
    seed.forEach(([x, y, z, s]) => list.push([x, y, z, s]));
    return list;
  }, []);

  // Farm plots on plains
  const farmPlots = useMemo(() => [
    { x: -3.5, y: 0.55, z: 4.8, w: 2.2, h: 1.8, rot: 0.1, color: "#84cc16" },
    { x: -1.2, y: 0.52, z: 4.2, w: 1.8, h: 2.0, rot: -0.15, color: "#eab308" },
    { x: -3.0, y: 0.5, z: 7.2, w: 2.5, h: 1.6, rot: 0.05, color: "#65a30d" },
    { x: -1.0, y: 0.48, z: 7.8, w: 2.0, h: 2.2, rot: -0.08, color: "#facc15" },
  ], []);

  // Settlement buildings at finish
  const buildings = useMemo(() => [
    { x: 4.6, y: 0.65, z: 10.5, sx: 0.9, sy: 0.8, sz: 1.0, color: "#f5e6d3" },
    { x: 3.8, y: 0.6, z: 11.8, sx: 1.1, sy: 0.7, sz: 0.9, color: "#e2d1be" },
    { x: 5.4, y: 0.7, z: 11.5, sx: 0.8, sy: 1.2, sz: 0.8, color: "#dbc8b0" }, // Watchtower
    { x: 4.8, y: 0.55, z: 12.6, sx: 1.0, sy: 0.6, sz: 1.2, color: "#eddcca" },
    { x: 3.0, y: 0.5, z: 12.2, sx: 0.7, sy: 0.5, sz: 0.7, color: "#f7eee3" },
  ], []);

  return (
    <group>
      {/* Main realistic terrain mesh */}
      <mesh geometry={terrainGeometry} receiveShadow castShadow>
        <meshStandardMaterial
          vertexColors
          roughness={0.82}
          metalness={0.08}
          flatShading={false}
        />
      </mesh>

      {/* Animated Water layer in riverbed */}
      <mesh
        ref={waterMeshRef}
        position={[1.0, 0.28, 2.5]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[18, 24, 24, 24]} />
        <meshStandardMaterial
          color="#0284c7"
          roughness={0.12}
          metalness={0.7}
          transparent
          opacity={0.82}
        />
      </mesh>

      {/* Animated Waterfall stream plane descending into valley */}
      <mesh
        ref={waterfallRef}
        position={[-1.6, 1.8, -2.6]}
        rotation={[0.4, 0.3, 0]}
      >
        <planeGeometry args={[0.9, 1.6, 8, 8]} />
        <meshStandardMaterial
          color="#e0f2fe"
          roughness={0.08}
          metalness={0.85}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Waterfall Base Splash Foam */}
      <group ref={foamRef} position={[-1.5, 0.45, -2.1]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.15, 0.6, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
        </mesh>
      </group>

      {/* Drifting Atmospheric Clouds */}
      <group ref={cloudsRef}>
        {[
          [-6, 7.2, -7, 1.1],
          [2, 8.0, -4, 1.3],
          [-3, 6.6, 2, 0.9],
          [5, 6.8, 6, 1.2],
        ].map(([cx, cy, cz, cs], i) => (
          <group key={`cloud-${i}`} position={[cx, cy, cz]} scale={[cs, cs * 0.55, cs]}>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.65, 8, 8]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.8} roughness={0.9} />
            </mesh>
            <mesh position={[0.45, 0.08, 0]}>
              <sphereGeometry args={[0.5, 8, 8]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.8} roughness={0.9} />
            </mesh>
            <mesh position={[-0.45, -0.04, 0.1]}>
              <sphereGeometry args={[0.48, 8, 8]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.8} roughness={0.9} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Stone Bridge crossing river */}
      <group position={[2.5, 0.45, 9.5]} rotation={[0, -0.4, 0]}>
        <mesh castShadow receiveShadow position={[0, 0.05, 0]}>
          <boxGeometry args={[1.6, 0.15, 0.7]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.7} />
        </mesh>
        <mesh position={[-0.7, 0.2, 0]}>
          <boxGeometry args={[0.1, 0.25, 0.7]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        <mesh position={[0.7, 0.2, 0]}>
          <boxGeometry args={[0.1, 0.25, 0.7]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
      </group>

      {/* Farm field patches */}
      {farmPlots.map((plot, idx) => (
        <mesh
          key={idx}
          position={[plot.x, plot.y, plot.z]}
          rotation={[-Math.PI / 2, 0, plot.rot]}
          receiveShadow
        >
          <planeGeometry args={[plot.w, plot.h]} />
          <meshStandardMaterial
            color={plot.color}
            roughness={0.9}
            polygonOffset
            polygonOffsetFactor={-1}
          />
        </mesh>
      ))}

      {/* Instanced/grouped pine trees */}
      {trees.map(([x, y, z, s], i) => (
        <group key={i} position={[x, y, z]} scale={[s, s, s]}>
          {/* Trunk */}
          <mesh position={[0, 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.09, 0.4, 6]} />
            <meshStandardMaterial color="#5c3818" roughness={0.9} />
          </mesh>
          {/* Foliage tiers */}
          <mesh position={[0, 0.5, 0]} castShadow>
            <coneGeometry args={[0.35, 0.55, 6]} />
            <meshStandardMaterial color="#166534" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.8, 0]} castShadow>
            <coneGeometry args={[0.26, 0.45, 6]} />
            <meshStandardMaterial color="#15803d" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Settlement Buildings */}
      {buildings.map((b, i) => (
        <group key={i} position={[b.x, b.y, b.z]}>
          <mesh castShadow receiveShadow position={[0, b.sy / 2, 0]}>
            <boxGeometry args={[b.sx, b.sy, b.sz]} />
            <meshStandardMaterial color={b.color} roughness={0.8} />
          </mesh>
          {/* Flat or dome roof */}
          <mesh position={[0, b.sy + 0.05, 0]}>
            <boxGeometry args={[b.sx * 1.05, 0.08, b.sz * 1.05]} />
            <meshStandardMaterial color="#c2410c" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Start Banner / Flag at summit */}
      <group position={[-3.2, 5.8, -9.2]}>
        <mesh position={[0, 0.7, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1.4]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0.25, 1.2, 0]}>
          <boxGeometry args={[0.45, 0.25, 0.02]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        <Html position={[0, 1.6, 0]} center distanceFactor={14}>
          <div className="bg-slate-900/90 text-white font-bold text-[11px] px-2 py-0.5 rounded shadow tracking-wide uppercase border border-slate-700 pointer-events-none select-none">
            START
          </div>
        </Html>
      </group>

      {/* Finish Arch & Checkered Flag at settlement */}
      <group position={[4.2, 0.45, 11.2]}>
        {/* Left post */}
        <mesh position={[-0.8, 0.7, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 1.4]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Right post */}
        <mesh position={[0.8, 0.7, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 1.4]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Crossbar */}
        <mesh position={[0, 1.35, 0]} castShadow>
          <boxGeometry args={[1.7, 0.2, 0.08]} />
          <meshStandardMaterial color="#f97316" />
        </mesh>
        <Html position={[0, 1.7, 0]} center distanceFactor={14}>
          <div className="bg-emerald-600 text-white font-extrabold text-[12px] px-2.5 py-0.5 rounded-full shadow-lg tracking-wider border-2 border-white pointer-events-none select-none animate-pulse">
            FINISH
          </div>
        </Html>
      </group>

      {/* Summit Snow Flurries Particle Cloud */}
      <points ref={snowRef} geometry={snowGeometry}>
        <pointsMaterial
          color="#ffffff"
          size={0.07}
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </points>

      {/* 3D Farmland Windmill in Plains */}
      <group position={[-4.2, 0.52, 5.8]}>
        {/* Stone / Timber Tower Base */}
        <mesh position={[0, 0.7, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.36, 1.4, 8]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.7} />
        </mesh>
        {/* Conical Roof Cap */}
        <mesh position={[0, 1.5, 0]}>
          <coneGeometry args={[0.26, 0.3, 8]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.6} />
        </mesh>
        {/* Rotor Hub & 4 Spinning Blades */}
        <group ref={windmillRotorRef} position={[0, 1.35, 0.24]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.08, 8]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          {/* Vertical Blade */}
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[0.07, 1.3, 0.015]} />
            <meshStandardMaterial color="#fed7aa" />
          </mesh>
          {/* Horizontal Blade */}
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[1.3, 0.07, 0.015]} />
            <meshStandardMaterial color="#fed7aa" />
          </mesh>
        </group>
      </group>

      {/* 3D Floating Zone Landmark Labels (Clickable for Educational Exploration) */}
      <Html position={[-0.5, 4.4, -6.8]} center distanceFactor={15}>
        <button
          onClick={() => onSelectZone?.('mountains')}
          title="Click to explore Mountains"
          className={`px-3 py-1.5 rounded-xl text-[11px] font-black tracking-wide shadow-lg transition-all duration-300 pointer-events-auto cursor-pointer border select-none hover:scale-110 active:scale-95 ${
            highlightZone === 'mountains' 
              ? 'bg-sky-500 text-white border-white scale-125 shadow-sky-500/50 ring-2 ring-white' 
              : 'bg-white/95 text-slate-800 border-slate-200/90 hover:bg-sky-50 hover:text-sky-700'
          }`}
        >
          🏔️ MOUNTAINS
        </button>
      </Html>

      <Html position={[-0.8, 2.2, -3.2]} center distanceFactor={15}>
        <button
          onClick={() => onSelectZone?.('valley')}
          title="Click to explore Valley"
          className={`px-3 py-1.5 rounded-xl text-[11px] font-black tracking-wide shadow-lg transition-all duration-300 pointer-events-auto cursor-pointer border select-none hover:scale-110 active:scale-95 ${
            highlightZone === 'valley' 
              ? 'bg-emerald-500 text-white border-white scale-125 shadow-emerald-500/50 ring-2 ring-white' 
              : 'bg-white/95 text-slate-800 border-slate-200/90 hover:bg-emerald-50 hover:text-emerald-700'
          }`}
        >
          🏞️ VALLEY
        </button>
      </Html>

      <Html position={[3.8, 2.9, 1.5]} center distanceFactor={15}>
        <button
          onClick={() => onSelectZone?.('plateau')}
          title="Click to explore Plateau"
          className={`px-3 py-1.5 rounded-xl text-[11px] font-black tracking-wide shadow-lg transition-all duration-300 pointer-events-auto cursor-pointer border select-none hover:scale-110 active:scale-95 ${
            highlightZone === 'plateau' 
              ? 'bg-amber-500 text-white border-white scale-125 shadow-amber-500/50 ring-2 ring-white' 
              : 'bg-white/95 text-slate-800 border-slate-200/90 hover:bg-amber-50 hover:text-amber-700'
          }`}
        >
          🏜️ PLATEAU
        </button>
      </Html>

      <Html position={[0.2, 1.2, 5.6]} center distanceFactor={15}>
        <button
          onClick={() => onSelectZone?.('plains')}
          title="Click to explore Plains"
          className={`px-3 py-1.5 rounded-xl text-[11px] font-black tracking-wide shadow-lg transition-all duration-300 pointer-events-auto cursor-pointer border select-none hover:scale-110 active:scale-95 ${
            highlightZone === 'plains' 
              ? 'bg-lime-600 text-white border-white scale-125 shadow-lime-600/50 ring-2 ring-white' 
              : 'bg-white/95 text-slate-800 border-slate-200/90 hover:bg-lime-50 hover:text-lime-700'
          }`}
        >
          🌾 PLAINS
        </button>
      </Html>
    </group>
  );
};
