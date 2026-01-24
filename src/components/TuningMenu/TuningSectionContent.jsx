import React, { Suspense } from "react";
import PartLoader from "../common/PartLoader";

const TiresSection = React.lazy(() => import("./sections/TiresSection"));
const GearingSection = React.lazy(() => import("./sections/GearingSection"));
const AlignmentSection = React.lazy(
  () => import("./sections/AlignmentSection"),
);
const ArbsSection = React.lazy(() => import("./sections/ArbsSection"));
const SpringsSection = React.lazy(() => import("./sections/SpringsSection"));
const DampingSection = React.lazy(() => import("./sections/DampingSection"));
const AeroSection = React.lazy(() => import("./sections/AeroSection"));
const BrakeSection = React.lazy(() => import("./sections/BrakeSection"));
const DifferentialSection = React.lazy(
  () => import("./sections/DifferentialSection"),
);

const sectionComponents = {
  tires: TiresSection,
  gearing: GearingSection,
  alignment: AlignmentSection,
  arbs: ArbsSection,
  springs: SpringsSection,
  damping: DampingSection,
  aero: AeroSection,
  brake: BrakeSection,
  differential: DifferentialSection,
};

const TuningSectionContent = ({
  activeSection,
  tuningSettings,
  setTuning,
  baseCar,
  performanceStats,
  carConfig,
}) => {
  const SectionComponent = sectionComponents[activeSection];
  if (!SectionComponent) return null;

  return (
    <div className="relative min-h-[200px] h-full">
      <Suspense fallback={<PartLoader />}>
        <SectionComponent
          tuningSettings={tuningSettings}
          setTuning={setTuning}
          baseCar={baseCar}
          performanceStats={performanceStats}
          carConfig={carConfig}
        />
      </Suspense>
    </div>
  );
};

export default TuningSectionContent;
