# AI Academic Paper Review Tool

A web app that gives section-wise feedback for academic papers from a Scopus-reviewer style perspective.

This project analyzes the content you paste for:

- Title
- Abstract
- Introduction
- Methodology
- Results
- Conclusion
- References

It then generates structured feedback in three buckets:

- Strengths
- Areas to Improve
- Actionable Suggestions

## What It Does

- Supports two input modes:
- Section-wise input (recommended)
- Full paper input
- Uses built-in review criteria per section (clarity, scope, structure, rigor, etc.)
- Generates instant feedback directly in the UI
- Includes an AI prompt template you can copy and use with ChatGPT/other AI tools
- Exports generated feedback as a `.txt` file

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (icons)

## Getting Started

## 1) Install dependencies

```bash
npm install
```

## 2) Run locally

```bash
npm run dev
```

Open the local URL shown in terminal (typically `http://localhost:5173`).

## 3) Build for production

```bash
npm run build
```

## 4) Preview production build

```bash
npm run preview
```

## Usage

1. Choose input mode (`Section-wise Input` or `Full Paper Input`).
2. Paste your paper content.
3. Click `Generate Review`.
4. Read feedback cards for each section:
- Strengths
- Areas to Improve
- Actionable Suggestions
5. Optional:
- Open `AI Prompt Template` and copy it for external AI review.
- Click `Export Feedback` to download `paper-review-feedback.txt`.

## Project Structure

```text
src/
  App.tsx
  components/
    PaperReviewTool.tsx
  index.css
  main.tsx
```

Main logic lives in `src/components/PaperReviewTool.tsx`.

## Notes

- Current feedback generation is rule-based (client-side heuristics), not an API-driven LLM evaluation.
- For best results, provide complete section content and keep sections clearly separated.

## Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Create production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

