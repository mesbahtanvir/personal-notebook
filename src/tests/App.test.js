import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

beforeEach(() => {
  localStorageMock.clear();
});

test('renders Personal Notebook heading', async () => {
  render(<App />);
  await waitFor(() => {
    const headingElement = screen.getByText(/Personal Notebook/i);
    expect(headingElement).toBeInTheDocument();
  });
});

test('renders theme toggle button', async () => {
  render(<App />);
  await waitFor(() => {
    const themeButton = screen.getByLabelText(/toggle theme/i);
    expect(themeButton).toBeInTheDocument();
  });
});
