import React from 'react';

interface NotificationBoxProps {
  type: 'success' | 'error';
  message: string;
  onClick: () => void;
}

const NotificationBox: React.FC<NotificationBoxProps> = ({
  type,
  message,
  onClick,
}) => {
  const isSuccess = type === 'success';

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 p-16 bg-black bg-opacity-50 backdrop-blur-md'>
      <div className='bg-captn-light-cream rounded-lg shadow-lg p-8 m-4 max-w-sm mx-auto'>
        <h2 className='text-xl font-bold mb-4 text-captn-dark-blue'>
          {isSuccess ? 'Success' : 'Error'}
        </h2>
        <p className='text-gray-700 dark:text-gray-300'>{message}</p>
        <div className='mt-4 text-right'>
          <button
            onClick={onClick}
            className={`py-2 px-4 rounded text-captn-light-cream focus:outline-none ${
              isSuccess ? 'bg-captn-cta-green' : 'bg-captn-cta-red'
            }`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationBox;
