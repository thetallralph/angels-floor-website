# Sveltia CMS Setup Guide for Angel's Floor

## Overview
This website uses **Sveltia CMS** - a modern, Git-based content management system that stores all content as JSON files in your repository.

## Features
✅ **No Database Required** - All content stored as JSON files
✅ **Version Control** - Every change is tracked in Git
✅ **Free Hosting** - Deploy on Vercel, Netlify, or any static host
✅ **Beautiful Admin Interface** - Modern, fast, and user-friendly
✅ **Secure** - GitHub/GitLab authentication

## Quick Start

### 1. Configure GitHub Repository
Update the repository name in `/static/admin/config.yml`:
```yaml
backend:
  name: github
  repo: YOUR_USERNAME/angels-floor-website  # Change this
  branch: main
```

### 2. Enable GitHub Authentication

#### Option A: Use Sveltia CMS Auth (Easiest)
No configuration needed! The config already points to:
```yaml
base_url: https://sveltia-cms-auth.netlify.app
```

#### Option B: Use Netlify Identity (If deploying to Netlify)
1. In Netlify dashboard, go to Site Settings > Identity
2. Enable Identity service
3. Set registration to "Invite only"
4. Update config.yml:
```yaml
backend:
  name: git-gateway
  branch: main
```

#### Option C: GitHub OAuth App (Self-hosted)
1. Create GitHub OAuth App at https://github.com/settings/applications/new
2. Set callback URL: `https://your-domain.com/admin/`
3. Use an OAuth gateway service

### 3. Access the Admin Panel
Navigate to: `https://your-domain.com/admin` or `https://your-domain.com/admin/index.html`

## Content Structure

### Products (`/src/content/products/`)
Each product is a JSON file with:
- Basic info (name, price, category)
- Images and galleries
- Nutritional information
- Benefits and usage

### Blog Articles (`/src/content/blog/`)
Blog posts with:
- Title, excerpt, full content
- Categories and tags
- Author and publication date

### Sales Points (`/src/content/sales-points/`)
Physical store locations with GPS coordinates

### Pages (`/src/content/pages/`)
Editable content for main pages:
- Homepage sections
- About page content
- Impact page content

### Settings (`/src/content/settings/`)
Global site configuration:
- Contact information
- Social media links

## Adding Editors

### For GitHub Backend:
1. Editors need a GitHub account
2. Add them as collaborators to your repository
3. They can log in at `/admin` with their GitHub credentials

### For Netlify Identity:
1. Go to Netlify Dashboard > Identity
2. Click "Invite users"
3. Enter their email address
4. They'll receive an invitation to create an account

## Local Development

### Testing the CMS Locally:
1. Update config.yml temporarily:
```yaml
backend:
  name: local
```

2. Run the local backend:
```bash
npx @sveltia/cms-server
```

3. Start the dev server:
```bash
npm run dev
```

4. Access at: `http://localhost:5173/admin`

## Workflow

### Content Editing Flow:
1. Editor logs into `/admin`
2. Makes changes through the UI
3. Clicks "Publish" 
4. Changes are committed to GitHub
5. Site automatically rebuilds (if using Vercel/Netlify)

### Media Management:
- Images uploaded through CMS go to `/static/uploads/`
- Automatically optimized for web
- Referenced in content files

## Security Best Practices

1. **Limit Editor Access**: Only add trusted users as editors
2. **Use Branch Protection**: Protect main branch, use PR workflow
3. **Regular Backups**: Your Git history is your backup
4. **Monitor Changes**: Review commits regularly

## Troubleshooting

### "Config not found" error:
- Check that `/static/admin/config.yml` exists
- Verify YAML syntax is correct

### Can't log in:
- Verify GitHub repo name is correct
- Check authentication method is configured
- Clear browser cache and cookies

### Changes not appearing:
- Check if build/deploy completed
- Verify content files were committed
- Clear site cache

## Migration from Static Data

The site currently has sample products. To add your real products:

1. Log into `/admin`
2. Delete sample products
3. Add your products through the UI
4. Or bulk import by creating JSON files matching the schema

## Support

- **Sveltia CMS Docs**: https://github.com/sveltia/sveltia-cms
- **Issues**: Report CMS issues at the Sveltia GitHub repo
- **Content Structure**: See `/static/admin/config.yml` for field definitions