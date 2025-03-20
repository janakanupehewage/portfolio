"use client"

import React, { Suspense, useRef,useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
//import CanvasLoader from "../Loader";
//import * as THREE from "three";
// @ts-ignore
import * as random from "maath/random/dist/maath-random.esm";

const Stars = (props: any) => {
    const ref:any = useRef(0);
    const [sphere] = useState(() => random.inSphere(new Float32Array(6000), { radius: 1.2 }));

    useFrame((state, delta) => {
        ref.current.rotation.x -= delta / 10;
        ref.current.rotation.y -= delta / 15;
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points
                ref={ref}
                positions={sphere}
                stride={3}
                frustumCulled
                {...props}>
                <PointMaterial
                    transparent
                    color="#f272c8"
                    size={0.002}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
};

const StarsCanvas = () => {
    return (
        <div className="w-full h-auto fixed inset-0 z-[20]">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Suspense fallback={null}>
                    <Stars />
                </Suspense>

                
            </Canvas>
        </div>
    );
};

export default StarsCanvas;
