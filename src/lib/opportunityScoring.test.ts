/**
 * Tests for the opportunity scoring / ranking system.
 * Run with: npm test
 */

import { describe, it, expect } from "vitest";
import {
  scoreOpportunity,
  rankOpportunities,
  buildUserProfile,
  UserProfile,
} from "./opportunityScoring";
import { Opportunity } from "@/data/opportunities";
import { Filters } from "@/components/FilterBar";

// ============================================================================
// FIXTURES: Student in Yakima, WA interested in Computer Science
// ============================================================================

const testOpportunities: Opportunity[] = [
  {
    id: "test-1",
    title: "Remote Software Internship (Seattle-based)",
    organization: "Seattle Tech Company",
    type: "internship",
    deadline: "2099-06-01",
    description: "Remote software engineering internship for high school students",
    fullDescription: "Full remote internship...",
    eligibility: ["High school student", "Interest in CS"],
    tags: ["remote", "paid", "computer-science"],
    gradeLevel: ["high-school"],
    interests: ["computer science", "engineering"],
    identity: ["first-gen", "underrepresented"],
    location: "remote",
    applyLink: "#",
  },
  {
    id: "test-2",
    title: "In-Person Engineering Workshop (Yakima)",
    organization: "Yakima STEM Hub",
    type: "program",
    deadline: "2099-05-15",
    description: "Hands-on engineering workshop in Yakima",
    fullDescription: "Local workshop...",
    eligibility: ["Yakima area students"],
    tags: ["local", "yakima", "engineering"],
    gradeLevel: ["high-school"],
    interests: ["engineering", "computer science"],
    identity: ["first-gen", "low-income"],
    location: "washington",
    applyLink: "#",
  },
  {
    id: "test-3",
    title: "In-Person Research Program (Seattle)",
    organization: "University of Washington",
    type: "program",
    deadline: "2099-07-01",
    description: "On-campus research opportunity in Seattle",
    fullDescription: "In-person research...",
    eligibility: ["Washington state residents"],
    tags: ["research", "seattle"],
    gradeLevel: ["high-school"],
    interests: ["computer science", "engineering"],
    identity: ["first-gen"],
    location: "washington",
    applyLink: "#",
  },
  {
    id: "test-4",
    title: "In-Person California Workshop (Weak Match)",
    organization: "California Institute",
    type: "program",
    deadline: "2099-08-01",
    description: "Biology workshop in California",
    fullDescription: "California program...",
    eligibility: ["All students"],
    tags: ["biology", "california"],
    gradeLevel: ["high-school"],
    interests: ["biology"],
    identity: [],
    location: "national",
    applyLink: "#",
  },
  {
    id: "test-5",
    title: "Gates Scholarship (National, High Value)",
    organization: "Gates Foundation",
    type: "scholarship",
    deadline: "2099-09-15",
    description: "Full-ride scholarship for minority students",
    fullDescription: "Full scholarship...",
    eligibility: ["High school senior", "Pell-eligible"],
    tags: ["full-ride", "first-gen", "scholarship"],
    gradeLevel: ["high-school"],
    interests: ["computer science", "engineering", "math"],
    identity: ["first-gen", "low-income", "underrepresented"],
    location: "national",
    applyLink: "#",
  },
];

const studentProfile: UserProfile = {
  location: "Yakima, WA",
  interests: ["computer science"],
  gradeLevel: "high-school",
  identity: ["first-gen", "low-income"],
};

const emptyFilters: Filters = {
  gradeLevel: "",
  interest: "",
  identity: "",
  location: "",
  type: "",
  search: "",
};

// ============================================================================
// TESTS
// ============================================================================

describe("rankOpportunities", () => {
  const ranked = rankOpportunities(testOpportunities, studentProfile, emptyFilters);
  const byId = (id: string) => ranked.find((r) => r.opportunity.id === id)!;
  const indexOf = (id: string) => ranked.findIndex((r) => r.opportunity.id === id);

  it("returns all opportunities when no hard filters are set", () => {
    expect(ranked).toHaveLength(testOpportunities.length);
  });

  it("sorts results by score, descending", () => {
    for (let i = 1; i < ranked.length; i++) {
      expect(ranked[i - 1].score).toBeGreaterThanOrEqual(ranked[i].score);
    }
  });

  it("ranks the remote CS internship high (score >= 50)", () => {
    expect(byId("test-1").score).toBeGreaterThanOrEqual(50);
  });

  it("ranks the local Yakima workshop high (score >= 45)", () => {
    expect(byId("test-2").score).toBeGreaterThanOrEqual(45);
  });

  it("ranks the distant weak-match workshop low (score < 30)", () => {
    expect(byId("test-4").score).toBeLessThan(30);
  });

  it("ranks the remote opportunity above the distant weak match", () => {
    expect(indexOf("test-1")).toBeLessThan(indexOf("test-4"));
  });

  it("applies hard filters before ranking", () => {
    const filtered = rankOpportunities(testOpportunities, studentProfile, {
      ...emptyFilters,
      type: "scholarship",
    });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].opportunity.id).toBe("test-5");
  });
});

describe("scoreOpportunity", () => {
  it("produces a score breakdown with profile, location, and value components", () => {
    const result = scoreOpportunity(testOpportunities[0], studentProfile);
    expect(result.scoreBreakdown.profileScore).toBeGreaterThan(0);
    expect(result.scoreBreakdown.locationScore).toBeGreaterThan(0);
    expect(result.scoreBreakdown.valueScore).toBeGreaterThan(0);
    expect(result.scoreBreakdown.bonuses.length).toBeGreaterThan(0);
  });

  it("boosts first-gen friendly opportunities when first-gen mode is on", () => {
    const base = scoreOpportunity(testOpportunities[4], studentProfile);
    const boosted = scoreOpportunity(testOpportunities[4], {
      ...studentProfile,
      firstGenMode: true,
    });
    expect(boosted.score).toBeGreaterThan(base.score);
    expect(boosted.scoreBreakdown.isFirstGenFriendly).toBe(true);
  });
});

describe("buildUserProfile", () => {
  it("builds a profile from filters, location, and first-gen mode", () => {
    const profile = buildUserProfile(
      { ...emptyFilters, interest: "computer science", gradeLevel: "high-school" },
      "Yakima, WA",
      true
    );
    expect(profile).toEqual({
      location: "Yakima, WA",
      interests: ["computer science"],
      gradeLevel: "high-school",
      identity: [],
      searchQuery: undefined,
      firstGenMode: true,
    });
  });

  it("defaults location to washington when unset", () => {
    expect(buildUserProfile(emptyFilters, "").location).toBe("washington");
  });
});
