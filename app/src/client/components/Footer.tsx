import { footerNavigation } from '../landing-page/contentSections';

const Footer = () => {
  return (
    <div>
      <footer
        aria-labelledby='footer-heading'
        className='relative mt-5 border-t border-gray-900/10'
      >
        <div className='flex items-start justify-end mt-10 gap-20 mx-auto max-w-7xl sm:px-6 lg:px-8'>
          <div>
            {/* <h3 className='text-sm font-semibold leading-6 text-captn-dark-blue dark:text-captn-light-cream'>
              Company
            </h3> */}
            <ul role='list' className='mt-6 space-y-4'>
              {footerNavigation.company.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className='text-sm leading-6 text-captn-dark-blue hover:text-captn-light-blue dark:text-captn-light-cream'
                    target={`${item.name === 'airt' ? '_blank' : '_self'}`}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
