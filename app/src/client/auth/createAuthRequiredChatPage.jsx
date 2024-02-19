import React from 'react';

import { Redirect } from 'react-router-dom';
import useAuth from '@wasp/auth/useAuth';

const createAuthRequiredChatPage = (Page) => {
  return (props) => {
    const { data: user, isError, isSuccess, isLoading } = useAuth();
    if (isSuccess) {
      if (user) {
        const redirectUrl = localStorage.getItem('captn:redirectUrl');
        if (redirectUrl) {
          localStorage.removeItem('captn:redirectUrl');
          console.log('Redirecting to: ', redirectUrl);
          window.location.href = redirectUrl;
          // return <Page {...props} user={user} redirectUrl={redirectUrl} />;
        } else {
          return <Page {...props} user={user} />;
        }
      } else {
        localStorage.setItem(
          'captn:redirectUrl',
          window.location.pathname + window.location.search
        );
        return <Redirect to='/login' />;
      }
    } else if (isLoading) {
      return <span>Loading...</span>;
    } else if (isError) {
      return <span>An error ocurred. Please refresh the page.</span>;
    } else {
      return <span>An unknown error ocurred. Please refresh the page.</span>;
    }
  };
};

export default createAuthRequiredChatPage;
