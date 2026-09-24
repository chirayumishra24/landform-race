import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { LandformZone } from '@/types/game';

interface TerrainCameraProps {
  activeZone: LandformZone;
  hintZone: LandformZone | null;
  allowOrbit: boolean;
}

export const TerrainCamera: React.FC<TerrainCameraProps> = ({
  activeZone,
  hintZone,
  allowOrbit
}) => {
  const { camera } = useThree();
  const targetLookAt = useRef(new THREE.Vector3(0, 1.5, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 1.5, 0));

  useFrame((_, delta) => {
    // Determine target camera position and lookAt based on hint or active zone
    const zoneToFocus = hintZone || activeZone;

    let targetCamPos = new THREE.Vector3(0, 12, 16);
    let targetCenter = new THREE.Vector3(0, 1.5, 0);

    switch (zoneToFocus) {
      case 'mountains':
        targetCamPos.set(-2.0, 10.5, 8.5);
        targetCenter.set(-2.2, 4.0, -7.0);
        break;
      case 'valley':
        targetCamPos.set(-1.0, 8.0, 7.5);
        targetCenter.set(-0.8, 1.8, -2.5);
        break;
      case 'plateau':
        targetCamPos.set(4.5, 9.0, 9.0);
        targetCenter.set(3.2, 2.5, 1.8);
        break;
      case 'plains':
        targetCamPos.set(-0.5, 8.5, 11.0);
        targetCenter.set(-0.5, 1.0, 6.0);
        break;
      case 'river':
        targetCamPos.set(2.0, 7.5, 13.0);
        targetCenter.set(2.0, 0.8, 9.2);
        break;
      case 'settlement':
        targetCamPos.set(4.5, 6.8, 15.0);
        targetCenter.set(4.2, 0.6, 11.2);
        break;
      default:
        // Default overview angle matching the reference screenshot
        targetCamPos.set(0.5, 11.5, 14.5);
        targetCenter.set(0.5, 1.6, 0.5);
        break;
    }

    if (!allowOrbit) {
      // Smoothly interpolate camera position
      camera.position.lerp(targetCamPos, delta * 1.8);

      // Smoothly interpolate lookAt target
      currentLookAt.current.lerp(targetCenter, delta * 2.2);
      camera.lookAt(currentLookAt.current);
    }
  });

  return allowOrbit ? (
    <OrbitControls
      enablePan={false}
      minDistance={6}
      maxDistance={25}
      maxPolarAngle={Math.PI / 2.1}
      target={[0.5, 1.5, 0.5]}
    />
  ) : null;
};
