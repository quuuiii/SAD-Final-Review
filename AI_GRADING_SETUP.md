# Secure AI grading backend (optional)

The midterm simulator supports **AI grading** for 12 written answers via a secure HTTPS endpoint. GitHub Pages is static and **must not expose API keys**.

## Cloudflare Worker deployment

1. Create a Cloudflare Worker in your Cloudflare account.
2. Copy the file `ai-grading-worker.js` into the Worker editor and deploy.
3. Add Worker secret `OPENAI_API_KEY` using the Worker Settings → Variables and Secrets. Do not commit the secret.
4. Set `ALLOWED_ORIGIN` to `https://quuuiii.github.io`. Optionally set `MODEL` to an available text model (default in code: `gpt-4.1-mini`).
5. In the site, after submitting the mock exam, enter your Worker URL (for example `https://your-worker.your-subdomain.workers.dev`) in the grading endpoint input and click **AI 批改全部簡答題**.

**Security notes:** The CORS restriction is not authentication. For a public production website, configure Cloudflare Access or additional user authentication, usage quotas/rate limits, abuse protection and spending limits before making the Worker openly reachable. The user submits their written answers to the backend and AI provider when requesting grading. AI grades are advisory and may differ from the instructor's grading.

**Without a backend:** Click **複製完整 AI 批改內容** and paste it into ChatGPT. This does not automatically transfer scores back into the website.

The Worker returns JSON: `{"grades":[{"id":27,"score":2,"feedback":"...","improvement":"..."}]}`.
