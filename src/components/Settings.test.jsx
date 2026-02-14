import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Settings from './Settings';
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

// Mock Temporal
vi.mock('@js-temporal/polyfill', () => ({
  Temporal: {
    Now: {
      timeZone: 'UTC',
    },
  },
}));

// Mock react-timezone-select
vi.mock('react-timezone-select', () => ({
  default: ({ value, onChange }) => (
    <select
      data-testid="timezone-select"
      value={value}
      onChange={(e) => onChange({ value: e.target.value })}
    >
      <option value="Europe/Berlin">Europe/Berlin</option>
      <option value="America/New_York">America/New_York</option>
    </select>
  ),
}));

describe('Settings', () => {
  const mockSetShow12HourTime = vi.fn();
  const mockSetShowLocalTime = vi.fn();
  const mockSetShowTimeZone = vi.fn();
  const mockSetUseTimeZone = vi.fn();
  const mockSetSelectedTimeZone = vi.fn();
  const mockSetDarkMode = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    useTranslation.mockReturnValue({
      t: (key) => key,
    });

    useStoreActions.mockImplementation((selector) => {
      const actions = {
        setShow12HourTime: mockSetShow12HourTime,
        setShowLocalTime: mockSetShowLocalTime,
        setShowTimeZone: mockSetShowTimeZone,
        setUseTimeZone: mockSetUseTimeZone,
        setSelectedTimeZone: mockSetSelectedTimeZone,
        setDarkMode: mockSetDarkMode,
      };
      return selector(actions);
    });

    // Default state
    useStoreState.mockImplementation((selector) => {
      const state = {
        show12HourTime: false,
        showLocalTime: 'never',
        showTimeZone: 'never',
        useTimeZone: false,
        selectedTimeZone: 'UTC',
        darkMode: 'browser',
      };
      return selector(state);
    });

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('renders all settings sections', () => {
    render(<Settings />);

    expect(screen.getByText('settings.title.label')).toBeDefined();
    expect(screen.getByText('settings.time_format.label')).toBeDefined();
    expect(screen.getByText('settings.show_local_time.label')).toBeDefined();
    expect(screen.getByText('settings.show_timezone.label')).toBeDefined();
    expect(screen.getByText('settings.select_timezone.label')).toBeDefined();
    expect(screen.getByText('settings.dark_mode.label')).toBeDefined();
  });

  it('handles 12/24 hour time format change', () => {
    render(<Settings />);
    
    // Initial state is 24h (show12HourTime: false)
    const radio12h = screen.getByLabelText('settings.time_format.t12_hour_label');
    fireEvent.click(radio12h);
    expect(mockSetShow12HourTime).toHaveBeenCalledWith(true);
  });

  it('handles show local time change', () => {
    render(<Settings />);
    
    // Select by value since it's unique within the radio groups we care about, 
    // or use container to scope
    const fieldset = screen.getByText('settings.show_local_time.label').closest('fieldset');
    const radioAlways = fieldset.querySelector('input[value="always"]');
    fireEvent.click(radioAlways);
    expect(mockSetShowLocalTime).toHaveBeenCalledWith('always');
  });

  it('handles show timezone change', () => {
    render(<Settings />);
    
    const fieldset = screen.getByText('settings.show_timezone.label').closest('fieldset');
    const radioAlways = fieldset.querySelector('input[value="always"]');
    fireEvent.click(radioAlways);
    expect(mockSetShowTimeZone).toHaveBeenCalledWith('always');
  });

  it('handles timezone method change', () => {
    render(<Settings />);
    
    const radioSelect = screen.getByLabelText('settings.select_timezone.select_label');
    fireEvent.click(radioSelect);
    expect(mockSetUseTimeZone).toHaveBeenCalledWith(true);
  });

  it('shows timezone select when useTimeZone is true', () => {
    useStoreState.mockImplementation((selector) => {
      const state = {
        show12HourTime: false,
        showLocalTime: 'never',
        showTimeZone: 'never',
        useTimeZone: true,
        selectedTimeZone: 'UTC',
        darkMode: 'browser',
      };
      return selector(state);
    });

    render(<Settings />);
    
    const select = screen.getByTestId('timezone-select');
    expect(select).toBeDefined();
    
    fireEvent.change(select, { target: { value: 'Europe/Berlin' } });
    expect(mockSetSelectedTimeZone).toHaveBeenCalledWith('Europe/Berlin');
  });

  it('handles dark mode change', () => {
    render(<Settings />);

    const radioDark = screen.getByLabelText('settings.dark_mode.dark_mode_label');
    fireEvent.click(radioDark);
    expect(mockSetDarkMode).toHaveBeenCalledWith('dark');

    const radioLight = screen.getByLabelText('settings.dark_mode.light_mode_label');
    fireEvent.click(radioLight);
    expect(mockSetDarkMode).toHaveBeenCalledWith('light');
  });
});
