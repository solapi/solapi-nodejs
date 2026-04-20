import {describe, expect, it} from 'vitest';
import {isErrorResponse} from '@/errors/defaultError';

describe('isErrorResponse', () => {
  it('should return true for valid ErrorResponse', () => {
    expect(
      isErrorResponse({errorCode: 'BadRequest', errorMessage: 'Invalid param'}),
    ).toBe(true);
  });

  it('should return true with extra fields', () => {
    expect(
      isErrorResponse({
        errorCode: 'NotFound',
        errorMessage: 'Not found',
        extra: 123,
      }),
    ).toBe(true);
  });

  it('should return false for null', () => {
    expect(isErrorResponse(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isErrorResponse(undefined)).toBe(false);
  });

  it.each([
    0,
    1,
    '',
    'string',
    true,
    false,
  ])('should return false for primitive: %s', value => {
    expect(isErrorResponse(value)).toBe(false);
  });

  it('should return false for array', () => {
    expect(isErrorResponse([])).toBe(false);
    expect(isErrorResponse(['errorCode', 'errorMessage'])).toBe(false);
  });

  it('should return false when errorCode is missing', () => {
    expect(isErrorResponse({errorMessage: 'msg'})).toBe(false);
  });

  it('should return false when errorMessage is missing', () => {
    expect(isErrorResponse({errorCode: 'code'})).toBe(false);
  });

  it('should return false when both fields are missing', () => {
    expect(isErrorResponse({})).toBe(false);
  });

  it('should return false when errorCode is not a string', () => {
    expect(isErrorResponse({errorCode: 123, errorMessage: 'msg'})).toBe(false);
  });

  it('should return false when errorMessage is not a string', () => {
    expect(isErrorResponse({errorCode: 'code', errorMessage: null})).toBe(
      false,
    );
  });

  it('should reject empty errorCode string', () => {
    expect(isErrorResponse({errorCode: '', errorMessage: 'msg'})).toBe(false);
  });

  it('should reject empty errorMessage string', () => {
    expect(isErrorResponse({errorCode: 'code', errorMessage: ''})).toBe(false);
  });

  it('should reject both empty strings', () => {
    expect(isErrorResponse({errorCode: '', errorMessage: ''})).toBe(false);
  });
});
