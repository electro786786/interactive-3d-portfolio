import React from 'react';
import { Text } from '@react-three/drei';

interface SignBoardProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

export const SignBoard: React.FC<SignBoardProps> = ({ position, rotation = [0, 0, 0] }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Central Post */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.1, 0.1, 3]} />
        <meshStandardMaterial color="#4E342E" roughness={0.9} />
      </mesh>

      {/* Sign 1: AI Lab (Pointing Right) */}
      <group position={[0.5, 2.5, 0]}>
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.6, 0.1]} />
          <meshStandardMaterial color="#5D4037" roughness={0.9} />
        </mesh>
        <mesh position={[0.75, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow receiveShadow>
          <coneGeometry args={[0.4, 0.5, 4]} />
          <meshStandardMaterial color="#5D4037" roughness={0.9} />
        </mesh>
        <Text position={[0, 0, 0.06]} fontSize={0.25} color="white" anchorX="center" anchorY="middle">
          AI Lab
        </Text>
      </group>

      {/* Sign 2: Network Lab (Pointing Left) */}
      <group position={[-0.5, 1.8, 0]}>
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.6, 0.1]} />
          <meshStandardMaterial color="#5D4037" roughness={0.9} />
        </mesh>
        <mesh position={[-0.75, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <coneGeometry args={[0.4, 0.5, 4]} />
          <meshStandardMaterial color="#5D4037" roughness={0.9} />
        </mesh>
        <Text position={[0, 0, 0.06]} fontSize={0.22} color="white" anchorX="center" anchorY="middle">
          Network
        </Text>
      </group>
      
      {/* Sign 3: Main Hub (Pointing Forward) */}
      <group position={[0, 1.1, 0.5]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.6, 0.1]} />
          <meshStandardMaterial color="#5D4037" roughness={0.9} />
        </mesh>
        <mesh position={[0.75, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow receiveShadow>
          <coneGeometry args={[0.4, 0.5, 4]} />
          <meshStandardMaterial color="#5D4037" roughness={0.9} />
        </mesh>
        <Text position={[0, 0, 0.06]} fontSize={0.25} color="white" anchorX="center" anchorY="middle">
          Main Hub
        </Text>
      </group>
    </group>
  );
};
