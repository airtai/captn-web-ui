import { useAuth } from 'wasp/client/auth';
import { Redirect } from 'react-router-dom';

import ServerNotRechableComponent from '../../components/ServerNotRechableComponent';
import LoadingComponent from '../../components/LoadingComponent';

const CustomAuthRequiredLayout = (Page: any) => {
  return (props: any) => {
    const { data: user, isError, isSuccess, isLoading } = useAuth();
    if (isSuccess) {
      if (user) {
        return <Page {...props} user={user} />;
      } else {
        return <Redirect to='/login' />;
      }
    } else if (isLoading) {
      return <LoadingComponent />;
    } else if (isError) {
      return (
        <ServerNotRechableComponent>
          <Page {...props} user={user} />
        </ServerNotRechableComponent>
      );
    } else {
      return (
        <ServerNotRechableComponent>
          <Page {...props} user={user} />
        </ServerNotRechableComponent>
      );
    }
  };
};

export default CustomAuthRequiredLayout;
