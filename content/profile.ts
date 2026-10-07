export const profile = {
  name: "Bereket Elias",
  title: "Electrical & Computer Engineering Student",
  specialization: "Computer Engineering",
  location: "Addis Ababa, Ethiopia",
  email: "bereket.elias@aastustudent.edu.et",
  summary:
    "4th-year Electrical and Computer Engineering student at AASTU with a strong interest in ICT, computer networks, and IoT. Practical experience in network design and simulation with Cisco Packet Tracer. CCNA certified.",
  availability: {
    open: true,
    label: "Open to internships · Class of 2027",
  },
  socials: {
    // TODO(owner): add profile URLs
    github: "",
    linkedin: "",
    telegram: "",
  },
} as const;

export type Profile = typeof profile;
