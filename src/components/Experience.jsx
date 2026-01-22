import React, { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Stage,
  useGLTF,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";
import useStore from "../store/useStore";

import { useCachedModelUrl } from "../utils/modelLoader";

const InnerCarModel = ({ url }) => {
  const { carConfig, baseCar } = useStore();
  const meshRef = useRef();

  const gltf = useGLTF(url);

  // Clone the scene to avoid modifying the cached original if we switch back and forth
  const scene = React.useMemo(() => gltf.scene.clone(true), [gltf]);

  useEffect(() => {
    const applyMaterialTweaks = (material) => {
      if (material?.isMeshStandardMaterial) {
        material.envMapIntensity = 0.6;
      }
    };

    // Traverse the model to apply materials or handle parts
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (Array.isArray(child.material)) {
          child.material.forEach(applyMaterialTweaks);
        } else {
          applyMaterialTweaks(child.material);
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
  const { baseCar } = useStore();
  const cachedUrl = useCachedModelUrl(baseCar.modelPath);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [4, 2, 5], fov: 45 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.9;
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
    >
      <color attach="background" args={["#101010"]} />
      <Suspense fallback={null}>
        {cachedUrl ? (
          <Stage
            key={cachedUrl}
            environment="city"
            intensity={0.55}
            contactShadow={false}
          >
            <InnerCarModel url={cachedUrl} />
          </Stage>
        ) : null}
        <ContactShadows
          position={[0, -0.01, 0]}
          opacity={0.5}
          scale={10}
          blur={2.5}
          far={1}
        />
      </Suspense>
      <OrbitControls
        key={baseCar.id}
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
