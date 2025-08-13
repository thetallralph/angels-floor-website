# Simple CMS Authentication Setup

## Current Setup

The CMS is configured with **test-repo** backend for easy local development without authentication.

## Two Ways to Use the CMS

### 1. Local Development (No Password Required)
The current `config.yml` uses `test-repo` backend which requires NO authentication:

```yaml
backend:
  name: test-repo
```

**How to use:**
1. Run `npm run dev`
2. Go to http://localhost:5173/admin
3. Start editing immediately - no login required!
4. **Note:** Changes are saved in browser memory only (not permanent)

### 2. Simple Password Protection (Optional)

I've created a simple login page at `/admin/login.html` that uses password authentication.

**For Local Testing:**
- Default password: `admin123`
- Go to http://localhost:5173/admin/login.html
- Enter the password
- You'll be redirected to the CMS

**For Production on Vercel:**

1. **Set Environment Variable in Vercel Dashboard:**
   - Go to your Vercel project settings
   - Navigate to Environment Variables
   - Add: `CMS_PASSWORD` = `your-secure-password`

2. **The `/api/cms-auth.js` endpoint handles authentication**
   - Validates password
   - Returns a simple token
   - No database required

## Deployment Options

### Option A: Keep it Simple (Recommended for Now)
Use `test-repo` backend for local editing, then manually commit changes:
1. Edit content locally in the CMS
2. Copy the changes to your JSON files
3. Commit and push to GitHub
4. Vercel auto-deploys

### Option B: Use GitHub Authentication (Production Ready)
Uncomment the GitHub backend in `config.yml`:
```yaml
backend:
  name: github
  repo: thetallralph/angels-floor-website
  branch: main
```

### Option C: Password-Protected (Semi-Production)
Use the login page with password protection:
1. Deploy to Vercel
2. Set `CMS_PASSWORD` environment variable
3. Access via `/admin/login.html`
4. Still need to manually save changes

## Quick Start for Development

```bash
# Start dev server
npm run dev

# Access CMS (no login required with test-repo)
http://localhost:5173/admin

# Or use password login
http://localhost:5173/admin/login.html
# Password: admin123
```

## Security Notes

- The current `test-repo` backend is ONLY for local development
- For production, either use GitHub auth or implement proper JWT tokens
- The simple password auth is basic - suitable for small teams only
- Always use environment variables for passwords in production

## Files Created

- `/static/admin/login.html` - Simple login page
- `/api/cms-auth.js` - Vercel serverless function for auth
- `/static/admin/config.yml` - Updated to use test-repo

The simplest approach is to use `test-repo` for now and manually copy your content changes!