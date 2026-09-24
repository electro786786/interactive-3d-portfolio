import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './components/3d/Scene';

function App() {
  return (
    <div className="app-container" style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadows camera={{ position: [0, 10, 30], fov: 50 }}>
        <Scene />
      </Canvas>
    </div>
  );
}

export default App;
