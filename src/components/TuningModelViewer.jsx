import React, { Suspense, Component } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, Stage, Html } from "@react-three/drei";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("Model loading failed:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

function Model({ path }) {
  // Key the hook with the path to ensure it reloads when path changes
  const { scene } = useGLTF(path);
  return <primitive object={scene} />;
}

import { useProgress } from "@react-three/drei";
import { useCachedModelUrl } from "../utils/modelLoader";

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center whitespace-nowrap">
        <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mb-2"></div>

        <div className="font-mono text-[8px] text-yellow-500 mt-1">
          {progress.toFixed(0)}%
        </div>
      </div>
    </Html>
  );
}

function CachedModel({ path }) {
  const cachedUrl = useCachedModelUrl(path);

  if (!cachedUrl) return <Loader />;

  return <Model path={cachedUrl} />;
}

export default function TuningModelViewer({ modelPath }) {
  return (
    <div className="w-full h-full min-h-[200px]">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ fov: 15 }}
        style={{ background: "transparent" }}
      >
        <ErrorBoundary
          fallback={
            <Html center>
              <div className="text-white/50 text-xs">Model not found</div>
            </Html>
          }
        >
          <Suspense fallback={<Loader />}>
            <Stage environment="city" intensity={0.5} adjustCamera={1.2}>
              {modelPath ? <CachedModel path={modelPath} /> : null}
            </Stage>
          </Suspense>
        </ErrorBoundary>
        <OrbitControls
          makeDefault
          autoRotate
          autoRotateSpeed={0.5}
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          minDistance={2}
          maxDistance={8}
        />
      </Canvas>
    </div>
  );
}
