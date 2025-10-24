# Admin Login Guide

## Default Admin Credentials

**Email:** admin@example.com
**Password:** admin123

## How to Login

1. Navigate to http://localhost:3000/login
2. Enter the email: `admin@example.com`
3. Enter the password: `admin123`
4. Click "Login"

You will be redirected to the admin panel at `/admin`

## Adding More Admin Users

Admin users are stored in `data/admins.json`. To add a new admin:

1. Open `data/admins.json`
2. Add a new admin user object:

```json
{
  "id": "2",
  "email": "newadmin@example.com",
  "password": "yourpassword",
  "name": "New Admin Name",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

3. Save the file
4. The new admin can now login

### Example with Multiple Admins:

```json
[
  {
    "id": "1",
    "email": "admin@example.com",
    "password": "admin123",
    "name": "Admin User",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "2",
    "email": "manager@example.com",
    "password": "manager123",
    "name": "Manager User",
    "created_at": "2024-01-02T00:00:00.000Z"
  }
]
```

## Troubleshooting

### "Invalid email or password" Error

1. Make sure you're typing the email and password exactly as shown
2. Check that `data/admins.json` exists and contains the admin user
3. Email comparison is case-insensitive, but password is case-sensitive
4. Check browser console for any error messages

### Cannot Access Admin Panel

1. Make sure you logged in successfully
2. Check that localStorage has the `admin_token`
3. Try logging out and logging in again
4. Clear browser cache and try again

### Password Not Working

If you forgot the password or it's not working:

1. Open `data/admins.json`
2. Change the password field to a new password
3. Save the file
4. Use the new password to login

## Security Notes

**IMPORTANT for Production:**

1. **Never use plain text passwords in production!**
   - This simple system is for development only
   - For production, use proper password hashing (bcrypt, argon2)
   - Consider using Supabase Auth or another authentication service

2. **Current Security Limitations:**
   - Passwords are stored in plain text
   - Tokens are simple base64 encoded strings
   - No password complexity requirements
   - No rate limiting on login attempts

3. **Recommended Production Setup:**
   - Implement Supabase Authentication
   - Use environment variables for secrets
   - Add password hashing
   - Implement proper session management
   - Add rate limiting
   - Use HTTPS only
   - Add 2FA for admin accounts

## Logout

To logout, click the "Logout" button in the admin panel header. This will:
- Remove the authentication token
- Redirect you back to the login page
- Require you to login again to access the admin panel
