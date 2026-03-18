export type Mentor = {
  id: string;
  name: string;
  role: string;
  company: string;
  interests: string[];
  bio: string;
  about: string;
  avatar: string;
  location: string;
  firstGen: boolean;
  linkedInUrl: string;
  featured?: boolean;
  featuredNote?: string;
};

export const mentors: Mentor[] = [
  // ── Aspirational leaders ──────────────────────────────────────────
  {
    id: "5",
    name: "Matt Garman",
    role: "Chief Executive Officer, Amazon Web Services",
    company: "Amazon Web Services (AWS)",
    interests: ["cloud computing", "engineering", "leadership", "computer science"],
    bio: "CEO of AWS since June 2024. Started as one of AWS's first product managers and spent 18 years growing the company before becoming its third CEO.",
    about: "Matt Garman is Chief Executive Officer of Amazon Web Services (AWS). He joined Amazon in 2006 as one of the first product managers for AWS and helped build and launch numerous core services. He most recently served as Senior Vice President of AWS Sales, Marketing, and Global Services before becoming CEO. Garman holds undergraduate and graduate degrees in industrial engineering from Stanford University and an MBA from Northwestern University. He has been instrumental in scaling AWS into a $100B+ annual revenue business and continues to lead its strategy in the age of AI.",
    avatar: "MG",
    location: "Seattle, WA",
    firstGen: false,
    linkedInUrl: "https://www.linkedin.com/in/mattgarman",
    featured: true,
    featuredNote: "Aspirational example — not a direct mentor",
  },
  {
    id: "6",
    name: "Swami Sivasubramanian",
    role: "Vice President, Agentic AI — Amazon Web Services",
    company: "Amazon Web Services (AWS)",
    interests: ["computer science", "AI", "machine learning", "engineering"],
    bio: "VP of Agentic AI at AWS. Led the development of Amazon DynamoDB, SageMaker, Bedrock, and Amazon Q. Joined Amazon in 2005 after a PhD in distributed computing.",
    about: "Swami Sivasubramanian is Vice President for Agentic AI at Amazon Web Services (AWS). At AWS, Swami has led the development and growth of leading AI services including Amazon DynamoDB, Amazon SageMaker, Amazon Bedrock, and Amazon Q. His team's mission is to provide the scale, flexibility, and value that customers and partners require to innovate using agentic AI — building agents that are powerful, efficient, trustworthy, and responsible. From May 2022 through May 2025, Swami served as a member of the National Artificial Intelligence Advisory Committee, advising the President of the United States and the National AI Initiative Office on topics related to the National AI Initiative.",
    avatar: "SS",
    location: "Seattle, WA",
    firstGen: false,
    linkedInUrl: "https://www.linkedin.com/in/swaminathansivasubramanian",
    featured: true,
    featuredNote: "Aspirational example — not a direct mentor",
  },
  {
    id: "7",
    name: "Werner Vogels",
    role: "Vice President & Chief Technology Officer, Amazon",
    company: "Amazon",
    interests: ["computer science", "engineering", "cloud computing", "distributed systems"],
    bio: "VP and CTO of Amazon since 2005. Responsible for driving Amazon's customer-centric technology vision. Joined from Cornell University where he was a distributed systems researcher.",
    about: "Dr. Werner Vogels is Chief Technology Officer at Amazon.com where he is responsible for driving the company's customer-centric technology vision. As one of the forces behind Amazon's approach to cloud computing, he is passionate about helping young businesses reach global scale, and transforming enterprises into fast-moving digital organizations. Vogels joined Amazon in 2004 from Cornell University where he was a distributed systems researcher. He has held technology leadership positions in companies that handle the transition of academic technology into industry. Vogels holds a PhD from the Vrije Universiteit in Amsterdam and has authored many articles on distributed systems technologies for enterprise computing.",
    avatar: "WV",
    location: "Seattle, WA",
    firstGen: false,
    linkedInUrl: "https://www.linkedin.com/in/wernervogels",
    featured: true,
    featuredNote: "Aspirational example — not a direct mentor",
  },
];
