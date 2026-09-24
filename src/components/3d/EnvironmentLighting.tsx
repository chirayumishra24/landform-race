import React from 'react';

export const EnvironmentLighting: React.FC = () => {
  return (
    <>
      {/* Soft warm ambient light */}
      <ambientLight intensity={0.75} color="#e0f2fe" />

      {/* Main sun light from top-right / front */}
      <directionalLight
        position={[14, 22, 12]}
        intensity={1.4}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
        shadow-bias={-0.0003}
        color="#fffbeb"
      />

      {/* Sky bounce light (cool sky fill) */}
      <hemisphereLight
        args={['#bae6fd', '#334155', 0.55]}
        position={[0, 30, 0]}
      />

      {/* Rim light for mountain edges */}
      <directionalLight
        position={[-12, 14, -14]}
        intensity={0.65}
        color="#93c5fd"
      />
    </>
  );
};
