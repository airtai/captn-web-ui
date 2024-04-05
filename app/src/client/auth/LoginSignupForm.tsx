import { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { styled } from './configs/stitches.config';
import { AuthContext } from './Auth';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import config from './configs/config';

export const Message = styled('div', {
  padding: '0.5rem 0.75rem',
  borderRadius: '0.375rem',
  marginTop: '1rem',
  background: '$gray400',
});

export const MessageError = styled(Message, {
  background: '#bb6e90',
  color: '#eae4d9',
});

const SocialAuth = styled('div', {
  marginTop: '1.5rem',
  marginBottom: '1.5rem',
});

const SocialAuthButtons = styled('div', {
  marginTop: '0.5rem',
  display: 'flex',

  variants: {
    direction: {
      horizontal: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(48px, 1fr))',
      },
      vertical: {
        flexDirection: 'column',
        margin: '8px 0',
      },
    },
    gap: {
      small: {
        gap: '4px',
      },
      medium: {
        gap: '8px',
      },
      large: {
        gap: '16px',
      },
    },
  },
});

const googleSignInUrl = `${config.apiUrl}/auth/google/login`;

export type LoginSignupFormFields = {
  [key: string]: string;
};

export const LoginSignupForm = ({
  state,
  socialButtonsDirection = 'horizontal',
  additionalSignupFields,
  errorMessage,
  changeHeaderText,
}: {
  state: 'login' | 'signup';
  socialButtonsDirection?: 'horizontal' | 'vertical';
  additionalSignupFields?: any;
  errorMessage?: any;
  changeHeaderText: any;
}) => {
  const { isLoading, setErrorMessage, setSuccessMessage, setIsLoading } =
    useContext(AuthContext);
  const isLogin = state === 'login';
  const cta = isLogin ? 'Log in' : 'Sign up';
  const history = useHistory();
  const [tocChecked, setTocChecked] = useState(false);
  const [marketingEmailsChecked, setMarketingEmailsChecked] = useState(false);
  const [loginFlow, setLoginFlow] = useState('signUp');
  //   const onErrorHandler = (error) => {
  //     setErrorMessage({
  //       title: error.message,
  //       description: error.data?.data?.message,
  //     });
  //   };
  const hookForm = useForm<LoginSignupFormFields>();
  const {
    register,
    formState: { errors },
    handleSubmit: hookFormHandleSubmit,
  } = hookForm;
  //   const { handleSubmit } = useUsernameAndPassword({
  //     isLogin,
  //     onError: onErrorHandler,
  //     onSuccess() {
  //       history.push('/chat');
  //     },
  //   });
  //   async function onSubmit(data) {
  //     setIsLoading(true);
  //     setErrorMessage(null);
  //     setSuccessMessage(null);
  //     try {
  //       await handleSubmit(data);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }

  useEffect(() => {
    if (tocChecked && marketingEmailsChecked) {
      setErrorMessage(null);
    }
  }, [tocChecked, marketingEmailsChecked]);

  const handleTocChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTocChecked(event.target.checked);
  };

  const handleMarketingEmailsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMarketingEmailsChecked(event.target.checked);
  };

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    googleSignInUrl: string
  ) => {
    event.preventDefault();
    if (loginFlow === 'signIn') {
      window.location.href = googleSignInUrl;
    } else {
      if (tocChecked && marketingEmailsChecked) {
        window.location.href = googleSignInUrl;
      } else {
        const err = {
          title:
            'To proceed, please ensure you have accepted the Terms & Conditions, Privacy Policy, and opted to receive marketing emails.',
          description: '',
        };
        setErrorMessage(err);
      }
    }
  };

  const toggleLoginFlow = () => {
    const newLoginFlow = loginFlow === 'signIn' ? 'signUp' : 'signIn';
    setLoginFlow(newLoginFlow);
    setTocChecked(false);
    setMarketingEmailsChecked(false);
    setErrorMessage(null);
    changeHeaderText(loginFlow);
  };

  const googleBtnText =
    loginFlow === 'signIn' ? 'Sign in with Google' : 'Sign up with Google';

  return (
    <>
      {loginFlow === 'signUp' && (
        <>
          <div className='mt-3'>
            <input
              type='checkbox'
              id='toc'
              checked={tocChecked}
              onChange={handleTocChange}
            />
            <label className='text-sm ml-2' htmlFor='toc'>
              I agree to the{' '}
              <Link
                to='/toc'
                className='no-underline hover:underline'
                target='_blank'
              >
                Terms & Conditions
              </Link>{' '}
              and{' '}
              <Link
                to='/privacy'
                className='no-underline hover:underline'
                target='_blank'
              >
                Privacy Policy
              </Link>
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='marketingEmails'
              checked={marketingEmailsChecked}
              onChange={handleMarketingEmailsChange}
            />
            <label className='text-sm ml-2' htmlFor='marketingEmails'>
              I agree to receiving marketing emails
            </label>
          </div>
          {errorMessage && (
            <div className='text-sm'>
              <MessageError style={{ border: '1px solid #bb6e90' }}>
                {errorMessage.title}
                {errorMessage.description && ': '}
                {errorMessage.description}
              </MessageError>
            </div>
          )}
        </>
      )}
      <SocialAuth>
        <SocialAuthButtons gap='large' direction={socialButtonsDirection}>
          <button
            className='gsi-material-button'
            onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
              handleClick(event, googleSignInUrl)
            }
          >
            <div className='gsi-material-button-state'></div>
            <div className='gsi-material-button-content-wrapper'>
              <div className='gsi-material-button-icon'>
                <svg
                  version='1.1'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 48 48'
                  xmlnsXlink='http://www.w3.org/1999/xlink'
                  style={{ display: 'block' }}
                >
                  <path
                    fill='#EA4335'
                    d='M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'
                  ></path>
                  <path
                    fill='#4285F4'
                    d='M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'
                  ></path>
                  <path
                    fill='#FBBC05'
                    d='M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z'
                  ></path>
                  <path
                    fill='#34A853'
                    d='M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z'
                  ></path>
                  <path fill='none' d='M0 0h48v48H0z'></path>
                </svg>
              </div>
              <span className='gsi-material-button-contents'>
                {googleBtnText}
              </span>
              <span style={{ display: 'none' }}>{googleBtnText}</span>
            </div>
          </button>
        </SocialAuthButtons>
      </SocialAuth>
      <div className='flex items-center justify-center'>
        <span className='text-sm block'>
          {loginFlow === 'signIn'
            ? "Don't have an account? "
            : 'Already have an account? '}
          <a
            className='no-underline hover:underline cursor-pointer'
            onClick={toggleLoginFlow}
          >
            {loginFlow === 'signIn' ? 'Sign Up' : 'Sign In'}
          </a>
        </span>
      </div>
    </>
  );
};
