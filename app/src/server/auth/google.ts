import { defineUserSignupFields } from 'wasp/server/auth';
import { generateAvailableUsername } from './authHelper';

export const userSignupFields = defineUserSignupFields({
  username: async (data: any) => {
    return await generateAvailableUsername(data.profile.displayName, {
      separator: '.',
    });
  },
  email: (data: any) => data.profile.emails[0].value,
  isAdmin: async (data: any) => {
    const email = data.profile.emails[0].value;
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
    return adminEmails.includes(email);
  },
});

export function getConfig() {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  return {
    clientID, // look up from env or elsewhere
    clientSecret, // look up from env or elsewhere
    scope: ['profile', 'email'],
  };
}
