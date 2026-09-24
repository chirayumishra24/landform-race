import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { TerrainWorld } from './TerrainWorld';
import { RaceVehicle } from './RaceVehicle';
import { RacePath } from './RacePath';
import { TerrainCamera } from './TerrainCamera';
import { EnvironmentLighting } from './EnvironmentLighting';
import { getTeamCurves } from './pathCoordinates';
import { LandformZone, TeamProgress } from '@/types/game';

interface DioramaCanvasProps {
  blueTeam: TeamProgress;
  orangeTeam: TeamProgress;
  activeZone: LandformZone;
  hintZone: LandformZone | null;
  allowOrbit: boolean;
  cameraMode?: 'overview' | 'chase';
  onSelectZone?: (zone: LandformZone) => void;
}

export const DioramaCanvas: React.FC<DioramaCanvasProps> = ({
  blueTeam,
  orangeTeam,
  activeZone,
  hintZone,
  allowOrbit,
  cameraMode = 'overview',
  onSelectZone
}) => {
  const { blueCurve, orangeCurve } = useMemo(() => getTeamCurves(), []);

  // Compute lead vehicle position and tangent for chase camera
  const { leadPosition, leadTangent } = useMemo(() => {
    const isBlueLeading = blueTeam.checkpoint >= orangeTeam.checkpoint;
    const leadCp = isBlueLeading ? blueTeam.checkpoint : orangeTeam.checkpoint;
    const curve = isBlueLeading ? blueCurve : orangeCurve;
    const t = Math.min(0.999, Math.max(0.001, leadCp / 15));
    return {
      leadPosition: curve.getPointAt(t),
      leadTangent: curve.getTangentAt(t)
    };
  }, [blueTeam.checkpoint, orangeTeam.checkpoint, blueCurve, orangeCurve]);

  return (
    <div className="w-full h-full relative select-none rounded-3xl overflow-hidden bg-gradient-to-b from-sky-100/70 via-sky-50/50 to-amber-50/30">
      <Canvas
        shadows
        camera={{ position: [0.5, 11.5, 14.5], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <EnvironmentLighting />
          
          <TerrainCamera
            activeZone={activeZone}
            hintZone={hintZone}
            allowOrbit={allowOrbit}
            cameraMode={cameraMode}
            leadPosition={leadPosition}
            leadTangent={leadTangent}
          />

          <TerrainWorld
            highlightZone={hintZone}
            onSelectZone={onSelectZone}
          />

          <RacePath
            blueCurve={blueCurve}
            orangeCurve={orangeCurve}
            blueCheckpoint={blueTeam.checkpoint}
            orangeCheckpoint={orangeTeam.checkpoint}
          />

          <RaceVehicle
            color="blue"
            teamName="North Star"
            checkpoint={blueTeam.checkpoint}
            isMoving={blueTeam.isMoving}
            isBoosting={blueTeam.isBoosting}
            curve={blueCurve}
          />

          <RaceVehicle
            color="orange"
            teamName="Earth Explorers"
            checkpoint={orangeTeam.checkpoint}
            isMoving={orangeTeam.isMoving}
            isBoosting={orangeTeam.isBoosting}
            curve={orangeCurve}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
