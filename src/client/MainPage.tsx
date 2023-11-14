import imgUrl from './static/rba-logo-large.png'

export default function MainPage() {
  return (
    <div>
      <div className='mx-auto max-w-7xl pt-10 pb-24 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:py-32 lg:px-8'>
        <div className='px-6 lg:px-0 lg:pt-4'>
          <div className='mx-auto max-w-2xl'>
            <div className='max-w-lg'>
              <h1 className=' text-4xl font-bold tracking-tight text-captn-dark-blue sm:text-6xl'>RBA Demo</h1>

              {/* <h2 className='ml-4 max-w-2xl text-2xl f tracking-tight text-gray-800 slg:col-span-2 xl:col-auto'>
                Product home page
              </h2> */}
              {/* <h2 className='ml-4 max-w-2xl text-md f tracking-tight text-gray-600 slg:col-span-2 xl:col-auto'>
                Postgres/Prisma, Express, React, Node
              </h2> */}

              <p className='mt-4 text-lg leading-8 text-captn-dark-blue'>
              Hi there! 🧙‍♂️ Tell us what you need, and we'll create a loan offer just for you.
              </p>
              {/* <ul className='list-disc ml-8 my-2 leading-8 text-gray-600'>
                <li>Stripe integration</li>
                <li>Authentication w/ Google</li>
                <li>OpenAI GPT API configuration</li>
                <li>Managed Server-Side Routes</li>
                <li>Tailwind styling</li>
                <li>Client-side Caching</li>
                <li>
                  One-command{' '}
                  <a href='https://wasp-lang.dev/docs/deploying' className='underline' target='_blank'>
                    Deploy 🚀
                  </a>
                </li>
              </ul>
              <p className='mt-4 text-lg leading-8 text-gray-600'>
                Make sure to check out the <code>README.md</code> file and add your <code>env</code> variables before
                you begin
              </p>
              <div className='mt-10 flex items-center gap-x-6'>
                <span className='text-sm font-semibold leading-6 text-gray-900'>Made with Wasp &nbsp; {' = }'}</span>
                <a
                  href='https://wasp-lang.dev/docs'
                  className='rounded-md bg-yellow-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-yellow-400 hover:text-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'
                >
                  Read the Wasp Docs
                </a>
              </div> */}
            </div>
          </div>
        </div>
        <div className='mt-20 sm:mt-24 lg:mx-0 md:mx-auto md:max-w-2xl lg:w-screen lg:mt-0 '>
          <div className='shadow-lg md:rounded-3xl relative isolate overflow-hidden'>
          <div className='relative'>
              <img className='w-full' src={imgUrl} />
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
