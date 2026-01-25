export default function getClassColor(carClass) {
  if (carClass === "X") return "bg-green-600";
  if (carClass === "S2") return "bg-blue-600";
  if (carClass === "S1") return "bg-purple-600";
  if (carClass === "A") return "bg-red-600";
  if (carClass === "B") return "bg-orange-500";
  return "bg-yellow-600";
}

export function getClassBorderColor(carClass) {
  if (carClass === "X") return "border-green-600";
  if (carClass === "S2") return "border-blue-600";
  if (carClass === "S1") return "border-purple-600";
  if (carClass === "A") return "border-red-600";
  if (carClass === "B") return "border-orange-500";
  return "border-yellow-600";
}
