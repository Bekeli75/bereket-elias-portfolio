import { z } from "zod";

export const ContactInput = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name (at least 2 characters).")
    .max(80, "Name must be 80 characters or fewer."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address.")
    .max(254, "Email must be 254 characters or fewer."),
  subject: z
    .string()
    .trim()
    .max(120, "Subject must be 120 characters or fewer.")
    .optional()
    .default("Portfolio inquiry"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(3000, "Message must be 3000 characters or fewer."),
  turnstileToken: z.string().optional().default(""),
  // Honeypot: checked before validation in the route; any filled value is a bot.
  website: z.string().max(0).optional().default(""),
});

export const SkillLevel = z.enum(["familiar", "working", "strong"]);

export const ProjectCategory = z.enum([
  "Software",
  "Networking",
  "Hardware",
  "Academic",
  "Web",
]);

export const ProjectSummary = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  category: ProjectCategory,
  tech: z.array(z.string()),
  cover: z.string().nullable(),
  featured: z.boolean(),
  status: z.enum(["completed", "in-progress", "planned"]),
  links: z.object({
    repo: z.string().nullable(),
    demo: z.string().nullable(),
  }),
  order: z.number().int(),
});
