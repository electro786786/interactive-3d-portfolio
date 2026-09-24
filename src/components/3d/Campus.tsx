import React from 'react';
import { Ground } from './Ground';
import { Building } from './Building';
import { VoxelHouse } from './VoxelHouse';
import { Tree } from './Tree';
import { Torch } from './Torch';
import { SignBoard } from './SignBoard';

export const Campus: React.FC = () => {
  return (
    <group>
      <Ground />
      
      {/* Central SignBoard */}
      <SignBoard position={[0, 0, 8]} />

      {/* Buildings based on user's layout - Spaced out for a village feel */}
      {/* Main Hub */}
      <Building position={[0, 0, 30]} name="Main Hub" color="#D7CCC8" size={[10, 8, 10]} />
      
      {/* Test Voxel House (Replacing About Me) */}
      <VoxelHouse position={[0, 0, 50]} width={9} depth={9} height={4} name="About Me" />
      
      {/* AI Lab */}
      <Building position={[0, 0, -20]} name="AI Lab" color="#BCAAA4" size={[12, 10, 12]} />
      
      {/* Network Lab */}
      <Building position={[-25, 0, 0]} name="Network Lab" color="#CFD8DC" size={[9, 8, 9]} />
      
      {/* DSA Lab */}
      <VoxelHouse position={[25, 0, 0]} width={9} depth={9} height={4} name="DSA Lab" />

      {/* Village Torches illuminating paths */}
      <Torch position={[-3, 0, 15]} />
      <Torch position={[3, 0, 15]} />
      <Torch position={[-3, 0, 40]} />
      <Torch position={[3, 0, 40]} />
      
      <Torch position={[-15, 0, 3]} />
      <Torch position={[15, 0, 3]} />
      
      <Torch position={[-3, 0, -5]} />
      <Torch position={[3, 0, -5]} />

      {/* Decorative Trees - Spaced out organically */}
      <Tree position={[-10, 0, 10]} />
      <Tree position={[12, 0, 15]} />
      <Tree position={[-18, 0, 25]} />
      <Tree position={[15, 0, 35]} />
      
      <Tree position={[-15, 0, -10]} />
      <Tree position={[20, 0, -15]} />
      <Tree position={[-8, 0, -25]} />
      <Tree position={[10, 0, -30]} />
    </group>
  );
};
