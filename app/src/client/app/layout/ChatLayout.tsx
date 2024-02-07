import { useState, ReactNode, FC } from 'react';
import Header from '../../admin/components/Header';
import ChatSidebar from '../../components/ChatSidebar';
import useAuth from '@wasp/auth/useAuth';

interface Props {
  children?: ReactNode;
}

const ChatLayout: FC<Props> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: user } = useAuth();

  return (
    <div className='dark:bg-boxdark-2 dark:text-bodydark bg-captn-light-blue'>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className='flex h-screen overflow-hidden'>
        {/* <!-- ===== Sidebar Start ===== --> */}
        <ChatSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className='relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden'>
          {/* <!-- ===== Header Start ===== --> */}
          <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            user={user}
          />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main className='flex-auto overflow-y-auto'>
            <div>{children}</div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
          <div data-testid='chat-form' className='mt-2 mb-2'>
            <form className=''>
              <label
                htmlFor='search'
                className='mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white'
              >
                Search
              </label>
              <div className='relative bottom-0 left-0 right-0 flex items-center justify-between m-1'>
                <input
                  type='search'
                  id='userQuery'
                  name='search'
                  className='block rounded-lg w-full h-12 text-sm text-captn-light-cream bg-captn-dark-blue focus:ring-blue-500 focus:border-blue-500'
                  placeholder='Message CaptnAI...'
                  required
                />
                <button
                  type='submit'
                  className={`text-white bg-captn-cta-green hover:bg-captn-cta-green-hover focus:ring-4 focus:outline-none focus:ring-blue-300 absolute right-2 font-medium rounded-lg text-sm px-1.5 py-1.5`}
                >
                  <span className=''>
                    <svg
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      className='text-captn-light-cream'
                    >
                      <path
                        d='M7 11L12 6L17 11M12 18V7'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      ></path>
                    </svg>
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  );
};

export default ChatLayout;
