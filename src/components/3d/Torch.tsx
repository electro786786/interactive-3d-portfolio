import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TorchProps {
  position: [number, number, number];
}

export const Torch: React.FC<TorchProps> = ({ position }) => {
  const lightRef = useRef<THREE.PointLight>(null);
  const flameRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (lightRef.current) {
      // Flicker effect: mix of sine waves
      const flicker = Math.sin(t * 15) * 0.1 + Math.sin(t * 25) * 0.05 + Math.random() * 0.1;
      lightRef.current.intensity = 2 + flicker;
    }
    if (flameRef.current) {
      // Flame animation
      flameRef.current.scale.y = 1 + Math.sin(t * 10) * 0.2;
      flameRef.current.position.y = 1.6 + Math.sin(t * 10) * 0.05;
    }
  });

  return (
    <group position={position}>
      {/* Wooden Pole */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.08, 1.5]} />
        <meshStandardMaterial color="#5D4037" roughness={0.9} />
      </mesh>

      {/* Metal Holder */}
      <mesh position={[0, 1.45, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.08, 0.2]} />
        <meshStandardMaterial color="#212121" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Flame */}
      <mesh ref={flameRef} position={[0, 1.6, 0]}>
        <coneGeometry args={[0.15, 0.4, 8]} />
        <meshBasicMaterial color="#FF5722" />
      </mesh>

      {/* Core Flame (Inner) */}
      <mesh position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color="#FFEB3B" />
      </mesh>

      {/* Light Source */}
      <pointLight 
        ref={lightRef} 
        position={[0, 1.7, 0]} 
        color="#FFA726" 
        distance={15} 
        decay={2} 
        intensity={2} 
        // castShadow removed for performance (8 point light shadows will lag normal laptops)
      />
    </group>
  );
};
