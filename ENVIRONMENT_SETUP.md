# Environm## Environment Files

### Setup for Local Development
1. Copy `.env.development.example` to `.env.development`
2. Update the values with your development keys

### `.env.development` (for local development)
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xgawYkbdrfISRM
VITE_IMGBB_API_KEY=0e9cde7ae8a30c258f12071cc6a4eced
```

### Production Environment (Railway)
Production environment variables should be set in Railway's dashboard, not in files:
- `VITE_API_BASE_URL=https://yess25-backend.up.railway.app/api`
- `VITE_RAZORPAY_KEY_ID=your_live_key`
- `VITE_IMGBB_API_KEY=your_imgbb_key`on Guide

This project now uses environment-based configuration to automatically switch between localhost and production backend URLs.

## How it works

- **Development**: Uses `http://localhost:3001/api` when running `npm run dev`
- **Production**: Uses `https://yess25-backend.up.railway.app/api` when building for production
- **Railway Deployment**: Automatically uses production environment variables

## Environment Files

### `.env.development` (for local development)
```
VITE_API_BASE_URL=http://localhost:3001/api
VITE_RAZORPAY_KEY_ID=rzp_test_xgawYkbdrfISRM
VITE_IMGBB_API_KEY=0e9cde7ae8a30c258f12071cc6a4eced
```

### `.env.production` (for production builds)
```
VITE_API_BASE_URL=https://yess25-backend.up.railway.app/api
VITE_RAZORPAY_KEY_ID=rzp_live_sTkXOTd2O2D904
VITE_IMGBB_API_KEY=0e9cde7ae8a30c258f12071cc6a4eced
```

### `.env` (fallback/default)
Contains production values as fallback

## Usage

### For Development
```bash
npm run dev
# Automatically uses localhost backend
```

### For Production Build
```bash
npm run build
# Automatically uses production backend
```

### For Development Build (if needed)
```bash
npm run build:dev
# Uses localhost backend in build
```

## Railway Deployment

Railway automatically detects the environment and uses the appropriate configuration:
- Set environment variables in Railway's project dashboard (not in files)
- Railway automatically sets `NODE_ENV=production`
- Fallback values in `api.js` ensure the app works even without explicit env vars
- No `.env` files needed in the repository

### Setting up Railway Environment Variables:
1. Go to your Railway project dashboard
2. Navigate to Variables tab
3. Add these variables:
   - `VITE_API_BASE_URL`: `https://yess25-backend.up.railway.app/api`
   - `VITE_RAZORPAY_KEY_ID`: Your live Razorpay key
   - `VITE_IMGBB_API_KEY`: Your ImgBB API key

## API Configuration

All API endpoints are centralized in `src/config/api.js`:
- Import `API_ENDPOINTS` for predefined endpoints
- Import `API_BASE` for custom endpoints
- Environment info available via `getEnvironmentInfo()`

## Benefits

1. **No more manual URL switching** between development and production
2. **Environment-specific configuration** (test vs live Razorpay keys)
3. **Centralized API endpoint management**
4. **Railway-compatible** - works seamlessly with Railway's deployment process
5. **Development logging** - see current environment in browser console during development
