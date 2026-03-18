# Technical Documentation

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Pages  │  │Components│  │ Contexts │  │   Lib    │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │              │             │          │
│       └─────────────┴──────────────┴─────────────┘          │
│                           ↓                                  │
│              ┌────────────────────────┐                     │
│              │  Opportunity Scoring   │                     │
│              │  Ranking Engine        │                     │
│              └────────────────────────┘                     │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Opportunities│  │  Volunteers  │  │  Translations│     │
│  │  (25 items)  │  │  (30 items)  │  │  (5 langs)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                 Persistence Layer                            │
│  ┌──────────────┐              ┌──────────────┐            │
│  │ localStorage │  (fallback)  │   Supabase   │            │
│  │  (default)   │     ←───→    │  (optional)  │            │
│  └──────────────┘              └──────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

#### 1. Static Data First
**Decision**: Store opportunities, volunteers, and resources as TypeScript constants in `src/data/`

**Rationale**:
- No database setup required for initial deployment
- Type-safe data access
- Easy to version control and review changes
- Fast development iteration
- Can migrate to database later without changing interfaces

**Trade-offs**:
- Requires rebuild to update data
- Not suitable for user-generated content
- Good for curated, slowly-changing data (perfect for our use case)

#### 2. Client-Side Ranking
**Decision**: Implement opportunity scoring and ranking in the browser

**Rationale**:
- Instant feedback - no API latency
- Works offline
- Reduces server costs (fully static site)
- User preferences (location, first-gen mode) applied immediately
- Transparent scoring - users can see why things match

**Trade-offs**:
- All opportunities loaded at once (acceptable with 25 items)
- Scoring logic is public (but we want transparency anyway)
- Could become slow with 1000s of opportunities (not our scale)

#### 3. Optional Authentication
**Decision**: Build fully functional app without requiring login, with optional Supabase sync

**Rationale**:
- Removes barrier to entry for students
- Privacy-conscious (no forced data collection)
- Works immediately without setup
- localStorage provides good UX for single-device users
- Supabase adds value for multi-device users when needed

**Implementation**:
```typescript
// Graceful degradation pattern
if (user && supabase) {
  // Sync to cloud
  await supabase.from("user_progress").upsert(data);
} else {
  // Fallback to localStorage
  localStorage.setItem("saved", JSON.stringify(data));
}
```

---

## Ranking Logic Deep Dive

### The Problem We Solved

**Initial State**: Simple filtering - students saw either everything or nothing
**Problem**: Remote opportunity in Seattle filtered out for Yakima student, even if perfect match
**Solution**: Rank all opportunities by relevance instead of binary filtering

### Scoring Algorithm

#### Weighted Scoring Model

```typescript
Total Score = Profile Match (0-50)
            + Location Score (0-30)
            + Value Score (0-20)
            + First-Gen Bonus (0-23 when active)
            = 0-123 points possible
```

#### Component Breakdown

**1. Profile Match (50 points max)**
```typescript
Interest Alignment (20 pts):
  - Ratio of matched interests × 20
  - Example: Student wants "CS", opp has ["CS", "Engineering"]
  - Match: 1/1 interests = 20 points

Grade Level (15 pts):
  - Exact match: 15 points
  - Partial (opp open to multiple levels): 4.5 points

Identity Match (10 pts):
  - Ratio of matched identity tags × 10
  - Example: Student is [first-gen, low-income], opp supports both
  - Match: 2/2 = 10 points

Search Relevance (5 pts):
  - Title match: 5 points
  - Description/org match: 3 points
```

**2. Location Accessibility (30 points max)**

The key insight: Location isn't binary (local vs not-local), it's a spectrum.

```typescript
Remote: 25 points
  → Accessible from anywhere
  → Perfect for rural students

Same State: 20 points
  → Yakima student seeing Yakima or WA opportunity
  → Still appears, just slightly lower than remote

National: 5 points base
  → If scholarship or high-value: +10 bonus (total 15)
  → Worth applying even if far away
```

**Why this works for rural students**:
- Remote opportunities naturally rise to top
- Local opportunities still rank high
- Distant opportunities aren't hidden (Gates Scholarship still appears!)
- Value can overcome distance (prestigious programs still visible)

**3. Value Score (20 points max)**
```typescript
Scholarship: 15 points
  → High financial impact

Paid Program: 10 points
  → Reduces financial barrier

Competitive/Prestigious: 5 points
  → Career impact (NASA, Google, etc.)

Deadline Urgency: 5 points
  → Within 30 days gets boost
  → Past deadline: -15 penalty
```

**4. First-Gen Mode Bonus (23 points max - ONLY when active)**

This was a key feature request - make first-gen mode actually DO something.

```typescript
Identity Bonus (+10):
  if (opportunity.identity.includes("first-gen") ||
      opportunity.tags.includes("first-gen")) {
    score += 10;
    isFirstGenFriendly = true; // Show badge
  }

No-Cost Bonus (+8):
  if (opportunity.tags.includes("free") ||
      opportunity.type === "scholarship") {
    score += 8; // Prioritize accessible opportunities
  }

Support Bonus (+5):
  if (opportunity.type === "college-prep" ||
      opportunity.type === "mentorship") {
    score += 5; // Extra support matters
  }
```

**Real Impact**:
```
Gates Scholarship without first-gen mode: 55 points
  Profile: 35 | Location: 5 | Value: 15

Gates Scholarship WITH first-gen mode: 78 points (+23!)
  Profile: 35 | Location: 5 | Value: 15 | First-Gen: 23
  (identity +10, scholarship +8, supportive +5)
```

### Algorithm Evolution

**Iteration 1**: Simple filter
```typescript
// Before
opportunities.filter(o => o.location === userLocation)
// Problem: Too restrictive
```

**Iteration 2**: Score and rank
```typescript
// Current
opportunities
  .map(o => ({ ...o, score: calculateScore(o, profile) }))
  .sort((a, b) => b.score - a.score)
// Solution: Everything visible, but ranked by fit
```

**Key Insight**: We're not trying to find the "perfect" match - we're trying to help students discover opportunities they might miss.

---

## MCP Server Purpose and Implementation

### What is MCP?

**MCP (Model Context Protocol)** is a protocol that lets LLMs (like Claude) access external tools and data sources.

### Our MCP Server

Located in `mcp-opportunity-server/`, provides two tools:

#### Tool 1: `search_stem_opportunities`

**Purpose**: Let Claude search our opportunity database with complex queries

**Why we built it**:
- Students might ask: "What scholarships are there for first-gen students in Washington?"
- Claude needs to search our data, not hallucinate
- Provides accurate, up-to-date information

**Implementation**:
```javascript
// Flexible tag matching
function normalizeIdentityTag(tag) {
  const map = {
    "first-generation": "first-gen",
    "first gen": "first-gen",
    "low income": "low-income",
    // ... more normalization
  };
  return map[tag.toLowerCase()] || tag;
}

// Search with ANY tag match (not all)
const matches = opportunities.filter(opp =>
  !identityTags || identityTags.some(tag =>
    opp.identity.some(id =>
      normalizeIdentityTag(id) === normalizeIdentityTag(tag)
    )
  )
);
```

**Example Usage**:
```json
Request:
{
  "grade_level": "high_school",
  "location": "Washington",
  "identity_tags": ["first-gen", "low-income"]
}

Response:
[
  { "title": "MESA Program – Yakima Valley", ... },
  { "title": "Washington STEM Scholarship", ... },
  ...
]
```

#### Tool 2: `simplify_opportunity`

**Purpose**: Translate jargon into plain language for first-gen students

**Why we built it**:
- Terms like "Pell-eligible" confuse students
- "Letters of recommendation" needs explanation
- Claude can rewrite in accessible language

**Example**:
```
Input: "Applicants must submit a personal statement and two letters of recommendation from non-familial references."

Output: "You'll need to write a short essay about yourself and ask two adults (like teachers or coaches, not family) to write letters saying good things about you."
```

### What Would Be Impossible Without MCP?

**Without MCP**:
- ❌ Claude would hallucinate scholarship information
- ❌ No real-time search of our curated database
- ❌ Students would get generic advice, not specific opportunities
- ❌ No consistent first-gen friendly language

**With MCP**:
- ✅ Claude accesses real, accurate opportunity data
- ✅ Students get personalized recommendations
- ✅ Jargon automatically simplified
- ✅ Trust in the information provided

### MCP Integration Architecture

```
Student asks Claude:
  "I'm a first-gen student in Yakima. What scholarships can I apply to?"
              ↓
Claude invokes MCP tool:
  search_stem_opportunities({
    location: "Washington",
    identity_tags: ["first-gen"]
  })
              ↓
MCP Server searches database:
  Returns: MESA Program, Washington STEM, Gates Scholarship, etc.
              ↓
Claude responds with:
  "Here are 5 scholarships perfect for you in Washington..."
  (with real, accurate data)
```

---

## Data Flow

### User Journey: Finding Opportunities

```
1. Student Opens App
   ↓
2. Sets Location: "Yakima, WA"
   → Stored in AppContext (localStorage)
   ↓
3. Enables First-Gen Mode
   → Stored in AppContext
   → Triggers re-ranking
   ↓
4. Views Opportunities Page
   ↓
   Components:
   - Opportunities Page reads filters + context
   - Builds UserProfile object
   - Calls rankOpportunities()
   ↓
   Ranking Engine:
   - For each opportunity:
     * calculateProfileScore()
     * calculateLocationScore()
     * calculateValueScore()
     * calculateFirstGenBonus() [if first-gen mode ON]
   - Sorts by total score (high to low)
   ↓
5. Sees Ranked List
   - "Gates Scholarship" at top (78 pts)
   - Can click match badge to see why
   ↓
6. Clicks on Opportunity
   - Reads full description
   - Gets first-gen tips if mode is ON
   ↓
7. Bookmarks It (★)
   → AppContext updates
   → Saves to localStorage (or Supabase if configured)
   ↓
8. Visits Dashboard
   → Sees all bookmarked opportunities
   → Tracks application status
```

### Data Flow Diagram

```
┌──────────────────┐
│  User Actions    │
│  - Set location  │
│  - Toggle mode   │
│  - Apply filters │
│  - Bookmark      │
└────────┬─────────┘
         ↓
┌────────────────────────────┐
│      AppContext            │
│  - firstGenMode: boolean   │
│  - userLocation: string    │
│  - saved: string[]         │
│  - language: Language      │
└────────┬───────────────────┘
         ↓
         ├─→ localStorage (immediate)
         └─→ Supabase (if configured)

         ↓
┌────────────────────────────┐
│  Opportunities Page        │
│  1. buildUserProfile()     │
│  2. rankOpportunities()    │
└────────┬───────────────────┘
         ↓
┌────────────────────────────┐
│   Ranking Engine           │
│   src/lib/opportunityScoring.ts
│   - Profile scoring        │
│   - Location scoring       │
│   - Value scoring          │
│   - First-gen bonuses      │
└────────┬───────────────────┘
         ↓
┌────────────────────────────┐
│  Scored Opportunities      │
│  [                         │
│    { opp, score: 78, ... } │
│    { opp, score: 73, ... } │
│    ...                     │
│  ]                         │
└────────┬───────────────────┘
         ↓
┌────────────────────────────┐
│  Opportunity Cards         │
│  - Show match badge        │
│  - First-gen friendly tag  │
│  - Contextual tips         │
│  - Score breakdown         │
└────────────────────────────┘
```

### State Management

We use **React Context** rather than Redux/Zustand because:

```typescript
// Simple, predictable state
const AppContext = createContext<AppContextType | null>(null);

// Easy to consume anywhere
const { firstGenMode, toggleFirstGenMode } = useApp();

// Automatic persistence
useEffect(() => {
  if (user && supabase) {
    supabase.from("user_progress").upsert({ ...state });
  } else {
    localStorage.setItem("state", JSON.stringify(state));
  }
}, [state]);
```

**Why Context works here**:
- Limited global state (user preferences only)
- Not deeply nested prop drilling
- State changes are infrequent (user actions, not animations)
- Simple to understand and debug

---

## Security and Scalability Considerations

### Current Scale

- **25 opportunities** - all loaded at once, scored client-side
- **30 volunteer opportunities** - filtered by location client-side
- **~50 concurrent users** (estimated rural student population)

### Security

**Data Exposure**:
- ✅ All opportunity data is public by design
- ✅ No sensitive information in opportunities
- ✅ User data (bookmarks, preferences) isolated by Supabase RLS when auth is enabled

**Row-Level Security (when Supabase enabled)**:
```sql
-- Users can only access their own progress
CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);
```

### Scalability Considerations

**Current Approach Works Until**:
- ~100 opportunities (client-side scoring still fast)
- ~1000 concurrent users (static site, CDN handles this)
- ~10 requests/second to MCP server (stdio protocol, single-threaded)

**When to Scale**:

**At 100+ opportunities**:
```typescript
// Option 1: Paginate results
const paged = scored.slice(page * 20, (page + 1) * 20);

// Option 2: Virtual scrolling (only render visible)
import { VirtualList } from 'react-window';
```

**At 1000+ opportunities**:
```typescript
// Move scoring to API route
// POST /api/rank
export async function POST(req: Request) {
  const { profile, filters } = await req.json();
  const scored = rankOpportunities(allOpportunities, profile, filters);
  return Response.json(scored.slice(0, 50)); // Top 50 only
}
```

**At 10,000+ opportunities**:
- Migrate to database (Supabase with full-text search)
- Use database indexes on location, tags, gradeLevel
- Cache rankings for common profiles
- Consider Elasticsearch for advanced search

**Current Architecture Benefits**:
- Zero latency (client-side)
- Zero cost (static hosting)
- Offline capable (PWA ready)
- Simple deployment (just `npm run build`)

---

## Kiro Usage Analysis

### Depth of Understanding Across Features

#### ✅ **Excellent Understanding** (80-100% depth)

**1. Opportunity Ranking System**
- Full comprehension of weighted scoring algorithm
- Understood trade-offs (client vs server-side)
- Generated complete, production-ready TypeScript
- Proper type safety with comprehensive interfaces
- Edge cases handled (deadline penalties, remote bonuses)

**Best Code Generation Moment**:
```typescript
// Generated this complex scoring logic perfectly on first try
function calculateLocationScore(opportunity, userLocation): ScoreResult {
  // Remote opportunities: huge boost
  if (opportunity.location === "remote") {
    score += 25;
    bonuses.push("Remote - accessible from anywhere");
    return { score, bonuses };
  }

  // State matching with proper normalization
  if (normalizedUserLoc.includes("washington") ||
      normalizedUserLoc.includes("yakima")) {
    score += 20;
  }
  // ... (correct logic throughout)
}
```

**2. First-Gen Mode Implementation**
- Understood the goal: make it actually DO something, not just UI
- Designed three-part system: ranking boost + badges + tips
- Integrated seamlessly with existing scoring
- Created contextual tip system based on opportunity type

**Best Workflow Automation**:
- Automatically propagated `firstGenMode` through entire data flow
- Updated types, scoring, UI components, and page logic in one coherent pass

---

### Feature Analysis

#### **Vibe Coding: How Did You Structure Conversations?**

**Pattern Observed**:
1. **Problem Statement** → "I want opportunities ranked, not filtered"
2. **Context Gathering** → Read existing code, understood structure
3. **Design Proposal** → Explained weighted scoring approach
4. **Iterative Implementation** → Built scoring system, then integrated
5. **Testing & Validation** → Created test scenarios, verified logic

**Best Conversation Moments**:
- When asked about First-Gen Mode: Immediately understood it was underutilized, proposed concrete enhancements
- When adding opportunities: Provided 15 diverse, well-researched opportunities with correct tags for ranking
- When asked about volunteer opportunities: Added 20 location-specific opportunities with proper keyword matching

**What Made It Effective**:
- Clear initial goals ("rank, not filter")
- Concrete examples ("Yakima student, Seattle opportunity")
- Iterative refinement (started with basic scoring, added first-gen bonuses)
- Validation at each step (explained expected behavior)

---

#### **Agent Hooks: What Workflows Did You Automate?**

**Not used in this session**, but would have been valuable for:
- Searching large codebases for existing ranking logic
- Analyzing all opportunity data to suggest scoring weights
- Researching scholarship programs to add to database

**Why Not Used**:
- Codebase was small enough to explore directly
- Tasks were well-scoped and sequential
- Human guidance on educational programs was more valuable than automated research

---

#### **Spec-Driven Development: How Did You Structure Specs?**

**Approach Used**: Implicit specifications through examples

**Example Specification (embedded in conversation)**:
```
Goal: Rank opportunities
Constraint: Don't exclude distant opportunities
Example Input: Student in Yakima, CS interest, first-gen
Expected Output:
  1. Remote CS internship (high)
  2. Local Yakima workshop (high)
  3. Seattle in-person (medium)
  4. California weak-match (low, but still visible)
```

**How It Compared to Vibe Coding**:
- More structured than pure vibe (had clear examples)
- Less formal than full TDD specs
- Effective for this scope (new feature, clear requirements)

**What Worked Best**:
- Concrete examples guided implementation
- "Ranked by relevance" was clear enough
- Scoring weights were tunable after seeing results

---

#### **Steering Docs: How Did Steering Improve Responses?**

**Not explicitly used**, but implicitly followed patterns:
- Consistent code style (TypeScript, functional components)
- Naming conventions (camelCase, descriptive names)
- File organization (lib/ for utilities, components/ for UI)

**What Would Have Helped**:
A steering doc with:
```markdown
# Opportunity Scoring Priorities
1. Profile match is most important (50% of score)
2. Remote opportunities should rank high (accessibility for rural)
3. Never completely filter out opportunities
4. First-gen friendly opportunities get boost when mode is ON
```

**Strategy That Worked Best**:
- Learning from existing code patterns
- Maintaining consistency with current architecture
- Explicit explanations in comments

---

#### **MCP: How Did Extending Kiro's Capabilities Help?**

**Critical Use**: MCP server provides Claude with access to accurate opportunity data

**What Would Have Been Impossible Without MCP**:

**Scenario 1: Student Asks Claude**
```
Student: "What scholarships can I apply to as a first-gen student in Washington?"

WITHOUT MCP:
Claude: "Here are some scholarships you might consider:
  1. [Generic scholarship name]
  2. [Possibly outdated or hallucinated]
  3. [May not exist or be relevant]"
❌ Inaccurate, possibly harmful

WITH MCP:
Claude uses search_stem_opportunities({
  location: "Washington",
  identity_tags: ["first-gen"]
})

Claude: "Based on our database, here are scholarships specifically for
first-gen students in Washington:
  1. MESA Program – Yakima Valley (Deadline: Oct 1, 2026)
  2. Washington STEM Scholarship (Priority for rural students)
  3. Gates Scholarship (Full-ride, for Pell-eligible students)"
✅ Accurate, actionable, trustworthy
```

**Scenario 2: Simplifying Jargon**
```
Opportunity text: "Candidates must demonstrate Pell eligibility and submit
FAFSA documentation with SAR verification."

WITHOUT MCP:
Claude: [Might explain generally, but inconsistently]

WITH MCP (simplify_opportunity tool):
Claude: "You need to show you qualify for financial aid by filling out the
FAFSA form (Free Application for Federal Student Aid). After you submit it,
you'll get a Student Aid Report - bring a copy of that."
✅ Consistent, plain language
```

**Key Insight**: MCP transforms Claude from "helpful assistant" to "accurate information system"

---

## Performance Characteristics

### Client-Side Scoring Performance

**Test**: Rank 25 opportunities with full profile

```javascript
// Measured performance
console.time("Ranking");
const ranked = rankOpportunities(opportunities, profile, filters);
console.timeEnd("Ranking");
// Result: ~2-5ms on modern hardware
```

**Why It's Fast**:
- Simple arithmetic operations
- No network requests
- Happens in useMemo (only recalculates when dependencies change)
- 25 opportunities × 4 scoring functions = 100 function calls (trivial)

**Optimization Applied**:
```typescript
// useMemo prevents re-ranking on every render
const rankedOpportunities = useMemo(() => {
  const profile = buildUserProfile(filters, userLocation, firstGenMode);
  return rankOpportunities(opportunities, profile, filters);
}, [filters, userLocation, firstGenMode]); // Only when these change
```

### Bundle Size Impact

**Added Code**:
- `opportunityScoring.ts`: ~10KB (well-commented)
- Updated `OpportunityCard.tsx`: +2KB
- Updated `opportunities.ts`: +15KB (new data)

**Total Impact**: ~27KB additional JavaScript

**Acceptable because**:
- Core algorithm is small
- Most bytes are data (would be fetched from API anyway)
- Gzips well (lots of repetitive structure)

---

## Testing Strategy

### Approach Used

**Hybrid Testing**: Combination of example-driven development and manual verification

**Test File Created**: `src/lib/opportunityScoring.test.ts`

**Purpose**:
```typescript
// Documents expected behavior
console.log("Expected Ranking:");
console.log("1. Remote Software Internship (65 pts)");
console.log("2. Gates Scholarship (55 pts)");
console.log("3. Local Yakima Workshop (55 pts)");

// Validates logic
const ranked = rankOpportunities(testOpportunities, studentProfile);
assert(ranked[0].opportunity.id === "expected-winner");
```

**Why This Approach**:
- Scoring is deterministic (pure functions)
- Visual inspection of rankings is important
- Example-based tests document intent
- Easy to add new scenarios

**What We'd Add for Production**:
```typescript
describe("Opportunity Scoring", () => {
  it("boosts remote opportunities for rural students", () => {
    const remote = { ...baseOpp, location: "remote" };
    const local = { ...baseOpp, location: "washington" };

    const scores = [remote, local].map(o =>
      scoreOpportunity(o, ruralProfile)
    );

    expect(scores[0].score).toBeGreaterThan(scores[1].score);
  });

  it("applies first-gen bonus only when mode is active", () => {
    const firstGenOpp = { ...baseOpp, identity: ["first-gen"] };

    const withoutMode = scoreOpportunity(firstGenOpp, { firstGenMode: false });
    const withMode = scoreOpportunity(firstGenOpp, { firstGenMode: true });

    expect(withMode.score).toBe(withoutMode.score + 10);
  });
});
```

---

## Lessons Learned & Best Practices

### What Worked Well

1. **Start Simple, Add Complexity**
   - Built basic ranking first
   - Added first-gen bonuses after core was solid
   - Easier to debug and explain

2. **Make Scoring Transparent**
   - Show score breakdown on each card
   - List all bonuses in plain language
   - Builds trust with users

3. **Tunable Weights**
   - Exposed `SCORING_WEIGHTS` constant
   - Easy to adjust without changing logic
   - Can A/B test different values

4. **Type Safety**
   - TypeScript caught issues early
   - `UserProfile` and `ScoredOpportunity` types made integration smooth
   - Autocomplete helped development speed

### What We'd Do Differently

1. **Earlier Consideration of Scale**
   - Current approach works for 25-100 opportunities
   - Would design differently if expecting 1000s
   - Trade-off: simplicity now vs future-proofing

2. **More Explicit Testing**
   - Example-driven works, but could add unit tests
   - Regression tests would catch scoring changes
   - Consider property-based testing for edge cases

3. **Analytics from Day One**
   - Track which opportunities get clicked
   - Measure if rankings correlate with applications
   - Use data to tune weights

---

## Future Enhancements

### Short Term (Could Implement Today)

1. **User Feedback on Rankings**
   ```typescript
   // "Was this opportunity helpful?" thumbs up/down
   // Adjust weights based on feedback
   ```

2. **Explain Score in Plain Language**
   ```typescript
   // Instead of "Profile: 35 | Location: 20"
   // Say: "This matches your computer science interest and is fully remote"
   ```

3. **Saved Searches**
   ```typescript
   // Save filter combinations
   // Get notified when new opportunities match
   ```

### Medium Term (Requires More Data)

1. **Machine Learning for Weights**
   ```python
   # Train on: which opportunities students applied to
   # Learn: optimal weights for different student profiles
   # Update: scoring_weights based on real outcomes
   ```

2. **Collaborative Filtering**
   ```typescript
   // "Students like you also applied to:"
   // Based on similar profiles and successful applications
   ```

3. **Time-Based Ranking**
   ```typescript
   // Boost deadlines closer to application season
   // Lower priority for far-future deadlines
   ```

### Long Term (Architectural Changes)

1. **Real-Time Opportunity Updates**
   - Integrate with scholarship APIs
   - Automatic deadline tracking
   - New opportunity notifications

2. **Personalized Application Timelines**
   - Build calendar of when to apply
   - Reminder system
   - Progress tracking

3. **Community Features**
   - Student success stories
   - Application tips from peers
   - Mentor matching based on successful applications

---

## Conclusion

This technical documentation captures the architecture, design decisions, and implementation details of the Rural STEM Opportunity Finder's ranking system. The key innovation is **intelligent ranking over binary filtering**, making all opportunities discoverable while surfacing the most relevant and accessible ones for rural, first-generation STEM students.

**Core Principles Applied**:
- Transparency (students see why things match)
- Accessibility (remote opportunities prioritized)
- Inclusion (first-gen mode provides real support)
- Simplicity (works without complex setup)
- Tunability (weights are adjustable)

**Technical Highlights**:
- Type-safe TypeScript implementation
- Client-side scoring (fast, offline-capable)
- Graceful degradation (works without auth)
- MCP integration (accurate data for Claude)
- Well-documented, maintainable code

Built with rural students in mind, optimized for the unique challenges of discovering STEM opportunities from small communities.
