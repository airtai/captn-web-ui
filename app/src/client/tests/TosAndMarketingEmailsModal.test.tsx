import { test, expect, vi, describe } from 'vitest';
import { renderInContext } from 'wasp/client/test';
import { fireEvent, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import TosAndMarketingEmailsModal, {
  notificationMsg,
} from '../components/TosAndMarketingEmailsModal';

describe('TosAndMarketingEmailsModal', () => {
  test('renders TosAndMarketingEmailsModal component', async () => {
    renderInContext(<TosAndMarketingEmailsModal />);
    const linkItems = await screen.findAllByText('Almost there...');
    expect(linkItems).toHaveLength(1);
  });
  test('calls handleTocChange when toc checkbox is clicked', async () => {
    renderInContext(<TosAndMarketingEmailsModal />);
    fireEvent.click(
      screen.getByLabelText(
        'I agree to the Terms & Conditions and Privacy Policy'
      )
    );
    expect(
      screen.getByLabelText(
        'I agree to the Terms & Conditions and Privacy Policy'
      )
    ).toBeChecked();
  });
  test('calls handleMarketingEmailsChange when marketingEmails checkbox is clicked', async () => {
    renderInContext(<TosAndMarketingEmailsModal />);
    fireEvent.click(
      screen.getByLabelText('I agree to receiving marketing emails')
    );
    expect(
      screen.getByLabelText('I agree to receiving marketing emails')
    ).toBeChecked();
  });
  test('navigates to /chat when both checkboxes are checked and save button is clicked', async () => {
    const history = createMemoryHistory();
    renderInContext(
      <Router history={history}>
        <TosAndMarketingEmailsModal />
      </Router>
    );
    fireEvent.click(
      screen.getByLabelText(
        'I agree to the Terms & Conditions and Privacy Policy'
      )
    );
    fireEvent.click(
      screen.getByLabelText('I agree to receiving marketing emails')
    );
    fireEvent.click(screen.getByText('Save'));
    expect(history.location.pathname).toBe('/chat');
  });
  test('renders error message when save button is clicked and checkboxes are not checked', async () => {
    renderInContext(<TosAndMarketingEmailsModal />);
    fireEvent.click(screen.getByText('Save'));
    const errorItems = await screen.findAllByText(notificationMsg);
    expect(errorItems).toHaveLength(1);
  });
});
