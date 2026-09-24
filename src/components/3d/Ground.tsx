import React from 'react';

export const Ground: React.FC = () => {
  return (
    <group>
      {/* Main Grass Area */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[150, 150]} />
        <meshStandardMaterial color="#2d4a22" roughness={0.9} />
      </mesh>

      {/* Main Hub Pathway */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 10]} receiveShadow>
        <planeGeometry args={[4, 25]} />
        <meshStandardMaterial color="#555555" roughness={0.8} />
      </mesh>
      
      {/* Horizontal Pathway to Labs */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[30, 4]} />
        <meshStandardMaterial color="#555555" roughness={0.8} />
      </mesh>
    </group>
  );
};
