import { test } from 'vitest';
import { screen } from '@testing-library/react';
import { renderInContext } from '@wasp/test';

import App from '../App';

test('renders App component', async () => {
  renderInContext(<App children={<div>Test</div>} />);

  await screen.findByText('Test');

  screen.debug();
});
