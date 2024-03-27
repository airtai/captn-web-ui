const wrapperStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4rem',
};

const commonMessageStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '.5rem',
  borderRadius: '.5rem',
  padding: '1rem',
};

const MessageIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1.25rem'
    height='1.25rem'
    fill='currentColor'
    stroke='currentColor'
    strokeWidth={0}
    aria-hidden='true'
    viewBox='0 0 20 20'
  >
    <path
      fillRule='evenodd'
      stroke='none'
      d='M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM9 9a1 1 0 0 0 0 2v3a1 1 0 0 0 1 1h1a1 1 0 1 0 0-2v-3a1 1 0 0 0-1-1H9z'
      clipRule='evenodd'
    />
  </svg>
);

export default function LoadingComponent() {
  return (
    <div style={wrapperStyles}>
      <div
        className='bg-captn-light-cream text-captn-dark-blue shadow'
        style={commonMessageStyles}
      >
        <MessageIcon /> Please wait a moment while we log you in.
      </div>
    </div>
  );
}
