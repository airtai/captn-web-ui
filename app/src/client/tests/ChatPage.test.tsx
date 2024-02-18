import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { test, expect } from 'vitest';
import { screen, render } from '@testing-library/react';
import { renderInContext } from '@wasp/test';

import ChatPage from '../app/ChatPage';

test('ChatPage redirects to login if user is not defined', async () => {
  const history = createMemoryHistory();

  render(
    <Router history={history}>
      <ChatPage user={null} />
    </Router>
  );
  expect(history.location.pathname).toBe('/login');
});

// next test case, not loggin in but with query parameters
// additionally check the local storage values

// next test case, loggin in but with query parameters
// additionally check the local storage values
// if value is present, then add it to the query parameters in the url
// finally remove local storage value

// next test case, loggin in without query parameters
// do nothing, just check the local storage values and make sure it is empty
