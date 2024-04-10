import { createTheme } from '@stitches/react';
import { useAuth } from 'wasp/client/auth';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
// import { LoginForm } from '@wasp/auth/forms/Login';
import { AuthWrapper } from './authWrapper';
import Auth from './Auth';
// import { State } from 'wasp/auth/forms/types';
import imgUrl from '../static/captn-logo-large.png';

export enum State {
  Login = 'login',
  Signup = 'signup',
}

export default function Login() {
  const history = useHistory();

  const { data: user } = useAuth();

  useEffect(() => {
    if (user) {
      history.push('/');
    }
  }, [user, history]);

  return (
    <AuthWrapper>
      <LoginForm logo={imgUrl} state={State.Login} />
      {/* <br />
      <span className='text-sm font-medium text-captn-dark-blue dark:text-captn-dark-blue'>
        Don't have an account yet?{' '}
        <Link to='/signup' className='underline'>
          go to signup
        </Link>
        .
      </span>
      <br />
      <span className='text-sm font-medium text-captn-dark-blue'>
        Forgot your password?{' '}
        <Link to='/request-password-reset' className='underline'>
          reset it
        </Link>
        .
      </span> */}
    </AuthWrapper>
  );
}

export type CustomizationOptions = {
  logo?: string;
  socialLayout?: 'horizontal' | 'vertical';
  appearance?: Parameters<typeof createTheme>[0];
  state: State;
};

export function LoginForm({
  appearance,
  logo,
  socialLayout,
  state,
}: CustomizationOptions) {
  return (
    <Auth
      appearance={appearance}
      logo={logo}
      socialLayout={socialLayout}
      state={state}
    />
  );
}
