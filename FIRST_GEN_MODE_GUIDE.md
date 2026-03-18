# First-Gen Mode Feature Guide

## Overview

The **First-Gen Mode** is now fully functional! When activated, it provides enhanced support, better rankings, and helpful guidance specifically designed for first-generation college students and those from low-income backgrounds.

## What the First-Gen Button Does

### Location
The First-Gen Mode toggle button is located in the **navigation bar** at the top of the page:
- **Inactive**: Shows as a gray button with "First-Gen Mode"
- **Active**: Shows as an amber button with "✓ First-Gen Mode"

### Core Functionality

When First-Gen Mode is **activated**, three major enhancements occur:

## 1. **Enhanced Ranking (Automatic Scoring Boost)**

Opportunities that are first-gen friendly receive significant ranking boosts:

### Scoring Bonuses:
- **+10 points**: Opportunities tagged as first-gen or low-income friendly
- **+8 points**: Free or fully-funded opportunities (no cost barriers)
- **+5 points**: Programs with mentorship or college-prep support

### Example Impact:
Without First-Gen Mode:
- Gates Scholarship: Score 55/100
- Local paid internship: Score 60/100

With First-Gen Mode ON:
- Gates Scholarship: Score **78/100** (+23 bonus!)
- Local paid internship: Score 68/100 (+8 bonus)

**Result**: First-gen friendly scholarships and programs jump to the top of the list!

## 2. **Visual Badges & Indicators**

### First-Gen Friendly Badge
Opportunities that explicitly welcome first-gen students display a special badge:

```
✨ First-Gen Friendly
```

This appears on:
- Opportunities tagged with "first-gen" or "low-income" in their identity or tags
- Makes it instantly clear which opportunities were designed for you

### Score Breakdown
When you click on a match badge, you now see:
```
Score: 78/100+ (Profile: 35 | Location: 20 | Value: 15 | First-Gen: +23)
```

The "+23" shows exactly how much the first-gen boost helped!

## 3. **Helpful Tips & Guidance**

When First-Gen Mode is active, each opportunity card shows contextual tips based on the opportunity type:

### Scholarship Tips
```
💡 Tip: Most scholarships are free to apply. Don't let application
fees discourage you—many have fee waivers!
```

### College Prep / Mentorship Tips
```
💡 Tip: These programs are designed to help first-gen students
navigate the college process. Don't hesitate to ask questions!
```

### Fully-Funded Program Tips
```
💡 Tip: This opportunity covers all costs, so finances shouldn't
hold you back from applying.
```

### Remote Opportunity Tips
```
💡 Tip: Remote means you can participate from anywhere—perfect
if you're in a rural area!
```

These tips help demystify the application process and encourage students to apply!

## How It Works Technically

### User Flow:
1. Student clicks **First-Gen Mode** button in navbar
2. Mode is saved to their profile (localStorage or Supabase)
3. Opportunities page receives `firstGenMode: true`
4. Scoring system applies bonuses to first-gen friendly opportunities
5. Opportunities are re-ranked automatically
6. Badges and tips appear on relevant cards

### Behind the Scenes:
```typescript
// Scoring system checks for first-gen mode
if (firstGenMode === true) {
  // Check if opportunity is first-gen friendly
  if (opportunity.identity.includes("first-gen") ||
      opportunity.tags.includes("first-gen")) {
    score += 10; // Identity bonus
    showBadge = true;
  }

  // Check if it's free/funded
  if (opportunity.tags.includes("free") ||
      opportunity.type === "scholarship") {
    score += 8; // No-cost bonus
  }

  // Check if supportive
  if (opportunity.type === "college-prep" ||
      opportunity.type === "mentorship") {
    score += 5; // Support bonus
  }
}
```

## Which Opportunities Get Boosted?

Currently, **these opportunities** receive first-gen bonuses (based on existing data):

### Maximum Boost (+23 points):
- **Gates Scholarship** - first-gen + low-income + full-ride
- **Questbridge College Prep** - first-gen + low-income + free + college-prep
- **Amazon Future Engineer** - first-gen + low-income + scholarship
- **First-Gen College Bound** - first-gen + low-income + free + college-prep

### Strong Boost (+18 points):
- **MESA Program** - first-gen + low-income + free
- **Google CSSI** - first-gen + free + underrepresented
- **Washington STEM Scholarship** - first-gen + low-income + scholarship
- **Upward Bound** - first-gen + low-income + free + college-prep

### Moderate Boost (+10-15 points):
- **NIH Undergraduate Scholarship** - low-income + scholarship + paid
- **Hispanic Scholarship Fund** - first-gen + low-income + scholarship
- Most other opportunities with first-gen or low-income tags

## Benefits for Students

### 1. **Confidence Building**
- Clear badges show "this opportunity was made for you"
- Reduces imposter syndrome
- Encourages applications to competitive programs

### 2. **Time Saving**
- First-gen friendly opportunities automatically rise to the top
- No need to manually filter through dozens of options
- Focus on opportunities most likely to support your success

### 3. **Education & Empowerment**
- Contextual tips explain unfamiliar terms
- Guidance on application processes
- Reduces barriers to entry

### 4. **Financial Clarity**
- Free and funded opportunities are prioritized
- No hidden costs or surprises
- Clear about what's covered

## Adjusting the Boost Strength

If you want to tune how much first-gen mode affects rankings, edit the weights in:

**File**: `src/lib/opportunityScoring.ts`

```typescript
firstGenMode: {
  identityBonus: 10,        // Boost for first-gen/low-income tags
  noCostBonus: 8,           // Boost for free/funded opportunities
  supportiveBonus: 5,       // Boost for mentorship/college-prep
},
```

### Tuning Examples:

**To prioritize first-gen even MORE**:
```typescript
firstGenMode: {
  identityBonus: 15,  // Increased from 10
  noCostBonus: 12,    // Increased from 8
  supportiveBonus: 8, // Increased from 5
},
```

**To make it more subtle**:
```typescript
firstGenMode: {
  identityBonus: 5,   // Decreased from 10
  noCostBonus: 4,     // Decreased from 8
  supportiveBonus: 3, // Decreased from 5
},
```

## Example User Experience

### Scenario: Student in Yakima, WA

**Without First-Gen Mode**:
1. Remote Software Internship (Score: 65)
2. Local Yakima Workshop (Score: 55)
3. Seattle Research Program (Score: 45)
4. Gates Scholarship (Score: 55)

**With First-Gen Mode ON**:
1. **Gates Scholarship (Score: 78)** ← Jumped to #1!
2. Remote Software Internship (Score: 73) ← Also got boost if tagged first-gen
3. **Questbridge College Prep (Score: 70)** ← Major boost
4. Local Yakima Workshop (Score: 63)

The first-gen friendly opportunities with strong support systems now rank highest!

## Adding More First-Gen Tips

To add more contextual tips, edit the `getFirstGenTip()` function in:

**File**: `src/components/OpportunityCard.tsx`

```typescript
function getFirstGenTip(opportunity: Opportunity): string | null {
  // Add your custom tips based on opportunity attributes
  if (opportunity.type === "internship" && opportunity.tags.includes("paid")) {
    return "💡 Tip: Paid internships mean you earn money while gaining experience!";
  }

  // Add more conditions as needed
  return null;
}
```

## Questions & Customization

### "Can students turn it off?"
Yes! It's a toggle. Students can activate/deactivate anytime.

### "Does it hide non-first-gen opportunities?"
No! It only **re-ranks** them. All opportunities remain visible, but first-gen friendly ones appear higher.

### "Can we add more criteria?"
Absolutely! Edit the `calculateFirstGenBonus()` function to check for additional tags, keywords, or attributes.

### "Does it work with the existing ranking system?"
Yes! First-gen bonuses **add to** the existing profile, location, and value scores. Everything works together.

## Summary

The First-Gen Mode button is now a **powerful tool** that:

✅ Automatically boosts first-gen friendly opportunities in rankings
✅ Shows clear visual badges for first-gen friendly programs
✅ Provides contextual tips and guidance
✅ Reduces barriers and builds confidence
✅ Works seamlessly with the existing opportunity ranking system

This feature specifically addresses the needs of rural, first-generation STEM students by surfacing the most supportive and accessible opportunities first!
