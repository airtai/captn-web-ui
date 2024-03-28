import { renderInContext } from 'wasp/client/test';
import { test } from 'vitest';
import { screen } from '@testing-library/react';

import App from '../App';

test('renders App component', async () => {
  renderInContext(<App children={<div>Test</div>} />);

  await screen.findByText('Please wait a moment while we log you in.');

  screen.debug();
});
