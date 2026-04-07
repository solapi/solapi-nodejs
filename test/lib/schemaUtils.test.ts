import {Schema} from 'effect';
import * as Effect from 'effect/Effect';
import {describe, expect, it} from 'vitest';
import {BadRequestError, InvalidDateError} from '@/errors/defaultError';
import {
  decodeWithBadRequest,
  safeDateTransfer,
  safeFinalize,
  safeFormatWithTransfer,
} from '@/lib/schemaUtils';

const testSchema = Schema.Struct({
  name: Schema.String,
  age: Schema.Number,
});

describe('decodeWithBadRequest', () => {
  it('should decode valid data successfully', () => {
    const result = Effect.runSync(
      decodeWithBadRequest(testSchema, {name: 'Alice', age: 30}),
    );
    expect(result).toEqual({name: 'Alice', age: 30});
  });

  it('should return BadRequestError for invalid data', () => {
    const result = Effect.runSync(
      Effect.either(decodeWithBadRequest(testSchema, {name: 123})),
    );
    expect(result._tag).toBe('Left');
    if (result._tag === 'Left') {
      expect(result.left).toBeInstanceOf(BadRequestError);
    }
  });

  it('should return BadRequestError for null input', () => {
    const result = Effect.runSync(
      Effect.either(decodeWithBadRequest(testSchema, null)),
    );
    expect(result._tag).toBe('Left');
  });
});

describe('safeDateTransfer', () => {
  it('should convert valid ISO string to Date', () => {
    const result = Effect.runSync(safeDateTransfer('2024-01-15T00:00:00'));
    expect(result).toBeInstanceOf(Date);
    expect(result!.getFullYear()).toBe(2024);
  });

  it('should return Date object unchanged', () => {
    const date = new Date('2024-06-15');
    const result = Effect.runSync(safeDateTransfer(date));
    expect(result).toBe(date);
  });

  it('should return undefined for undefined input', () => {
    const result = Effect.runSync(safeDateTransfer(undefined));
    expect(result).toBeUndefined();
  });

  it('should return InvalidDateError for invalid date string', () => {
    const result = Effect.runSync(
      Effect.either(safeDateTransfer('not-a-date')),
    );
    expect(result._tag).toBe('Left');
    if (result._tag === 'Left') {
      expect(result.left).toBeInstanceOf(InvalidDateError);
      expect(result.left.originalValue).toBe('not-a-date');
    }
  });
});

describe('safeFormatWithTransfer', () => {
  it('should format valid Date to ISO string', () => {
    const date = new Date('2024-01-15T12:00:00Z');
    const result = Effect.runSync(safeFormatWithTransfer(date));
    expect(typeof result).toBe('string');
    expect(result).toContain('2024-01-15');
  });

  it('should format valid ISO string', () => {
    const result = Effect.runSync(safeFormatWithTransfer('2024-01-15'));
    expect(typeof result).toBe('string');
    expect(result).toContain('2024-01-15');
  });

  it('should return InvalidDateError for invalid date string', () => {
    const result = Effect.runSync(
      Effect.either(safeFormatWithTransfer('not-a-date')),
    );
    expect(result._tag).toBe('Left');
    if (result._tag === 'Left') {
      expect(result.left).toBeInstanceOf(InvalidDateError);
    }
  });
});

describe('safeFinalize', () => {
  it('should return value from successful function', () => {
    const result = Effect.runSync(safeFinalize(() => ({key: 'value'})));
    expect(result).toEqual({key: 'value'});
  });

  it('should return BadRequestError for generic thrown error', () => {
    const result = Effect.runSync(
      Effect.either(
        safeFinalize(() => {
          throw new Error('generic error');
        }),
      ),
    );
    expect(result._tag).toBe('Left');
    if (result._tag === 'Left') {
      expect(result.left).toBeInstanceOf(BadRequestError);
    }
  });

  it('should preserve InvalidDateError instead of wrapping as BadRequestError', () => {
    const result = Effect.runSync(
      Effect.either(
        safeFinalize(() => {
          throw new InvalidDateError({
            message: 'Invalid Date',
            originalValue: 'bad-date',
          });
        }),
      ),
    );
    expect(result._tag).toBe('Left');
    if (result._tag === 'Left') {
      expect(result.left).toBeInstanceOf(InvalidDateError);
      expect((result.left as InvalidDateError).originalValue).toBe('bad-date');
    }
  });

  it('should handle non-Error thrown values', () => {
    const result = Effect.runSync(
      Effect.either(
        safeFinalize(() => {
          throw 'string error';
        }),
      ),
    );
    expect(result._tag).toBe('Left');
    if (result._tag === 'Left') {
      expect(result.left).toBeInstanceOf(BadRequestError);
    }
  });
});
