# Admin User Setup

This directory contains scripts to set up the default admin user for the job board application.

## Admin User Credentials

The default admin user is created with the following credentials:

- **Email**: `jobadmin@taiyari24.com`
- **Password**: `job1234`
- **Role**: `admin`
- **Status**: `Active`

## Running the Seed Script

To create or update the admin user, run the following command from the project root:

```bash
npm run seed:admin
```

This script will:
1. Connect to your MongoDB database using the `MONGODB_URI` from `.env.local`
2. Check if an admin user with the email `jobadmin@taiyari24.com` already exists
3. If the user exists, it will update their password and ensure they have admin role
4. If the user doesn't exist, it will create a new admin user with the specified credentials

## Important Notes

- Make sure your MongoDB connection is properly configured in `.env.local`
- The password is hashed using bcrypt before storing in the database
- The script can be run multiple times safely - it will update the existing user if found
- After running the script, you can log in to the job board using the admin credentials

## Security Considerations

- Change the default password after first login
- Consider using environment variables for sensitive credentials in production
- The JWT_SECRET in your .env.local should be a strong, random string