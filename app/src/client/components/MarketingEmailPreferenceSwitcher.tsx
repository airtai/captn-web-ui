import React, { useState } from 'react';

import { updateCurrentUser } from 'wasp/client/operations';

export function MarketingEmailPreferenceSwitcher({
  hasSubscribedToMarketingEmails,
}: {
  hasSubscribedToMarketingEmails: boolean;
}) {
  const [status, setStatus] = useState(hasSubscribedToMarketingEmails);
  const [hasChanged, setHasChanged] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.value === 'Yes');
    setHasChanged(true);
  };

  const handleClick = async (status: boolean) => {
    setHasChanged(false);
    await updateCurrentUser({ hasSubscribedToMarketingEmails: status });
  };

  return (
    <>
      <div className='mt-1 text-sm text-captn-dark-blue sm:col-span-1 sm:mt-0'>
        <label className='mr-4'>
          <input
            type='radio'
            value='Yes'
            checked={status}
            onChange={handleChange}
            className='form-radio text-captn-light-blue mr-2 focus:ring-1 outline-none'
          />
          Yes
        </label>
        <label>
          <input
            type='radio'
            value='No'
            checked={!status}
            onChange={handleChange}
            className='form-radio text-captn-light-blue mr-2 focus:ring-1 outline-none'
          />
          No
        </label>
      </div>

      <div
        className='ml-4 flex-shrink-0 sm:col-span-1 sm:mt-0'
        style={{ height: '24px' }}
      >
        {hasChanged && (
          <button
            onClick={() => handleClick(status)}
            className={`font-medium text-sm text-captn-light-blue hover:underline`}
          >
            Update
          </button>
        )}
      </div>
    </>
  );
}
