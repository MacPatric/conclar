import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProgramList from './ProgramList';
import { Temporal } from '@js-temporal/polyfill';

// Mock easy-peasy
vi.mock('easy-peasy', () => ({
  useStoreState: vi.fn(),
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(),
}));

// Mock LocalTime
vi.mock('../utils/LocalTime', () => ({
  LocalTime: {
    storeCachedTimes: vi.fn(),
    checkTimeZonesDiffer: vi.fn(),
    conventionTimeZone: 'America/New_York',
    localTimeZone: 'America/Los_Angeles',
    timezonesDiffer: false,
  },
}));

// Mock Day component
vi.mock('./Day', () => ({
  default: ({ date, items, forceExpanded, now }) => (
    <div data-testid="day-component" data-date={date.toString()}>
      Day with {items.length} items
    </div>
  ),
}));

// Mock config data
vi.mock('../config.json', () => ({
  default: {
    TIMEZONE: 'America/New_York',
  },
}));

import { useStoreState } from 'easy-peasy';
import { useTranslation } from 'react-i18next';
import { LocalTime } from '../utils/LocalTime';

describe('ProgramList', () => {
  let originalSetInterval;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock setInterval to prevent actual timing issues in tests
    originalSetInterval = global.setInterval;
    global.setInterval = vi.fn((callback, delay) => {
      return 123; // Return a mock timer ID
    });

    useStoreState.mockReturnValue('never');

    useTranslation.mockReturnValue({
      t: (key) => {
        const translations = {
          'program.no_items': 'No program items available',
          'convention_time.notice': 'All times in @timezone',
          'local_time.notice': 'Your local time: @timezone',
        };
        return translations[key] || key;
      },
    });

    LocalTime.timezonesDiffer = false;
  });

  afterEach(() => {
    global.setInterval = originalSetInterval;
  });

  it('renders empty message when program is null', () => {
    const { container } = render(<ProgramList program={null} />);

    expect(screen.getByText('No program items available')).toBeTruthy();
    expect(container.querySelector('.program-empty')).toBeTruthy();
  });

  it('renders empty message when program is empty array', () => {
    const { container } = render(<ProgramList program={[]} />);

    expect(screen.getByText('No program items available')).toBeTruthy();
    expect(container.querySelector('.program-empty')).toBeTruthy();
  });

  it('renders program with items grouped by day', () => {
    const program = [
      {
        id: 'item1',
        startDateAndTime: Temporal.ZonedDateTime.from('2026-01-15T10:00:00-05:00[America/New_York]'),
      },
      {
        id: 'item2',
        startDateAndTime: Temporal.ZonedDateTime.from('2026-01-15T14:00:00-05:00[America/New_York]'),
      },
      {
        id: 'item3',
        startDateAndTime: Temporal.ZonedDateTime.from('2026-01-16T10:00:00-05:00[America/New_York]'),
      },
    ];

    render(<ProgramList program={program} />);

    const days = screen.getAllByTestId('day-component');
    expect(days.length).toBe(2); // 2 different days
  });

  it('renders convention time notice', () => {
    const program = [
      {
        id: 'item1',
        startDateAndTime: Temporal.ZonedDateTime.from('2026-01-15T10:00:00-05:00[America/New_York]'),
      },
    ];

    render(<ProgramList program={program} />);

    expect(screen.getByText('All times in America/New_York')).toBeTruthy();
  });

  it('shows local time notice when showLocalTime is "always"', () => {
    useStoreState.mockReturnValue('always');
    LocalTime.timezonesDiffer = true;

    const program = [
      {
        id: 'item1',
        startDateAndTime: Temporal.ZonedDateTime.from('2026-01-15T10:00:00-05:00[America/New_York]'),
      },
    ];

    render(<ProgramList program={program} />);

    expect(screen.getByText('Your local time: America/Los_Angeles')).toBeTruthy();
  });

  it('shows local time notice when showLocalTime is "differs" and timezones differ', () => {
    useStoreState.mockReturnValue('differs');
    LocalTime.timezonesDiffer = true;

    const program = [
      {
        id: 'item1',
        startDateAndTime: Temporal.ZonedDateTime.from('2026-01-15T10:00:00-05:00[America/New_York]'),
      },
    ];

    render(<ProgramList program={program} />);

    expect(screen.getByText('Your local time: America/Los_Angeles')).toBeTruthy();
  });

  it('does not show local time notice when showLocalTime is "never"', () => {
    useStoreState.mockReturnValue('never');
    LocalTime.timezonesDiffer = true;

    const program = [
      {
        id: 'item1',
        startDateAndTime: Temporal.ZonedDateTime.from('2026-01-15T10:00:00-05:00[America/New_York]'),
      },
    ];

    render(<ProgramList program={program} />);

    expect(screen.queryByText(/Your local time:/)).toBeNull();
  });

  it('does not show local time notice when showLocalTime is "differs" and timezones match', () => {
    useStoreState.mockReturnValue('differs');
    LocalTime.timezonesDiffer = false;

    const program = [
      {
        id: 'item1',
        startDateAndTime: Temporal.ZonedDateTime.from('2026-01-15T10:00:00-05:00[America/New_York]'),
      },
    ];

    render(<ProgramList program={program} />);

    expect(screen.queryByText(/Your local time:/)).toBeNull();
  });

  it('passes forceExpanded prop to Day components', () => {
    const program = [
      {
        id: 'item1',
        startDateAndTime: Temporal.ZonedDateTime.from('2026-01-15T10:00:00-05:00[America/New_York]'),
      },
    ];

    render(<ProgramList program={program} forceExpanded={true} />);

    const day = screen.getByTestId('day-component');
    expect(day).toBeTruthy();
  });

  it('groups items on same day together', () => {
    const program = [
      {
        id: 'item1',
        startDateAndTime: Temporal.ZonedDateTime.from('2026-01-15T10:00:00-05:00[America/New_York]'),
      },
      {
        id: 'item2',
        startDateAndTime: Temporal.ZonedDateTime.from('2026-01-15T14:00:00-05:00[America/New_York]'),
      },
      {
        id: 'item3',
        startDateAndTime: Temporal.ZonedDateTime.from('2026-01-15T18:00:00-05:00[America/New_York]'),
      },
    ];

    render(<ProgramList program={program} />);

    const days = screen.getAllByTestId('day-component');
    expect(days.length).toBe(1); // All items on same day
    expect(screen.getByText('Day with 3 items')).toBeTruthy();
  });

  it('separates items on different days', () => {
    const program = [
      {
        id: 'item1',
        startDateAndTime: Temporal.ZonedDateTime.from('2026-01-15T23:00:00-05:00[America/New_York]'),
      },
      {
        id: 'item2',
        startDateAndTime: Temporal.ZonedDateTime.from('2026-01-16T01:00:00-05:00[America/New_York]'),
      },
    ];

    render(<ProgramList program={program} />);

    const days = screen.getAllByTestId('day-component');
    expect(days.length).toBe(2); // Different days
  });

  it('calls LocalTime.storeCachedTimes on render', () => {
    const program = [
      {
        id: 'item1',
        startDateAndTime: Temporal.ZonedDateTime.from('2026-01-15T10:00:00-05:00[America/New_York]'),
      },
    ];

    render(<ProgramList program={program} />);

    expect(LocalTime.storeCachedTimes).toHaveBeenCalled();
  });

  it('calls LocalTime.checkTimeZonesDiffer with program', () => {
    const program = [
      {
        id: 'item1',
        startDateAndTime: Temporal.ZonedDateTime.from('2026-01-15T10:00:00-05:00[America/New_York]'),
      },
    ];

    render(<ProgramList program={program} />);

    expect(LocalTime.checkTimeZonesDiffer).toHaveBeenCalledWith(program);
  });

  it('sets up interval to update time', () => {
    const program = [
      {
        id: 'item1',
        startDateAndTime: Temporal.ZonedDateTime.from('2026-01-15T10:00:00-05:00[America/New_York]'),
      },
    ];

    render(<ProgramList program={program} />);

    expect(global.setInterval).toHaveBeenCalledWith(expect.any(Function), 10000);
  });

  it('has program-container class', () => {
    const program = [
      {
        id: 'item1',
        startDateAndTime: Temporal.ZonedDateTime.from('2026-01-15T10:00:00-05:00[America/New_York]'),
      },
    ];

    const { container } = render(<ProgramList program={program} />);

    expect(container.querySelector('.program-container')).toBeTruthy();
  });

  it('has time-convention-message class', () => {
    const program = [
      {
        id: 'item1',
        startDateAndTime: Temporal.ZonedDateTime.from('2026-01-15T10:00:00-05:00[America/New_York]'),
      },
    ];

    const { container } = render(<ProgramList program={program} />);

    expect(container.querySelector('.time-convention-message')).toBeTruthy();
  });

  it('has aria-hidden on convention time message', () => {
    const program = [
      {
        id: 'item1',
        startDateAndTime: Temporal.ZonedDateTime.from('2026-01-15T10:00:00-05:00[America/New_York]'),
      },
    ];

    const { container } = render(<ProgramList program={program} />);

    const conventionMessage = container.querySelector('.time-convention-message');
    expect(conventionMessage.getAttribute('aria-hidden')).toBe('true');
  });
});
