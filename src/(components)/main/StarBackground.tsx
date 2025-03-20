"use client"

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const CustomGeometryParticles = ({ count, shape }: { count: number; shape: "box" | "sphere" }) => {
  // Type the ref to be a reference to a THREE.Points object
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x += delta / 10;
      pointsRef.current.rotation.y += delta / 15;
    }
  });

  // Generate particle positions with spread
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);

    // Box Shape
    if (shape === "box") {
      for (let i = 0; i < count; i++) {
        // Widen the range for better distribution across the layout
        const x = (Math.random() - 0.5) * 20;  // Increase the multiplier for larger spread
        const y = (Math.random() - 0.5) * 20;
        const z = (Math.random() - 0.5) * 20;
        positions.set([x, y, z], i * 3);
      }
    }

    // Sphere Shape
    if (shape === "sphere") {
      const distance = 10; // Increase distance for larger radius

      for (let i = 0; i < count; i++) {
        const theta = THREE.MathUtils.randFloatSpread(360);
        const phi = THREE.MathUtils.randFloatSpread(360);

        const x = distance * Math.sin(theta) * Math.cos(phi);
        const y = distance * Math.sin(theta) * Math.sin(phi);
        const z = distance * Math.cos(theta);

        positions.set([x, y, z], i * 3);
      }
    }

    return positions;
  }, [count, shape]);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particlesPosition, 3]}  // Attach the correct data for position
          array={particlesPosition}
          count={particlesPosition.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.003} color="#5786F5" sizeAttenuation depthWrite={false} />
    </points>
  );
};

const StarsCanvas: React.FC = () => {
  return (
    <div className="w-full h-auto fixed inset-0 z-[20]">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <CustomGeometryParticles count={5000} shape="sphere" />
      </Canvas>
    </div>
  );
};

export default StarsCanvas;
