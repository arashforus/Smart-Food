# Render PostgreSQL Database Setup Guide

Your application is now configured to use a PostgreSQL database on Render. Follow these steps to connect it.

## Step 1: Get Your Database Connection String from Render

1. Log in to your **Render.com** account
2. Go to **PostgreSQL** database
3. Click on your database name
4. Scroll down to find **External Database URL**
5. Copy the URL (it looks like: `postgresql://user:password@host:port/dbname`)

## Step 2: Add DATABASE_URL to Your Web Service

1. On **Render.com**, go to your **Web Service** (la-bella-cucina)
2. Click on **Environment** tab
3. Click **Add Environment Variable**
4. Fill in:
   - **Key:** `DATABASE_URL`
   - **Value:** Paste the connection string you copied above
5. Click **Save Changes**

Render will automatically redeploy your app with the new database connection.

## Step 3: Verify the Connection

After deployment completes:

1. Go to your app's URL
2. Open **Browser DevTools** (F12)
3. Go to **Console** tab
4. Look for any database connection errors
5. Try logging in with:
   - **Username:** `admin`
   - **Password:** `admin123`

If login works and you don't see errors, your database is connected! ✅

## How It Works

- Your app now uses a **real PostgreSQL database** instead of in-memory storage
- All user data and waiter requests are **permanently saved**
- Data persists even when your app restarts
- The app automatically creates tables when first run

## Troubleshooting

### "DATABASE_URL is not set" error
- Make sure you added the environment variable to your Web Service on Render
- Wait a few seconds after saving and check the deployment logs

### Login fails but no errors
- The tables might not have been created yet
- Go to Render PostgreSQL → Query → Run this SQL:
  ```sql
  CREATE TABLE IF NOT EXISTS users (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    username text UNIQUE NOT NULL,
    password text NOT NULL,
    name text NOT NULL DEFAULT '',
    email text NOT NULL DEFAULT '',
    role text NOT NULL DEFAULT 'chef',
    created_at timestamp DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS waiter_requests (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    table_id varchar,
    branch_id varchar,
    status text DEFAULT 'pending',
    timestamp timestamp DEFAULT now()
  );

  INSERT INTO users (username, password, name, email, role) 
  VALUES ('admin', 'admin123', 'John Admin', 'admin@restaurant.com', 'admin')
  ON CONFLICT (username) DO NOTHING;
  ```

### Still having issues?
1. Check your app logs: Render → Web Service → Logs
2. Make sure the DATABASE_URL format is correct (starts with `postgresql://`)
3. Verify the database exists on your Render account

## Next Steps

Your app is now connected to PostgreSQL! You can:
- ✅ Create new users that persist
- ✅ Login and authentication works with real data
- ✅ All data is saved to the database
- ✅ Data survives app restarts

All your website data is now connected to a real production database! 🎉
