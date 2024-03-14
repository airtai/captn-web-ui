import { prisma } from 'wasp/server';
import { MigrateGoogle } from 'wasp/server/api';

export const migrateGoogleHandler: MigrateGoogle = async (_req, res) => {
  const result = await createSocialLoginMigration('google');

  res.status(200).json({ message: 'Migrated users to the new auth', result });
};

async function createSocialLoginMigration(
  providerName: 'google' | 'github'
): Promise<{
  numUsersAlreadyMigrated: number;
  numUsersNotUsingThisAuthMethod: number;
  numUsersMigratedSuccessfully: number;
}> {
  const users = await prisma.user.findMany({
    include: {
      auth: true,
      externalAuthAssociations: true,
    },
  });

  const result = {
    numUsersAlreadyMigrated: 0,
    numUsersNotUsingThisAuthMethod: 0,
    numUsersMigratedSuccessfully: 0,
  };

  for (const user of users) {
    if (user.auth) {
      result.numUsersAlreadyMigrated++;
      console.log('Skipping user (already migrated) with id:', user.id);
      continue;
    }

    const provider = user.externalAuthAssociations.find(
      (provider) => provider.provider === providerName
    );

    if (!provider) {
      result.numUsersNotUsingThisAuthMethod++;
      console.log(
        `Skipping user (not using ${providerName} auth) with id:`,
        user.id
      );
      continue;
    }

    await prisma.auth.create({
      data: {
        identities: {
          create: {
            providerName,
            providerUserId: provider.providerId,
            providerData: JSON.stringify({}),
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    result.numUsersMigratedSuccessfully++;
  }

  return result;
}
