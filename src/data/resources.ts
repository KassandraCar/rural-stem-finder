export type Resource = {
  id: string;
  title: string;
  category: "college" | "internships" | "scholarships" | "stem-careers" | "financial-aid";
  description: string;
  steps: string[];
  tips: string[];
  links: { label: string; url: string }[];
};

export const resources: Resource[] = [
  {
    id: "1",
    title: "How to Apply for College",
    category: "college",
    description: "A simple, step-by-step guide to applying for college — even if no one in your family has done it before.",
    steps: [
      "Make a list of 5–8 colleges you're interested in (include safety, match, and reach schools)",
      "Create a Common App account at commonapp.org",
      "Request letters of recommendation from 2–3 teachers or counselors",
      "Write your personal statement — talk about your story and what drives you",
      "Gather transcripts and test scores (SAT/ACT optional at many schools)",
      "Apply for financial aid using FAFSA at studentaid.gov",
      "Submit applications before deadlines (usually Nov–Jan for fall admission)",
    ],
    tips: [
      "Start early — give yourself at least 3 months",
      "Apply to schools with strong financial aid for low-income students",
      "Your counselor is a free resource — use them",
      "Many application fees can be waived if you have financial need",
    ],
    links: [
      { label: "Common App", url: "https://commonapp.org" },
      { label: "FAFSA", url: "https://studentaid.gov/h/apply-for-aid/fafsa" },
      { label: "College Board", url: "https://bigfuture.collegeboard.org" },
    ],
  },
  {
    id: "2",
    title: "How to Find STEM Internships",
    category: "internships",
    description: "Internships are one of the best ways to explore STEM careers. Here's how to find and land one.",
    steps: [
      "Figure out what field interests you (coding, biology, engineering, etc.)",
      "Search on Handshake, LinkedIn, and Indeed using terms like 'STEM internship high school'",
      "Look for programs specifically for underrepresented students (NASA, Google, NIH)",
      "Build a simple resume — include school, GPA, clubs, and any projects",
      "Write a short cover letter explaining your interest and background",
      "Apply to at least 5–10 programs to increase your chances",
      "Follow up if you don't hear back in 2–3 weeks",
    ],
    tips: [
      "Many top internships are free and fully funded — don't let cost stop you",
      "Remote internships are a great option if you're in a rural area",
      "Ask teachers or counselors to review your application",
      "Apply even if you don't meet every requirement — you might still get in",
    ],
    links: [
      { label: "Handshake", url: "https://joinhandshake.com" },
      { label: "NASA Internships", url: "https://intern.nasa.gov" },
      { label: "Google Programs", url: "https://buildyourfuture.withgoogle.com" },
    ],
  },
  {
    id: "3",
    title: "How to Apply for Scholarships",
    category: "scholarships",
    description: "Free money for college exists — you just have to find it and apply. Here's how.",
    steps: [
      "Start with FAFSA to see what federal aid you qualify for",
      "Search for local scholarships in Yakima Valley and Washington state",
      "Look for scholarships tied to your identity (first-gen, Hispanic, rural, etc.)",
      "Create a scholarship tracker spreadsheet with deadlines and requirements",
      "Write a strong personal essay — reuse and adapt it for multiple applications",
      "Ask for letters of recommendation early (give people at least 3 weeks)",
      "Apply to as many as you can — even small awards add up",
    ],
    tips: [
      "Local scholarships have less competition than national ones",
      "Never pay to apply for a scholarship — it's always free",
      "Fastweb and Scholarships.com are good free search tools",
      "Your school counselor may know about local scholarships not listed online",
    ],
    links: [
      { label: "Fastweb", url: "https://fastweb.com" },
      { label: "Scholarships.com", url: "https://scholarships.com" },
      { label: "Washington Student Achievement Council", url: "https://wsac.wa.gov" },
    ],
  },
  {
    id: "4",
    title: "Exploring STEM Careers",
    category: "stem-careers",
    description: "Not sure what you want to do? Here's how to explore STEM careers and find what fits you.",
    steps: [
      "Take a free career quiz (try MyMajors or CareerOneStop)",
      "Shadow a professional in a field you're curious about",
      "Join a club or program related to your interest (robotics, coding, science fair)",
      "Watch YouTube channels and podcasts by people in STEM careers",
      "Talk to mentors who work in fields you're interested in",
      "Try free online courses on Khan Academy or Coursera to test your interest",
    ],
    tips: [
      "You don't have to have it all figured out — exploring is the point",
      "STEM careers include medicine, coding, research, engineering, and much more",
      "Many STEM jobs are remote-friendly, which matters if you're from a rural area",
    ],
    links: [
      { label: "Khan Academy", url: "https://khanacademy.org" },
      { label: "CareerOneStop", url: "https://careeronestop.org" },
      { label: "Coursera (free courses)", url: "https://coursera.org" },
    ],
  },
];
