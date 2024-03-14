// TODO: Removed `GetUserFieldsFn` from "@wasp/types" import because it is deprecated and has no clear alternative. Please check migration instructions in Wasp docs on how to manually migrate the code that was using it.
// TODO: Removed `generateAvailableUsername` from "@wasp/core/auth" import because it is deprecated and has no clear alternative. Please check migration instructions in Wasp docs on how to manually migrate the code that was using it.
// export const getUserFields: GetUserFieldsFn = async (
//   _context: any,
//   args: any
// ) => {
//   const email = args.profile.emails[0].value;
//   const username = await generateAvailableUsername(
//     args.profile.displayName.split(' '),
//     { separator: '.' }
//   );
//   const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
//   const isAdmin = adminEmails.includes(email);
//   return { email, username, isAdmin };
// };

// export function config() {
//   const clientID = process.env.GOOGLE_CLIENT_ID;
//   const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
//   return {
//     clientID, // look up from env or elsewhere,
//     clientSecret, // look up from env or elsewhere,
//     scope: ['profile', 'email'], // must include at least 'profile' for Google
//   };
// }

import { defineUserSignupFields } from 'wasp/server/auth'

export const userSignupFields = defineUserSignupFields({
  username: (data: any) => data.profile.displayName,
  email: (data: any) => data.profile.emails[0].value,
  isAdmin: async (data: any) => {
    const email = data.profile.emails[0].value;
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
    return adminEmails.includes(email);
  },
})

export function getConfig() {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  return {
    clientID, // look up from env or elsewhere
    clientSecret, // look up from env or elsewhere
    scope: ['profile', 'email'],
  }
}