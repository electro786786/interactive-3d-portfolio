export interface AABB {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

// Global store for colliders to keep it simple and performant
const colliders: AABB[] = [];

export const registerCollider = (box: AABB) => {
  colliders.push(box);
  return () => {
    const index = colliders.indexOf(box);
    if (index > -1) {
      colliders.splice(index, 1);
    }
  };
};

export const checkCollision = (x: number, z: number, playerRadius = 0.5): boolean => {
  // Check if the player's bounding cylinder intersects with any AABB
  for (let i = 0; i < colliders.length; i++) {
    const box = colliders[i];
    // Closest point on the AABB to the player
    const closestX = Math.max(box.minX, Math.min(x, box.maxX));
    const closestZ = Math.max(box.minZ, Math.min(z, box.maxZ));

    // Distance from player to closest point
    const distanceX = x - closestX;
    const distanceZ = z - closestZ;

    // If distance is less than radius, we have a collision
    if ((distanceX * distanceX + distanceZ * distanceZ) < (playerRadius * playerRadius)) {
      return true;
    }
  }
  return false;
};
