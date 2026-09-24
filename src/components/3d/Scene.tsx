import React from 'react';
import { PointerLockControls, Sky } from '@react-three/drei';
import { Campus } from './Campus';
import { Player } from './Player';

export const Scene: React.FC = () => {
  return (
    <>
      {/* Minecraft Daylight Setup */}
      <Sky sunPosition={[100, 50, 100]} turbidity={0.1} rayleigh={0.5} mieCoefficient={0.005} mieDirectionalG={0.8} />
      <ambientLight intensity={0.7} color="#ffffff" />
      <directionalLight 
        position={[100, 100, 50]} 
        intensity={1.5} 
        color="#ffffff"
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      
      {/* Player Controller */}
      <PointerLockControls />
      <Player />
      
      {/* The Campus World */}
      <React.Suspense fallback={null}>
        <Campus />
      </React.Suspense>
    </>
  );
};
