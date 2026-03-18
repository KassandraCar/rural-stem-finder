# Opportunity Ranking System Guide

## Overview

The Rural STEM Opportunity Finder now uses an intelligent **ranking system** instead of simple filtering. This ensures that students see **all relevant opportunities**, even distant ones, but with the most accessible and matching opportunities appearing first.

## Philosophy

### Key Principles:
1. **Never completely exclude opportunities** - Even distant opportunities appear if they match the student's profile
2. **Remote opportunities get a strong boost** - Remote work/learning is highly accessible from rural areas
3. **Local opportunities rank high** - Same state/region opportunities are prioritized
4. **High-value overcomes distance** - Scholarships and competitive programs rank well even if far away
5. **Profile match is paramount** - Interest and identity alignment matter most

## How It Works

### Scoring Components

Every opportunity receives a score from **0-100** based on three factors:

#### 1. Profile Match (50 points possible)
- **Interest Alignment (20 pts)**: How well the opportunity matches the student's interests
- **Grade Level (15 pts)**: Whether the opportunity is open to the student's grade level
- **Identity Match (10 pts)**: Alignment with identity tags (first-gen, low-income, etc.)
- **Search Relevance (5 pts)**: Match with search terms

#### 2. Location Accessibility (30 points possible)
- **Remote Bonus (25 pts)**: Remote opportunities get maximum location score
- **Local Match (20 pts)**: Same state/region opportunities score high
- **National Base (5 pts)**: National opportunities get a base score
- **High-Value Bonus (+10 pts)**: Scholarships/funded programs get extra location points

#### 3. Opportunity Value (20 points possible)
- **Scholarship Bonus (15 pts)**: Scholarships have high intrinsic value
- **Paid Programs (10 pts)**: Paid internships/programs are valuable
- **Competitive/Prestigious (5 pts)**: Programs from NASA, Google, etc. get a boost
- **Deadline Urgency (5 pts)**: Deadlines within 30 days get a small boost
- **Deadline Penalty (-15 pts)**: Passed deadlines are heavily penalized

## Example Scenarios

### Scenario: Student in Yakima, WA
**Profile**: High school student, interested in Computer Science, First-gen, Low-income

**Expected Ranking**:

1. **🥇 Remote Software Internship (Seattle-based)**
   - Score: ~65/100
   - Why: Remote (25 pts) + Perfect CS match (20 pts) + Paid (10 pts)
   - **Even though based in Seattle, being remote makes it highly accessible**

2. **🥈 In-Person Engineering Workshop (Yakima)**
   - Score: ~55/100
   - Why: Local to Yakima (20 pts) + Good interest match (15 pts) + Identity match (10 pts)
   - **Local and in-person is great for hands-on learning**

3. **🥉 Gates Scholarship (National)**
   - Score: ~50/100
   - Why: Scholarship (15 pts) + Perfect profile match (35 pts) + National bonus for high value (10 pts)
   - **Despite being national, the scholarship value makes it worth applying**

4. **📍 In-Person Research Program (Seattle)**
   - Score: ~45/100
   - Why: In-state (20 pts) + Good CS match (20 pts)
   - **Still appears, but lower because commuting to Seattle may be harder**

5. **⚠️ In-Person California Workshop (Biology)**
   - Score: ~15/100
   - Why: National/distant (5 pts) + No CS match (5 pts for grade level only)
   - **Still visible but ranked much lower due to distance and weak profile match**

## Match Level Indicators

Opportunities display a visual match indicator:

- **✓ Excellent Match** (70+ points): Green badge - Highly recommended
- **✓ Good Match** (50-69 points): Blue badge - Strong candidate
- **✓ Possible Match** (30-49 points): Amber badge - Worth considering
- **✓ Consider** (<30 points): Gray badge - Available but less aligned

Students can click on the match badge to see **why** an opportunity matches their profile.

## Adjusting the Scoring Weights

The scoring system is fully configurable. To adjust how opportunities are ranked, edit the weights in:

**File**: `src/lib/opportunityScoring.ts`

```typescript
export const SCORING_WEIGHTS = {
  profileMatch: {
    interestAlignment: 20,      // Increase for stronger interest matching
    gradeLevelMatch: 15,         // Increase to prioritize grade level more
    identityMatch: 10,           // Increase for stronger identity focus
    searchRelevance: 5,
  },
  location: {
    remoteBonus: 25,             // Increase to favor remote even more
    localMatch: 20,              // Increase to favor local opportunities
    nationalBase: 5,
    distancePenalty: -10,
  },
  value: {
    scholarship: 15,             // Increase to prioritize scholarships
    paidProgram: 10,
    competitiveBonus: 5,
    deadlineUrgency: 5,          // Increase for stronger deadline pressure
  },
};
```

### Example Adjustments

**To favor remote opportunities even more**:
```typescript
location: {
  remoteBonus: 30,  // Increased from 25
  ...
}
```

**To prioritize scholarships more heavily**:
```typescript
value: {
  scholarship: 20,  // Increased from 15
  ...
}
```

**To focus more on interest alignment**:
```typescript
profileMatch: {
  interestAlignment: 25,  // Increased from 20
  ...
}
```

## Implementation Details

### Key Files Modified

1. **`src/lib/opportunityScoring.ts`** (NEW)
   - Core scoring logic
   - Fully documented with comments
   - Configurable weights at the top of the file

2. **`src/app/opportunities/page.tsx`** (UPDATED)
   - Changed from filtering to ranking
   - Uses `rankOpportunities()` function
   - Passes user profile and filters to scoring system

3. **`src/components/OpportunityCard.tsx`** (UPDATED)
   - Displays match level badge
   - Shows score breakdown on click
   - Visual indicators for match quality

### User Profile Construction

The system builds a user profile from:
- **User Location**: From `AppContext.userLocation` (e.g., "Yakima, WA")
- **Interests**: From filter selections
- **Grade Level**: From filter selections
- **Identity**: From filter selections
- **Search Query**: From search bar input

### How Ranking Works

```typescript
// 1. Build user profile from context and filters
const profile = buildUserProfile(filters, userLocation);

// 2. Rank all opportunities
const ranked = rankOpportunities(opportunities, profile, filters);

// 3. Opportunities are automatically sorted by score (highest first)

// 4. Each opportunity includes score breakdown for transparency
ranked.forEach(scored => {
  console.log(scored.score); // 0-100
  console.log(scored.scoreBreakdown.bonuses); // Human-readable reasons
});
```

## Testing

A test file demonstrates the scoring with realistic scenarios:

**File**: `src/lib/opportunityScoring.test.ts`

This file contains:
- Example student profile (Yakima, WA student)
- Mock opportunities (remote, local, distant, etc.)
- Expected ranking order
- Verification tests

## Benefits of This Approach

### For Students:
1. **Discovery**: See opportunities they might have filtered out
2. **Transparency**: Understand WHY an opportunity matches
3. **Context**: Distant opportunities aren't hidden, just ranked lower
4. **Empowerment**: Remote opportunities are surfaced prominently

### For the Platform:
1. **Flexibility**: Easy to tune weights without changing code structure
2. **Explainability**: Score breakdowns show the "why" behind rankings
3. **Scalability**: Works with any number of opportunities
4. **Accessibility**: Optimized for rural students' unique needs

## Future Enhancements

Potential improvements to consider:

1. **Distance Calculation**: Use actual geographic distance instead of state/national categories
2. **Machine Learning**: Learn from which opportunities students apply to
3. **Time-Based Scoring**: Adjust weights based on time of year (scholarship season, etc.)
4. **Personalized Weights**: Let students adjust scoring weights themselves
5. **Application History**: Boost similar opportunities to ones they've saved/applied to

## Questions?

The scoring system is designed to be:
- **Transparent**: All logic is documented
- **Adjustable**: Weights can be tuned easily
- **Fair**: No opportunities are completely hidden
- **Student-centered**: Optimized for rural student accessibility

For questions or to adjust the scoring logic, see `src/lib/opportunityScoring.ts`.
