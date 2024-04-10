import React, { useState, useEffect, useContext, useMemo } from 'react';
import { updateCurrentUser } from 'wasp/client/operations';
import { useHistory } from 'react-router-dom';

import { AuthContext } from '../auth/Auth';
import TosAndMarketingEmails from './TosAndMarketingEmails';
import { checkBoxErrMsg } from '../auth/LoginSignupForm';
import AppNavBar from './AppNavBar';

export type ErrorMessage = {
  title: string;
  description?: string;
};

export const notificationMsg =
  'Before accessing the application, please confirm your agreement to the Terms & Conditions and Privacy Policy.';

const TosAndMarketingEmailsModal = () => {
  const history = useHistory();
  const { isLoading, setSuccessMessage, setIsLoading } =
    useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);

  const [tocChecked, setTocChecked] = useState(false);
  const [marketingEmailsChecked, setMarketingEmailsChecked] = useState(false);

  useEffect(() => {
    if (tocChecked) {
      setErrorMessage(null);
    }
  }, [tocChecked]);

  const handleTocChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTocChecked(event.target.checked);
  };

  const handleMarketingEmailsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMarketingEmailsChecked(event.target.checked);
  };

  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (tocChecked) {
      setErrorMessage(null);
      updateCurrentUser({
        isSignUpComplete: true,
        hasAcceptedTos: tocChecked,
        ...(marketingEmailsChecked && {
          hasSubscribedToMarketingEmails: marketingEmailsChecked,
        }),
      });
      history.push('/chat');
    } else {
      setErrorMessage(checkBoxErrMsg);
    }
  };

  const customStyle = errorMessage
    ? { maxHeight: '400px' }
    : { maxHeight: '280px' };

  const isAccountPage = useMemo(() => {
    return location.pathname.startsWith('/account');
  }, [location]);

  return (
    <>
      {!isAccountPage && <AppNavBar />}

      <div className='flex items-center justify-center z-50 p-16 backdrop-blur-sm bg-captn-light-cream/30 mt-16'>
        <div
          className='toc-marketing-container bg-captn-dark-blue rounded-lg shadow-lg p-8 m-4 max-w-xl mx-auto'
          style={customStyle}
        >
          <div className='inner-wrapper'>
            <h2 className='text-xl font-bold mb-4 text-captn-light-cream'>
              Almost there...
            </h2>
            <p className='text-captn-light-cream'>{notificationMsg}</p>
            <TosAndMarketingEmails
              tocChecked={tocChecked}
              handleTocChange={handleTocChange}
              marketingEmailsChecked={marketingEmailsChecked}
              handleMarketingEmailsChange={handleMarketingEmailsChange}
              errorMessage={errorMessage}
            />

            <div className='mt-6 text-right'>
              <button
                onClick={onClick}
                className='mt-4 md:-mt-10 no-underline rounded-md px-3.5 py-2.5 text-sm text-captn-light-cream  hover:bg-captn-cta-green-hover shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:text-captn-light-cream bg-captn-cta-green '
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TosAndMarketingEmailsModal;