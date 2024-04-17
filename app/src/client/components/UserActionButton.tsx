import { Link } from 'react-router-dom';
import FreeTrialButton from './FreeTrialButton';

interface UserActionButtonProps {
  user: any;
  renderGoToChat: boolean;
}

const UserActionButton: React.FC<UserActionButtonProps> = ({
  user,
  renderGoToChat,
}) => {
  if (!user) {
    return (
      <Link
        to='/signup'
        className='no-underline rounded-md px-3.5 py-2.5 text-sm text-captn-light-cream  hover:bg-captn-cta-green-hover shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:text-captn-light-cream bg-captn-cta-green'
      >
        Create an account
      </Link>
    );
  }

  if (!user.hasPaid) {
    return <FreeTrialButton />;
  }

  return renderGoToChat ? (
    <a
      href='/chat'
      className='no-underline rounded-md px-3.5 py-2.5 text-sm text-captn-light-cream  hover:bg-captn-cta-green-hover shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:text-captn-light-cream bg-captn-cta-green'
    >
      Go to chat <span aria-hidden='true'>→</span>
    </a>
  ) : (
    <></>
  );
};

export default UserActionButton;
