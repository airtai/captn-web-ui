import { defineUserSignupFields } from 'wasp/server/auth';
import { generateAvailableUsername } from './authHelper';

export const userSignupFields = defineUserSignupFields({
  username: async (data: any) => {
    return await generateAvailableUsername(data.profile.name, {
      separator: '.',
    });
  },
  email: (data: any) => data.profile.email,
  isAdmin: async (data: any) => {
    const email = data.profile.email;
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
    return adminEmails.includes(email);
  },
});

export function getConfig() {
  return {
    scopes: ['profile', 'email'],
  };
}
