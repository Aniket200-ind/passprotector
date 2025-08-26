## PassProtector — Privacy‑first password manager with modern UI/UX 🔐✨

> Open‑source Next.js password manager for secure password generation, storage, and analysis — powered by AES‑256‑GCM encryption, Google Sign‑In, Prisma + PostgreSQL, and a sleek, responsive interface.

---

### ⭐ Why I built this
> I forget passwords a lot 😅 and as a developer I juggle multiple accounts to access free resources. Most password managers lock essential features behind paywalls, so I built my own. I worked solo on this project and used AI for research and brainstorming (not copy‑pasting code). This is my first full‑stack side project — not perfect, but it gets better every week.

---

### 🧠 Description
PassProtector is an open‑source password manager that focuses on privacy, strong encryption, and a modern developer‑friendly stack. It includes AES‑256‑GCM encryption with authentication tags, salt‑hashing to detect duplicate passwords, real‑time strength analysis (entropy and pattern checks), and a fast, accessible UI. Built with Next.js 15, React 19, Tailwind, Prisma, and PostgreSQL.

---

### ✨ Core features (at a glance)
- 🔐 AES‑256‑GCM encryption with IV + auth tag (tamper detection)
- 🧂 Salt‑hashing (PBKDF2‑SHA512) to detect duplicate passwords securely
- ⚙️ Strong password + passphrase generator
- 📊 Password analytics: category breakdown + strength charts
- 🔑 Google authentication (NextAuth v5 + Prisma adapter)
- 🛡️ Rate limiting (Upstash) + security headers (Helmet) + structured logging (Winston)
- 🚀 Optimized UX: lazy loading, in‑view rendering, skeletons
- ✅ Type‑safe forms and validation (React Hook Form + Zod)
- 🧪 Unit tests for password utilities

---

### 🧰 Tech stack
- **Frontend**: Next.js 15 (App Router), React 19, Tailwind, shadcn/ui, Framer Motion, TanStack Query
- **Backend**: Next.js API routes, NextAuth v5 (Google), Prisma ORM
- **Database/Infra**: PostgreSQL, Upstash Ratelimit/Redis
- **Security**: AES‑256‑GCM, PBKDF2‑SHA512, Helmet, custom security headers
- **Tooling**: TypeScript, Jest + Testing Library, ESLint

---

### 🚀 Quick start
1) Clone and install
```bash
git clone https://github.com/<your-username>/passprotector.git
cd passprotector
npm install
```

2) Configure environment
Create a `.env` file with:
```bash
DATABASE_URL="postgresql://user:password@host:5432/passprotector"
AUTH_SECRET="<complex-random-string>"
AUTH_GOOGLE_ID="<your-google-client-id>"
AUTH_GOOGLE_SECRET="<your-google-client-secret>"
AES_SECRET_KEY="<64-char-hex-32-bytes>" # required for AES-256-GCM
UPSTASH_REDIS_REST_URL="<your-upstash-rest-url>"
UPSTASH_REDIS_REST_TOKEN="<your-upstash-rest-token>"
# Optional (for deterministic hashing during local dev/testing)
FIXED_SALT="<hex-salt>"
NEXT_PUBLIC_SITE_URL="https://www.passprotector.in"
```

3) DB & dev
```bash
npx prisma migrate deploy
npm run dev
```

---

### 📦 Scripts
- `npm run dev`: Next dev (Turbopack)
- `npm run build`: Prisma generate + Next build
- `npm start`: Start production server
- `npm test`: Jest tests
- `npm run lint`: Lint

---

### 📁 Project structure
```
src/
  app/
    (authentication)/login/         # Sign-in page (NextAuth custom page)
    (generation)/generate/          # Client-side generators
    api/
      auth/                         # NextAuth handlers
      passwords/                    # CRUD, strength scoring endpoints
      generate/                     # Password/passphrase API
    dashboard/                      # Authenticated dashboard & stats
    layout.tsx, globals.css         # App shell & global styles
  components/
    layout/                         # Hero, sections, dashboard components
    features/                       # Dialogs, charts, generators
    ui/                             # shadcn/ui components
    providers/                      # React Query provider
  lib/
    passwords/                      # encryption, hash, generator, strength
    actions/                        # server actions using Prisma
    middleware/                     # security headers
    prisma.ts                       # Prisma client singleton
    logger.ts, ratelimitConfig.ts   # logging & rate limiting
  auth.ts                           # NextAuth config (Google, Prisma adapter)
prisma/                             # schema & migrations
```

---

### 🔒 Security highlights
- AES‑256‑GCM with separate IV and auth tag
- PBKDF2‑SHA512 salt‑hashing to safely detect duplicate passwords
- Zod validation, Helmet security headers, Upstash rate limiting
- Winston logging with daily rotation

> Keep your `.env` private. Rotate keys if exposed.

---

### 📈 Performance
- Lazy loaded sections + in‑view rendering
- Skeleton fallbacks for instant feedback
- Client caching with TanStack Query

---

### 🧪 Testing
Password utilities are unit‑tested under `src/lib/passwords/__tests__`.

```bash
npm test
```

---

### 🔍 Advanced security and generation details
> High‑level notes here; full methodology and references will live in `docs/`.
- NIST‑informed strength checks: entropy, length, and common‑pattern considerations
- Blocklist of common passwords (3,000+): `src/lib/passwords/common-passwords.json`
- Diceware‑style passphrases via curated wordlist (8,000+ words): `src/lib/passwords/wordlist.json`

For rationale, algorithms, and benchmarks, see the technical documentation in `docs/`.

---

### 🗺️ Roadmap
- Public technical documentation in `docs/`
- Password expiry support
- New ideas and enhancements will be added continuously ✨

---

### 🤝 Contributing
> I know it’s not perfect — I built this alone. I welcome contributions of all sizes: typo fixes, UI refinements, docs, tests, and new features. If you’re unsure, open an issue first and we can scope it together.

1. Fork the repo and create a feature branch.
2. Make changes with clear commit messages.
3. Add/update tests when relevant.
4. Open a PR. Small improvements are very appreciated!

---

### 📝 License
MIT
