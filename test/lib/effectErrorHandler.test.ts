import {Effect} from 'effect';
import {describe, expect, it} from 'vitest';
import {
  ApiKeyError,
  BadRequestError,
  UnexpectedDefectError,
  UnhandledExitError,
} from '../../src/errors/defaultError';
import {runSafePromise} from '../../src/lib/effectErrorHandler';

describe('runSafePromise', () => {
  it('should resolve on success', async () => {
    const result = await runSafePromise(Effect.succeed('ok'));
    expect(result).toBe('ok');
  });

  it('should reject with original TaggedError on expected failure', async () => {
    const effect = Effect.fail(new ApiKeyError({message: 'bad key'}));
    await expect(runSafePromise(effect)).rejects.toThrow('bad key');
    try {
      await runSafePromise(effect);
    } catch (e) {
      expect((e as ApiKeyError)._tag).toBe('ApiKeyError');
      expect(e).toBeInstanceOf(Error);
    }
  });

  it('should reject with BadRequestError preserving original fields', async () => {
    const effect = Effect.fail(new BadRequestError({message: '잘못된 요청'}));
    try {
      await runSafePromise(effect);
    } catch (e) {
      const err = e as BadRequestError;
      expect(err._tag).toBe('BadRequestError');
      expect(err.message).toBe('잘못된 요청');
    }
  });

  it('should reject with UnexpectedDefectError for non-Error defects', async () => {
    const effect = Effect.die({weird: 'object'});
    try {
      await runSafePromise(effect);
    } catch (e) {
      expect((e as UnexpectedDefectError)._tag).toBe('UnexpectedDefectError');
    }
  });

  it('should handle defect with non-string _tag as generic object', async () => {
    expect.assertions(2);
    const effect = Effect.die({_tag: 42, message: 'numeric tag'});
    try {
      await runSafePromise(effect);
    } catch (e) {
      const err = e as UnexpectedDefectError;
      expect(err._tag).toBe('UnexpectedDefectError');
      expect(err.message).not.toContain('Tagged Error');
    }
  });

  it('should handle tagged defect without message property', async () => {
    expect.assertions(2);
    const effect = Effect.die({_tag: 'CustomTag'});
    try {
      await runSafePromise(effect);
    } catch (e) {
      const err = e as UnexpectedDefectError;
      expect(err._tag).toBe('UnexpectedDefectError');
      expect(err.message).toContain('CustomTag');
    }
  });

  it('should reject with original Error for Error defects', async () => {
    const originalError = new RangeError('out of range');
    const effect = Effect.die(originalError);
    try {
      await runSafePromise(effect);
    } catch (e) {
      expect(e).toBe(originalError);
      expect(e).toBeInstanceOf(RangeError);
    }
  });

  it('should reject with UnhandledExitError for interrupted effects', async () => {
    const effect = Effect.interrupt;
    try {
      await runSafePromise(effect);
    } catch (e) {
      expect((e as UnhandledExitError)._tag).toBe('UnhandledExitError');
      expect(e).toBeInstanceOf(Error);
    }
  });
});
