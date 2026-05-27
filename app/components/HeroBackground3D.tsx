"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Floating particles that respond to mouse movement
function Particles({ count = 200 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  // Generate particle positions
  const [positions, speeds] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5 - 2;
      speeds[i] = Math.random() * 0.5 + 0.2;
    }
    return [positions, speeds];
  }, [count]);

  // Track mouse position
  useFrame(({ pointer }) => {
    mouse.current.x = pointer.x * aspect * 0.5;
    mouse.current.y = pointer.y * aspect * 0.5;
  });

  // Animate particles
  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.elapsedTime;
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Base floating motion
      positions[i3 + 1] += Math.sin(time * speeds[i] + i) * 0.002;
      positions[i3] += Math.cos(time * speeds[i] * 0.5 + i) * 0.001;

      // Mouse influence - particles drift away from mouse
      const dx = positions[i3] - mouse.current.x;
      const dy = positions[i3 + 1] - mouse.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 2) {
        const force = (2 - dist) * 0.01;
        positions[i3] += dx * force * 0.1;
        positions[i3 + 1] += dy * force * 0.1;
      }

      // Bounds wrapping
      if (positions[i3] > 5) positions[i3] = -5;
      if (positions[i3] < -5) positions[i3] = 5;
      if (positions[i3 + 1] > 5) positions[i3 + 1] = -5;
      if (positions[i3 + 1] < -5) positions[i3 + 1] = 5;
    }

    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.rotation.z = time * 0.02;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#10b981"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Floating geometric shapes
function FloatingGeometry() {
  const group = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  // Track mouse for parallax effect
  useFrame(({ pointer }) => {
    mouse.current.x = pointer.x;
    mouse.current.y = pointer.y;
  });

  useFrame((state) => {
    if (!group.current) return;
    const time = state.clock.elapsedTime;

    // Smooth parallax following mouse
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      mouse.current.x * 0.15,
      0.05
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      mouse.current.y * 0.1,
      0.05
    );

    // Animate children
    group.current.children.forEach((child, i) => {
      child.rotation.x = time * 0.2 * (i % 2 === 0 ? 1 : -1);
      child.rotation.y = time * 0.3 * (i % 2 === 0 ? -1 : 1);
      child.position.y += Math.sin(time + i * 2) * 0.002;
    });
  });

  return (
    <group ref={group}>
      {/* Wireframe Icosahedron - top right */}
      <mesh position={[2.5, 1.5, -2]}>
        <icosahedronGeometry args={[0.6, 0]} />
        <meshBasicMaterial
          color="#10b981"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Wireframe Octahedron - left side */}
      <mesh position={[-3, -0.5, -1.5]}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshBasicMaterial
          color="#a78bfa"
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>

      {/* Wireframe Torus - bottom right */}
      <mesh position={[2, -1.8, -2.5]}>
        <torusGeometry args={[0.4, 0.15, 8, 16]} />
        <meshBasicMaterial
          color="#fbbf24"
          wireframe
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Small floating cubes */}
      {[...Array(6)].map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 4,
            -2 - Math.random() * 2,
          ]}
        >
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#10b981" : "#a78bfa"}
            transparent
            opacity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

// Glowing orbs with mouse interaction
function GlowOrbs() {
  const group = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useFrame(({ pointer, clock }) => {
    mouse.current.x = pointer.x;
    mouse.current.y = pointer.y;

    if (!group.current) return;
    const time = clock.elapsedTime;

    group.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      // Floating motion
      mesh.position.y += Math.sin(time * 0.5 + i * 1.5) * 0.003;
      mesh.position.x += Math.cos(time * 0.3 + i * 2) * 0.002;

      // Scale pulsing
      const scale = 1 + Math.sin(time * 0.8 + i) * 0.1;
      mesh.scale.setScalar(scale);

      // Mouse attraction
      const targetX = mesh.userData.baseX + mouse.current.x * 0.3;
      const targetY = mesh.userData.baseY + mouse.current.y * 0.2;
      mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, targetX, 0.02);
      mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, targetY, 0.02);
    });
  });

  const orbData = useMemo(
    () => [
      { x: -2.5, y: 1, z: -3, color: "#10b981", size: 0.4, opacity: 0.08 },
      { x: 3, y: -0.5, z: -4, color: "#a78bfa", size: 0.6, opacity: 0.06 },
      { x: -1, y: -1.5, z: -2.5, color: "#fbbf24", size: 0.3, opacity: 0.05 },
      { x: 1.5, y: 2, z: -3.5, color: "#10b981", size: 0.35, opacity: 0.07 },
    ],
    []
  );

  return (
    <group ref={group}>
      {orbData.map((orb, i) => (
        <mesh
          key={i}
          position={[orb.x, orb.y, orb.z]}
          userData={{ baseX: orb.x, baseY: orb.y }}
        >
          <sphereGeometry args={[orb.size, 32, 32]} />
          <meshBasicMaterial
            color={orb.color}
            transparent
            opacity={orb.opacity}
          />
        </mesh>
      ))}
    </group>
  );
}

// Connection lines between points
function ConnectionLines() {
  const linesRef = useRef<THREE.LineSegments>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const [points] = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 30; i++) {
      pts.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6,
          -2 - Math.random() * 3
        )
      );
    }
    return [pts];
  }, []);

  useFrame(({ pointer, clock }) => {
    mouse.current.x = pointer.x;
    mouse.current.y = pointer.y;

    if (!linesRef.current) return;
    const time = clock.elapsedTime;

    // Animate points slightly
    const positions = linesRef.current.geometry.attributes.position
      .array as Float32Array;
    for (let i = 0; i < points.length; i++) {
      const i3 = i * 3;
      points[i].y += Math.sin(time + i) * 0.001;
      points[i].x += Math.cos(time * 0.5 + i) * 0.0005;
    }

    // Update line geometry
    let idx = 0;
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dist = points[i].distanceTo(points[j]);
        if (dist < 2 && idx < positions.length / 6) {
          positions[idx * 6] = points[i].x;
          positions[idx * 6 + 1] = points[i].y;
          positions[idx * 6 + 2] = points[i].z;
          positions[idx * 6 + 3] = points[j].x;
          positions[idx * 6 + 4] = points[j].y;
          positions[idx * 6 + 5] = points[j].z;
          idx++;
        }
      }
    }

    linesRef.current.geometry.attributes.position.needsUpdate = true;
    linesRef.current.geometry.setDrawRange(0, idx * 2);
  });

  const linePositions = useMemo(() => {
    // Pre-allocate enough space for potential connections
    return new Float32Array(points.length * points.length * 6);
  }, [points]);

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={linePositions.length / 3}
          array={linePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#10b981"
        transparent
        opacity={0.08}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

// Main scene component
function Scene() {
  return (
    <>
      <color attach="background" args={["#0a0e16"]} />
      <fog attach="fog" args={["#0a0e16", 3, 10]} />
      <Particles count={150} />
      <FloatingGeometry />
      <GlowOrbs />
      <ConnectionLines />
    </>
  );
}

export default function HeroBackground3D() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
