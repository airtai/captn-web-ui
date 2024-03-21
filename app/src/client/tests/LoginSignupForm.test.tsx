import { test, expect, vi } from 'vitest';
import { renderInContext } from 'wasp/client/test';
import { screen, fireEvent } from '@testing-library/react';

import { LoginSignupForm, CheckboxWithLabel } from '../auth/LoginSignupForm';

test('renders LoginSignupForm component', async () => {
  renderInContext(
    <LoginSignupForm
      state='login'
      socialButtonsDirection='horizontal'
      additionalSignupFields=''
      errorMessage={null}
    />
  );
  const signInItems = await screen.findAllByText('Sign in with Google');
  expect(signInItems).toHaveLength(2);
  screen.debug();
});

test('should check the checkbox when clicked', () => {
  const handleChange = vi.fn();
  renderInContext(
    <CheckboxWithLabel
      checked={false}
      onChange={handleChange}
      id='test-checkbox'
    />
  );

  const checkbox = screen.getByTestId('test-checkbox-checkbox');
  fireEvent.click(checkbox);

  expect(handleChange).toHaveBeenCalled();
});
