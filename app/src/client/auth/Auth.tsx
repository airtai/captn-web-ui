import { type CustomizationOptions } from 'wasp/client/auth';
import { useState, createContext } from 'react';
import { createTheme } from '@stitches/react';
import { styled } from 'wasp/stitches.config';

import {
  type State,
  type ErrorMessage,
  type AdditionalSignupFields,
} from 'wasp/auth/forms/types';
import { LoginSignupForm } from './LoginSignupForm';
import { MessageSuccess } from 'wasp/auth/forms/internal/Message';

const logoStyle = {
  height: '6rem',
};

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
});

// const HeaderText = styled('h2', {
//   fontSize: '1.875rem',
//   fontWeight: '700',
//   marginTop: '1.5rem',
// });

export const AuthContext = createContext({
  isLoading: false,
  setIsLoading: (isLoading: boolean) => {},
  setErrorMessage: (errorMessage: ErrorMessage | null) => {},
  setSuccessMessage: (successMessage: string | null) => {},
});

function Auth({
  state,
  appearance,
  logo,
  socialLayout = 'horizontal',
  additionalSignupFields,
}: {
  state: State;
} & CustomizationOptions & {
    additionalSignupFields?: AdditionalSignupFields;
  }) {
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // TODO(matija): this is called on every render, is it a problem?
  // If we do it in useEffect(), then there is a glitch between the default color and the
  // user provided one.
  const customTheme = createTheme(appearance ?? {});

  const titles: Record<State, string> = {
    login: 'Log in to your account',
    signup: 'Create a new account',
  };
  const title = titles[state];

  const socialButtonsDirection =
    socialLayout === 'vertical' ? 'vertical' : 'horizontal';

  return (
    <div className={customTheme}>
      <div>
        {logo && (
          <img
            className='mt-10 mx-auto'
            style={logoStyle}
            src={logo}
            alt='Capt’n.ai'
          />
        )}
        {/* <HeaderText>{title}</HeaderText> */}
        <p className='mt-7 text-2xl'>{title}</p>
      </div>

      {/* {errorMessage && (
        <MessageError>
          {errorMessage.title}
          {errorMessage.description && ': '}
          {errorMessage.description}
        </MessageError>
      )} */}
      {successMessage && <MessageSuccess>{successMessage}</MessageSuccess>}
      <AuthContext.Provider
        value={{ isLoading, setIsLoading, setErrorMessage, setSuccessMessage }}
      >
        {(state === 'login' || state === 'signup') && (
          <LoginSignupForm
            state={state}
            socialButtonsDirection={socialButtonsDirection}
            additionalSignupFields={additionalSignupFields}
            errorMessage={errorMessage}
          />
        )}
      </AuthContext.Provider>
    </div>
  );
}

export default Auth;
