# URL Shortener

CS391 Mini Project 5 — a URL shortener built with Next.js (App Router) and MongoDB.

**Live demo:** https://mp-5-liard.vercel.app

## Features

- Enter a URL and a custom alias to create a short link.
- URLs are validated on the server (only `http` / `https`).
- Aliases are unique; a taken alias shows an error message.
- Visiting `/r/<alias>` redirects to the original URL automatically.
- Unknown aliases return a 404 page.

## Project structure

```
app/
  page.tsx            Home page with the form
  r/[alias]/page.tsx  Looks up the alias and redirects
components/
  UrlForm.tsx         Client form: input, messages, short link
lib/
  createShortUrl.ts   Server Action: validate + save to MongoDB
  getUrl.ts           Server Action: find the URL for an alias
db.ts                 MongoDB connection helper
```

## Run locally

1. Create `.env.local` in the project root:

   ```
   MONGO_URI=your-mongodb-connection-string
   ```

2. Install and start:

   ```bash
   npm install
   npm run dev
   ```

3. Open http://localhost:3000
