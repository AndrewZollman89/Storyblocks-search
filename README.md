# Storyblocks Search App

This is a small assessment built with **Next.js 15** and **TypeScript**.  
It shows how to search the **Storyblocks API** for images, videos, or audio and view details for each asset.

---

## How to Run

1. **Install dependencies**
```bash
npm install
```

2. **Set environment variables**  
Create `.env.local` in the root with your Storyblocks keys:
```ini
STORYBLOCKS_PUBLIC_KEY=your_public_key
STORYBLOCKS_PRIVATE_KEY=your_private_key
STORYBLOCKS_PROJECT_ID=optional_project_id
STORYBLOCKS_USER_ID=optional_user_id
```

3. **Start the dev server**
```bash
npm run dev
```
Then open http://localhost:3000 in your browser.

---

## What’s Inside

- **UI Components**: Button, Dropdown, Pagination, AssetCard  
- **Pages**: Search page and Asset detail page  
- **API Routes**: 
  - `/api/storyblocks/[type]` → search (images, videos, audio)  
  - `/api/asset/[type]/[assetId]` → single asset details  
- **Lib**: helpers for signing requests and fetching data  
- **Styles**: Tailwind CSS with a dark theme  

---

## Notes & Trade-offs

- The UI is simple and dark-themed.  
- API keys are kept safe by signing requests on the server.  
- Error messages are basic (just text).  
- Root `/` is still a placeholder; most work is around search and detail pages.  
- Some extra polish (loading states, tests, accessibility) could be added with more time.

---

## Known Issues

- “HMAC header is invalid”  usually means your keys or clock are off.  
- Search might be slow if Storyblocks API is slow.  
- Video preview uses a simple width check to pick source quality.

---

## AI Tools

I didn't use any AI Tools for this assessment.

---
