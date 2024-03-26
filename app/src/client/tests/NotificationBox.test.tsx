import { test, expect, vi, describe } from 'vitest';
import { renderInContext } from 'wasp/client/test';
import { fireEvent, screen } from '@testing-library/react';

import NotificationBox from '../components/NotificationBox';

describe('NotificationBox', () => {
  test('renders the correct message and title', () => {
    const mockOnClick = vi.fn();

    renderInContext(
      <NotificationBox
        type='success'
        message='Your changes are saved successfully.'
        onClick={mockOnClick}
      />
    );

    expect(
      screen.getByText('Your changes are saved successfully.')
    ).toBeInTheDocument();
    expect(screen.getByText('Success')).toBeInTheDocument();

    fireEvent.click(screen.getByText('OK'));
    expect(mockOnClick).toHaveBeenCalled();
  });

  test('renders the correct title for error type', () => {
    const mockOnClick = vi.fn();

    renderInContext(
      <NotificationBox
        type='error'
        message='Something went wrong. Please try again later.'
        onClick={mockOnClick}
      />
    );

    expect(
      screen.getByText('Something went wrong. Please try again later.')
    ).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();

    fireEvent.click(screen.getByText('OK'));
    expect(mockOnClick).toHaveBeenCalled();
  });
});
