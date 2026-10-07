import { Code2, Cpu, Globe, GraduationCap, Network } from "lucide-react";

const icons = {
  Software: Code2,
  Networking: Network,
  Hardware: Cpu,
  Academic: GraduationCap,
  Web: Globe,
};

export function ProjectIcon({ category, size = 24, className }) {
  const Icon = icons[category] ?? Code2;
  return <Icon aria-hidden="true" size={size} className={className} />;
}
