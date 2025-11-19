# 🚀 Deployment Guide

## Quick Deploy to Vercel

### Step 1: Prepare MongoDB Atlas

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free (no credit card required)

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select a cloud provider and region close to you
   - Click "Create Cluster"

3. **Set Up Database Access**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (save these!)
   - Set privileges to "Read and write to any database"
   - Click "Add User"

4. **Set Up Network Access**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `<dbname>` with `wordle`

   Example:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/wordle?retryWrites=true&w=majority
   ```

### Step 2: Deploy to Vercel

1. **Push to GitHub** ✅ (Already done!)
   - Your code is at: https://github.com/MayankMehra7/wordle

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "Add New..." → "Project"
   - Import your `wordle` repository
   - **Important**: Set Root Directory to `wordle` (not the root)

3. **Configure Environment Variables**
   
   Before deploying, add these environment variables:
   
   | Name | Value |
   |------|-------|
   | `MONGODB_URI` | Your MongoDB connection string from Step 1 |
   | `MONGODB_DB` | `wordle` |

   Click "Deploy"

4. **Seed the Database**
   
   After first deployment:
   - Go to your project settings
   - Navigate to "Functions" tab
   - You'll need to seed the database manually using MongoDB Compass or run the seed script locally:
   
   ```bash
   # In your local project
   npm run seed
   ```

5. **Visit Your Site!**
   - Vercel will provide a URL like: `your-project.vercel.app`
   - Your Wordle game is now live! 🎉

### Step 3: Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Environment Variables Reference

```env
# Required
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wordle?retryWrites=true&w=majority
MONGODB_DB=wordle
```

## Vercel Configuration

The project includes `vercel.json` with optimal settings:
- Serverless functions for API routes
- Automatic HTTPS
- Global CDN
- Analytics enabled

## Post-Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string copied
- [ ] Vercel project created
- [ ] Root directory set to `wordle`
- [ ] Environment variables added
- [ ] First deployment successful
- [ ] Database seeded with words
- [ ] Site tested (solo mode)
- [ ] Site tested (multiplayer mode)
- [ ] Analytics working

## Troubleshooting

### "Failed to connect to MongoDB"
- Check your connection string is correct
- Verify password doesn't contain special characters (or URL encode them)
- Ensure network access allows 0.0.0.0/0
- Check MongoDB Atlas cluster is running

### "No words available"
- Run the seed script: `npm run seed`
- Check MongoDB connection in Atlas dashboard
- Verify `words` collection exists with documents

### "Room not found" in multiplayer
- This is normal if room expired (24 hours)
- Create a new room
- Check MongoDB `rooms` collection

### Build fails on Vercel
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript has no errors locally: `npx tsc --noEmit`

### Analytics not showing
- Wait 30 seconds after deployment
- Disable ad blockers
- Navigate between pages
- Check Vercel Analytics dashboard

## Performance Tips

1. **MongoDB Indexes**: Already created by seed script
   - Index on `word` field
   - Index on `difficulty` field

2. **Vercel Edge Functions**: API routes are automatically optimized

3. **Caching**: Static assets cached automatically

4. **Database Connection Pooling**: Implemented in `lib/mongodb.ts`

## Monitoring

### Vercel Dashboard
- View deployment logs
- Monitor function execution
- Check analytics data
- View error reports

### MongoDB Atlas
- Monitor database performance
- View connection statistics
- Check query performance
- Set up alerts

## Scaling

The free tiers support:
- **Vercel**: 100GB bandwidth, unlimited requests
- **MongoDB Atlas**: 512MB storage, shared cluster

For higher traffic:
- Upgrade Vercel plan for more bandwidth
- Upgrade MongoDB to dedicated cluster (M10+)
- Add Redis for caching (optional)

## Security Notes

- Environment variables are encrypted by Vercel
- MongoDB credentials never exposed to client
- HTTPS enforced automatically
- CORS configured for API routes

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check MongoDB Atlas logs
3. Test locally first: `npm run dev`
4. Review error messages in browser console

---

**Your Wordle game is production-ready!** 🎮

Repository: https://github.com/MayankMehra7/wordle
