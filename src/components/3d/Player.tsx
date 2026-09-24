import React from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { usePlayerControls } from '../../hooks/usePlayerControls';
import { checkCollision } from './CollisionSystem';

const SPEED = 12; // Units per second
const BOUNDARY = 72; // Prevent walking off the 150x150 grass terrain

export const Player: React.FC = () => {
  const movement = usePlayerControls();
  const { camera } = useThree();

  // Create vectors outside the loop to avoid garbage collection overhead
  const direction = new Vector3();
  const forwardVector = new Vector3();
  const rightVector = new Vector3();

  // Initialize camera position
  React.useEffect(() => {
    camera.position.set(0, 2, 30);
  }, [camera]);

  useFrame((_, delta) => {
    const { forward, backward, left, right } = movement;

    // 1. Get the camera's local forward and right directions, ignoring the Y axis (up/down)
    forwardVector.set(0, 0, -1).applyQuaternion(camera.quaternion);
    forwardVector.y = 0;
    forwardVector.normalize();

    rightVector.set(1, 0, 0).applyQuaternion(camera.quaternion);
    rightVector.y = 0;
    rightVector.normalize();

    // 2. Scale these vectors based on which keys are pressed
    const forwardMovement = Number(forward) - Number(backward);
    const rightMovement = Number(right) - Number(left);

    // 3. Combine them to get the final movement direction
    direction
      .set(0, 0, 0)
      .addScaledVector(forwardVector, forwardMovement)
      .addScaledVector(rightVector, rightMovement);

    // 4. Calculate proposed new position
    if (direction.lengthSq() > 0) {
      direction.normalize().multiplyScalar(SPEED * delta);
      
      const nextX = camera.position.x + direction.x;
      const nextZ = camera.position.z + direction.z;

      // 5. Sliding Collision Check (Check X and Z independently)
      // This allows the player to slide along walls instead of getting completely stuck
      if (!checkCollision(nextX, camera.position.z)) {
        camera.position.x = nextX;
      }
      if (!checkCollision(camera.position.x, nextZ)) {
        camera.position.z = nextZ;
      }
    }

    // 6. Force the camera to stay at a fixed standing height
    camera.position.y = 2;

    // 7. Basic Collision Boundaries (World Edge)
    if (camera.position.x > BOUNDARY) camera.position.x = BOUNDARY;
    if (camera.position.x < -BOUNDARY) camera.position.x = -BOUNDARY;
    if (camera.position.z > BOUNDARY) camera.position.z = BOUNDARY;
    if (camera.position.z < -BOUNDARY) camera.position.z = -BOUNDARY;
  });

  return null;
};
