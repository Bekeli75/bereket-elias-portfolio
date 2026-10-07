export type Education = {
  institution: string;
  degree: string;
  specialization: string;
  start: number;
  end: number;
  status: "expected" | "completed";
  note: string;
};

export const education: Education[] = [
  {
    institution: "Addis Ababa Science and Technology University",
    degree: "BSc Electrical and Computer Engineering",
    specialization: "Computer Engineering",
    start: 2022,
    end: 2027,
    status: "expected",
    note: "Currently in 4th year",
  },
];
