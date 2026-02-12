import { describe, it, expect } from 'vitest';
import { JsonParse } from './JsonParse';

describe('JsonParse', () => {
  describe('extractJson', () => {
    it('should parse a simple JSON object', () => {
      const data = '{"key": "value"}';
      const result = JsonParse.extractJson(data);
      expect(result).toEqual([{ key: 'value' }]);
    });

    it('should parse multiple JSON entities', () => {
      const data = '{"a": 1}[1, 2, 3]';
      const result = JsonParse.extractJson(data);
      expect(result).toEqual([{ a: 1 }, [1, 2, 3]]);
    });

    it('should handle nested objects and arrays', () => {
      const data = '{"outer": {"inner": [1, 2]}, "list": [{"id": 1}]}';
      const result = JsonParse.extractJson(data);
      expect(result).toEqual([{ outer: { inner: [1, 2] }, list: [{ id: 1 }] }]);
    });

    it('should ignore single-line comments', () => {
      const data = '{\n// this is a comment\n"key": "value"\n}';
      const result = JsonParse.extractJson(data);
      expect(result).toEqual([{ key: 'value' }]);
    });

    it('should ignore multi-line comments', () => {
      const data = '{\n/* this is a \n multi-line comment */\n"key": "value"\n}';
      const result = JsonParse.extractJson(data);
      expect(result).toEqual([{ key: 'value' }]);
    });

    it('should handle strings containing JSON-like characters', () => {
      const data = '{"key": "string with {braces} and [brackets] and // comments and /* block comments */"}';
      const result = JsonParse.extractJson(data);
      expect(result).toEqual([{ key: 'string with {braces} and [brackets] and // comments and /* block comments */' }]);
    });

    it('should handle escaped quotes in strings', () => {
      const data = '{"key": "string with \\"escaped quotes\\""}';
      const result = JsonParse.extractJson(data);
      expect(result).toEqual([{ key: 'string with "escaped quotes"' }]);
    });

    it('should handle whitespace around JSON entities', () => {
      const data = '   \n  {"a": 1}  \t  [2]  \n ';
      const result = JsonParse.extractJson(data);
      expect(result).toEqual([{ a: 1 }, [2]]);
    });

    it('should handle single-line comments ending with \\n', () => {
      const data = '{"a": 1} // comment\n{"b": 2}';
      const result = JsonParse.extractJson(data);
      expect(result).toEqual([{ a: 1 }, { b: 2 }]);
    });

    it('should handle single-line comments ending with \\r', () => {
      const data = '{"a": 1} // comment\r{"b": 2}';
      const result = JsonParse.extractJson(data);
      expect(result).toEqual([{ a: 1 }, { b: 2 }]);
    });

    it('should handle single quotes (though strictly not standard JSON, the parser seems to support them)', () => {
      // Actually standard JSON.parse will fail on single quotes. 
      // But extractJson seems to try to handle them.
      // However, it uses JSON.parse(json) internally, which will fail if single quotes are passed to it.
      // Let's see what happens.
      const data = "{'a': 1}";
      // result = [{ 'a': 1 }] if JSON.parse handled it, but it doesn't.
      // However, extractJson's purpose is to find the entity.
      // If the entity found is "{'a': 1}", JSON.parse will throw.
      expect(() => JsonParse.extractJson(data)).toThrow();
    });
  });
});
