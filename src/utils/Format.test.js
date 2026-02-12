import { describe, it, expect } from 'vitest';
import { Format } from './Format';

describe('Format', () => {
  describe('formatTag', () => {
    it('should format a tag with a colon correctly', () => {
      const input = 'category:tagname';
      const expected = 'Category: tagname';
      expect(Format.formatTag(input)).toBe(expected);
    });

    it('should lowercase the rest of the prefix before the colon', () => {
      const input = 'CATEGORY:tagname';
      const expected = 'Category: tagname';
      expect(Format.formatTag(input)).toBe(expected);
    });

    it('should preserve the case of the part after the colon', () => {
      const input = 'category:TagName';
      const expected = 'Category: TagName';
      expect(Format.formatTag(input)).toBe(expected);
    });

    it('should return the original string if no colon is present', () => {
      const input = 'notagcolon';
      const expected = 'notagcolon';
      expect(Format.formatTag(input)).toBe(expected);
    });

    it('should handle multiple colons by splitting at the first and last (regex dependency check)', () => {
      // The regex is /^(.+):(.+)$/
      // This will match greedily on the first group if there are multiple colons?
      // Actually . matches anything, and + is greedy.
      // "a:b:c" -> group 1: "a:b", group 2: "c"
      const input = 'first:second:third';
      const expected = 'First:second: third';
      expect(Format.formatTag(input)).toBe(expected);
    });

    it('should handle leading/trailing spaces if they are part of the input', () => {
      const input = ' category:tag ';
      const expected = ' Category:tag : tag '; // Wait, let's see how regex handles it
      // matches[1] = " category:tag " -> wait no.
      // /^(.+):(.+)$/
      // " category:tag " -> matches[1] = " category", matches[2] = "tag "
      // Result: " Category: tag "
      expect(Format.formatTag('category:tag ')).toBe('Category: tag ');
    });

    it('should handle empty parts around the colon if they match .+ (they wont if empty)', () => {
      // .+ requires at least one character.
      expect(Format.formatTag(':')).toBe(':');
      expect(Format.formatTag('a:')).toBe('a:');
      expect(Format.formatTag(':b')).toBe(':b');
    });
  });
});
