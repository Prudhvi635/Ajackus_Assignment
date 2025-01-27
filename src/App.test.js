import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders User Management title', () => {
  render(<App />);
  const titleElement = screen.getByText(/User Management/i);
  expect(titleElement).toBeInTheDocument();
});
