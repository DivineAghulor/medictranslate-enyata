# Contributing to MedicTranslate

First off, thank you for your interest in contributing to **MedicTranslate**!  
Your support helps us make health information more accessible for everyone.

MedicTranslate is being built as part of the **Buildathon by Enyata**, and we welcome contributors of all experience levels.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Branch Naming Convention](#branch-naming-convention)
- [Commit Message Convention](#commit-message-convention)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting Guidelines](#issue-reporting-guidelines)
- [Security and Medical Safety Notes](#security-and-medical-safety-notes)
- [Project Structure](#project-structure)
- [Need Help?](#need-help)

---

## Code of Conduct

Please be respectful, inclusive, and constructive in all interactions.

By participating, you agree to:

- Be kind and professional
- Welcome newcomers
- Give and receive feedback respectfully
- Focus on what is best for users and the project

Harassment, discrimination, or toxic behavior will not be tolerated.

---

## Ways to Contribute

You can contribute in many ways:

- Fix bugs
- Improve UI/UX
- Add features
- Improve documentation
- Improve accessibility and performance
- Write tests
- Review pull requests
- Suggest ideas via issues

---

## Getting Started

### 1) Fork and Clone

1. Fork the repository to your GitHub account
2. Clone your fork locally

```bash
git clone https://github.com/<your-username>/medictranslate-enyata.git
cd medictranslate-enyata
```

### 2) Install Dependencies

The frontend app is inside the `web` folder:

```bash
cd web
npm install
```

### 3) Run the App

```bash
npm run dev
```

Open: `http://localhost:3000`

---

## Development Workflow

1. Create an issue (or pick an existing one)
2. Create a feature branch from `main`
3. Make your changes
4. Test locally
5. Commit with clear messages
6. Push your branch
7. Open a Pull Request (PR)

Please keep PRs focused and small where possible.

---

## Branch Naming Convention

Use descriptive branch names:

- `feat/<short-description>`
- `fix/<short-description>`
- `docs/<short-description>`
- `chore/<short-description>`
- `refactor/<short-description>`
- `test/<short-description>`

Examples:

- `feat/upload-lab-image`
- `fix/ocr-error-handling`
- `docs/update-readme`

---

## Commit Message Convention

We recommend [Conventional Commits](https://www.conventionalcommits.org/):

- `feat: add OCR preprocessing pipeline`
- `fix: handle invalid image type upload`
- `docs: update setup instructions`
- `refactor: simplify result summary component`
- `test: add unit tests for parser`

---

## Pull Request Process

When opening a PR:

1. Use a clear title
2. Describe **what** changed and **why**
3. Link related issue(s) (e.g., `Closes #12`)
4. Add screenshots/video for UI changes
5. Include testing notes

### PR Checklist

- [ ] My code follows the project style
- [ ] I tested my changes locally
- [ ] I updated documentation where needed
- [ ] I did not introduce sensitive keys/secrets
- [ ] My changes are focused and relevant

---

## Issue Reporting Guidelines

When creating an issue, include:

- Clear title
- Expected behavior
- Actual behavior
- Steps to reproduce
- Screenshots/logs (if applicable)
- Environment info (OS, browser, Node version)

Use labels where possible (`bug`, `feature`, `docs`, etc.).

---

## Security and Medical Safety Notes

Because MedicTranslate deals with health-related information:

1. **Do not claim definitive diagnosis** in UI copy or logic.
2. Always frame outputs as educational/assistive, not a replacement for licensed medical care.
3. Avoid storing sensitive personal/medical data unless explicitly required and secured.
4. Never commit secrets, API keys, or credentials.
5. Report security vulnerabilities privately to project maintainers (do not open public issues for sensitive vulnerabilities).

---

## Project Structure

Current high-level structure:

- `web/` — Next.js frontend application
- `api/` — backend/API services (if/when implemented)

---

## Need Help?

If you’re unsure what to work on, open an issue or ask in project discussions.  
We’re happy to help you get started.

Thanks again for contributing to **MedicTranslate**.