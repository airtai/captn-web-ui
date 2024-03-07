import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import useAuth from '@wasp/auth/useAuth';
import stripePayment from '@wasp/actions/stripePayment';
import { TierIds, STRIPE_CUSTOMER_PORTAL_LINK } from '@wasp/shared/constants';

export default function FreeTrialButton() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: user } = useAuth();

  async function handleClick(tierId: string) {
    if (!user) {
      history.push('/login');
    } else {
      try {
        // setIsStripePaymentLoading(tierId);
        setIsLoading(true);
        let stripeResults = await stripePayment(tierId);

        if (stripeResults?.sessionUrl) {
          window.open(stripeResults.sessionUrl, '_self');
        }
      } catch (error: any) {
        console.error(error?.message ?? 'Something went wrong.');
      } finally {
        // setIsStripePaymentLoading(false);
        setIsLoading(false);
      }
    }
  }

  return (
    <a
      onClick={(e) => {
        e.preventDefault();
        handleClick(TierIds.PRO);
      }}
      href='/chat'
      className='no-underline rounded-md px-3.5 py-2.5 text-sm text-captn-light-cream ring-1 ring-inset ring-gray-200 hover:bg-captn-cta-green-hover shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:text-captn-light-cream bg-captn-cta-green'
    >
      {!isLoading ? 'Free Trial' : 'Loading...'}
    </a>
  );
}
