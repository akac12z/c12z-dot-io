import type { APIRoute } from "astro";

const llms = `

# c12z.io - Website Context for LLMs

[c12z.io](https://c12z.io)

## Site Overview
c12z.io is the personal website and blog of Chema Ferrandez aka "cz" and in their social media "akac12z". He is focused on "building and learning in public" through sharing his knowledge about Growth, Behavioral Economics, Development in Product and Code.

## Author
- **Name**: Chema Ferrandez | cz
- **Knowledge**: Growth, Behavioral Economics, Development in Products
- **Approach**: Building and learning in public. Sharing his learning journey
- **Focus**: He is focused on climatetech, edtech industries and network effects products 
- **His context**: [c12z.io/context](https://c12z.io/context)

## Content Sections

Some sections are currently empty, but will contain the following in the future:

### 1. Biblioteca (Library)
- [c12z.io/biblioteca](https://c12z.io/biblioteca)
- Book notes and reflections on growth, startups, behavioral psychology, and personal development
- Content format: MDX files with book summaries and key takeaways

### 2. Behavior (Behavioral Economics)
- [c12z.io/behavior](https://c12z.io/behavior)
- Applied behavioral economics for Growth and Product
- Focus on understanding user psychology and creating sticky products
- Cognitive biases, mental models and heuristics with practical examples. In thsi page, he is gathering all the knowledge he has about this topics. This route covers everything related to behavioral economics. Within it, there are other routes such as "c12z.io/behavior/biases," "c12z.io/behavior/mental-models," and others that I will add, where these topics are explored in greater depth.

### 3. Sesgos (Biases)
- [c12z.io/behavior/sesgos](https://c12z.io/behavior/sesgos)
- Cognitive biases and heuristics explained with examples
- Applied to product and growth for user acquisition and retention
- Startup-focused applications

### 4. Ensayos (Essays)
- [c12z.io/ensayos](https://c12z.io/ensayos)
- Guides and reflections on Growth, Behavioral Economics, and Product
- Original ideas and curated content from startup and product peers
- Deep-dive analysis and practical insights

### 5. Proyectos (Projects)
- [c12z.io/proyectos](https://c12z.io/proyectos)
- Personal projects explained step-by-step
- Technical implementation details, tools used, and decision rationale
- Building and learning in public approach with transparent development process

## Key Themes
- Growth strategies and tactics
- Behavioral economics applied to digital products
- User psychology and cognitive biases
- Product development and optimization
- Startup methodologies and learnings
- Building and learning in public philosophy
- Technical implementation and tool sharing

## Last Updated
- Last updated: 2026-01-18
`;

export const GET: APIRoute = () => {
  return new Response(llms);
};
