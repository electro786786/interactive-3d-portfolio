import * as THREE from 'three';

const createPixelTexture = (type: 'planks' | 'cobblestone' | 'log' | 'leaves' | 'glass' | 'door' | 'roof' | 'dirt' | 'stonebrick') => {
  const size = 16;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();

  // Minecraft-style pixel art generation
  if (type === 'planks') {
    ctx.fillStyle = '#b8945f'; // Base oak color
    ctx.fillRect(0, 0, size, size);
    
    // Draw plank lines and wood grain
    ctx.fillStyle = '#8f6d3a';
    for(let y = 0; y < size; y += 4) {
      ctx.fillRect(0, y, size, 1);
      const offset = (y % 8 === 0) ? 4 : 12;
      ctx.fillRect(offset, y, 1, 4);
    }
    ctx.fillStyle = '#a47e4c';
    for(let i = 0; i < 40; i++) {
      ctx.fillRect(Math.floor(Math.random() * size), Math.floor(Math.random() * size), 1, 1);
    }
  } 
  else if (type === 'cobblestone') {
    ctx.fillStyle = '#7a7a7a'; // Base gray
    ctx.fillRect(0, 0, size, size);
    
    // Draw irregular stones
    const colors = ['#5a5a5a', '#686868', '#8c8c8c', '#9b9b9b'];
    for(let i = 0; i < 60; i++) {
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      const w = Math.floor(Math.random() * 3) + 2;
      const h = Math.floor(Math.random() * 3) + 2;
      ctx.fillRect(Math.floor(Math.random() * size), Math.floor(Math.random() * size), w, h);
    }
    ctx.fillStyle = '#404040';
    for(let i = 0; i < 30; i++) {
      ctx.fillRect(Math.floor(Math.random() * size), Math.floor(Math.random() * size), 1, 1);
    }
  }
  else if (type === 'log') {
    ctx.fillStyle = '#5c4831'; // Bark base
    ctx.fillRect(0, 0, size, size);
    
    const colors = ['#443320', '#3b2b18', '#6a533a'];
    for(let i = 0; i < 80; i++) {
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.fillRect(Math.floor(Math.random() * size), Math.floor(Math.random() * size), 1, Math.floor(Math.random() * 4) + 1);
    }
  }
  else if (type === 'leaves') {
    ctx.fillStyle = '#3a5c2b';
    ctx.fillRect(0, 0, size, size);
    const colors = ['#2d4a22', '#4c7a38', '#1f3317'];
    for(let i = 0; i < 150; i++) {
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.fillRect(Math.floor(Math.random() * size), Math.floor(Math.random() * size), 2, 2);
    }
  }
  else if (type === 'glass') {
    ctx.fillStyle = 'rgba(150, 200, 255, 0.4)';
    ctx.clearRect(0, 0, size, size);
    ctx.fillRect(0, 0, size, size);
    
    ctx.fillStyle = '#5c4831';
    ctx.fillRect(0, 0, size, 2);
    ctx.fillRect(0, size-2, size, 2);
    ctx.fillRect(0, 0, 2, size);
    ctx.fillRect(size-2, 0, 2, size);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillRect(4, 4, 4, 4);
    ctx.fillRect(8, 8, 2, 2);
  }
  else if (type === 'door') {
    ctx.fillStyle = '#7a5a3a';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#4a3620';
    ctx.fillRect(0, 0, size, 2);
    ctx.fillRect(0, size-2, size, 2);
    ctx.fillRect(0, 0, 2, size);
    ctx.fillRect(size-2, 0, 2, size);
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(size - 4, size / 2, 2, 3);
  }
  else if (type === 'roof') {
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#261412';
    for (let y = 0; y < size; y += 4) {
      ctx.fillRect(0, y, size, 1);
      const offset = (y % 8 === 0) ? 4 : 12;
      ctx.fillRect(offset, y, 1, 4);
    }
  }
  else if (type === 'dirt') {
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(0, 0, size, size);
    const colors = ['#4e342e', '#3e2723', '#6d4c41'];
    for(let i = 0; i < 100; i++) {
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.fillRect(Math.floor(Math.random() * size), Math.floor(Math.random() * size), 2, 2);
    }
  }
  else if (type === 'stonebrick') {
    ctx.fillStyle = '#757575';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#424242';
    for (let y = 0; y < size; y += 8) {
      ctx.fillRect(0, y, size, 1);
      const offset = (y % 16 === 0) ? 8 : 0;
      for (let x = 0; x < size; x += 8) {
        ctx.fillRect(x + offset, y, 1, 8);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  
  return texture;
};

export const planksTexture = createPixelTexture('planks');
export const cobblestoneTexture = createPixelTexture('cobblestone');
export const logTexture = createPixelTexture('log');
export const leavesTexture = createPixelTexture('leaves');
export const glassTexture = createPixelTexture('glass');
export const doorTexture = createPixelTexture('door');
export const roofTexture = createPixelTexture('roof');
export const dirtTexture = createPixelTexture('dirt');
export const stonebrickTexture = createPixelTexture('stonebrick');
