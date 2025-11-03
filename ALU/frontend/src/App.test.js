import { render, screen } from '@testing-library/react';
import App from './App';

test('renders landing page headline', () => {
  render(<App />);

  expect(screen.getByText('Empowering Workers Through Digital Union Services')).toBeInTheDocument();
});
