export default function SystemFailureComponent() {
  return (
    <div className='fixed inset-0 flex flex-col items-center justify-center bg-captn-light-cream space-y-4 p-4 sm:p-8 md:p-16'>
      <div className='font-bold leading-none text-lg sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl text-captn-dark-blue'>
        Ahoy! We're facing technical difficulties.
      </div>
      <p className='text-sm sm:text-base md:text-lg leading-8'>
        Please try again later for a smoother experience. Thank you for your
        patience!
      </p>
      <p className='text-sm sm:text-base md:text-lg'>
        For urgent matters or updates on the application's return, please reach
        out to us at <a href='mailto:support@captn.ai'>support@captn.ai</a>.
      </p>
    </div>
  );
}
