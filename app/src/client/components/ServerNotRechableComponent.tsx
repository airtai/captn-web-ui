import AnimatedCharacterLoader from './AnimatedCharacterLoader';

export default function ServerNotRechableComponent() {
  return (
    <div className='server-error-component sticky top-0 z-999 flex w-full justify-center bg-captn-rose-quartz'>
      <AnimatedCharacterLoader
        loadingMessage={
          "Oops! Something went wrong. Our server is currently unavailable. Please do not refresh your browser. We're trying to reconnect..."
        }
        showLogo={false}
        bgColor='bg-captn-rose-quartz'
      />
    </div>
  );
}
