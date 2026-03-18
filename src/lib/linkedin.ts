// Builds a LinkedIn People Search URL from keywords
// No API key needed — uses LinkedIn's public search interface
export function buildLinkedInSearchUrl(keywords: string[]): string {
  const query = keywords.filter(Boolean).join(" ");
  const encoded = encodeURIComponent(query);
  return `https://www.linkedin.com/search/results/people/?keywords=${encoded}&origin=GLOBAL_SEARCH_HEADER`;
}

// Builds a direct profile search for a named person
export function buildLinkedInProfileSearch(name: string, role?: string, company?: string): string {
  const parts = [name, role, company].filter(Boolean);
  return buildLinkedInSearchUrl(parts as string[]);
}

type StudentProfile = {
  location: string;
  interests: string[];
  grade: string;
  background: string[]; // e.g. ["first-gen", "rural", "hispanic"]
};

type SearchSuggestion = {
  label: string;
  description: string;
  url: string;
  keywords: string[];
};

// Generates a set of tailored LinkedIn search suggestions based on student profile
export function generateLinkedInSuggestions(profile: StudentProfile): SearchSuggestion[] {
  const { location, interests, grade, background } = profile;
  const isCollege = grade.startsWith("college");
  const locationClean = location.trim();

  const suggestions: SearchSuggestion[] = [];

  // 1. Local professionals in their field
  interests.forEach((interest) => {
    const keywords = [interest, locationClean, "mentor"].filter(Boolean);
    suggestions.push({
      label: `${capitalize(interest)} professionals near ${locationClean || "you"}`,
      description: `Find people working in ${interest} who are local and may be open to connecting.`,
      url: buildLinkedInSearchUrl(keywords),
      keywords,
    });
  });

  // 2. First-gen / rural background match
  if (background.includes("first-gen") || background.includes("rural")) {
    interests.forEach((interest) => {
      const keywords = [interest, "first generation", "rural", "mentor"];
      suggestions.push({
        label: `First-gen ${capitalize(interest)} mentors`,
        description: "People who share your background and made it into STEM — they get it.",
        url: buildLinkedInSearchUrl(keywords),
        keywords,
      });
    });
  }

  // 3. Alumni from Washington state schools
  if (locationClean) {
    interests.forEach((interest) => {
      const keywords = [interest, "Washington State University", "University of Washington", "alumni"];
      suggestions.push({
        label: `UW / WSU ${capitalize(interest)} alumni`,
        description: "Washington state university grads in your field — great for in-state connections.",
        url: buildLinkedInSearchUrl(keywords),
        keywords,
      });
    });
  }

  // 4. College students / early career (peer mentors)
  if (!isCollege) {
    interests.forEach((interest) => {
      const keywords = [interest, "intern", "student", locationClean].filter(Boolean);
      suggestions.push({
        label: `${capitalize(interest)} students & interns`,
        description: "Connect with college students just a few years ahead of you — they're approachable and remember being in your spot.",
        url: buildLinkedInSearchUrl(keywords),
        keywords,
      });
    });
  }

  // 5. Specific company searches based on interest
  const companyMap: Record<string, string[]> = {
    "computer science": ["Microsoft", "Amazon", "Google", "Apple"],
    engineering: ["Boeing", "SpaceX", "Tesla", "Bechtel"],
    biology: ["NIH", "Fred Hutch", "Pfizer", "Genentech"],
    neuroscience: ["Allen Institute", "NIH", "UW Medicine"],
    math: ["Jane Street", "Two Sigma", "Citadel"],
    chemistry: ["Dow", "BASF", "Pacific Northwest National Laboratory"],
  };

  interests.forEach((interest) => {
    const companies = companyMap[interest];
    if (companies) {
      const company = companies[0];
      const keywords = [interest, company, "mentor", "diversity"];
      suggestions.push({
        label: `${capitalize(interest)} at ${company}`,
        description: `Professionals at ${company} who work in ${interest} — many have mentorship programs.`,
        url: buildLinkedInSearchUrl(keywords),
        keywords,
      });
    }
  });

  // Deduplicate and cap at 6
  return suggestions.slice(0, 6);
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Cold outreach message template
export function getColdOutreachTemplate(mentorName: string, studentName: string, interest: string, location: string): string {
  return `Hi ${mentorName},

My name is ${studentName}, and I'm a high school student from ${location || "a rural community"} interested in ${interest}. I came across your profile and was inspired by your work.

I'm exploring career paths in ${interest} and would love to hear about your journey — even a 15-minute conversation would mean a lot. I'm a first-generation college student trying to figure out the right path forward.

Thank you for your time, and I hope to connect!`;
}
