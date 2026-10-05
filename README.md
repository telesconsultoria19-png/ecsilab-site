# ecsilab-site

Site da ecsilab (X-Lab). TanStack Start + Tailwind, publicado no Cloudflare; banco e login no Supabase.

- `npm run dev` — desenvolvimento local (porta 5200)
- `npm run typecheck` — checagem de tipos
- Publicação: cada push na `main` dispara o build no Cloudflare (`npm run build` + `npx wrangler deploy`).
