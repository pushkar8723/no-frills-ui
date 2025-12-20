import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';

// Mock window.scrollTo since jsdom doesn't implement it
Object.defineProperty(window, 'scrollTo', {
    value: jest.fn(),
    writable: true,
});

// Make window.setTimeout use the mocked global.setTimeout
window.setTimeout = global.setTimeout;
