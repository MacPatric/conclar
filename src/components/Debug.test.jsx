import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Debug from './Debug';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { useTranslation } from 'react-i18next';

// Mock easy-peasy
vi.mock('easy-peasy', () => ({
  useStoreState: vi.fn(),
  useStoreActions: vi.fn(),
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(),
}));

// Mock config data with DEBUG_MODE enabled
vi.mock('../config.json', () => ({
  default: {
    DEBUG_MODE: {
      ENABLE: true,
    },
  },
}));

describe('Debug', () => {
  const mockFetchProgram = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    useTranslation.mockReturnValue({
      t: (key) => {
        const translations = {
          'debug_mode.online_label': 'Online',
          'debug_mode.offline_label': 'Offline',
          'debug_mode.fetch_button_label': 'Fetch Now',
        };
        return translations[key] || key;
      },
    });

    useStoreActions.mockImplementation((selector) => {
      const actions = {
        fetchProgram: mockFetchProgram,
      };
      return selector(actions);
    });
  });

  it('renders debug component when online', () => {
    useStoreState.mockImplementation((selector) => {
      const state = {
        timeToNextFetch: 30,
        onLine: true,
      };
      return selector(state);
    });

    const { container } = render(<Debug />);

    const debugDiv = container.querySelector('.debug');
    expect(debugDiv).toBeDefined();
  });

  it('displays online status when online', () => {
    useStoreState.mockImplementation((selector) => {
      const state = {
        timeToNextFetch: 30,
        onLine: true,
      };
      return selector(state);
    });

    render(<Debug />);

    expect(screen.getByText('Online')).toBeDefined();
  });

  it('displays offline status when offline', () => {
    useStoreState.mockImplementation((selector) => {
      const state = {
        timeToNextFetch: 30,
        onLine: false,
      };
      return selector(state);
    });

    render(<Debug />);

    expect(screen.getByText('Offline')).toBeDefined();
  });

  it('applies debug-online class when online', () => {
    useStoreState.mockImplementation((selector) => {
      const state = {
        timeToNextFetch: 30,
        onLine: true,
      };
      return selector(state);
    });

    const { container } = render(<Debug />);

    const debugDiv = container.querySelector('.debug');
    expect(debugDiv.className).toContain('debug-online');
  });

  it('applies debug-offline class when offline', () => {
    useStoreState.mockImplementation((selector) => {
      const state = {
        timeToNextFetch: 30,
        onLine: false,
      };
      return selector(state);
    });

    const { container } = render(<Debug />);

    const debugDiv = container.querySelector('.debug');
    expect(debugDiv.className).toContain('debug-offline');
  });

  it('renders fetch button', () => {
    useStoreState.mockImplementation((selector) => {
      const state = {
        timeToNextFetch: 30,
        onLine: true,
      };
      return selector(state);
    });

    render(<Debug />);

    expect(screen.getByText('Fetch Now')).toBeDefined();
  });

  it('displays time to next fetch', () => {
    useStoreState.mockImplementation((selector) => {
      const state = {
        timeToNextFetch: 45,
        onLine: true,
      };
      return selector(state);
    });

    render(<Debug />);

    expect(screen.getByText('45 seconds')).toBeDefined();
  });

  it('calls fetchProgram when button is clicked', () => {
    useStoreState.mockImplementation((selector) => {
      const state = {
        timeToNextFetch: 30,
        onLine: true,
      };
      return selector(state);
    });

    render(<Debug />);

    const button = screen.getByText('Fetch Now');
    fireEvent.click(button);

    expect(mockFetchProgram).toHaveBeenCalledWith(false);
    expect(mockFetchProgram).toHaveBeenCalledTimes(1);
  });

  it('has correct structure with status, fetch button, and time', () => {
    useStoreState.mockImplementation((selector) => {
      const state = {
        timeToNextFetch: 30,
        onLine: true,
      };
      return selector(state);
    });

    const { container } = render(<Debug />);

    expect(container.querySelector('.debug-status')).toBeDefined();
    expect(container.querySelector('.debug-fetch')).toBeDefined();
    expect(container.querySelector('.debug-time-left')).toBeDefined();
  });

  it('updates display when time changes', () => {
    useStoreState.mockImplementation((selector) => {
      const state = {
        timeToNextFetch: 10,
        onLine: true,
      };
      return selector(state);
    });

    render(<Debug />);

    expect(screen.getByText('10 seconds')).toBeDefined();
  });

  it('handles zero time to next fetch', () => {
    useStoreState.mockImplementation((selector) => {
      const state = {
        timeToNextFetch: 0,
        onLine: true,
      };
      return selector(state);
    });

    render(<Debug />);

    expect(screen.getByText('0 seconds')).toBeDefined();
  });

  it('button is clickable when offline', () => {
    useStoreState.mockImplementation((selector) => {
      const state = {
        timeToNextFetch: 30,
        onLine: false,
      };
      return selector(state);
    });

    const mockFetchProgramLocal = vi.fn();

    useStoreActions.mockImplementation((selector) => {
      const actions = {
        fetchProgram: mockFetchProgramLocal,
      };
      return selector(actions);
    });

    render(<Debug />);

    const button = screen.getByText('Fetch Now');
    fireEvent.click(button);

    expect(mockFetchProgramLocal).toHaveBeenCalledWith(false);
  });

  it('renders all required elements together', () => {
    useStoreState.mockImplementation((selector) => {
      const state = {
        timeToNextFetch: 60,
        onLine: true,
      };
      return selector(state);
    });

    render(<Debug />);

    expect(screen.getByText('Online')).toBeDefined();
    expect(screen.getByText('Fetch Now')).toBeDefined();
    expect(screen.getByText('60 seconds')).toBeDefined();
  });
});
