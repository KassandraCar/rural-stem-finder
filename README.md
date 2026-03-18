# Rural STEM Opportunity Finder 🌱

A Next.js web app helping students in rural communities — particularly Washington state's Yakima Valley — discover STEM scholarships, internships, programs, and mentorships they'd otherwise miss.

**Now featuring intelligent opportunity ranking and enhanced first-gen student support!**

## Getting Started

```bash
cd rural-stem-finder
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## ✨ Key Features

### 🎯 **Intelligent Opportunity Ranking** (NEW!)
Instead of just filtering, opportunities are now **ranked by relevance** using a weighted scoring system:
- **Profile Match (50 pts)**: Interest alignment, grade level, identity tags
- **Location Accessibility (30 pts)**: Remote opportunities get a huge boost, local opportunities rank high
- **Opportunity Value (20 pts)**: Scholarships, paid programs, prestigious opportunities
- **First-Gen Boost (up to +23 pts)**: When First-Gen Mode is on, supportive opportunities rank higher

**Result**: Students see ALL opportunities, but the most relevant and accessible ones appear first!

### ✨ **Enhanced First-Gen Mode** (NEW!)
When activated, this mode provides comprehensive support for first-generation students:
- **Automatic Ranking Boost**: First-gen friendly opportunities jump to the top (+10-23 points)
- **Visual Badges**: "✨ First-Gen Friendly" badges on supportive programs
- **Contextual Tips**: Helpful guidance on each opportunity card
  - 💡 Scholarship tips: "Most scholarships are free to apply!"
  - 💡 Remote tips: "You can participate from anywhere!"
  - 💡 College prep tips: "Don't hesitate to ask questions!"
- **No-Cost Priority**: Free and funded opportunities receive extra boost

[Read the full First-Gen Mode guide →](FIRST_GEN_MODE_GUIDE.md)

### 📚 **Expanded Opportunity Database**
- **25 opportunities** (up from 10) carefully selected for rural students
- **7 remote opportunities** - fully accessible from anywhere
- **Washington-specific programs** - Yakima Valley, Seattle, Spokane, Tri-Cities
- **Diverse STEM fields** - CS, engineering, biology, physics, agriculture, AI

### 🤝 **30 Volunteer Opportunities** (NEW!)
- **20 area-specific opportunities** for Yakima Valley, Tri-Cities, Spokane, and rural WA
- **10 remote options** - contribute to STEM from anywhere
- Categories: STEM education, tutoring, environment, health, community service
- Location-based matching - see local opportunities first

### 🌍 **Multilingual Support**
Full translation support across **5 languages**:
- 🇺🇸 English
- 🇪🇸 Español
- 🇻🇳 Tiếng Việt
- 🇸🇴 Soomaali
- 🇷🇺 Русский

### 💾 **Save & Track Progress**
- Bookmark opportunities with ★
- Track application status: Not Started → In Progress → Applied
- Syncs across devices with Supabase (optional)
- Works offline with localStorage fallback

### 👥 **Other Features**
- Mentor directory with LinkedIn outreach templates
- Step-by-step resource guides (FAFSA, college apps, scholarships, internships)
- Auth + cloud sync via Supabase (optional — falls back to localStorage)

## 🎓 How the Ranking System Works

The opportunity ranking system uses a **weighted scoring algorithm** to match students with the best opportunities based on their profile, location, and needs.

### Scoring Components

Every opportunity receives a score from 0-100+ based on:

1. **Profile Match (0-50 points)**
   - Interest alignment (20 pts)
   - Grade level compatibility (15 pts)
   - Identity match - first-gen, low-income, etc. (10 pts)
   - Search term relevance (5 pts)

2. **Location Accessibility (0-30 points)**
   - Remote opportunities: **25 points** (huge boost!)
   - Local/same-state: 20 points
   - National opportunities: 5 points base
   - High-value programs get +10 bonus even if distant

3. **Opportunity Value (0-20 points)**
   - Scholarships: 15 points
   - Paid programs/internships: 10 points
   - Competitive/prestigious: 5 points
   - Deadline urgency: 5 points (within 30 days)

4. **First-Gen Mode Bonus (0-23 points)** - Only when activated
   - First-gen/low-income friendly: +10 points
   - Free/fully-funded: +8 points
   - Mentorship/college-prep support: +5 points

### Example: Student in Yakima, WA

**Profile**: High school, interested in Computer Science, First-gen

**Without First-Gen Mode**:
1. Remote Software Internship (65 pts)
2. Local Yakima Workshop (55 pts)
3. Gates Scholarship (55 pts)

**With First-Gen Mode ON**:
1. **Gates Scholarship (78 pts)** ← +23 boost!
2. Remote Software Internship (73 pts) ← +8 boost
3. **Questbridge College Prep (70 pts)** ← Major boost
4. Local Yakima Workshop (63 pts)

### Customizing the Weights

Edit `src/lib/opportunityScoring.ts` to tune the ranking behavior:

```typescript
export const SCORING_WEIGHTS = {
  profileMatch: {
    interestAlignment: 20,    // Increase for stronger interest matching
    gradeLevelMatch: 15,
    identityMatch: 10,
    searchRelevance: 5,
  },
  location: {
    remoteBonus: 25,          // Increase to favor remote even more
    localMatch: 20,
    nationalBase: 5,
  },
  value: {
    scholarship: 15,          // Increase to prioritize scholarships
    paidProgram: 10,
    competitiveBonus: 5,
    deadlineUrgency: 5,
  },
  firstGenMode: {
    identityBonus: 10,        // Boost for first-gen tagged opportunities
    noCostBonus: 8,           // Boost for free/funded programs
    supportiveBonus: 5,       // Boost for mentorship/college-prep
  },
};
```

[Read the full ranking system guide →](OPPORTUNITY_RANKING_GUIDE.md)

## Environment Variables

Create `rural-stem-finder/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Both are optional. The app works fully without Supabase using localStorage. Supabase is considered unconfigured (and the app falls back to localStorage) if either variable is missing or still set to a placeholder value — this is detected via `isSupabaseConfigured()` in `src/lib/supabase.ts`, which delegates to `createClient()` returning `null`.

The sign-in button and user menu in the Navbar are always rendered regardless of whether Supabase is configured. If Supabase is not configured, auth actions will have no effect (no session will be created or persisted).

## 📝 Adding Opportunities and Volunteers

### Adding New Opportunities

Opportunities are stored in `src/data/opportunities.ts`. To add a new opportunity:

```typescript
{
  id: "26",
  title: "Your Opportunity Name",
  organization: "Organization Name",
  type: "scholarship" | "internship" | "program" | "mentorship" | "college-prep",
  deadline: "2026-12-31",
  description: "Short description (1-2 sentences)",
  fullDescription: "Detailed description with eligibility and benefits",
  eligibility: ["Requirement 1", "Requirement 2", "etc."],
  tags: ["first-gen", "remote", "paid", "free"], // Used for ranking!
  gradeLevel: ["high-school", "college"],
  interests: ["computer science", "engineering", "biology"],
  identity: ["first-gen", "low-income", "underrepresented"], // Used for ranking!
  location: "remote" | "washington" | "national", // Critical for ranking!
  applyLink: "https://...",
}
```

**Important for Ranking**:
- `location: "remote"` gets **+25 points** in ranking
- `identity: ["first-gen"]` gets **+10 points** when First-Gen Mode is on
- `tags: ["free", "fully-funded"]` gets **+8 points** in First-Gen Mode
- `type: "scholarship"` gets **+15 points** in value scoring

### Adding New Volunteer Opportunities

Volunteer opportunities are stored in `src/data/volunteer.ts`:

```typescript
{
  id: "v31",
  title: "Volunteer Opportunity Name",
  organization: "Organization Name",
  description: "Brief description of the volunteer role",
  category: "tutoring" | "environment" | "community" | "stem" | "health" | "food",
  commitment: "2-4 hrs/week" or "Flexible" or "Monthly events",
  remote: true, // or false for in-person
  applyLink: "https://...",
  tags: ["remote", "local", "stem", "youth"],
  locationKeywords: ["yakima", "sunnyside", "washington", "wa"], // For location matching
}
```

**Location Matching**: The `locationKeywords` array is used to surface local opportunities when students set their location in the app.

## MCP Opportunity Server

A standalone [Model Context Protocol](https://modelcontextprotocol.io) server lives at `mcp-opportunity-server/`. It exposes two tools:

### `search_stem_opportunities`

Searches opportunities by grade level, location, interest, and identity tags.

```json
{
  "grade_level": "high_school",
  "location": "Washington",
  "interest": "engineering",
  "identity_tags": ["first-gen", "low-income"]
}
```

**Identity tag matching behavior:**
- Matching uses `some` (any tag match returns the opportunity), not `every`
- Tags are normalized before matching — e.g. `"first-generation"` is automatically treated as `"first-gen"`
- Passing no `identity_tags` returns all opportunities regardless of identity

### `simplify_opportunity`

Rewrites jargon-heavy opportunity text into plain, first-gen-friendly language.

```json
{ "text": "Applicants must submit a personal statement and letters of recommendation." }
```

### Running the MCP server

```bash
cd mcp-opportunity-server
npm install
node server.js
```

The server communicates over stdio using JSON-RPC 2.0 and is configured in `.kiro/settings/mcp.json`.

## Internationalization

All pages are fully translated across all 5 supported languages, including the home page, opportunities listing and detail, volunteer, resources, mentors, dashboard, auth (sign in / sign up), and mentor card UI. Translations live in `src/data/translations.ts`. The `t` object maps translation keys to all 5 supported languages:

| Code | Language   |
|------|------------|
| `en` | English    |
| `es` | Español    |
| `vi` | Tiếng Việt |
| `so` | Soomaali   |
| `ru` | Русский    |

To use a translation in a component, import `t` and index by the current `language` from `useApp()`:

```tsx
import { t } from "@/data/translations";
const { language, setLanguage } = useApp();

<p>{t.findOpportunities[language]}</p>
```

To change the language, call `setLanguage` with a `Language` code directly (e.g. `setLanguage("es")`).

The Navbar renders a dropdown that lists all supported languages (with flags) and calls `setLanguage` on selection. The `languageOptions` array in `translations.ts` drives both the dropdown and any other language-picker UI — add new languages there first.

To add a new key, add an entry to the `t` object with all 5 language values.

## 📖 Documentation

- **[OPPORTUNITY_RANKING_GUIDE.md](OPPORTUNITY_RANKING_GUIDE.md)** - Complete guide to the ranking system, how it works, and how to customize scoring weights
- **[FIRST_GEN_MODE_GUIDE.md](FIRST_GEN_MODE_GUIDE.md)** - Detailed explanation of First-Gen Mode features, benefits, and implementation

## 🛠️ Tech Stack

- Next.js 16 (App Router) + React + TypeScript
- Tailwind CSS v4
- Supabase (`@supabase/ssr`) for optional auth and persistence
- Static data in `src/data/` as the primary content source
- Intelligent ranking system in `src/lib/opportunityScoring.ts`

## 📊 Project Stats

- **25 STEM opportunities** across scholarships, internships, programs, mentorships, and college prep
- **30 volunteer opportunities** with local and remote options
- **5 language translations** (English, Spanish, Vietnamese, Somali, Russian)
- **100+ point scoring system** with customizable weights
- **First-gen friendly** with dedicated support features
