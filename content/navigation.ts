export type NavLink = {
  label: string;
  href: string;
  sectionId?: string;
};

export const navLinks: NavLink[] = [
  { label: "Home", href: "/", sectionId: "top" },
  { label: "About", href: "/#about", sectionId: "about" },
  { label: "Skills", href: "/#skills", sectionId: "skills" },
  { label: "Projects", href: "/#projects", sectionId: "projects" },
  { label: "Experience", href: "/#experience", sectionId: "experience" },
  { label: "Certifications", href: "/#certifications", sectionId: "certifications" },
  { label: "Contact", href: "/#contact", sectionId: "contact" },
];
