import { Link } from 'wasp/client/router';
import { type User } from 'wasp/entities';
import { logout } from 'wasp/client/auth';
import { STRIPE_CUSTOMER_PORTAL_LINK } from '../../shared/constants';
import { TierIds } from '../../shared/constants';
import FreeTrialButton from '../components/FreeTrialButton';
import { MarketingEmailPreferenceSwitcher } from '../components/MarketingEmailPreferenceSwitcher';

import CustomAuthRequiredLayout from './layout/CustomAuthRequiredLayout';

const AccountPage = ({ user }: { user: User }) => {
  return (
    <div className='mt-10 px-6'>
      <div className='overflow-hidden bg-captn-light-cream ring-1 ring-gray-900/10 shadow-lg sm:rounded-lg lg:m-8 '>
        <div className='px-4 py-5 sm:px-6 lg:px-8'>
          <h3 className='text-base font-semibold leading-6 text-captn-dark-blue'>
            Account Information
          </h3>
        </div>
        <div className='border-t border-gray-200 px-4 py-5 sm:p-0'>
          <dl className='sm:divide-y sm:divide-gray-200'>
            {!!user.email && (
              <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
                <dt className='text-sm font-medium text-captn-dark-blue dark:text-captn-light-cream'>
                  Email address
                </dt>
                <dd className='mt-1 text-sm text-captn-dark-blue dark:text-gray-400 sm:col-span-2 sm:mt-0'>
                  {user.email}
                </dd>
              </div>
            )}
            {!!user.username && (
              <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
                <dt className='text-sm font-medium text-captn-dark-blue dark:text-captn-light-cream'>
                  Username
                </dt>
                <dd className='mt-1 text-sm text-captn-dark-blue dark:text-gray-400 sm:col-span-2 sm:mt-0'>
                  {user.username}
                </dd>
              </div>
            )}
            <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
              <dt className='text-sm font-medium text-captn-dark-blue'>
                Subscription status
              </dt>
              {user.hasPaid ? (
                <>
                  {user.subscriptionStatus !== 'past_due' ? (
                    <dd className='mt-1 text-sm text-captn-dark-blue sm:col-span-1 sm:mt-0'>
                      {/* {user.subscriptionTier === TierIds.HOBBY
                        ? 'Hobby'
                        : 'Monthly'}{' '}
                      Plan */}
                      Active
                    </dd>
                  ) : (
                    <dd className='mt-1 text-sm text-captn-dark-blue sm:col-span-1 sm:mt-0'>
                      Your Account is Past Due! Please Update your Payment
                      Information
                    </dd>
                  )}
                  <CustomerPortalButton />
                </>
              ) : (
                <>
                  <dd className='mt-1 text-sm text-captn-dark-blue sm:col-span-1 sm:mt-0'>
                    N/A
                  </dd>
                  {/* <BuyMoreButton /> */}
                  <div className='flex items-center justify-left -mt-2'>
                    <FreeTrialButton />
                  </div>
                </>
              )}
            </div>
            <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
              <dt className='text-sm font-medium text-captn-dark-blue'>
                I agree to receiving marketing emails
              </dt>
              <>
                <MarketingEmailPreferenceSwitcher
                  hasSubscribedToMarketingEmails={
                    user.hasSubscribedToMarketingEmails
                  }
                />
              </>
            </div>
            {/* <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
              <dt className='text-sm font-medium text-captn-dark-blue'>About</dt>
              <dd className='mt-1 text-sm text-captn-dark-blue sm:col-span-2 sm:mt-0'>
                I'm a cool customer.
              </dd>
            </div> */}
          </dl>
        </div>
      </div>
      <div className='inline-flex w-full justify-end'>
        <button
          onClick={logout}
          className='inline-flex justify-center mx-8 py-2 px-4 border border-transparent shadow-md text-sm font-medium rounded-md text-captn-light-cream bg-captn-cta-green hover:bg-captn-cta-green-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

const AccountPageWithCustomAuthLayout = CustomAuthRequiredLayout(AccountPage);
export default AccountPageWithCustomAuthLayout;

function BuyMoreButton() {
  return (
    <div className='ml-4 flex-shrink-0 sm:col-span-1 sm:mt-0'>
      <Link
        to='/'
        hash='pricing'
        className={`font-medium text-sm text-indigo-600 hover:text-indigo-500`}
      >
        Buy More/Upgrade
      </Link>
    </div>
  );
}

function CustomerPortalButton() {
  const handleClick = () => {
    window.open(STRIPE_CUSTOMER_PORTAL_LINK, '_blank');
  };

  return (
    <div className='ml-0 md:ml-4 flex-shrink-0 sm:col-span-1 sm:mt-0'>
      <button
        onClick={handleClick}
        className={`font-medium text-sm text-captn-light-blue hover:underline`}
      >
        Manage Subscription
      </button>
    </div>
  );
}
