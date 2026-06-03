"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Heritage hero backdrop: a slow-drifting field of golden motes in 3D with
 * gentle mouse parallax. Tasteful, not flashy. Capped DPR + points (not
 * meshes) for performance. Honours prefers-reduced-motion.
 */

const COUNT = 650;
const GOLD = new THREE.Color("#9a5bff");
const GOLD_SOFT = new THREE.Color("#c4a3ff");
const OXBLOOD = new THREE.Color("#7a3b2b");

function Motes() {
  const points = useRef<THREE.Points>(null);
  const { size } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const reduced = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const { positions, colors, scales } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const scales = new Float32Array(COUNT);
    const palette = [GOLD, GOLD_SOFT, OXBLOOD];
    for (let i = 0; i < COUNT; i++) {
      // Distribute in a soft slab of space
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      scales[i] = Math.random() * 0.6 + 0.2;
    }
    return { positions, colors, scales };
  }, []);

  useFrame((state, delta) => {
    if (!points.current) return;
    const t = state.clock.elapsedTime;
    if (!reduced.current) {
      points.current.rotation.y += delta * 0.025;
      points.current.rotation.x = Math.sin(t * 0.1) * 0.05;
      // mouse parallax (eased)
      const target = state.pointer;
      mouse.current.x += (target.x - mouse.current.x) * 0.03;
      mouse.current.y += (target.y - mouse.current.y) * 0.03;
      points.current.position.x = mouse.current.x * 0.6;
      points.current.position.y = mouse.current.y * 0.4;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={size.width < 640 ? 0.032 : 0.026}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.4}
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}

export default function HeroCanvas() {
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 7], fov: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Motes />
    </Canvas>
  );
}
