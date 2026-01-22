import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import {
  OrbitControls,
  Stage,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import useStore from "../store/useStore";

const CarModel = () => {
  const { carConfig, baseCar } = useStore();
  const meshRef = useRef();

  // Use the modelPath from the car data
  const modelUrl = baseCar.modelPath;

  const gltf = useLoader(GLTFLoader, modelUrl);
  
  // Clone the scene to avoid modifying the cached original if we switch back and forth
  const scene = React.useMemo(() => gltf.scene.clone(), [gltf]);

  useEffect(() => {
    // Traverse the model to apply materials or handle parts
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Apply envMap intensity to materials if they are standard materials
        if (child.material.isMeshStandardMaterial) {
          child.material.envMapIntensity = 1.0;
        }
      }
    });
  }, [scene, baseCar.id]);

  // Dynamic updates based on config (Simulated)
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        // Hacky way to find wheels if named correctly, otherwise just general logic
        if (
          child.name.toLowerCase().includes("wheel") &&
          carConfig.tires === "slick_comp"
        ) {
           // Example modification for slick tires
           // child.material.color.setHex(0x111111); 
        }
      }
    });
  }, [carConfig, scene]);

  return <primitive object={scene} ref={meshRef} />;
};

const Experience = () => {
  return (
    <Canvas shadows camera={{ position: [4, 2, 5], fov: 45 }}>
      <color attach="background" args={["#101010"]} />
      <Suspense fallback={null}>
        <Stage environment="city" intensity={0.6} contactShadow={false}>
          <CarModel />
        </Stage>
        <Environment preset="city" />
        <ContactShadows
          position={[0, -0.01, 0]}
          opacity={0.5}
          scale={10}
          blur={2.5}
          far={1}
        />
      </Suspense>
      <OrbitControls
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        enableZoom={true}
        enablePan={false}
        autoRotate={true}
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
};

export default Experience;
