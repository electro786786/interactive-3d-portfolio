import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { registerCollider } from './CollisionSystem';
import { 
  planksTexture, cobblestoneTexture, logTexture, 
  roofTexture, glassTexture, doorTexture, stonebrickTexture, dirtTexture
} from './Textures';

interface VoxelHouseProps {
  position: [number, number, number];
  width: number; // e.g. 9
  depth: number; // e.g. 9
  height: number; // e.g. 4
  name: string;
}

// Helper to create instanced matrices
const createInstancedBuffer = (blocks: {pos: THREE.Vector3, scale?: number}[]) => {
  const instancedData = new Float32Array(blocks.length * 16);
  const dummy = new THREE.Object3D();
  blocks.forEach((b, i) => {
    dummy.position.copy(b.pos);
    const s = b.scale || 0.99; // Slight scale reduction for voxel seams
    dummy.scale.set(s, s, s);
    dummy.updateMatrix();
    dummy.matrix.toArray(instancedData, i * 16);
  });
  return new THREE.InstancedBufferAttribute(instancedData, 16);
};

export const VoxelHouse: React.FC<VoxelHouseProps> = ({ position, width, depth, height, name }) => {
  
  // Register Collisions
  useEffect(() => {
    const px = position[0];
    const pz = position[2];
    
    // Half dimensions for grid calculations
    const hW = Math.floor(width / 2);
    const hD = Math.floor(depth / 2);
    const t = 1.0; // Wall thickness (1 block)

    // Using AABB colliders for the perimeter of the VoxelHouse
    // These block the player from walking through the exterior walls.
    const colliders = [
      // Left Wall
      { minX: px - hW - t/2, maxX: px - hW + t/2, minZ: pz - hD - t/2, maxZ: pz + hD + t/2 },
      // Right Wall
      { minX: px + hW - t/2, maxX: px + hW + t/2, minZ: pz - hD - t/2, maxZ: pz + hD + t/2 },
      // Back Wall
      { minX: px - hW - t/2, maxX: px + hW + t/2, minZ: pz - hD - t/2, maxZ: pz - hD + t/2 },
      // Front Wall Left (Door gap is from x=-0.5 to x=0.5)
      { minX: px - hW - t/2, maxX: px - 0.5, minZ: pz + hD - t/2, maxZ: pz + hD + t/2 },
      // Front Wall Right
      { minX: px + 0.5, maxX: px + hW + t/2, minZ: pz + hD - t/2, maxZ: pz + hD + t/2 },
    ];

    const cleanupFns = colliders.map(c => registerCollider(c));
    return () => cleanupFns.forEach(fn => fn());
  }, [position, width, depth]);

  const { foundation, walls, beams, roof, glass, door, stonebrick, dirt } = useMemo(() => {
    const minX = -Math.floor(width / 2);
    const maxX = Math.floor(width / 2);
    const minZ = -Math.floor(depth / 2);
    const maxZ = Math.floor(depth / 2);

    const f: {pos: THREE.Vector3, scale?: number}[] = [];
    const w: {pos: THREE.Vector3, scale?: number}[] = [];
    const b: {pos: THREE.Vector3, scale?: number}[] = [];
    const r: {pos: THREE.Vector3, scale?: number}[] = [];
    const g: {pos: THREE.Vector3, scale?: number}[] = [];
    const d: {pos: THREE.Vector3, scale?: number}[] = [];
    const sb: {pos: THREE.Vector3, scale?: number}[] = [];
    const dt: {pos: THREE.Vector3, scale?: number}[] = [];

    // 1. Foundation & Floors (y=0.5)
    for (let x = minX - 1; x <= maxX + 1; x++) {
      for (let z = minZ - 1; z <= maxZ + 1; z++) {
        const isHouse = x >= minX && x <= maxX && z >= minZ && z <= maxZ;
        if (isHouse) {
          f.push({pos: new THREE.Vector3(x, 0.5, z)});
        }
      }
    }

    // 2. Walls, Beams, Windows, Doors (y=1.5 to height+0.5)
    for (let y = 1; y <= height; y++) {
      for (let x = minX; x <= maxX; x++) {
        for (let z = minZ; z <= maxZ; z++) {
          const isPerimeter = x === minX || x === maxX || z === minZ || z === maxZ;
          if (!isPerimeter) continue;

          const isCorner = (x === minX || x === maxX) && (z === minZ || z === maxZ);
          const isTopRing = y === height;
          const isDoor = x === 0 && z === maxZ && (y === 1 || y === 2);
          const isDoorFrame = (x === -1 || x === 1) && z === maxZ && (y === 1 || y === 2 || y === 3);
          const isWindow = (
            ((x === minX || x === maxX) && z === 0 && (y === 2 || y === 3)) || 
            (z === minZ && x === 0 && (y === 2 || y === 3))
          );

          const py = y + 0.5;

          if (isCorner || isTopRing || isDoorFrame) {
            b.push({pos: new THREE.Vector3(x, py, z), scale: 1.05}); // Protruding slightly
          } else if (isDoor) {
            // Door is slightly recessed
            d.push({pos: new THREE.Vector3(x, py, z - 0.2)}); 
          } else if (isWindow) {
            // Window is slightly recessed
            const zRecess = x === minX ? 0.2 : (x === maxX ? -0.2 : 0);
            const xRecess = z === minZ ? 0.2 : (z === maxZ ? -0.2 : 0);
            g.push({pos: new THREE.Vector3(x + xRecess, py, z + zRecess)});
          } else {
            w.push({pos: new THREE.Vector3(x, py, z)});
          }
        }
      }
    }

    // 3. Roof (Stepped A-frame along X axis)
    const roofOverhang = 1;
    for (let x = minX - roofOverhang; x <= maxX + roofOverhang; x++) {
      const distFromCenter = Math.abs(x);
      const rHeight = maxX + roofOverhang - distFromCenter;
      const py = height + 1.5 + rHeight;

      for (let z = minZ - roofOverhang; z <= maxZ + roofOverhang; z++) {
        const isTrim = z === minZ - roofOverhang || z === maxZ + roofOverhang;
        if (isTrim) {
          b.push({pos: new THREE.Vector3(x, py, z), scale: 1.05}); // Roof trim
        } else {
          r.push({pos: new THREE.Vector3(x, py, z)}); // Roof blocks
        }
      }
    }

    // 4. Chimney
    const cx = minX + 2;
    const cz = minZ + 2;
    for (let y = height + 1; y <= height + 5; y++) {
      sb.push({pos: new THREE.Vector3(cx, y + 0.5, cz)});
    }

    // 5. Porch & Pathway
    for (let x = -2; x <= 2; x++) {
      for (let z = maxZ + 1; z <= maxZ + 3; z++) {
        if (z === maxZ + 1) {
          w.push({pos: new THREE.Vector3(x, 0.5, z)}); // Porch floor
          if (x === -2 || x === 2) {
             b.push({pos: new THREE.Vector3(x, 1.5, z)}); // Fence post
          }
        } else if (z === maxZ + 2) {
          sb.push({pos: new THREE.Vector3(x, 0.25, z)}); // Stairs
        } else {
          dt.push({pos: new THREE.Vector3(x, 0.01, z)}); // Pathway
          dt.push({pos: new THREE.Vector3(x, 0.01, z+1)});
        }
      }
    }

    return { 
      foundation: f, walls: w, beams: b, roof: r, 
      glass: g, door: d, stonebrick: sb, dirt: dt 
    };
  }, [width, depth, height]);

  // Create Matrices
  const fMat = createInstancedBuffer(foundation);
  const wMat = createInstancedBuffer(walls);
  const bMat = createInstancedBuffer(beams);
  const rMat = createInstancedBuffer(roof);
  const gMat = createInstancedBuffer(glass);
  const dMat = createInstancedBuffer(door);
  const sbMat = createInstancedBuffer(stonebrick);
  const dtMat = createInstancedBuffer(dirt);

  return (
    <group position={position}>
      {foundation.length > 0 && (
        <instancedMesh args={[undefined, undefined, foundation.length]} castShadow receiveShadow frustumCulled={false}>
          <boxGeometry args={[1, 1, 1]}>
            <instancedBufferAttribute attach="attributes-instanceMatrix" {...fMat} />
          </boxGeometry>
          <meshStandardMaterial map={cobblestoneTexture} roughness={1} />
        </instancedMesh>
      )}

      {walls.length > 0 && (
        <instancedMesh args={[undefined, undefined, walls.length]} castShadow receiveShadow frustumCulled={false}>
          <boxGeometry args={[1, 1, 1]}>
            <instancedBufferAttribute attach="attributes-instanceMatrix" {...wMat} />
          </boxGeometry>
          <meshStandardMaterial map={planksTexture} roughness={1} />
        </instancedMesh>
      )}

      {beams.length > 0 && (
        <instancedMesh args={[undefined, undefined, beams.length]} castShadow receiveShadow frustumCulled={false}>
          <boxGeometry args={[1, 1, 1]}>
            <instancedBufferAttribute attach="attributes-instanceMatrix" {...bMat} />
          </boxGeometry>
          <meshStandardMaterial map={logTexture} roughness={1} />
        </instancedMesh>
      )}

      {roof.length > 0 && (
        <instancedMesh args={[undefined, undefined, roof.length]} castShadow receiveShadow frustumCulled={false}>
          <boxGeometry args={[1, 1, 1]}>
            <instancedBufferAttribute attach="attributes-instanceMatrix" {...rMat} />
          </boxGeometry>
          <meshStandardMaterial map={roofTexture} roughness={1} />
        </instancedMesh>
      )}

      {glass.length > 0 && (
        <instancedMesh args={[undefined, undefined, glass.length]} castShadow frustumCulled={false}>
          <boxGeometry args={[1, 1, 1]}>
            <instancedBufferAttribute attach="attributes-instanceMatrix" {...gMat} />
          </boxGeometry>
          <meshStandardMaterial map={glassTexture} roughness={0.2} metalness={0.5} transparent opacity={0.8} />
        </instancedMesh>
      )}

      {door.length > 0 && (
        <instancedMesh args={[undefined, undefined, door.length]} castShadow receiveShadow frustumCulled={false}>
          <boxGeometry args={[1, 1, 1]}>
            <instancedBufferAttribute attach="attributes-instanceMatrix" {...dMat} />
          </boxGeometry>
          <meshStandardMaterial map={doorTexture} roughness={1} />
        </instancedMesh>
      )}

      {stonebrick.length > 0 && (
        <instancedMesh args={[undefined, undefined, stonebrick.length]} castShadow receiveShadow frustumCulled={false}>
          <boxGeometry args={[1, 1, 1]}>
            <instancedBufferAttribute attach="attributes-instanceMatrix" {...sbMat} />
          </boxGeometry>
          <meshStandardMaterial map={stonebrickTexture} roughness={1} />
        </instancedMesh>
      )}

      {dirt.length > 0 && (
        <instancedMesh args={[undefined, undefined, dirt.length]} receiveShadow frustumCulled={false}>
          <boxGeometry args={[1, 0.1, 1]}>
            <instancedBufferAttribute attach="attributes-instanceMatrix" {...dtMat} />
          </boxGeometry>
          <meshStandardMaterial map={dirtTexture} roughness={1} />
        </instancedMesh>
      )}

      {/* Porch Lanterns */}
      <pointLight position={[-2, 2.5, Math.floor(depth / 2) + 1]} color="#FF9800" intensity={0.5} distance={10} />
      <pointLight position={[2, 2.5, Math.floor(depth / 2) + 1]} color="#FF9800" intensity={0.5} distance={10} />
      
      {/* House Name Sign */}
      <mesh position={[0, height + 0.5, Math.floor(depth / 2) + 1.1]} castShadow>
        <boxGeometry args={[4, 1.2, 0.2]} />
        <meshStandardMaterial map={planksTexture} color="#8D6E63" />
      </mesh>
      <Text
        position={[0, height + 0.5, Math.floor(depth / 2) + 1.25]}
        fontSize={0.7}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="black"
        fontWeight="bold"
      >
        {name}
      </Text>
    </group>
  );
};
