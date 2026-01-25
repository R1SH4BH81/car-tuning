import React, { Suspense, useEffect, useRef, useMemo } from "react";
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

  // Normalize Scale and Position
  const scene = useMemo(() => {
    const clonedScene = gltf.scene.clone(true);

    // 1. Calculate Bounding Box
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = new THREE.Vector3();
    box.getSize(size);

    const getTargetSize = () => {
      if (typeof window === "undefined") return 3;
      if (window.matchMedia("(min-width: 1024px)").matches) return 6;
      if (window.matchMedia("(min-width: 768px)").matches) return 4;
      return 3;
    };
    const targetSize = getTargetSize();
    const maxDim = Math.max(size.x, size.y, size.z);
    const scaleFactor = targetSize / maxDim;
    clonedScene.scale.setScalar(scaleFactor);

    // 3. Center the model
    // We re-calculate the box after scaling to get accurate centering
    const centeredBox = new THREE.Box3().setFromObject(clonedScene);
    const center = new THREE.Vector3();
    centeredBox.getCenter(center);

    // Move model so center is at 0,0,0 but the bottom (min.y) is at exactly 0
    clonedScene.position.x = -center.x;
    clonedScene.position.y = -centeredBox.min.y;
    clonedScene.position.z = -center.z;

    return clonedScene;
  }, [gltf]);

  // Apply Material Tweaks
  useEffect(() => {
    const applyMaterialTweaks = (material) => {
      if (material?.isMeshStandardMaterial) {
        material.envMapIntensity = 0.6;
      }
    };

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

  // Dynamic Updates (e.g. Wheels)
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.name.toLowerCase().includes("wheel")) {
        if (carConfig.tires === "slick_comp") {
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
      dpr={[1, 1.5]}
      camera={{ position: [5, 2, 5], fov: 40 }}
      gl={{ preserveDrawingBuffer: true }}
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
            // CRITICAL: Disable Stage auto-scaling/centering to prevent fluctuation
            adjustCamera={false}
            center={false}
          >
            <InnerCarModel url={cachedUrl} />
          </Stage>
        ) : null}

        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.5}
          scale={12}
          blur={2}
          far={1.5}
          resolution={512}
        />
      </Suspense>

      <OrbitControls
        key={baseCar.id}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2.1}
        enableZoom={true}
        enablePan={false}
        autoRotate={true}
        autoRotateSpeed={2}
        minDistance={3}
        maxDistance={12}
      />
    </Canvas>
  );
};

export default Experience;
