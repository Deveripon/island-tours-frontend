# ✈️ TripWheel – Contribution Guide

> 🚀 **Welcome aboard!** This document is your one-stop guide to set up, contribute, and maintain high-quality code in our TripWheel (SMT) app built with **Next.js**, **shadcn/ui**, and **Lucide Icons**.

---

## 📦 Tech Stack

| Tool              | Purpose                      |
| ----------------- | ---------------------------- |
| Next.js           | React framework (App Router) |
| shadcn/ui         | Reusable UI Components       |
| Lucide React      | Icon Library                 |
| TypeScript        | Type-safe Development        |
| ESLint + Prettier | Code Quality + Formatting    |

---

## 👉 Before You Get Started:

## 🔧 Project Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-org/TripWheel.git
cd TripWheel

# 2. Create a new branch for your task
git checkout -b feature/<your-task-name>

# 3. Pull the latest dev (if needed)
git pull origin dev

# 4. Install dependencies
yarn install

# 5. Setup/edit environment variables if needed
 .env.example .env.local

# 6. Run the development server
yarn dev / npm dev
```

> ✅ Ensure you never commit `.env.local`. by adding in `.gitignore`

---

## 📂 Folder Structure

Below folder structure we using in frontend where we

> 🧠 Using a **feature-first** modular structure. Keep related components and logic grouped.

```bash
root/
├── app/              # Next.js App Router pages
│   ├── chat/         # Chat flow
│   ├── onboarding/   # User onboarding pages
│   └── pricing/      # Pricing page
│   ├── globals.css   # Global styles
│   ├── layout.jsx    # Root layout
│   └── page.jsx      # Entry point page
│
├── components/       # Reusable UI components
│   ├── common/       # Shared base components
│   ├── faq/          # FAQ related components
│   ├── features/     # Feature-specific UI blocks
│   ├── footer/       # Footer UI
│   ├── hero/         # Hero section
│   ├── navbar/       # Navigation bar
│   ├── pricing/      # Pricing UI components
│   ├── svg/          # SVG-based icons/assets
│   └── ui/           # UI primitives (shadcn)
│       └── theme-provider.jsx
│
├── data/             # Static JSON data
│   ├── faq.json
│   ├── navigations.json
│   ├── onboarding-request.json
│   └── pricing.json
│
├── hooks/            # Custom hooks (e.g., `use-toast.js`)
├── lib/              # Utility libraries
│   └── utils.js
├── public/           # Static files
│   └── assets/
│       └── bg/
│           └── bg.png
├── utils/            # Other standalone helper functions
├── .eslintrc.json
├── .gitignore
├── next.config.js
├── postcss.config.js
```

---

## 🧪 Code Quality Rules

### ✅ Naming Conventions

| Entity        | Convention  | Example                   |
| ------------- | ----------- | ------------------------- |
| Component     | kebab-case  | `destination-card.jsx`    |
| Function Name | PascalCase  | `ChatBot`                 |
| Variable      | camelCase   | `userId`                  |
| Constants     | UPPER_SNAKE | `API_BASE_URL`            |
| File/Folder   | kebab-case  | `booking-form/`           |
| Branch        | kebab-case  | `feature/bookinging-form` |

### ✅ Format & Lint

```bash
npm format      # Prettier
npm lint        # ESLint
```

## Editing And Pushing Rules

---

### 🌱 One Task = One Branch

### 🌿 Branch Naming Rules

```
feature/<task-name>     # For new features
fix/<bug-description>   # For bug fixes
chore/<update-name>     # For non-feature tasks
```

### 🛠 Creating a Branch

```bash
git checkout main
git pull origin main

git checkout -b feature/add-destination-card
```

---

## 📅 Commit Messages (Conventional Commits)

| Prefix   | Use For           |
| -------- | ----------------- |
| `feat:`  | New feature       |
| `fix:`   | Bug fix           |
| `chore:` | Maintenance task  |
| `docs:`  | Docs only changes |

```bash
# Good Examples:
feat: add search filters to explore page
fix: resolve image loading issue in gallery
```

---

## 🔄 Handling Merge Conflicts

1. Update your branch with the latest `main`:

```bash
git checkout main
git pull origin main
```

2. Rebase your branch:

```bash
git checkout your-branch
git rebase main
```

3. Resolve conflicts manually if needed:

```bash
git add .
git rebase --continue
```

4. Force push:

```bash
git push --force-with-lease
```

---

## ✅ Before You Push a PR

-   [ ] Lint + Format code ✅
-   [ ] Run the app locally ✅
-   [ ] Follow naming conventions ✅
-   [ ] Keep code modular & readable ✅
-   [ ] One PR = One Task ✅
-   [ ] Good commit messages ✅
-   [ ] Reviewed your own code before PR ✅

---

## 🔗 Helpful Scripts

| Command     | Purpose                |
| ----------- | ---------------------- |
| `npm dev`   | Start local dev server |
| `npm build` | Production build       |
| `npm lint`  | Run ESLint             |

---

## 🤍 Need Help?

-   Ask in the team Slack channel
-   Tag leads if urgent
-   Or open a GitHub issue

---

## ✨ Final Words

> "Clean code always looks like it was written by someone who cares." – Robert C. Martin
> So, always focus on writting clean code. code should like poetry

