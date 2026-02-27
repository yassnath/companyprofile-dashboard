import { describe, expect, it } from "vitest";

import { orderDraftSchema, signUpSchema } from "@/lib/validations";

describe("signUpSchema", () => {
  it("accepts valid payload", () => {
    const parsed = signUpSchema.safeParse({
      name: "Demo User",
      email: "demo@solvix.studio",
      password: "StrongPass1!",
      confirmPassword: "StrongPass1!",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects weak password", () => {
    const parsed = signUpSchema.safeParse({
      name: "Demo User",
      email: "demo@solvix.studio",
      password: "weakpass",
      confirmPassword: "weakpass",
    });

    expect(parsed.success).toBe(false);
  });
});

describe("orderDraftSchema", () => {
  it("accepts minimal draft", () => {
    const parsed = orderDraftSchema.safeParse({
      serviceType: "LANDING_PAGE",
      title: "Draft 1",
      description: "Short draft",
      submit: false,
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects invalid budget range", () => {
    const parsed = orderDraftSchema.safeParse({
      budgetMin: 10000000,
      budgetMax: 5000000,
    });

    expect(parsed.success).toBe(false);
  });
});
