import { useAuth } from 'wasp/client/auth';

import React from 'react';
import { Redirect } from 'react-router-dom';

import SystemFailureComponent from '../components/SystemFailureComponent';
import LoadingComponent from '../components/LoadingComponent';

const createAuthRequiredChatPage = (Page) => {
  return (props) => {
    const { data: user, isError, isSuccess, isLoading } = useAuth();
    if (isSuccess) {
      if (user) {
        const redirectUrl = localStorage.getItem('captn:redirectUrl');
        if (redirectUrl) {
          localStorage.removeItem('captn:redirectUrl');
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
      return <LoadingComponent />;
    } else if (isError) {
      return <SystemFailureComponent />;
    } else {
      return <SystemFailureComponent />;
    }
  };
};

export default createAuthRequiredChatPage;
