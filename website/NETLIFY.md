# Netlify deployment

Netlify is configured to publish this site's static files from `website/public` and route `POST /api/inquiries` to a Netlify Function. No Express server or local `.env` file is needed in production.

## Deploy

1. Import this repository into Netlify and select the `main` branch.
2. The checked-in `netlify.toml` sets the base directory and publish directory; leave Netlify's build command and publish directory overrides blank.
3. In **Site configuration → Environment variables**, add `FORMSPREE_ENDPOINT2` with the HTTPS Formspree form endpoint (format: `https://formspree.io/f/your-form-id`).
4. Trigger a deploy. After it completes, open the deployed home page and submit a test inquiry from Contact Us.

Without the Formspree variable, the website and pages still deploy, but inquiry submissions return a clear `503` response instead of a missing-route `404`.
