import {describe, expect, it} from '@effect/vitest';
import stringifyQuery from '@/lib/stringifyQuery';

describe('stringifyQuery', () => {
  it('should return empty string for null or undefined', () => {
    expect(stringifyQuery(null)).toBe('');
    expect(stringifyQuery(undefined)).toBe('');
  });

  it('should return empty string for empty object', () => {
    expect(stringifyQuery({})).toBe('');
  });

  it('should return query string with ? prefix by default', () => {
    const result = stringifyQuery({limit: 1, status: 'active'});
    expect(result).toBe('?limit=1&status=active');
  });

  it('should return query string without ? prefix when addQueryPrefix is false', () => {
    const result = stringifyQuery(
      {limit: 1, status: 'active'},
      {addQueryPrefix: false},
    );
    expect(result).toBe('limit=1&status=active');
  });

  it('should return query string with ? prefix when addQueryPrefix is true (explicit)', () => {
    const result = stringifyQuery(
      {limit: 1, status: 'active'},
      {addQueryPrefix: true},
    );
    expect(result).toBe('?limit=1&status=active');
  });

  it('should handle arrays with indices by default', () => {
    const result = stringifyQuery({tags: ['tag1', 'tag2']});
    expect(result).toBe('?tags[0]=tag1&tags[1]=tag2');
  });

  it('should handle arrays without indices when indices is false', () => {
    const result = stringifyQuery({tags: ['tag1', 'tag2']}, {indices: false});
    expect(result).toBe('?tags=tag1&tags=tag2');
  });

  it('should handle arrays without indices and without prefix when both options are set', () => {
    const result = stringifyQuery(
      {tags: ['tag1', 'tag2']},
      {indices: false, addQueryPrefix: false},
    );
    expect(result).toBe('tags=tag1&tags=tag2');
  });

  it('should handle special characters properly', () => {
    const result = stringifyQuery({message: 'hello world', symbol: '&='});
    expect(result).toBe('?message=hello%20world&symbol=%26%3D');
  });

  it('should ignore null and undefined values', () => {
    const result = stringifyQuery({
      limit: 1,
      nullValue: null,
      undefinedValue: undefined,
      status: 'active',
    });
    expect(result).toBe('?limit=1&status=active');
  });
});
