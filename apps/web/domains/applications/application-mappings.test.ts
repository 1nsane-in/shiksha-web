import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import {
  getStatusColor,
  statusColorMap,
  getStageAction,
  stageActionsMap,
  sortApplicationsByDateDesc,
} from "./application-mappings";

/**
 * Feature: student-application-integration, Property 5: Status badge color mapping
 * Validates: Requirements 4.1
 *
 * For any valid application status string, the rendered badge must use the correct
 * color scheme: pending→yellow, in_review→blue, approved→green, rejected→red.
 */
describe("Property 5: Status badge color mapping", () => {
  const validStatuses = [
    "pending",
    "in_review",
    "approved",
    "rejected",
  ] as const;

  const expectedColorKeywords: Record<string, string> = {
    pending: "yellow",
    in_review: "blue",
    approved: "green",
    rejected: "red",
  };

  it("for any valid status, the color class contains the correct color keyword", () => {
    fc.assert(
      fc.property(fc.constantFrom(...validStatuses), (status) => {
        const result = getStatusColor(status);
        expect(result).toBeDefined();
        const expectedKeyword = expectedColorKeywords[status];
        expect(result!.color).toContain(expectedKeyword);
      }),
      { numRuns: 100 },
    );
  });

  it("for any valid status, the result has a non-empty label", () => {
    fc.assert(
      fc.property(fc.constantFrom(...validStatuses), (status) => {
        const result = getStatusColor(status);
        expect(result).toBeDefined();
        expect(result!.label.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 },
    );
  });

  it("for any invalid status string, getStatusColor returns undefined", () => {
    fc.assert(
      fc.property(
        fc.string().filter((s) => !validStatuses.includes(s as any)),
        (invalidStatus) => {
          const result = getStatusColor(invalidStatus);
          expect(result).toBeUndefined();
        },
      ),
      { numRuns: 100 },
    );
  });
});

/**
 * Feature: student-application-integration, Property 4: Stage-to-action mapping is correct
 * Validates: Requirements 3.3, 4.3
 *
 * For any application with a current stage between 2 and 5, the detail page must
 * display the correct action button corresponding to that stage's required next step.
 */
describe("Property 4: Stage-to-action mapping is correct", () => {
  const validStages = [2, 3, 4, 5] as const;

  const expectedHrefs: Record<number, string> = {
    2: "/student/payments",
    3: "/student/exams",
    4: "/student/letters",
    5: "/student/visa-support",
  };

  it("for any valid stage (2-5), the action has the correct href", () => {
    fc.assert(
      fc.property(fc.constantFrom(...validStages), (stage) => {
        const action = getStageAction(stage);
        expect(action).toBeDefined();
        expect(action!.href).toBe(expectedHrefs[stage]);
      }),
      { numRuns: 100 },
    );
  });

  it("for any valid stage (2-5), the action has non-empty label and description", () => {
    fc.assert(
      fc.property(fc.constantFrom(...validStages), (stage) => {
        const action = getStageAction(stage);
        expect(action).toBeDefined();
        expect(action!.label.length).toBeGreaterThan(0);
        expect(action!.description.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 },
    );
  });

  it("for any stage outside 2-5, getStageAction returns undefined", () => {
    fc.assert(
      fc.property(
        fc.integer().filter((n) => n < 2 || n > 5),
        (invalidStage) => {
          const action = getStageAction(invalidStage);
          expect(action).toBeUndefined();
        },
      ),
      { numRuns: 100 },
    );
  });
});

/**
 * Feature: student-application-integration, Property 2: Applications on profile are sorted by date descending
 * Validates: Requirements 2.4
 *
 * For any list of student applications, the profile page must display them in
 * descending order of submittedAt date (most recent first).
 */
describe("Property 2: Applications on profile are sorted by date descending", () => {
  const applicationArb = fc.record({
    id: fc.uuid(),
    submittedAt: fc
      .integer({ min: 1577836800000, max: 1924991999000 })
      .map((ts) => new Date(ts).toISOString()),
    universityName: fc.string({ minLength: 1 }),
    status: fc.constantFrom("pending", "in_review", "approved", "rejected"),
  });

  it("for any list of applications, sorting produces descending date order", () => {
    fc.assert(
      fc.property(
        fc.array(applicationArb, { minLength: 0, maxLength: 50 }),
        (applications) => {
          const sorted = sortApplicationsByDateDesc(applications);

          // Verify descending order
          for (let i = 0; i < sorted.length - 1; i++) {
            const current = new Date(sorted[i].submittedAt).getTime();
            const next = new Date(sorted[i + 1].submittedAt).getTime();
            expect(current).toBeGreaterThanOrEqual(next);
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it("for any list of applications, sorting preserves all elements (same length)", () => {
    fc.assert(
      fc.property(
        fc.array(applicationArb, { minLength: 0, maxLength: 50 }),
        (applications) => {
          const sorted = sortApplicationsByDateDesc(applications);
          expect(sorted.length).toBe(applications.length);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("for any list of applications, sorting does not mutate the original array", () => {
    fc.assert(
      fc.property(
        fc.array(applicationArb, { minLength: 1, maxLength: 20 }),
        (applications) => {
          const original = [...applications];
          sortApplicationsByDateDesc(applications);
          expect(applications).toEqual(original);
        },
      ),
      { numRuns: 100 },
    );
  });
});
