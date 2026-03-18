#!/usr/bin/env node
// MCP server using JSON-RPC 2.0 over stdio
// Compatible with Kiro's MCP client

const opportunities = [
  {
    title: "Washington State Opportunity Scholarship",
    organization: "WSAC",
    location: "Washington",
    interest: "engineering",
    identity: ["first-gen", "low-income"],
    deadline: "June 1",
    description: "Up to $5,000/year for WA students in STEM or health care fields with financial need.",
    applyLink: "https://wsac.wa.gov/wsos",
  },
  {
    title: "NASA L'SPACE Program",
    organization: "NASA",
    location: "Remote",
    interest: "engineering",
    identity: [],
    deadline: "May 15",
    description: "Virtual STEM academy where college students work on real NASA mission concepts.",
    applyLink: "https://lspace.asu.edu",
  },
  {
    title: "MESA Program – Yakima Valley",
    organization: "MESA Washington",
    location: "Washington",
    interest: "math",
    identity: ["first-gen", "underrepresented"],
    deadline: "October 1",
    description: "Math, Engineering, Science Achievement program for underrepresented students in WA.",
    applyLink: "https://mesawa.org",
  },
  {
    title: "Google CSSI",
    organization: "Google",
    location: "Remote",
    interest: "computer science",
    identity: ["underrepresented"],
    deadline: "February 28",
    description: "Free 3-week intro to CS at Google for rising college freshmen from underrepresented groups.",
    applyLink: "https://buildyourfuture.withgoogle.com/programs/computer-science-summer-institute",
  },
  {
    title: "Gates Scholarship",
    organization: "Bill & Melinda Gates Foundation",
    location: "National",
    interest: "general",
    identity: ["first-gen", "low-income", "minority"],
    deadline: "September 15",
    description: "Full last-dollar scholarship for Pell-eligible minority high school seniors.",
    applyLink: "https://www.thegatesscholarship.org",
  },
  {
    title: "NIH Undergraduate Scholarship",
    organization: "NIH",
    location: "National",
    interest: "biology",
    identity: ["low-income", "underrepresented"],
    deadline: "March 15",
    description: "Scholarship + paid summer research for students from disadvantaged backgrounds in biomedical science.",
    applyLink: "https://www.training.nih.gov/programs/ugsp",
  },
];

// ── Tool implementations ──────────────────────────────────────────────

function search_stem_opportunities(input) {
  const { location, interest, identity } = input || {};
  return opportunities.filter((o) => {
    if (location && !o.location.toLowerCase().includes(location.toLowerCase())) return false;
    if (interest && !o.interest.toLowerCase().includes(interest.toLowerCase())) return false;
    if (identity) {
      const normalized = identity.toLowerCase().replace("first-generation", "first-gen");
      if (!o.identity.includes(normalized)) return false;
    }
    return true;
  });
}

function simplify_opportunity(input) {
  const replacements = [
    ["letters of recommendation", "ask 2–3 teachers to write a short letter about you"],
    ["GPA", "your grades in school"],
    ["Pell-eligible", "you qualify for federal financial aid based on income"],
    ["last-dollar scholarship", "covers whatever financial aid doesn't pay for"],
    ["disadvantaged background", "students from low-income or underrepresented communities"],
    ["biomedical", "health and life sciences"],
    ["undergraduate", "college student (first 4 years)"],
    ["merit-based", "based on your grades and achievements"],
    ["need-based", "based on your family's income"],
    ["FAFSA", "the Free Application for Federal Student Aid — a form that determines your financial aid"],
  ];

  let text = input.text || "";
  for (const [term, plain] of replacements) {
    text = text.replace(new RegExp(term, "gi"), plain);
  }
  return { simplified: text, original: input.text };
}

// ── MCP JSON-RPC 2.0 handler ──────────────────────────────────────────

const TOOLS = [
  {
    name: "search_stem_opportunities",
    description: "Search STEM opportunities by location, interest area, and identity tags. Returns matching opportunities with titles, deadlines, and apply links.",
    inputSchema: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "Filter by location, e.g. 'Washington', 'Remote', 'National'",
        },
        interest: {
          type: "string",
          description: "Filter by STEM interest, e.g. 'engineering', 'biology', 'computer science'",
        },
        identity: {
          type: "string",
          description: "Filter by identity tag, e.g. 'first-gen', 'low-income', 'underrepresented'",
        },
      },
    },
  },
  {
    name: "simplify_opportunity",
    description: "Takes jargon-heavy opportunity text and rewrites it in plain, beginner-friendly language for first-generation students.",
    inputSchema: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "The opportunity description or eligibility text to simplify",
        },
      },
      required: ["text"],
    },
  },
];

function handleRequest(request) {
  const { id, method, params } = request;

  // initialize
  if (method === "initialize") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "local-opportunity-server", version: "1.0.0" },
      },
    };
  }

  // list tools
  if (method === "tools/list") {
    return { jsonrpc: "2.0", id, result: { tools: TOOLS } };
  }

  // call tool
  if (method === "tools/call") {
    const { name, arguments: args } = params;
    try {
      let result;
      if (name === "search_stem_opportunities") {
        const matches = search_stem_opportunities(args);
        result = {
          content: [
            {
              type: "text",
              text: matches.length === 0
                ? "No opportunities found matching those filters."
                : JSON.stringify(matches, null, 2),
            },
          ],
        };
      } else if (name === "simplify_opportunity") {
        result = {
          content: [{ type: "text", text: JSON.stringify(simplify_opportunity(args), null, 2) }],
        };
      } else {
        return {
          jsonrpc: "2.0",
          id,
          error: { code: -32601, message: `Unknown tool: ${name}` },
        };
      }
      return { jsonrpc: "2.0", id, result };
    } catch (err) {
      return {
        jsonrpc: "2.0",
        id,
        error: { code: -32603, message: err.message },
      };
    }
  }

  // notifications (no response needed)
  if (method === "notifications/initialized") return null;

  return {
    jsonrpc: "2.0",
    id,
    error: { code: -32601, message: `Method not found: ${method}` },
  };
}

// ── stdio transport ───────────────────────────────────────────────────

let buffer = "";

process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  buffer += chunk;
  const lines = buffer.split("\n");
  buffer = lines.pop(); // keep incomplete line

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const request = JSON.parse(trimmed);
      const response = handleRequest(request);
      if (response !== null) {
        process.stdout.write(JSON.stringify(response) + "\n");
      }
    } catch (e) {
      process.stdout.write(
        JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }) + "\n"
      );
    }
  }
});

process.stdin.on("end", () => process.exit(0));
process.stderr.write("MCP server started: local-opportunity-server\n");
