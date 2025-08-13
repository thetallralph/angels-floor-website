# Real CMS Setup - GitHub Backend (Production Ready)

## ✅ This Setup Will:
- **Read your actual content files** from the repository
- **Save changes directly to GitHub**
- **Automatically deploy via Vercel** when you publish changes
- **Work with secure authentication**

## 🚀 Quick Setup (5 minutes)

### Step 1: Deploy to Vercel (if not done already)
```bash
# Push your code to GitHub
git add .
git commit -m "Add Sveltia CMS"
git push origin main

# Import to Vercel from GitHub
# Go to https://vercel.com/new
# Import your repository
```

### Step 2: Enable GitHub Authentication

The CMS is already configured to use **Sveltia's free OAuth service**. This is the easiest option:

```yaml
backend:
  name: github
  repo: thetallralph/angels-floor-website
  branch: main
  base_url: https://sveltia-cms-auth.netlify.app
```

### Step 3: How to Use

1. **Go to your live site**: `https://your-site.vercel.app/admin`
2. **Click "Login with GitHub"**
3. **Authorize the app** (first time only)
4. **Start editing!**

### How It Works:
- When you click "Login", you'll authenticate with GitHub
- The CMS reads content from your GitHub repository
- When you save changes, they're committed to GitHub
- Vercel automatically rebuilds and deploys your site

## 🔒 Who Can Access?

By default, **anyone with write access to your GitHub repository** can edit the CMS. This includes:
- The repository owner (you)
- Collaborators you've added to the repo

### To Add Editors:
1. Go to your GitHub repository
2. Settings → Manage access → Add people
3. Invite them as collaborators
4. They can now log into the CMS with their GitHub account

## 📝 Important Notes

### Content Location:
Your content is stored in:
- **Products**: `/src/content/products/*.json`
- **Blog**: `/src/content/blog/*.json`
- **Pages**: `/src/content/pages/*.json`
- **Images**: `/static/uploads/`

### When You Save in CMS:
1. Changes are committed to GitHub with message "Update [filename]"
2. Vercel detects the change and rebuilds (takes ~1 minute)
3. Your site is live with new content!

## 🎯 Test It Now!

1. Make sure your code is pushed to GitHub
2. Visit: `https://your-vercel-url.vercel.app/admin`
3. Login with your GitHub account
4. Try editing a product or creating a new one
5. Click "Publish" and watch it go live!

## Alternative: Simple Password (Not Recommended)

If you absolutely need password-only access, you would need to:
1. Set up a custom OAuth2 server
2. Or use a service like Auth0/Clerk
3. Or switch to a different CMS like Strapi

But GitHub auth is the **simplest, most secure, and free** option for Sveltia CMS.

## Troubleshooting

**"No OAuth token" error:**
- Make sure you're using the correct GitHub account
- Check that the repository name is correct in config.yml

**"Repository not found":**
- Verify the repo name: `thetallralph/angels-floor-website`
- Make sure the repository is public or you're logged in

**Content not showing:**
- Check that your JSON files are in the correct folders
- Verify the file format matches the schema in config.yml

## Ready to Go! 🚀

Your CMS is now fully configured for production use. No test mode, no temporary storage - this is the real deal! Your content will be saved directly to GitHub and automatically deployed via Vercel.