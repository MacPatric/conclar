import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { LocalTime } from './LocalTime';
import { Temporal } from '@js-temporal/polyfill';
import configData from '../config.json';

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
});
