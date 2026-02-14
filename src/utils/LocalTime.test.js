import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { LocalTime } from './LocalTime';
import { Temporal } from '@js-temporal/polyfill';
import configData from '../config.json';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'local_time.prev_day': ' previous day',
        'local_time.next_day': ' next day',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
  };
})();

vi.stubGlobal('localStorage', localStorageMock);

// Mock window.navigator.language
vi.stubGlobal('navigator', {
  language: 'en-GB',
});

describe('LocalTime', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    
    // Reset static properties of LocalTime to initial state if possible
    // Since they are static and initialized at load, we might need to manually reset them
    LocalTime.timeSlotCache = {};
    LocalTime.conventionTimeCache = [];
    LocalTime.localTimeCache = [];
    LocalTime.getLocalTimeZone();
  });

  describe('getTimeSlot', () => {
    it('should return a new index for a new dateAndTime', () => {
      const dt = '2026-05-21T10:00:00+02:00';
      const index = LocalTime.getTimeSlot(dt);
      expect(index).toBe(0);
      expect(LocalTime.timeSlotCache[dt]).toBe(0);
    });

    it('should return the same index for the same dateAndTime', () => {
      const dt = '2026-05-21T10:00:00+02:00';
      const index1 = LocalTime.getTimeSlot(dt);
      const index2 = LocalTime.getTimeSlot(dt);
      expect(index1).toBe(index2);
    });
  });

  describe('formatTime', () => {
    it('should format time in 24h format by default (based on config or ampm param)', () => {
      const dt = Temporal.ZonedDateTime.from('2026-05-21T14:30:00+02:00[Europe/Berlin]');
      const formatted = LocalTime.formatTime(dt, false);
      // Depending on locale, but en-GB should be 14:30
      expect(formatted).toMatch(/14:30/);
    });

    it('should format time in 12h format when ampm is true', () => {
      const dt = Temporal.ZonedDateTime.from('2026-05-21T14:30:00+02:00[Europe/Berlin]');
      const formatted = LocalTime.formatTime(dt, true);
      expect(formatted).toMatch(/2:30/);
      expect(formatted).toMatch(/pm/i);
    });

    it('should include timezone code when showTimeZone is true', () => {
      const dt = Temporal.ZonedDateTime.from('2026-05-21T14:30:00+02:00[Europe/Berlin]');
      const formatted = LocalTime.formatTime(dt, false, true);
      expect(formatted).toContain(configData.TIMEZONECODE);
    });
  });

  describe('checkTimeZonesDiffer', () => {
    it('should return false for empty program', () => {
      expect(LocalTime.checkTimeZonesDiffer([])).toBe(false);
    });

    it('should return false if local timezone matches convention timezone', () => {
      // Convention is Europe/Berlin in config.json
      // Force local timezone to be Europe/Berlin
      vi.spyOn(LocalTime, 'getStoredSelectedTimeZone').mockReturnValue('Europe/Berlin');
      vi.spyOn(LocalTime, 'getStoredUseTimeZone').mockReturnValue(true);
      LocalTime.getLocalTimeZone();
      
      const program = [
        { startDateAndTime: Temporal.ZonedDateTime.from('2026-05-21T10:00:00+02:00[Europe/Berlin]') }
      ];
      expect(LocalTime.checkTimeZonesDiffer(program)).toBe(false);
    });

    it('should return true if local timezone differs from convention timezone', () => {
      // Mock local timezone to be different (e.g., UTC)
      vi.spyOn(LocalTime, 'getStoredSelectedTimeZone').mockReturnValue('UTC');
      vi.spyOn(LocalTime, 'getStoredUseTimeZone').mockReturnValue(true);
      LocalTime.getLocalTimeZone();

      const program = [
        { startDateAndTime: Temporal.ZonedDateTime.from('2026-05-21T10:00:00+02:00[Europe/Berlin]') }
      ];
      expect(LocalTime.checkTimeZonesDiffer(program)).toBe(true);
    });
  });

  describe('filterPastItems', () => {
    it('should filter items based on current time', () => {
      // Mock "Now" to be 2026-05-21T12:00:00Z
      const now = Temporal.Instant.from('2026-05-21T12:00:00Z');
      vi.spyOn(Temporal.Now, 'zonedDateTimeISO').mockReturnValue(now.toZonedDateTimeISO('UTC'));

      const program = [
        { startDateAndTime: Temporal.ZonedDateTime.from('2026-05-21T11:00:00Z[UTC]'), mins: 30 }, // Past
        { startDateAndTime: Temporal.ZonedDateTime.from('2026-05-21T13:00:00Z[UTC]'), mins: 30 }, // Future
      ];

      const filtered = LocalTime.filterPastItems(program);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].startDateAndTime.toString()).toContain('13:00');
    });
  });

  describe('isDuringCon', () => {
    it('should return true if current time is between first item start and last item end', () => {
      const now = Temporal.Instant.from('2026-05-21T12:00:00Z');
      vi.spyOn(Temporal.Now, 'zonedDateTimeISO').mockReturnValue(now.toZonedDateTimeISO('UTC'));

      const program = [
        {
          startDateAndTime: Temporal.ZonedDateTime.from('2026-05-21T10:00:00Z[UTC]'),
          endDateAndTime: Temporal.ZonedDateTime.from('2026-05-21T11:00:00Z[UTC]')
        },
        {
          startDateAndTime: Temporal.ZonedDateTime.from('2026-05-21T13:00:00Z[UTC]'),
          endDateAndTime: Temporal.ZonedDateTime.from('2026-05-21T14:00:00Z[UTC]')
        },
      ];

      expect(LocalTime.isDuringCon(program)).toBe(true);
    });

    it('should return false if current time is before convention', () => {
      const now = Temporal.Instant.from('2026-05-21T09:00:00Z');
      vi.spyOn(Temporal.Now, 'zonedDateTimeISO').mockReturnValue(now.toZonedDateTimeISO('UTC'));

      const program = [
        {
          startDateAndTime: Temporal.ZonedDateTime.from('2026-05-21T10:00:00Z[UTC]'),
          endDateAndTime: Temporal.ZonedDateTime.from('2026-05-21T11:00:00Z[UTC]')
        }
      ];

      expect(LocalTime.isDuringCon(program)).toBe(false);
    });
  });

  describe('formatTimeInLocalTimeZone', () => {
    beforeEach(() => {
      LocalTime.localTimeCache = [];
    });

    it('should format time without day label when local and convention times are on same day', () => {
      // Convention time: 2026-05-21 14:00 in Europe/Berlin (UTC+2)
      // Set local timezone to Europe/Berlin (same timezone)
      vi.spyOn(LocalTime, 'getStoredSelectedTimeZone').mockReturnValue('Europe/Berlin');
      vi.spyOn(LocalTime, 'getStoredUseTimeZone').mockReturnValue(true);
      LocalTime.getLocalTimeZone();

      const dt = Temporal.ZonedDateTime.from('2026-05-21T14:00:00+02:00[Europe/Berlin]');
      const timeSlot = LocalTime.getTimeSlot(dt.toString());
      const formatted = LocalTime.formatTimeInLocalTimeZone(timeSlot, dt, false, false);

      expect(formatted).toMatch(/14:00/);
      expect(formatted).not.toContain('previous day');
      expect(formatted).not.toContain('next day');
    });

    it('should append "previous day" label when local time is on previous day', () => {
      // Convention time: 2026-05-21 02:00 in Europe/Berlin (UTC+2)
      // Local timezone: America/Los_Angeles (UTC-7)
      // This converts to 2026-05-20 17:00 in LA (previous day)
      vi.spyOn(LocalTime, 'getStoredSelectedTimeZone').mockReturnValue('America/Los_Angeles');
      vi.spyOn(LocalTime, 'getStoredUseTimeZone').mockReturnValue(true);
      LocalTime.getLocalTimeZone();

      const dt = Temporal.ZonedDateTime.from('2026-05-21T02:00:00+02:00[Europe/Berlin]');
      const timeSlot = LocalTime.getTimeSlot(dt.toString());
      const formatted = LocalTime.formatTimeInLocalTimeZone(timeSlot, dt, false, false);

      expect(formatted).toContain('previous day');
      expect(formatted).toMatch(/17:00/);
    });

    it('should append "next day" label when local time is on next day', () => {
      // Convention time: 2026-05-21 23:00 in Europe/Berlin (UTC+2)
      // Local timezone: Asia/Tokyo (UTC+9)
      // This converts to 2026-05-22 06:00 in Tokyo (next day)
      vi.spyOn(LocalTime, 'getStoredSelectedTimeZone').mockReturnValue('Asia/Tokyo');
      vi.spyOn(LocalTime, 'getStoredUseTimeZone').mockReturnValue(true);
      LocalTime.getLocalTimeZone();

      const dt = Temporal.ZonedDateTime.from('2026-05-21T23:00:00+02:00[Europe/Berlin]');
      const timeSlot = LocalTime.getTimeSlot(dt.toString());
      const formatted = LocalTime.formatTimeInLocalTimeZone(timeSlot, dt, false, false);

      expect(formatted).toContain('next day');
      expect(formatted).toMatch(/6:00/);
    });

    it('should work correctly with 12-hour format and timezone', () => {
      // Test with ampm=true and showTimeZone=true
      vi.spyOn(LocalTime, 'getStoredSelectedTimeZone').mockReturnValue('America/New_York');
      vi.spyOn(LocalTime, 'getStoredUseTimeZone').mockReturnValue(true);
      LocalTime.getLocalTimeZone();

      const dt = Temporal.ZonedDateTime.from('2026-05-21T01:00:00+02:00[Europe/Berlin]');
      const timeSlot = LocalTime.getTimeSlot(dt.toString());
      const formatted = LocalTime.formatTimeInLocalTimeZone(timeSlot, dt, true, true);

      // 01:00 Berlin = 19:00 (7pm) NY previous day
      expect(formatted).toContain('previous day');
      expect(formatted).toMatch(/7:00/);
      expect(formatted).toMatch(/pm/i);
    });

    it('should use cached values on subsequent calls', () => {
      vi.spyOn(LocalTime, 'getStoredSelectedTimeZone').mockReturnValue('Europe/Berlin');
      vi.spyOn(LocalTime, 'getStoredUseTimeZone').mockReturnValue(true);
      LocalTime.getLocalTimeZone();

      const dt = Temporal.ZonedDateTime.from('2026-05-21T14:00:00+02:00[Europe/Berlin]');
      const timeSlot = LocalTime.getTimeSlot(dt.toString());

      const formatted1 = LocalTime.formatTimeInLocalTimeZone(timeSlot, dt, false, false);
      const formatted2 = LocalTime.formatTimeInLocalTimeZone(timeSlot, dt, false, false);

      expect(formatted1).toBe(formatted2);
      expect(LocalTime.localTimeCache[timeSlot]).toBeDefined();
    });

    it('should handle edge case at midnight boundary', () => {
      // Convention time: 2026-05-21 00:00 in Europe/Berlin
      // Local timezone: UTC (2 hours behind)
      // This converts to 2026-05-20 22:00 UTC (previous day)
      vi.spyOn(LocalTime, 'getStoredSelectedTimeZone').mockReturnValue('UTC');
      vi.spyOn(LocalTime, 'getStoredUseTimeZone').mockReturnValue(true);
      LocalTime.getLocalTimeZone();

      const dt = Temporal.ZonedDateTime.from('2026-05-21T00:00:00+02:00[Europe/Berlin]');
      const timeSlot = LocalTime.getTimeSlot(dt.toString());
      const formatted = LocalTime.formatTimeInLocalTimeZone(timeSlot, dt, false, false);

      expect(formatted).toContain('previous day');
      expect(formatted).toMatch(/22:00/);
    });
  });
});
