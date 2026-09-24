import React from 'react';
import { logTexture, leavesTexture } from './Textures';

interface TreeProps {
  position: [number, number, number];
}

export const Tree: React.FC<TreeProps> = ({ position }) => {
  const logMat = <meshStandardMaterial map={logTexture} roughness={1} />;
  const leavesMat = <meshStandardMaterial map={leavesTexture} roughness={1} />;

  return (
    <group position={position}>
      {/* Minecraft Trunk (1x4x1 blocks) */}
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 4, 1]} />
        {logMat}
      </mesh>
      
      {/* Leaves Layer 1 (5x2x5) */}
      <mesh position={[0, 5, 0]} castShadow receiveShadow>
        <boxGeometry args={[5, 2, 5]} />
        {leavesMat}
      </mesh>

      {/* Leaves Layer 2 (3x2x3 on top) */}
      <mesh position={[0, 7, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 2, 3]} />
        {leavesMat}
      </mesh>
    </group>
  );
};
