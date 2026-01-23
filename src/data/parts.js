import * as EngineParts from "./parts/engine";
import * as PlatformParts from "./parts/platform";
import * as DrivetrainParts from "./parts/drivetrain";
import * as TireParts from "./parts/tires";
import * as AeroParts from "./parts/aero";

export const PARTS_DB = {
  ...EngineParts,
  ...PlatformParts,
  ...DrivetrainParts,
  ...TireParts,
  ...AeroParts,
};

export { INITIAL_TUNING } from "./parts/tuning";
