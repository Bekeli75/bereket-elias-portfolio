// Seed projects grounded only in the CV and planning docs (PRD §6, SRS FR-PROJ-04).
// TODO(owner): add cover screenshots (16:10), repo/demo URLs, and personal write-up
// notes for "learnings" — the case-study page hides sections that have no content yet.

export const projects = [
  {
    slug: "digital-billboard-ams",
    title: "Digital Billboard Advertising Management System",
    summary:
      "Java application for managing advertising content on digital billboards.",
    category: "Software",
    tech: ["Java"],
    cover: null, // TODO(owner): project screenshot
    featured: true,
    status: "completed",
    links: { repo: "", demo: "" }, // TODO(owner)
    order: 1,
    problem:
      "Advertising content on digital billboards has to be scheduled and kept up to date. This project builds a system to manage that content instead of handling it manually.",
    approach:
      "Developed in Java with an object-oriented structure: content records and the operations on them organized into classes, with a clear workflow for adding, updating, and removing entries.",
    result:
      "A completed Java application applying object-oriented design to an advertising management use case.",
    learnings: "", // TODO(owner): one or two sentences on lessons learned
  },
  {
    slug: "mini-computer-design",
    title: "Mini Computer Design",
    summary:
      "Academic project designing a small computer and how its core components fit together.",
    category: "Academic",
    tech: ["Computer Architecture"],
    cover: null, // TODO(owner): diagram or screenshot
    featured: false,
    status: "completed",
    links: { repo: "", demo: "" },
    order: 2,
    problem:
      "Understanding a computer as a system — not as isolated parts — means designing how the CPU, memory, and I/O work together.",
    approach:
      "Worked through the design of a minimal computer, applying computer systems coursework to component selection and organization.",
    result: "Completed as part of the Computer Engineering curriculum.",
    learnings: "", // TODO(owner)
  },
  {
    slug: "web-development-projects",
    title: "Web Development Projects",
    summary:
      "Set of basic web development projects completed through Udacity coursework.",
    category: "Web",
    tech: ["HTML5", "CSS3", "JavaScript"], // TODO(owner): confirm exact stack
    cover: null, // TODO(owner): screenshots
    featured: false,
    status: "completed",
    links: { repo: "", demo: "" },
    order: 3,
    problem:
      "Turning requirements and designs into pages people can actually use is the core loop of front-end work.",
    approach:
      "Built a series of small projects covering page structure, styling, and interactivity.",
    result: "Completed the project requirements for the Udacity coursework.",
    learnings: "", // TODO(owner)
  },
  {
    slug: "packet-tracer-network-labs",
    title: "Networking Labs — Cisco Packet Tracer",
    summary:
      "Network design and simulation labs built in Cisco Packet Tracer during coursework. Topologies and write-ups will be published here.",
    category: "Networking",
    tech: ["Cisco Packet Tracer"],
    cover: null, // TODO(owner): export topology diagrams as SVG
    featured: false,
    status: "in-progress",
    links: { repo: "", demo: "" },
    order: 4,
    problem:
      "Networks need to be designed and verified before real hardware is involved.",
    approach:
      "Lab exercises in Cisco Packet Tracer: building topologies, configuring devices, and troubleshooting them against expectations.",
    result:
      "Labs completed as coursework; publishing the diagrams and full write-ups is still in progress.",
    learnings: "", // TODO(owner)
  },
  {
    slug: "property-management-software",
    title: "Propentra — Property Management Software",
    summary:
      "Full-stack property management system: Next.js frontend with a Laravel REST API handling property, unit, tenant, and lease management plus rent, maintenance, and financial workflows.",
    category: "Software",
    tech: ["Next.js", "React", "Laravel", "MySQL"], // TODO(owner): confirm exact stack
    cover: null, // TODO(owner): project screenshot
    featured: false,
    status: "completed", // TODO(owner): confirm
    links: {
      repo: "https://github.com/Bekeli75/Property-Management-Software",
      demo: "",
    },
    order: 5,
    problem:
      "Property owners, managers, and tenants need one system to manage properties, units, leases, rent, and maintenance requests instead of tracking them separately.",
    approach:
      "Split into a Next.js frontend and a Laravel REST API backed by MySQL, with Sanctum authentication and role-based access for owners, managers, tenants, and administrators. Covers property, unit, tenant, and lease management, rent and payment processing, maintenance requests, and financial reporting.",
    result:
      "A working web application wired end-to-end with a REST API under /api/v1 and Chapa payment integration (test environment, ETB).",
    learnings: "", // TODO(owner)
  },
];

export function sortedProjects() {
  return [...projects].sort((a, b) => a.order - b.order);
}

export function projectCategories() {
  return [...new Set(projects.map((project) => project.category))];
}
