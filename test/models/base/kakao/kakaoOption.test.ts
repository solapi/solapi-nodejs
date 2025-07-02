import {
  baseKakaoOptionSchema,
  transformVariables,
  validateVariableNames,
  VariableValidationError,
} from '@models/base/kakao/kakaoOption';
import {Effect, Schema} from 'effect';
import {describe, expect, it} from 'vitest';

describe('KakaoOption variables validation', () => {
  it('should provide clear error message for specific variable with dot', () => {
    const invalidData = {
      pfId: 'test-pf-id',
      variables: {
        '#{user.name}': 'John Doe',
        '#{valid_var}': 'Valid Value',
      },
    };

    expect(() => {
      Schema.decodeUnknownSync(baseKakaoOptionSchema)(invalidData);
    }).toThrow(
      '변수명 `user.name`에 점(.)을 포함할 수 없습니다. 언더스코어(_)나 다른 문자를 사용해주세요.',
    );
  });

  it('should provide clear error message for multiple variables with dots', () => {
    const invalidData = {
      pfId: 'test-pf-id',
      variables: {
        '총결제.금액': '10000',
        'user.email': 'test@example.com',
        valid_var: 'Valid Value',
      },
    };

    expect(() => {
      Schema.decodeUnknownSync(baseKakaoOptionSchema)(invalidData);
    }).toThrow(
      '변수명 `총결제.금액`, `user.email`에 점(.)을 포함할 수 없습니다. 언더스코어(_)나 다른 문자를 사용해주세요.',
    );
  });

  it('should reject variable names containing dots', () => {
    const invalidData = {
      pfId: 'test-pf-id',
      variables: {
        '#{user.name}': 'John Doe',
        '#{valid_var}': 'Valid Value',
      },
    };

    expect(() => {
      Schema.decodeUnknownSync(baseKakaoOptionSchema)(invalidData);
    }).toThrow();
  });

  it('should accept variable names without dots', () => {
    const validData = {
      pfId: 'test-pf-id',
      variables: {
        '#{user_name}': 'John Doe',
        '#{valid_var}': 'Valid Value',
      },
    };

    const result = Schema.decodeUnknownEither(baseKakaoOptionSchema)(validData);
    expect(result._tag).toBe('Right');
  });

  it('should accept variable names with underscores and numbers', () => {
    const validData = {
      pfId: 'test-pf-id',
      variables: {
        '#{user_name_123}': 'John Doe',
        '#{valid_var2}': 'Valid Value',
      },
    };

    const result = Schema.decodeUnknownEither(baseKakaoOptionSchema)(validData);
    expect(result._tag).toBe('Right');
  });

  it('should automatically format variable names without #{} wrapper', () => {
    const inputData = {
      pfId: 'test-pf-id',
      variables: {
        user_name: 'John Doe',
        valid_var: 'Valid Value',
      },
    };

    const result = Schema.decodeUnknownSync(baseKakaoOptionSchema)(inputData);
    expect(result.variables).toEqual({
      '#{user_name}': 'John Doe',
      '#{valid_var}': 'Valid Value',
    });
  });

  it('should reject variable names containing dots even without #{} wrapper', () => {
    const invalidData = {
      pfId: 'test-pf-id',
      variables: {
        'user.name': 'John Doe',
        valid_var: 'Valid Value',
      },
    };

    expect(() => {
      Schema.decodeUnknownSync(baseKakaoOptionSchema)(invalidData);
    }).toThrow();
  });
});

describe('Effect-based variable validation (new functionality)', () => {
  it('should validate variables and return Effect Success for valid input', async () => {
    const validVariables = {
      user_name: 'John Doe',
      valid_var: 'Valid Value',
      '#{formatted_var}': 'Already Formatted',
    };

    const result = await Effect.runPromise(
      validateVariableNames(validVariables),
    );

    expect(result).toEqual(validVariables);
  });

  it('should validate variables and return Effect Failure for invalid input', async () => {
    const invalidVariables = {
      'user.name': 'John Doe',
      'user.email': 'john@example.com',
      valid_var: 'Valid Value',
    };

    const result = await Effect.runPromise(
      Effect.either(validateVariableNames(invalidVariables)),
    );

    expect(result._tag).toBe('Left');
    if (result._tag === 'Left') {
      expect(result.left).toBeInstanceOf(VariableValidationError);
      expect(result.left.invalidVariables).toEqual(['user.name', 'user.email']);
      expect(result.left.toString()).toContain(
        '변수명 `user.name`, `user.email`에 점(.)을 포함할 수 없습니다',
      );
    }
  });

  it('should transform variables efficiently using Effect pipeline', async () => {
    const inputVariables = {
      user_name: 'John Doe',
      email: 'john@example.com',
      '#{already_formatted}': 'Already Formatted',
    };

    const result = await Effect.runPromise(transformVariables(inputVariables));

    expect(result).toEqual({
      '#{user_name}': 'John Doe',
      '#{email}': 'john@example.com',
      '#{already_formatted}': 'Already Formatted',
    });
  });

  it('should fail transformation for variables with dots', async () => {
    const invalidVariables = {
      'user.name': 'John Doe',
      valid_var: 'Valid Value',
    };

    const result = await Effect.runPromise(
      Effect.either(transformVariables(invalidVariables)),
    );

    expect(result._tag).toBe('Left');
    if (result._tag === 'Left') {
      expect(result.left).toBeInstanceOf(VariableValidationError);
      expect(result.left.invalidVariables).toEqual(['user.name']);
    }
  });

  it('should handle empty variables object', async () => {
    const emptyVariables = {};

    const validationResult = await Effect.runPromise(
      validateVariableNames(emptyVariables),
    );
    const transformResult = await Effect.runPromise(
      transformVariables(emptyVariables),
    );

    expect(validationResult).toEqual({});
    expect(transformResult).toEqual({});
  });

  it('should be performant with large variable sets', async () => {
    const largeVariableSet = Object.fromEntries(
      Array.from({length: 1000}, (_, i) => [`var_${i}`, `value_${i}`]),
    );

    const startTime = performance.now();
    const result = await Effect.runPromise(
      transformVariables(largeVariableSet),
    );
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(100); // Should complete in under 100ms
    expect(Object.keys(result)).toHaveLength(1000);
    expect(result['#{var_0}']).toBe('value_0');
    expect(result['#{var_999}']).toBe('value_999');
  });
});
