import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HelpText from './HelpText';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { useTranslation } from 'react-i18next';
import configData from '../config.json';

// Mock easy-peasy
vi.mock('easy-peasy', () => ({
  useStoreState: vi.fn(),
  useStoreActions: vi.fn(),
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(),
}));

describe('HelpText', () => {
  const mockSetHelpTextDismissed = vi.fn();
  const mockT = vi.fn((key) => key);

  beforeEach(() => {
    vi.clearAllMocks();
    useTranslation.mockReturnValue({ t: mockT });
    useStoreActions.mockReturnValue(mockSetHelpTextDismissed);
  });

  it('renders WELCOME text when schedule is empty and not dismissed', () => {
    useStoreState.mockImplementation((selector) => {
      const state = {
        getMySchedule: [],
        helpTextDismissed: {},
      };
      return selector(state);
    });

    render(<HelpText />);

    expect(screen.getByText('help_text.welcome')).toBeDefined();
    expect(screen.getByText('help_text.close_label')).toBeDefined();
  });

  it('renders SHARING text when schedule is not empty and not dismissed', () => {
    useStoreState.mockImplementation((selector) => {
      const state = {
        getMySchedule: [{ id: 1 }],
        helpTextDismissed: {},
      };
      return selector(state);
    });

    render(<HelpText />);

    expect(screen.getByText('help_text.sharing')).toBeDefined();
  });

  it('does not render when WELCOME is dismissed', () => {
    useStoreState.mockImplementation((selector) => {
      const state = {
        getMySchedule: [],
        helpTextDismissed: { WELCOME: true },
      };
      return selector(state);
    });

    const { container } = render(<HelpText />);
    expect(container.firstChild).toBeNull();
  });

  it('does not render when SHARING is dismissed', () => {
    useStoreState.mockImplementation((selector) => {
      const state = {
        getMySchedule: [{ id: 1 }],
        helpTextDismissed: { SHARING: true },
      };
      return selector(state);
    });

    const { container } = render(<HelpText />);
    expect(container.firstChild).toBeNull();
  });

  it('calls dismiss action when close button is clicked', () => {
    useStoreState.mockImplementation((selector) => {
      const state = {
        getMySchedule: [],
        helpTextDismissed: {},
      };
      return selector(state);
    });

    render(<HelpText />);
    
    const closeButton = screen.getByRole('button', { name: 'help_text.close_aria_label' });
    fireEvent.click(closeButton);

    expect(mockSetHelpTextDismissed).toHaveBeenCalledWith({ WELCOME: true });
  });

  it('calls dismiss action with SHARING key when schedule is not empty', () => {
    useStoreState.mockImplementation((selector) => {
      const state = {
        getMySchedule: [{ id: 1 }],
        helpTextDismissed: { WELCOME: true },
      };
      return selector(state);
    });

    render(<HelpText />);
    
    const closeButton = screen.getByRole('button', { name: 'help_text.close_aria_label' });
    fireEvent.click(closeButton);

    expect(mockSetHelpTextDismissed).toHaveBeenCalledWith({ WELCOME: true, SHARING: true });
  });
});
