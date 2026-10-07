export type Certification = {
  title: string;
  issuer: string;
  url: string | null;
  credentialId: string | null;
};

// TODO(owner): add verification URLs / credential IDs when available.
export const certifications: Certification[] = [
  {
    title: "Cisco Certified Network Associate (CCNA)",
    issuer: "Cisco",
    url: null,
    credentialId: null,
  },
  {
    title: "Programming Fundamentals Nanodegree",
    issuer: "Udacity",
    url: null,
    credentialId: null,
  },
  {
    title: "Apprenticeship Certificate",
    issuer: "MOHA Soft Drinks Industry",
    url: null,
    credentialId: null,
  },
];
