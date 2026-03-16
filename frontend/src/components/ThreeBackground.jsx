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

    // Particle system
    const count = 200;
    const positions = new Float32Array(count * 3);
    const velocities = Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 0.04,
      y: (Math.random() - 0.5) * 0.04,
      z: (Math.random() - 0.5) * 0.02,
    }));

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 160;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0x8b5cf6, size: 0.6, transparent: true, opacity: 0.7 });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Line network
    const lineMat = new THREE.LineBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.08 });
    let linesMesh = null;
    const MAX_DIST = 30;

    const buildLines = () => {
      if (linesMesh) scene.remove(linesMesh);
      const pos = geometry.attributes.position.array;
      const lineVerts = [];
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = pos[i*3] - pos[j*3], dy = pos[i*3+1] - pos[j*3+1], dz = pos[i*3+2] - pos[j*3+2];
          if (Math.sqrt(dx*dx+dy*dy+dz*dz) < MAX_DIST) {
            lineVerts.push(pos[i*3], pos[i*3+1], pos[i*3+2], pos[j*3], pos[j*3+1], pos[j*3+2]);
          }
        }
      }
      const lg = new THREE.BufferGeometry();
      lg.setAttribute('position', new THREE.Float32BufferAttribute(lineVerts, 3));
      linesMesh = new THREE.LineSegments(lg, lineMat);
      scene.add(linesMesh);
    };
    buildLines();

    let frame = 0;
    const animate = () => {
      const id = requestAnimationFrame(animate);
      mount.__animId = id;
      const pos = geometry.attributes.position.array;

      for (let i = 0; i < count; i++) {
        pos[i*3] += velocities[i].x;
        pos[i*3+1] += velocities[i].y;
        pos[i*3+2] += velocities[i].z;
        if (Math.abs(pos[i*3]) > 80) velocities[i].x *= -1;
        if (Math.abs(pos[i*3+1]) > 60) velocities[i].y *= -1;
        if (Math.abs(pos[i*3+2]) > 40) velocities[i].z *= -1;
      }
      geometry.attributes.position.needsUpdate = true;
      frame++;
      if (frame % 3 === 0) buildLines();

      particles.rotation.y += 0.0003;
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
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} style={{
      position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
      background: 'radial-gradient(ellipse at 20% 50%, rgba(139,92,246,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(6,182,212,0.08) 0%, transparent 50%), #080b1a'
    }} />
  );
}
