import { ReactNode } from 'react';

export function AuthWrapper({ children }: { children: ReactNode }) {
  return (
    <div className='custom-auth-wrapper flex min-h-full flex-col justify-center pt-10 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-captn-dark-blue py-8 px-4 shadow-xl ring-1 ring-gray-900/10 sm:rounded-lg sm:px-10 dark:bg-white text-captn-light-cream'>
          <div className='-mt-8'>{children}</div>
        </div>
      </div>
    </div>
  );
}
