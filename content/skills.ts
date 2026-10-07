export type SkillLevel = "familiar" | "working" | "strong";

export type Skill = {
  name: string;
  level: SkillLevel;
};

export type SkillCategory = {
  name: string;
  items: Skill[];
};

// Level labels are honest self-assessments — TODO(owner): confirm or adjust.
export const skillCategories: SkillCategory[] = [
  {
    name: "Networking",
    items: [
      { name: "Cisco networking", level: "working" },
      { name: "CCNA fundamentals", level: "working" },
      { name: "Network design & simulation", level: "working" },
      { name: "Network troubleshooting", level: "familiar" },
    ],
  },
  {
    name: "Programming",
    items: [
      { name: "JavaScript", level: "working" },
      { name: "Java", level: "working" },
      { name: "C++", level: "working" },
      { name: "HTML5 / CSS3", level: "working" },
    ],
  },
  {
    name: "Foundations",
    items: [
      { name: "Data structures", level: "familiar" },
      { name: "Algorithms", level: "familiar" },
      { name: "Computer systems (CPU, memory, I/O)", level: "familiar" },
    ],
  },
  {
    name: "Hardware",
    items: [{ name: "Circuit design", level: "familiar" }],
  },
  {
    name: "Tools",
    items: [
      { name: "Cisco Packet Tracer", level: "working" },
      { name: "VS Code", level: "working" },
      { name: "MATLAB", level: "familiar" },
      { name: "Proteus", level: "familiar" },
      { name: "Multisim", level: "familiar" },
      { name: "Microsoft Office", level: "working" },
    ],
  },
];
