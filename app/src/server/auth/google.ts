import type { GetUserFieldsFn } from '@wasp/types';
import { generateAvailableUsername } from '@wasp/core/auth.js';

export const getUserFields: GetUserFieldsFn = async (
  _context: any,
  args: any
) => {
  const email = args.profile.emails[0].value;
  const username = await generateAvailableUsername(
    args.profile.displayName.split(' '),
    { separator: '.' }
  );
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  const isAdmin = adminEmails.includes(email);
  return { email, username, isAdmin };
};

export function config() {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  return {
    clientID, // look up from env or elsewhere,
    clientSecret, // look up from env or elsewhere,
    scope: ['profile', 'email'], // must include at least 'profile' for Google
  };
}
