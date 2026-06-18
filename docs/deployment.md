# Deployment Notes

Current production setup:

- Vercel project: `riyatilwanis-projects/rtil-fyi`
- Production URL: `https://rtil-fyi.vercel.app`
- Neon resource: `neon-bistre-ladder`
- Attached custom domains: `rtil.fyi`, `www.rtil.fyi`

Cloudflare DNS still needs to point the custom domains at Vercel:

1. Add an `A` record for `rtil.fyi` pointing to `76.76.21.21`.
2. Add an `A` record for `www.rtil.fyi` pointing to `76.76.21.21`.
3. Remove conflicting `A`, `AAAA`, or `CNAME` records for `@` and `www`.
4. Keep Cloudflare SSL/TLS mode on `Full (strict)` once Vercel has issued the certificate.

Vercel will verify the domain after DNS propagates.

Required production setup:

1. Deploy the Next.js app on Vercel.
2. Add Neon Postgres from the Vercel Marketplace and set `DATABASE_URL`.
3. Add the Grok API key as `XAI_API_KEY`.
4. Set `AI_PROVIDER=grok` and `XAI_MODEL=grok-4.3`.
5. Set strong `ADMIN_USERNAME` and `ADMIN_PASSWORD` values.

The app creates the `resume_drafts` and `site_content` tables automatically on first use. `db/schema.sql` is included for manual setup or inspection.

The Resume Lab is protected by Basic Auth through middleware and each Resume Lab API route also checks admin authorization. The PDF export path is a print-ready HTML page; use the `Print / Save PDF` button and choose "Save as PDF" in the browser print dialog.

Production admin content edits are saved in Neon through `DATABASE_URL`, so changes can appear on the live site without a redeploy.
