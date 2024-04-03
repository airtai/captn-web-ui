import { test, expect, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderInContext } from 'wasp/client/test';

import AnimatedCharacterLoader from '../components/AnimatedCharacterLoader';

describe('AnimatedCharacterLoader', () => {
  test('renders AnimatedCharacterLoader component with default props', async () => {
    renderInContext(<AnimatedCharacterLoader />);

    const logo = screen.getByAltText('Capt’n.ai logo');
    expect(logo).toBeInTheDocument();
  });
});
