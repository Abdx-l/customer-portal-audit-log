# Customer Portal with Audit Log

TypeScript/Express/Prisma policy portal with hashed-password login, expiring JWTs, CUSTOMER/AGENT/ADMIN query scoping, transactional JSONB audit records, admin audit filters, React UI, and PostgreSQL-backed Supertest access tests.

## Run

Set DATABASE_URL and JWT_SECRET (32+ characters). `npm install && npx prisma generate && npx prisma db push`; set DEMO_PASSWORD and run `npm run seed`. `npm run dev` starts the API; `cd web && npm install && npm run dev` starts the UI.
