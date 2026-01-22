import React, { Suspense, Component } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, Stage, Html } from "@react-three/drei";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
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

export default function TuningModelViewer({ modelPath }) {
  return (
    <div className="w-full h-full min-h-[200px]">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ fov: 45 }}
        style={{ background: "transparent" }}
      >
        <ErrorBoundary
          fallback={
            <Html center>
              <div className="text-white/50 text-xs">Model not found</div>
            </Html>
          }
        >
          <Suspense
            fallback={
              <Html center>
                <div className="text-white text-xs">Loading </div>
              </Html>
            }
          >
            <Stage environment="city" intensity={0.5} adjustCamera={1.2}>
              {modelPath ? <Model path={modelPath} /> : null}
            </Stage>
          </Suspense>
        </ErrorBoundary>
        <OrbitControls
          makeDefault
          autoRotate
          autoRotateSpeed={2}
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
