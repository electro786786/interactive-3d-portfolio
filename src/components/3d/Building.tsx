import React, { useEffect } from 'react';
import { Text } from '@react-three/drei';
import { registerCollider } from './CollisionSystem';
import { planksTexture, cobblestoneTexture, logTexture } from './Textures';

interface BuildingProps {
  position: [number, number, number];
  name: string;
  color?: string;
  size?: [number, number, number];
}

export const Building: React.FC<BuildingProps> = ({ 
  position, 
  name, 
  color = "#ffffff", 
  size = [6, 6, 6] 
}) => {
  const [w, h, d] = size;
  const t = 0.5; // Wall thickness

  const roofHeight = h * 0.6;
  const roofY = h + roofHeight / 2;

  // Use procedural Minecraft-style textures
  // We clone them to adjust repeat based on wall size to keep pixels square
  const wallMat = <meshStandardMaterial map={planksTexture} roughness={1} />;
  const roofMat = <meshStandardMaterial map={cobblestoneTexture} roughness={1} />;
  const logMat = <meshStandardMaterial map={logTexture} roughness={1} />;

  // Register the bounding boxes for collision
  useEffect(() => {
    const px = position[0];
    const pz = position[2];
    
    const colliders = [
      // Left Wall
      { minX: px - w/2, maxX: px - w/2 + t, minZ: pz - d/2, maxZ: pz + d/2 },
      // Right Wall
      { minX: px + w/2 - t, maxX: px + w/2, minZ: pz - d/2, maxZ: pz + d/2 },
      // Back Wall
      { minX: px - w/2, maxX: px + w/2, minZ: pz - d/2, maxZ: pz - d/2 + t },
      // Front Wall Left (Door is between x=-1.5 and x=1.5)
      { minX: px - w/2, maxX: px - 1.5, minZ: pz + d/2 - t, maxZ: pz + d/2 },
      // Front Wall Right
      { minX: px + 1.5, maxX: px + w/2, minZ: pz + d/2 - t, maxZ: pz + d/2 },
    ];

    const cleanupFns = colliders.map(c => registerCollider(c));
    return () => cleanupFns.forEach(fn => fn());
  }, [position, w, d]);

  return (
    <group position={position}>
      {/* Wooden Floor Interior */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
        <planeGeometry args={[w - t*2, d - t*2]} />
        {wallMat}
      </mesh>

      {/* Left Wall */}
      <mesh position={[-w/2 + t/2, h/2, 0]} castShadow receiveShadow>
        <boxGeometry args={[t, h, d]} />
        {wallMat}
      </mesh>
      
      {/* Right Wall */}
      <mesh position={[w/2 - t/2, h/2, 0]} castShadow receiveShadow>
        <boxGeometry args={[t, h, d]} />
        {wallMat}
      </mesh>
      
      {/* Back Wall */}
      <mesh position={[0, h/2, -d/2 + t/2]} castShadow receiveShadow>
        <boxGeometry args={[w - t*2, h, t]} />
        {wallMat}
      </mesh>
      
      {/* Front Wall (Left of Door) */}
      <mesh position={[-(w/2 + 1.5)/2 + t/2, h/2, d/2 - t/2]} castShadow receiveShadow>
        <boxGeometry args={[w/2 - 1.5 - t, h, t]} />
        {wallMat}
      </mesh>
      
      {/* Front Wall (Right of Door) */}
      <mesh position={[(w/2 + 1.5)/2 - t/2, h/2, d/2 - t/2]} castShadow receiveShadow>
        <boxGeometry args={[w/2 - 1.5 - t, h, t]} />
        {wallMat}
      </mesh>
      
      {/* Front Wall (Above Door) */}
      <mesh position={[0, (h + 3)/2, d/2 - t/2]} castShadow receiveShadow>
        <boxGeometry args={[3, h - 3, t]} />
        {wallMat}
      </mesh>

      {/* 4 Oak Log Pillars at the corners */}
      <mesh position={[-w/2 + t/2, h/2, -d/2 + t/2]} castShadow receiveShadow>
        <boxGeometry args={[t + 0.1, h + 0.1, t + 0.1]} />
        {logMat}
      </mesh>
      <mesh position={[w/2 - t/2, h/2, -d/2 + t/2]} castShadow receiveShadow>
        <boxGeometry args={[t + 0.1, h + 0.1, t + 0.1]} />
        {logMat}
      </mesh>
      <mesh position={[-w/2 + t/2, h/2, d/2 - t/2]} castShadow receiveShadow>
        <boxGeometry args={[t + 0.1, h + 0.1, t + 0.1]} />
        {logMat}
      </mesh>
      <mesh position={[w/2 - t/2, h/2, d/2 - t/2]} castShadow receiveShadow>
        <boxGeometry args={[t + 0.1, h + 0.1, t + 0.1]} />
        {logMat}
      </mesh>

      {/* Minecraft Stepped Roof (Staircase effect) */}
      {[...Array(Math.ceil(w / 2))].map((_, i) => {
        const stepWidth = w + 1 - (i * 2);
        const stepHeight = 1;
        const stepY = h + 0.5 + (i * stepHeight);
        
        if (stepWidth <= 0) return null;
        
        return (
          <mesh key={i} position={[0, stepY, 0]} castShadow receiveShadow>
            <boxGeometry args={[stepWidth, stepHeight, d + 1]} />
            {roofMat}
          </mesh>
        );
      })}

      {/* Interior Light */}
      <pointLight position={[0, h - 1, 0]} color="#FFD54F" intensity={0.5} distance={10} />

      {/* Signage Board */}
      <mesh position={[0, h + 1, d / 2 + 0.2]} castShadow>
        <boxGeometry args={[4, 1.2, 0.2]} />
        <meshStandardMaterial color="#3E2723" />
      </mesh>
      <Text
        position={[0, h + 1, d / 2 + 0.32]}
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
