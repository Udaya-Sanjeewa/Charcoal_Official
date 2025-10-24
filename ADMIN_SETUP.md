# Admin Setup Guide - Supabase Authentication

Your admin authentication now uses Supabase's built-in Authentication system!

## Step 1: Create Admin User in Supabase

### Using Supabase Dashboard:

1. Go to your Supabase project: https://supabase.com/dashboard
2. Navigate to **Authentication** → **Users**
3. Click **"Add user"** or **"Create new user"**
4. Enter admin credentials:
   - **Email:** `admin@example.com`
   - **Password:** `admin123` (or your chosen password)
   - Leave "Auto Confirm User" checked (or enable it)
5. Click **"Create user"**

### Using SQL (Alternative):

You can also create a user via SQL in the SQL Editor:

```sql
-- Note: This creates a user with a hashed password
-- Replace 'your-password' with your actual password
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@example.com',
  crypt('your-password', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

## Step 2: Enable Email Authentication

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Make sure **Email** provider is **enabled**
3. For development, you can disable email confirmation:
   - Go to **Authentication** → **Settings**
   - Under **Auth Providers**, find Email settings
   - Disable **"Enable email confirmations"** (for testing only)

## Step 3: Login to Admin Panel

1. Navigate to: http://localhost:3000/login
2. Enter the email and password you created
3. Click **"Login"**
4. You'll be redirected to `/admin`

## How It Works

Your application now uses Supabase Auth:

- **Login:** Uses `supabase.auth.signInWithPassword()`
- **Session Management:** Handled by Supabase automatically
- **Token:** Real JWT tokens from Supabase
- **Security:** Industry-standard authentication with password hashing

## Adding More Admin Users

### Method 1: Supabase Dashboard
1. Go to Authentication → Users
2. Click "Add user"
3. Enter email and password
4. Click "Create user"

### Method 2: Sign Up Page (Optional)
You can create a sign-up page using:
```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'newadmin@example.com',
  password: 'password123',
});
```

## Managing Users

### View All Users
Go to Supabase Dashboard → Authentication → Users

### Reset User Password
1. Go to Authentication → Users
2. Click on the user
3. Click "Reset password"
4. User will receive a password reset email

### Delete User
1. Go to Authentication → Users
2. Click on the user
3. Click "Delete user"

### Disable/Enable User
1. Go to Authentication → Users
2. Click on the user
3. Use the status toggle or edit options

## Security Features

Supabase Auth provides:

- **Password Hashing:** Automatic bcrypt hashing
- **JWT Tokens:** Secure session management
- **Email Verification:** Optional email confirmation
- **Password Reset:** Built-in password recovery
- **Rate Limiting:** Protection against brute force
- **Multi-factor Auth:** Optional 2FA support
- **Social OAuth:** Optional Google, GitHub, etc.

## Troubleshooting

### Cannot Login

1. **Check User Exists:**
   - Go to Supabase Dashboard → Authentication → Users
   - Verify the user email is listed

2. **Check Email Confirmed:**
   - In Users list, check "Email Confirmed" column
   - If not confirmed, click user and confirm manually

3. **Check Password:**
   - Try resetting the password via Supabase Dashboard
   - Make sure you're entering the correct password

4. **Check Email Provider Enabled:**
   - Go to Authentication → Providers
   - Verify Email provider is enabled

### "Invalid login credentials" Error

- Double-check email and password
- Ensure user is confirmed (if email confirmation is enabled)
- Try creating a new user to test

### User Not Appearing in Dashboard

- Refresh the Users page
- Check if you're looking at the correct project
- Verify the insert query completed successfully

## Email Confirmation Settings

### For Development (Disable Confirmation):
1. Go to Authentication → Settings
2. Find "Enable email confirmations"
3. Toggle it OFF
4. Users can login immediately after creation

### For Production (Enable Confirmation):
1. Go to Authentication → Settings
2. Enable "Enable email confirmations"
3. Configure email templates
4. Set up SMTP settings (optional)

## Advanced: Custom User Metadata

You can add custom data to users:

```javascript
const { data, error } = await supabase.auth.updateUser({
  data: {
    name: 'Admin Name',
    role: 'admin',
    department: 'IT'
  }
});
```

Access metadata in your app:
```javascript
const user = data.user;
const userName = user.user_metadata?.name;
const userRole = user.user_metadata?.role;
```

## Production Checklist

- [ ] Enable email confirmations
- [ ] Set up custom email templates
- [ ] Configure SMTP settings
- [ ] Enable password complexity requirements
- [ ] Set up password recovery flow
- [ ] Consider enabling 2FA for admin users
- [ ] Set up proper CORS policies
- [ ] Review and configure rate limiting
- [ ] Set up monitoring and alerts

## Support

- Supabase Auth Docs: https://supabase.com/docs/guides/auth
- Supabase Dashboard: https://supabase.com/dashboard
- Check server logs for detailed error messages
