/**
 * TEST FILE: Opportunity Scoring System
 *
 * This file demonstrates how the ranking system works with real examples.
 * Run this with: npm test (if Jest is configured) or just read through
 * the examples to understand the scoring logic.
 */

import { scoreOpportunity, rankOpportunities, buildUserProfile } from "./opportunityScoring";
import { Opportunity } from "@/data/opportunities";
import { Filters } from "@/components/FilterBar";

// ============================================================================
// TEST SCENARIO: Student in Yakima, WA interested in Computer Science
// ============================================================================

console.log("=".repeat(80));
console.log("TEST SCENARIO: Student in Yakima, WA");
console.log("Profile: High school student interested in Computer Science");
console.log("Identity: First-gen, low-income");
console.log("=".repeat(80));

// Mock opportunities matching the user's scenario
const testOpportunities: Opportunity[] = [
  {
    id: "test-1",
    title: "Remote Software Internship (Seattle-based)",
    organization: "Seattle Tech Company",
    type: "internship",
    deadline: "2026-06-01",
    description: "Remote software engineering internship for high school students",
    fullDescription: "Full remote internship...",
    eligibility: ["High school student", "Interest in CS"],
    tags: ["remote", "paid", "computer-science"],
    gradeLevel: ["high-school"],
    interests: ["computer science", "engineering"],
    identity: ["first-gen", "underrepresented"],
    location: "remote", // REMOTE - should rank HIGH
    applyLink: "#",
  },
  {
    id: "test-2",
    title: "In-Person Engineering Workshop (Yakima)",
    organization: "Yakima STEM Hub",
    type: "program",
    deadline: "2026-05-15",
    description: "Hands-on engineering workshop in Yakima",
    fullDescription: "Local workshop...",
    eligibility: ["Yakima area students"],
    tags: ["local", "yakima", "engineering"],
    gradeLevel: ["high-school"],
    interests: ["engineering", "computer science"],
    identity: ["first-gen", "low-income"],
    location: "washington", // LOCAL - should rank HIGH
    applyLink: "#",
  },
  {
    id: "test-3",
    title: "In-Person Research Program (Seattle)",
    organization: "University of Washington",
    type: "program",
    deadline: "2026-07-01",
    description: "On-campus research opportunity in Seattle",
    fullDescription: "In-person research...",
    eligibility: ["Washington state residents"],
    tags: ["research", "seattle"],
    gradeLevel: ["high-school"],
    interests: ["computer science", "engineering"],
    identity: ["first-gen"],
    location: "washington", // IN-PERSON but in-state - should rank MEDIUM
    applyLink: "#",
  },
  {
    id: "test-4",
    title: "In-Person California Workshop (Weak Match)",
    organization: "California Institute",
    type: "program",
    deadline: "2026-08-01",
    description: "Biology workshop in California",
    fullDescription: "California program...",
    eligibility: ["All students"],
    tags: ["biology", "california"],
    gradeLevel: ["high-school"],
    interests: ["biology"], // DOESN'T MATCH student's CS interest
    identity: [],
    location: "national", // DISTANT and weak profile match - should rank LOW
    applyLink: "#",
  },
  {
    id: "test-5",
    title: "Gates Scholarship (National, High Value)",
    organization: "Gates Foundation",
    type: "scholarship",
    deadline: "2026-09-15",
    description: "Full-ride scholarship for minority students",
    fullDescription: "Full scholarship...",
    eligibility: ["High school senior", "Pell-eligible"],
    tags: ["full-ride", "first-gen", "scholarship"],
    gradeLevel: ["high-school"],
    interests: ["computer science", "engineering", "math"],
    identity: ["first-gen", "low-income", "underrepresented"],
    location: "national", // NATIONAL but HIGH VALUE - should rank MEDIUM-HIGH
    applyLink: "#",
  },
];

// Student profile: Yakima, WA student interested in Computer Science
const studentProfile = {
  location: "Yakima, WA",
  interests: ["computer science"],
  gradeLevel: "high-school" as const,
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

// Rank the opportunities
const rankedResults = rankOpportunities(testOpportunities, studentProfile, emptyFilters);

console.log("\n📊 RANKING RESULTS:\n");

rankedResults.forEach((result, index) => {
  console.log(`${index + 1}. ${result.opportunity.title} (${result.opportunity.organization})`);
  console.log(`   Score: ${result.score}/100`);
  console.log(`   Breakdown:`);
  console.log(`     - Profile Match: ${result.scoreBreakdown.profileScore}/50`);
  console.log(`     - Location Score: ${result.scoreBreakdown.locationScore}/30`);
  console.log(`     - Value Score: ${result.scoreBreakdown.valueScore}/20`);
  console.log(`   Why it matches:`);
  result.scoreBreakdown.bonuses.forEach((bonus) => {
    console.log(`     ✓ ${bonus}`);
  });
  console.log("");
});

// ============================================================================
// EXPECTED RANKING ORDER (based on our logic):
// ============================================================================
console.log("=".repeat(80));
console.log("EXPECTED RANKING ORDER:");
console.log("=".repeat(80));
console.log(`
1. 🥇 Remote Software Internship (Seattle-based)
   Why: REMOTE (25 pts location) + Perfect CS match + Paid internship
   Expected Score: ~60-70

2. 🥈 In-Person Engineering Workshop (Yakima)
   Why: LOCAL to Yakima (20 pts location) + Good interest match + Identity match
   Expected Score: ~50-60

3. 🥉 Gates Scholarship (National, High Value)
   Why: SCHOLARSHIP (15 pts value) + Excellent profile match + Identity match
   Despite being national, high value overcomes distance
   Expected Score: ~50-60

4. 📍 In-Person Research Program (Seattle)
   Why: In-state (20 pts location) + Good CS match
   But not as good as remote or local Yakima option
   Expected Score: ~40-50

5. ⚠️  In-Person California Workshop (Weak Match)
   Why: NATIONAL (5 pts location) + Biology (NO CS match)
   Lowest because it doesn't match student interests and is far
   Expected Score: ~10-20
`);

// ============================================================================
// VERIFICATION
// ============================================================================

console.log("=".repeat(80));
console.log("✅ VERIFICATION:");
console.log("=".repeat(80));

// Check if remote opportunity ranks in top 2
const remoteOpportunity = rankedResults.find(r => r.opportunity.id === "test-1");
const yakimaOpportunity = rankedResults.find(r => r.opportunity.id === "test-2");
const californiaOpportunity = rankedResults.find(r => r.opportunity.id === "test-4");

if (remoteOpportunity && remoteOpportunity.score >= 50) {
  console.log("✅ Remote opportunity ranks high (score >= 50)");
} else {
  console.log("❌ Remote opportunity should rank higher");
}

if (yakimaOpportunity && yakimaOpportunity.score >= 45) {
  console.log("✅ Local Yakima opportunity ranks high (score >= 45)");
} else {
  console.log("❌ Local opportunity should rank higher");
}

if (californiaOpportunity && californiaOpportunity.score < 30) {
  console.log("✅ Distant weak-match opportunity ranks low (score < 30)");
} else {
  console.log("❌ Weak match should rank lower");
}

// Verify ranking order
const remoteIndex = rankedResults.findIndex(r => r.opportunity.id === "test-1");
const californiaIndex = rankedResults.findIndex(r => r.opportunity.id === "test-4");

if (remoteIndex < californiaIndex) {
  console.log("✅ Remote opportunity ranks higher than distant weak match");
} else {
  console.log("❌ Ranking order is incorrect");
}

console.log("\n" + "=".repeat(80));
console.log("TEST COMPLETE");
console.log("=".repeat(80));

// Export for potential Jest testing
export { testOpportunities, studentProfile };
