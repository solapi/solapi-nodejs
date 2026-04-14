import {Effect} from 'effect';
import {describe, expect, it} from 'vitest';
import {
  ApiKeyError,
  BadRequestError,
  UnexpectedDefectError,
  UnhandledExitError,
} from '../../src/errors/defaultError';
import {runSafePromise, runSafeSync} from '../../src/lib/effectErrorHandler';

describe('runSafeSync', () => {
  it('should return value on success', () => {
    const result = runSafeSync(Effect.succeed(42));
    expect(result).toBe(42);
  });

  it('should throw original TaggedError on expected failure', () => {
    const effect = Effect.fail(new BadRequestError({message: '잘못된 요청'}));
    expect(() => runSafeSync(effect)).toThrow('잘못된 요청');
    try {
      runSafeSync(effect);
    } catch (e) {
      expect((e as BadRequestError)._tag).toBe('BadRequestError');
    }
  });

  it('should throw UnexpectedDefectError for non-Error defects', () => {
    const effect = Effect.die('unexpected string defect');
    try {
      runSafeSync(effect);
    } catch (e) {
      expect((e as UnexpectedDefectError)._tag).toBe('UnexpectedDefectError');
    }
  });

  it('should handle defect with non-string _tag as generic object', () => {
    expect.assertions(2);
    const effect = Effect.die({_tag: 42, message: 'numeric tag'});
    try {
      runSafeSync(effect);
    } catch (e) {
      const err = e as UnexpectedDefectError;
      expect(err._tag).toBe('UnexpectedDefectError');
      expect(err.message).not.toContain('Tagged Error');
    }
  });

  it('should handle tagged defect without message property', () => {
    expect.assertions(2);
    const effect = Effect.die({_tag: 'CustomTag'});
    try {
      runSafeSync(effect);
    } catch (e) {
      const err = e as UnexpectedDefectError;
      expect(err._tag).toBe('UnexpectedDefectError');
      expect(err.message).toContain('CustomTag');
    }
  });

  it('should throw original Error for Error defects', () => {
    const originalError = new TypeError('type mismatch');
    const effect = Effect.die(originalError);
    expect(() => runSafeSync(effect)).toThrow(originalError);
  });

  it('should throw UnhandledExitError for interrupted effects', () => {
    const effect = Effect.interrupt;
    try {
      runSafeSync(effect);
    } catch (e) {
      expect((e as UnhandledExitError)._tag).toBe('UnhandledExitError');
      expect(e).toBeInstanceOf(Error);
    }
  });
});

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

  it('should reject with UnexpectedDefectError for non-Error defects', async () => {
    const effect = Effect.die({weird: 'object'});
    try {
      await runSafePromise(effect);
    } catch (e) {
      expect((e as UnexpectedDefectError)._tag).toBe('UnexpectedDefectError');
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
