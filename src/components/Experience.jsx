import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import {
  OrbitControls,
  Stage,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import * as THREE from "three";
import useStore from "../store/useStore";
// Import only the Nissan model for now as it's the only one we have
import nissanObjUrl from "../assets/models/nissangtr.obj?url";

const CarModel = () => {
  const { carConfig, baseCar } = useStore();
  const meshRef = useRef();

  // Determine which model to load.
  // Since we only have the Nissan file, we'll use it as a fallback for others to prevent crashes.
  // In a real app, we'd dynamically import or have a map of URL imports.
  const modelUrl =
    baseCar.id === "nissan-gtr-r35" ? nissanObjUrl : nissanObjUrl;

  // NOTE: If we had the other files, we could do something like:
  // const modelUrl = useMemo(() => new URL(`../assets/models/${baseCar.modelPath.split('/').pop()}`, import.meta.url).href, [baseCar]);
  // But Vite needs static analysis or glob imports for that to work reliably in production.

  const obj = useLoader(OBJLoader, modelUrl);

  // Clone the object to avoid modifying the cached original
  const scene = React.useMemo(() => obj.clone(), [obj]);

  useEffect(() => {
    // Traverse the model to apply materials or handle parts
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Simple material enhancement
        if (!child.material.map) {
          child.material = new THREE.MeshStandardMaterial({
            color: child.material.color,
            metalness: 0.8,
            roughness: 0.2,
          });
        }

        // If it's not the Nissan, maybe change color to indicate it's a placeholder?
        if (baseCar.id !== "nissan-gtr-r35") {
          // Placeholder visual: Make it ghost-like or wireframe-ish?
          // Or just standard grey.
          child.material.color.setHex(0xaaaaaa);
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
          child.material.color.setHex(0x111111); // Darker tires
          child.material.roughness = 0.8;
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
