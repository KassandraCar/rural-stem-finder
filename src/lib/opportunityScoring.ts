import { Opportunity } from "@/data/opportunities";
import { Filters } from "@/components/FilterBar";

/**
 * OPPORTUNITY SCORING SYSTEM
 *
 * This module implements a weighted scoring algorithm to rank opportunities
 * based on profile match, location accessibility, and opportunity value.
 *
 * Philosophy:
 * - Never completely exclude opportunities (unless they fail hard filters)
 * - Remote opportunities get a significant boost regardless of base location
 * - Local opportunities rank high, distant ones rank lower
 * - High-value opportunities (scholarships, competitive programs) can overcome distance
 * - Profile match is the most important factor
 */

// ============================================================================
// CONFIGURATION: Adjust these weights to tune the ranking behavior
// ============================================================================

export const SCORING_WEIGHTS = {
  // Profile match components (total: 50 points possible)
  profileMatch: {
    interestAlignment: 20,      // How well interests match
    gradeLevelMatch: 15,         // Grade level compatibility
    identityMatch: 10,           // Identity tags (first-gen, etc.)
    searchRelevance: 5,          // Search term match
  },

  // Location accessibility (total: 30 points possible)
  location: {
    remoteBonus: 25,             // Strong bonus for remote opportunities
    localMatch: 20,              // Same state/region match
    nationalBase: 5,             // Base score for national opportunities
    distancePenalty: -10,        // Penalty for far locations (before remote check)
  },

  // Opportunity value (total: 20 points possible)
  value: {
    scholarship: 15,             // Scholarships are high value
    paidProgram: 10,             // Paid internships/programs
    competitiveBonus: 5,         // Prestigious/competitive programs
    deadlineUrgency: 5,          // Deadline approaching (within 30 days)
  },

  // First-Gen Mode bonuses (applied when first-gen mode is active)
  firstGenMode: {
    identityBonus: 10,           // Boost for opportunities tagged first-gen/low-income
    noCostBonus: 8,              // Boost for free/fully-funded opportunities
    supportiveBonus: 5,          // Boost for college-prep/mentorship programs
  },
};

// Maximum possible score for normalization (can exceed 100 with first-gen bonuses)
const MAX_SCORE = 100;

// ============================================================================
// TYPES
// ============================================================================

export type UserProfile = {
  location: string;              // e.g., "Yakima, WA" or "washington"
  interests: string[];           // e.g., ["computer science", "engineering"]
  gradeLevel: "high-school" | "college" | "";
  identity: string[];            // e.g., ["first-gen", "low-income"]
  searchQuery?: string;
  firstGenMode?: boolean;        // First-gen mode for enhanced support
};

export type ScoredOpportunity = {
  opportunity: Opportunity;
  score: number;                 // 0-100+
  scoreBreakdown: {
    profileScore: number;
    locationScore: number;
    valueScore: number;
    firstGenBonus?: number;      // Bonus when first-gen mode is active
    bonuses: string[];           // Human-readable bonus descriptions
    isFirstGenFriendly?: boolean; // Flag for first-gen friendly opportunities
  };
};

// ============================================================================
// SCORING FUNCTIONS
// ============================================================================

/**
 * Calculate profile match score (0-50 points)
 *
 * This measures how well the opportunity aligns with the user's academic
 * profile, interests, and identity.
 */
function calculateProfileScore(
  opportunity: Opportunity,
  profile: UserProfile
): { score: number; bonuses: string[] } {
  let score = 0;
  const bonuses: string[] = [];
  const weights = SCORING_WEIGHTS.profileMatch;

  // Interest alignment (0-20 points)
  if (profile.interests && profile.interests.length > 0) {
    const matchingInterests = opportunity.interests.filter(
      interest => profile.interests.includes(interest)
    );
    const interestMatchRatio = matchingInterests.length / profile.interests.length;
    const interestScore = Math.round(interestMatchRatio * weights.interestAlignment);
    score += interestScore;

    if (matchingInterests.length > 0) {
      bonuses.push(`Matches ${matchingInterests.length} interest(s)`);
    }
  }

  // Grade level match (0-15 points)
  if (profile.gradeLevel && opportunity.gradeLevel.includes(profile.gradeLevel as any)) {
    score += weights.gradeLevelMatch;
    bonuses.push("Grade level match");
  } else if (profile.gradeLevel) {
    // Partial credit if opportunity is open to multiple levels
    score += Math.round(weights.gradeLevelMatch * 0.3);
  }

  // Identity match (0-10 points)
  if (profile.identity && profile.identity.length > 0) {
    const matchingIdentity = opportunity.identity.filter(
      id => profile.identity.includes(id)
    );
    const identityMatchRatio = matchingIdentity.length / Math.max(profile.identity.length, 1);
    const identityScore = Math.round(identityMatchRatio * weights.identityMatch);
    score += identityScore;

    if (matchingIdentity.length > 0) {
      bonuses.push(`Identity match (${matchingIdentity.join(", ")})`);
    }
  }

  // Search relevance (0-5 points)
  if (profile.searchQuery) {
    const query = profile.searchQuery.toLowerCase();
    const titleMatch = opportunity.title.toLowerCase().includes(query);
    const descMatch = opportunity.description.toLowerCase().includes(query);
    const orgMatch = opportunity.organization.toLowerCase().includes(query);

    if (titleMatch) {
      score += weights.searchRelevance;
      bonuses.push("Title matches search");
    } else if (descMatch || orgMatch) {
      score += Math.round(weights.searchRelevance * 0.6);
      bonuses.push("Description matches search");
    }
  }

  return { score: Math.min(score, 50), bonuses };
}

/**
 * Calculate location accessibility score (0-30 points)
 *
 * This measures how accessible the opportunity is based on location.
 * Remote opportunities receive a major boost.
 * Local opportunities (same state) rank high.
 * Distant opportunities are penalized but not excluded.
 */
function calculateLocationScore(
  opportunity: Opportunity,
  userLocation: string
): { score: number; bonuses: string[] } {
  let score = 0;
  const bonuses: string[] = [];
  const weights = SCORING_WEIGHTS.location;

  // Normalize user location to lowercase for comparison
  const normalizedUserLoc = userLocation.toLowerCase();

  // REMOTE OPPORTUNITIES: Get a strong boost regardless of base location
  if (opportunity.location === "remote") {
    score += weights.remoteBonus;
    bonuses.push("Remote - accessible from anywhere");
    return { score, bonuses };
  }

  // WASHINGTON STATE: High score for local opportunities
  if (opportunity.location === "washington") {
    // Check if user is in Washington
    if (normalizedUserLoc.includes("washington") ||
        normalizedUserLoc.includes("wa") ||
        normalizedUserLoc.includes("yakima") ||
        normalizedUserLoc.includes("seattle") ||
        normalizedUserLoc.includes("spokane")) {
      score += weights.localMatch;
      bonuses.push("Local to your region");
    } else {
      // User is not in Washington but opportunity is WA-specific
      score += Math.round(weights.localMatch * 0.3);
      bonuses.push("Regional opportunity (Washington)");
    }
    return { score, bonuses };
  }

  // NATIONAL OPPORTUNITIES: Base score, accessible but may require travel
  if (opportunity.location === "national") {
    score += weights.nationalBase;
    bonuses.push("National opportunity");

    // Check if it's a high-value opportunity that overcomes distance
    if (opportunity.type === "scholarship" ||
        opportunity.tags.includes("fully-funded") ||
        opportunity.tags.includes("paid")) {
      score += 10; // Bonus for valuable national opportunities
      bonuses.push("High-value program worth the distance");
    }
  }

  return { score: Math.max(score, 0), bonuses };
}

/**
 * Calculate opportunity value score (0-20 points)
 *
 * This measures the inherent value of the opportunity, including:
 * - Financial value (scholarships, paid programs)
 * - Competitiveness/prestige
 * - Deadline urgency
 */
function calculateValueScore(
  opportunity: Opportunity
): { score: number; bonuses: string[] } {
  let score = 0;
  const bonuses: string[] = [];
  const weights = SCORING_WEIGHTS.value;

  // Scholarship bonus (high financial value)
  if (opportunity.type === "scholarship") {
    score += weights.scholarship;
    bonuses.push("Scholarship opportunity");
  }

  // Paid program bonus
  if (opportunity.tags.includes("paid") ||
      opportunity.tags.includes("fully-funded") ||
      opportunity.type === "internship") {
    score += weights.paidProgram;
    bonuses.push("Paid opportunity");
  }

  // Competitive/prestigious bonus
  if (opportunity.tags.includes("prestigious") ||
      opportunity.tags.includes("competitive") ||
      opportunity.organization.toLowerCase().includes("nasa") ||
      opportunity.organization.toLowerCase().includes("google") ||
      opportunity.organization.toLowerCase().includes("amazon")) {
    score += weights.competitiveBonus;
    bonuses.push("Prestigious program");
  }

  // Deadline urgency (within 30 days gets bonus)
  const deadlineDate = new Date(opportunity.deadline);
  const daysUntil = Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  if (daysUntil > 0 && daysUntil <= 30) {
    score += weights.deadlineUrgency;
    bonuses.push(`Deadline soon (${daysUntil} days)`);
  } else if (daysUntil < 0) {
    // Deadline has passed - significant penalty
    score -= 15;
    bonuses.push("⚠️ Deadline passed");
  }

  return { score: Math.min(score, 20), bonuses };
}

/**
 * Calculate First-Gen Mode bonus (0-23 points possible)
 *
 * When first-gen mode is active, this boosts opportunities that are:
 * - Tagged as first-gen or low-income friendly
 * - Free or fully-funded (no cost barriers)
 * - Provide extra support (college-prep, mentorship)
 */
function calculateFirstGenBonus(
  opportunity: Opportunity,
  firstGenMode: boolean
): { score: number; bonuses: string[]; isFirstGenFriendly: boolean } {
  let score = 0;
  const bonuses: string[] = [];
  let isFirstGenFriendly = false;

  // Only calculate if first-gen mode is active
  if (!firstGenMode) {
    return { score: 0, bonuses: [], isFirstGenFriendly: false };
  }

  const weights = SCORING_WEIGHTS.firstGenMode;

  // Identity bonus: opportunity explicitly welcomes first-gen/low-income students
  const hasFirstGenTag = opportunity.identity.includes("first-gen") ||
                         opportunity.identity.includes("low-income") ||
                         opportunity.tags.includes("first-gen") ||
                         opportunity.tags.includes("low-income");

  if (hasFirstGenTag) {
    score += weights.identityBonus;
    bonuses.push("✨ First-gen friendly");
    isFirstGenFriendly = true;
  }

  // No-cost bonus: free, fully-funded, or includes financial support
  const isNoCost = opportunity.tags.includes("free") ||
                   opportunity.tags.includes("fully-funded") ||
                   opportunity.tags.includes("full-ride") ||
                   opportunity.type === "scholarship";

  if (isNoCost) {
    score += weights.noCostBonus;
    bonuses.push("💰 No cost / Funded");
  }

  // Supportive programs: extra mentoring/prep for first-gen success
  const isSupportive = opportunity.type === "college-prep" ||
                       opportunity.type === "mentorship" ||
                       opportunity.tags.includes("mentoring") ||
                       opportunity.tags.includes("college-prep");

  if (isSupportive) {
    score += weights.supportiveBonus;
    bonuses.push("🤝 Mentorship/Support included");
  }

  return { score, bonuses, isFirstGenFriendly };
}

/**
 * Calculate total opportunity score
 *
 * Combines profile match, location accessibility, opportunity value,
 * and first-gen bonuses (if active) into a single score for ranking.
 */
export function scoreOpportunity(
  opportunity: Opportunity,
  profile: UserProfile
): ScoredOpportunity {
  // Calculate component scores
  const profileResult = calculateProfileScore(opportunity, profile);
  const locationResult = calculateLocationScore(opportunity, profile.location);
  const valueResult = calculateValueScore(opportunity);
  const firstGenResult = calculateFirstGenBonus(opportunity, profile.firstGenMode || false);

  // Combine scores (can exceed 100 with first-gen bonuses)
  const totalScore = profileResult.score +
                     locationResult.score +
                     valueResult.score +
                     firstGenResult.score;

  // Don't cap the score - let first-gen bonuses push opportunities higher
  const finalScore = Math.max(totalScore, 0);

  // Combine all bonuses
  const allBonuses = [
    ...profileResult.bonuses,
    ...locationResult.bonuses,
    ...valueResult.bonuses,
    ...firstGenResult.bonuses,
  ];

  return {
    opportunity,
    score: finalScore,
    scoreBreakdown: {
      profileScore: profileResult.score,
      locationScore: locationResult.score,
      valueScore: valueResult.score,
      firstGenBonus: firstGenResult.score,
      bonuses: allBonuses,
      isFirstGenFriendly: firstGenResult.isFirstGenFriendly,
    },
  };
}

/**
 * Rank opportunities based on user profile and filters
 *
 * This function:
 * 1. Applies hard filters (user-selected filters that must match)
 * 2. Scores all remaining opportunities
 * 3. Sorts by score (highest first)
 *
 * @param opportunities - All available opportunities
 * @param profile - User's profile for scoring
 * @param filters - User's selected filters (hard filters)
 * @returns Sorted array of scored opportunities
 */
export function rankOpportunities(
  opportunities: Opportunity[],
  profile: UserProfile,
  filters: Filters
): ScoredOpportunity[] {
  // Step 1: Apply hard filters
  const filtered = opportunities.filter((o) => {
    // Grade level filter
    if (filters.gradeLevel && !o.gradeLevel.includes(filters.gradeLevel as any)) {
      return false;
    }

    // Interest filter
    if (filters.interest && !o.interests.includes(filters.interest)) {
      return false;
    }

    // Identity filter
    if (filters.identity && !o.identity.includes(filters.identity)) {
      return false;
    }

    // Location filter (if user explicitly selects a location filter)
    if (filters.location && o.location !== filters.location) {
      return false;
    }

    // Type filter
    if (filters.type && o.type !== filters.type) {
      return false;
    }

    // Search filter
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchesSearch =
        o.title.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q) ||
        o.organization.toLowerCase().includes(q);

      if (!matchesSearch) {
        return false;
      }
    }

    return true;
  });

  // Step 2: Score all filtered opportunities
  const scored = filtered.map(opp => scoreOpportunity(opp, profile));

  // Step 3: Sort by score (highest first)
  scored.sort((a, b) => b.score - a.score);

  return scored;
}

/**
 * Build user profile from filters and app context
 *
 * Helper function to construct a UserProfile from the current
 * filter state and user context.
 */
export function buildUserProfile(
  filters: Filters,
  userLocation: string,
  firstGenMode?: boolean
): UserProfile {
  return {
    location: userLocation || "washington", // Default to Washington if not set
    interests: filters.interest ? [filters.interest] : [],
    gradeLevel: (filters.gradeLevel as "high-school" | "college" | "") || "",
    identity: filters.identity ? [filters.identity] : [],
    searchQuery: filters.search || undefined,
    firstGenMode: firstGenMode || false,
  };
}
