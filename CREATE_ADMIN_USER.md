# Create Admin User for Login

The admin system uses Supabase Authentication. You need to create an admin user in Supabase Auth to be able to log in.

## Method 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://gnkrgtrizuoxslmuudvr.supabase.co
2. Navigate to **Authentication** → **Users** in the left sidebar
3. Click the **Add user** button
4. Select **Create new user**
5. Fill in the details:
   - **Email**: `admin@example.com`
   - **Password**: `admin123`
   - Check **Auto Confirm User** (important!)
6. Click **Create user**

## Method 2: Using SQL Editor in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy and paste the following SQL:

```sql
-- This uses Supabase's auth.users table to create an admin
-- Note: This is a direct insert and bypasses normal auth flows
-- Use the Dashboard method above if possible

SELECT auth.uid(); -- Check if you can access auth functions
```

**Important**: The SQL method is limited. Use the Dashboard method instead.

## Method 3: Using Supabase CLI (If you have it installed)

Run this command in your terminal:

```bash
npx supabase db execute --db-url "your-connection-string" <<SQL
-- Unfortunately, direct SQL inserts to auth.users are not recommended
-- Please use the Dashboard method
SQL
```

## After Creating the User

Once you've created the admin user using **Method 1 (Dashboard)**, you can log in at:

- **Login URL**: http://localhost:3000/login
- **Email**: admin@example.com
- **Password**: admin123

## Troubleshooting

If you can't log in:
1. Make sure you checked **Auto Confirm User** when creating the user
2. Check that the email is exactly `admin@example.com`
3. Make sure email confirmations are disabled in Supabase (they are by default)
4. Verify the user was created in **Authentication** → **Users**

## Security Note

After creating your admin user, you should:
1. Change the default password immediately
2. Use a strong, unique password
3. Never commit credentials to your repository
