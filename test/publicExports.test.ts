import {Schema} from 'effect';
import {describe, expect, it} from 'vitest';
import {
  defaultMessageRequestSchema,
  osPlatform,
  sdkVersion,
} from '../src/index';

describe('public exports', () => {
  it('should keep defaultMessageRequestSchema available from the root entry point', () => {
    const decoded = Schema.decodeUnknownSync(defaultMessageRequestSchema)({
      allowDuplicates: true,
      agent: {},
    });

    expect(decoded.allowDuplicates).toBe(true);
    expect(decoded.agent?.sdkVersion).toBe(sdkVersion);
    expect(decoded.agent?.osPlatform).toBe(osPlatform);
  });
});
