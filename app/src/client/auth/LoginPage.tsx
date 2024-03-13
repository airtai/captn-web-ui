import { useAuth, type CustomizationOptions } from "wasp/client/auth";
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
// import { LoginForm } from '@wasp/auth/forms/Login';
import { AuthWrapper } from './authWrapper';
import Auth from './Auth';
import { State } from '@wasp/auth/forms/types';
import imgUrl from '../static/captn-logo-large.png';

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
      <LoginForm logo={imgUrl} />
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

export function LoginForm({
  appearance,
  logo,
  socialLayout,
}: CustomizationOptions) {
  return (
    <Auth
      appearance={appearance}
      logo={logo}
      socialLayout={socialLayout}
      state={State.Login}
    />
  );
}
