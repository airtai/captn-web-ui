import { test, expect, vi, describe } from 'vitest';
import { renderInContext } from 'wasp/client/test';
import { fireEvent, screen } from '@testing-library/react';

import TosAndMarketingEmails from '../components/TosAndMarketingEmails';

const mockHandleTocChange = vi.fn();
const mockHandleMarketingEmailsChange = vi.fn();

describe('TosAndMarketingEmails', () => {
  test('renders TosAndMarketingEmails component', async () => {
    renderInContext(
      <TosAndMarketingEmails
        tocChecked={false}
        handleTocChange={mockHandleTocChange}
        marketingEmailsChecked={false}
        handleMarketingEmailsChange={mockHandleMarketingEmailsChange}
        errorMessage={null}
      />
    );
    const linkItems = await screen.findAllByText('Terms & Conditions');
    expect(linkItems).toHaveLength(1);
  });

  test('calls handleTocChange when toc checkbox is clicked', async () => {
    renderInContext(
      <TosAndMarketingEmails
        tocChecked={false}
        handleTocChange={mockHandleTocChange}
        marketingEmailsChecked={false}
        handleMarketingEmailsChange={mockHandleMarketingEmailsChange}
        errorMessage={null}
      />
    );
    fireEvent.click(
      screen.getByLabelText(
        'I agree to the Terms & Conditions and Privacy Policy'
      )
    );
    expect(mockHandleTocChange).toHaveBeenCalled();
  });
  test('calls handleMarketingEmailsChange when marketingEmails checkbox is clicked', async () => {
    renderInContext(
      <TosAndMarketingEmails
        tocChecked={false}
        handleTocChange={mockHandleTocChange}
        marketingEmailsChecked={false}
        handleMarketingEmailsChange={mockHandleMarketingEmailsChange}
        errorMessage={null}
      />
    );
    fireEvent.click(
      screen.getByLabelText('I agree to receiving marketing emails')
    );
    expect(mockHandleMarketingEmailsChange).toHaveBeenCalled();
  });

  test('renders error message when errorMessage prop is provided', async () => {
    const errorMessage = { title: 'Error', description: 'This is an error' };
    renderInContext(
      <TosAndMarketingEmails
        tocChecked={false}
        handleTocChange={mockHandleTocChange}
        marketingEmailsChecked={false}
        handleMarketingEmailsChange={mockHandleMarketingEmailsChange}
        errorMessage={errorMessage}
      />
    );
    const errorItems = await screen.findAllByText('Error: This is an error');
    expect(errorItems).toHaveLength(1);
  });
});
