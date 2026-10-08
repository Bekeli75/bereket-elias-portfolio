import { describe, expect, it } from "vitest";
import { ContactInput, ProjectCategory, SkillLevel } from "@/lib/schemas";

const valid = () => ({
  name: "  Bereket Elias  ",
  email: "  BECKET@Example.COM ",
  subject: "  Hello there  ",
  message: "  This is a valid message body.  ",
});

describe("ContactInput", () => {
  it("trims fields, lowercases email, and keeps valid input", () => {
    const parsed = ContactInput.parse(valid());
    expect(parsed.name).toBe("Bereket Elias");
    expect(parsed.email).toBe("becket@example.com");
    expect(parsed.subject).toBe("Hello there");
    expect(parsed.message).toBe("This is a valid message body.");
  });

  it("applies the subject default when omitted", () => {
    const body = valid();
    delete body.subject;
    expect(ContactInput.parse(body).subject).toBe("Portfolio inquiry");
  });

  it("defaults the honeypot and turnstile token to empty strings", () => {
    const parsed = ContactInput.parse(valid());
    expect(parsed.website).toBe("");
    expect(parsed.turnstileToken).toBe("");
  });

  it("rejects a filled honeypot", () => {
    const result = ContactInput.safeParse({ ...valid(), website: "spam.example" });
    expect(result.success).toBe(false);
    expect(result.error.issues.some((i) => i.path.includes("website"))).toBe(true);
  });

  it.each([
    ["short name", { name: "B" }, "name", "at least 2 characters"],
    ["invalid email", { email: "not-an-email" }, "email", "valid email address"],
    ["long subject", { subject: "x".repeat(121) }, "subject", "120 characters or fewer"],
    ["short message", { message: "too short" }, "message", "at least 10 characters"],
    ["long message", { message: "x".repeat(3001) }, "message", "3000 characters or fewer"],
  ])("rejects %s with a friendly message", (_label, patch, field, fragment) => {
    const result = ContactInput.safeParse({ ...valid(), ...patch });
    expect(result.success).toBe(false);
    const issue = result.error.issues.find((i) => i.path.includes(field));
    expect(issue.message).toContain(fragment);
  });
});

describe("enums", () => {
  it("accepts known project categories and skill levels", () => {
    expect(ProjectCategory.parse("Web")).toBe("Web");
    expect(SkillLevel.parse("working")).toBe("working");
  });

  it("rejects unknown values", () => {
    expect(ProjectCategory.safeParse("Blogs").success).toBe(false);
    expect(SkillLevel.safeParse("expert").success).toBe(false);
  });
});
