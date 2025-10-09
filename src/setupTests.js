// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock ResizeObserver (used by recharts and other libs)
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!window.ResizeObserver) {
  window.ResizeObserver = ResizeObserverMock;
}

// Mock matchMedia for environments without it
if (!window.matchMedia) {
  window.matchMedia = function () {
    return {
      matches: false,
      media: '',
      onchange: null,
      addListener: function () {}, // deprecated
      removeListener: function () {}, // deprecated
      addEventListener: function () {},
      removeEventListener: function () {},
      dispatchEvent: function () { return false; },
    };
  };
}

// Mock Recharts to lightweight pass-through components for tests
// This avoids JSDOM/SVG/ResizeObserver complexities during unit tests
jest.mock('recharts', () => {
  const React = require('react');
  // Strip all props to avoid React unknown prop warnings in tests
  const passthrough = (tag = 'div') => {
    return ({ children }) => React.createElement(tag, null, children);
  };
  return {
    ResponsiveContainer: passthrough('div'),
    BarChart: passthrough('div'),
    LineChart: passthrough('div'),
    PieChart: passthrough('div'),
    CartesianGrid: passthrough('div'),
    XAxis: passthrough('div'),
    YAxis: passthrough('div'),
    Tooltip: passthrough('div'),
    Legend: passthrough('div'),
    Bar: passthrough('div'),
    Line: passthrough('div'),
    Pie: passthrough('div'),
    Cell: passthrough('div'),
  };
});

// Make Framer Motion a no-op in tests to avoid act warnings
jest.mock('framer-motion', () => {
  const React = require('react');
  // Pass through normal props (e.g., aria-label, className) but strip animation props
  const sanitizeProps = (props) => {
    const {
      initial,
      animate,
      exit,
      transition,
      whileHover,
      whileTap,
      drag,
      layout,
      variants,
      ...rest
    } = props || {};
    return rest;
  };
  const handler = {
    get: () => ({ children, ...rest }) => React.createElement('div', sanitizeProps(rest), children),
  };
  return {
    __esModule: true,
    motion: new Proxy({}, handler),
    AnimatePresence: ({ children }) => React.createElement(React.Fragment, null, children),
  };
});
