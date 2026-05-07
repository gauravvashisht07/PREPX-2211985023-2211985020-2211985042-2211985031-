import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const W = window.innerWidth, H = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, W / H, 0.1, 1000);
    camera.position.z = 80;

    // Particle system (Purple & Cyan Dual-Color)
    const count = 300;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const velocities = Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 0.05,
      y: (Math.random() - 0.5) * 0.05,
      z: (Math.random() - 0.5) * 0.03,
    }));

    const color1 = new THREE.Color(0x7c3aed); // Purple
    const color2 = new THREE.Color(0x06b6d4); // Cyan

    for (let i = 0; i < count; i++) {
        // Positions
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 150;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

      // Colors
      const mix = Math.random();
      const finalColor = color1.clone().lerp(color2, mix);
      colors[i * 3] = finalColor.r;
      colors[i * 3 + 1] = finalColor.g;
      colors[i * 3 + 2] = finalColor.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({ 
        size: 0.8, 
        vertexColors: true, 
        transparent: true, 
        opacity: 0.6,
        blending: THREE.AdditiveBlending 
    });
    
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Line network (very subtle)
    const lineMat = new THREE.LineBasicMaterial({ 
        color: 0x7c3aed, 
        transparent: true, 
        opacity: 0.05 
    });
    let linesMesh = null;
    const MAX_DIST = 25;

    const buildLines = () => {
      if (linesMesh) scene.remove(linesMesh);
      const pos = geometry.attributes.position.array;
      const lineVerts = [];
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = pos[i*3] - pos[j*3], dy = pos[i*3+1] - pos[j*3+1], dz = pos[i*3+2] - pos[j*3+2];
          const distSq = dx*dx+dy*dy+dz*dz;
          if (distSq < MAX_DIST * MAX_DIST) {
            lineVerts.push(pos[i*3], pos[i*3+1], pos[i*3+2], pos[j*3], pos[j*3+1], pos[j*3+2]);
          }
        }
      }
      const lg = new THREE.BufferGeometry();
      lg.setAttribute('position', new THREE.Float32BufferAttribute(lineVerts, 3));
      linesMesh = new THREE.LineSegments(lg, lineMat);
      scene.add(linesMesh);
    };

    let frame = 0;
    const animate = () => {
      const id = requestAnimationFrame(animate);
      mount.__animId = id;
      const pos = geometry.attributes.position.array;

      for (let i = 0; i < count; i++) {
        pos[i*3] += velocities[i].x;
        pos[i*3+1] += velocities[i].y;
        pos[i*3+2] += velocities[i].z;
        if (Math.abs(pos[i*3]) > 100) velocities[i].x *= -1;
        if (Math.abs(pos[i*3+1]) > 75) velocities[i].y *= -1;
        if (Math.abs(pos[i*3+2]) > 50) velocities[i].z *= -1;
      }
      geometry.attributes.position.needsUpdate = true;
      
      frame++;
      if (frame % 5 === 0) buildLines();

      particles.rotation.y += 0.0002;
      particles.rotation.z += 0.0001;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(mount.__animId);
      window.removeEventListener('resize', onResize);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} style={{
      position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
      background: 'radial-gradient(circle at 10% 20%, rgba(124, 58, 237, 0.1) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(6, 182, 212, 0.05) 0%, transparent 40%), #03050f'
    }} />
  );
}
