export default function getClassColor(carClass) {
  if (carClass === "X") return "bg-green-600";
  if (carClass === "S2") return "bg-blue-600";
  if (carClass === "S1") return "bg-purple-600";
  if (carClass === "A") return "bg-red-600";
  if (carClass === "B") return "bg-orange-500";
  return "bg-yellow-600";
}

