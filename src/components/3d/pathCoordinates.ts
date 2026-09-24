import * as THREE from 'three';

// 16 keypoints (0: Start, 1-3: Mountains, 4-6: Valley, 7-9: Plateau, 10-12: Plains, 13-14: River, 15: Settlement Finish)
export interface CheckpointCoord {
  id: number;
  name: string;
  zone: "mountains" | "valley" | "plateau" | "plains" | "river" | "settlement";
  position: THREE.Vector3;
}

export const BASE_CHECKPOINTS: CheckpointCoord[] = [
  { id: 0, name: "Start Expedition", zone: "mountains", position: new THREE.Vector3(-3.2, 5.8, -9.2) },
  { id: 1, name: "Summit Pass", zone: "mountains", position: new THREE.Vector3(-2.0, 5.0, -8.0) },
  { id: 2, name: "Alpine Ridge", zone: "mountains", position: new THREE.Vector3(-3.8, 4.2, -6.6) },
  { id: 3, name: "Pine Tree Line", zone: "mountains", position: new THREE.Vector3(-1.8, 3.2, -5.2) },
  
  { id: 4, name: "Valley Entrance", zone: "valley", position: new THREE.Vector3(-0.6, 2.1, -3.8) },
  { id: 5, name: "Waterfall Gorge", zone: "valley", position: new THREE.Vector3(-1.4, 1.4, -2.4) },
  { id: 6, name: "Valley Stream", zone: "valley", position: new THREE.Vector3(0.2, 1.2, -1.0) },
  
  { id: 7, name: "Plateau Ascent", zone: "plateau", position: new THREE.Vector3(2.2, 2.4, 0.2) },
  { id: 8, name: "Tableland Mineral Ridge", zone: "plateau", position: new THREE.Vector3(3.6, 2.7, 1.6) },
  { id: 9, name: "Plateau Escarpment Edge", zone: "plateau", position: new THREE.Vector3(2.4, 2.2, 3.2) },
  
  { id: 10, name: "Plains Descent", zone: "plains", position: new THREE.Vector3(0.4, 1.1, 4.5) },
  { id: 11, name: "Farmland Crossing", zone: "plains", position: new THREE.Vector3(-1.2, 0.65, 5.8) },
  { id: 12, name: "Agricultural Greenbelt", zone: "plains", position: new THREE.Vector3(0.1, 0.55, 7.2) },
  
  { id: 13, name: "Meandering Riverbend", zone: "river", position: new THREE.Vector3(1.6, 0.45, 8.6) },
  { id: 14, name: "River Crossing Bridge", zone: "river", position: new THREE.Vector3(2.8, 0.5, 9.8) },
  
  { id: 15, name: "Settlement Finish", zone: "settlement", position: new THREE.Vector3(4.2, 0.45, 11.2) }
];

// Generates parallel curves for blue (slightly left) and orange (slightly right)
export function getTeamCurves() {
  const bluePoints: THREE.Vector3[] = [];
  const orangePoints: THREE.Vector3[] = [];

  for (let i = 0; i < BASE_CHECKPOINTS.length; i++) {
    const p = BASE_CHECKPOINTS[i].position;
    // Calculate normal perpendicular offset
    let dir = new THREE.Vector3(0, 0, 1);
    if (i < BASE_CHECKPOINTS.length - 1) {
      dir = BASE_CHECKPOINTS[i + 1].position.clone().sub(p).normalize();
    } else if (i > 0) {
      dir = p.clone().sub(BASE_CHECKPOINTS[i - 1].position).normalize();
    }
    const side = new THREE.Vector3(-dir.z, 0, dir.x).normalize();

    // Offset distance: 0.35 units
    const blueOffset = side.clone().multiplyScalar(0.32);
    const orangeOffset = side.clone().multiplyScalar(-0.32);

    bluePoints.push(new THREE.Vector3(p.x + blueOffset.x, p.y + 0.05, p.z + blueOffset.z));
    orangePoints.push(new THREE.Vector3(p.x + orangeOffset.x, p.y + 0.05, p.z + orangeOffset.z));
  }

  const blueCurve = new THREE.CatmullRomCurve3(bluePoints, false, 'centripetal', 0.5);
  const orangeCurve = new THREE.CatmullRomCurve3(orangePoints, false, 'centripetal', 0.5);

  return { blueCurve, orangeCurve, bluePoints, orangePoints };
}
