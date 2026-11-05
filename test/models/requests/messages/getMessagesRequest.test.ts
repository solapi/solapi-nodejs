import {Either, Schema} from 'effect';
import {describe, expect, it} from 'vitest';
import {InvalidDateError} from '@/errors/defaultError';
import {
  finalizeGetMessagesRequest,
  getMessagesRequestSchema,
} from '@/models/requests/messages/getMessagesRequest';

describe('getMessagesRequestSchema', () => {
  it('should accept valid request with dateType and startDate', () => {
    const result = Schema.decodeUnknownSync(getMessagesRequestSchema)({
      dateType: 'CREATED',
      startDate: '2024-01-01',
    });
    expect(result.dateType).toBe('CREATED');
    expect(result.startDate).toBe('2024-01-01');
  });

  it('should accept request with startDate only (no dateType)', () => {
    const result = Schema.decodeUnknownSync(getMessagesRequestSchema)({
      startDate: '2024-01-01',
    });
    expect(result.startDate).toBe('2024-01-01');
    expect(result.dateType).toBeUndefined();
  });

  it('should reject dateType without startDate or endDate', () => {
    expect(() => {
      Schema.decodeUnknownSync(getMessagesRequestSchema)({
        dateType: 'CREATED',
      });
    }).toThrow();
  });

  it('should accept empty request', () => {
    const result = Schema.decodeUnknownSync(getMessagesRequestSchema)({});
    expect(result).toBeDefined();
  });

  it('should accept request with Date object', () => {
    const date = new Date('2024-06-15');
    const result = Schema.decodeUnknownSync(getMessagesRequestSchema)({
      startDate: date,
    });
    expect(result.startDate).toBe(date);
  });

  it('should reject invalid dateType value', () => {
    expect(() => {
      Schema.decodeUnknownSync(getMessagesRequestSchema)({
        dateType: 'INVALID',
        startDate: '2024-01-01',
      });
    }).toThrow();
  });
});

describe('finalizeGetMessagesRequest', () => {
  it('should return empty object for undefined input', () => {
    expect(finalizeGetMessagesRequest(undefined)).toEqual({});
  });

  it('should default dateType to CREATED when dates are present', () => {
    const input = Schema.decodeUnknownSync(getMessagesRequestSchema)({
      startDate: '2024-01-15',
    });
    const result = finalizeGetMessagesRequest(input);
    expect(result.dateType).toBe('CREATED');
  });

  it('should preserve explicit dateType', () => {
    const input = Schema.decodeUnknownSync(getMessagesRequestSchema)({
      dateType: 'UPDATED',
      startDate: '2024-01-15',
    });
    const result = finalizeGetMessagesRequest(input);
    expect(result.dateType).toBe('UPDATED');
  });

  it('should format startDate and endDate as ISO strings', () => {
    const input = Schema.decodeUnknownSync(getMessagesRequestSchema)({
      startDate: '2024-01-15',
      endDate: '2024-02-15',
    });
    const result = finalizeGetMessagesRequest(input);
    expect(result.startDate).toContain('2024-01-15');
    expect(result.endDate).toContain('2024-02-15');
  });

  it('should throw InvalidDateError for invalid date string', () => {
    const input = Schema.decodeUnknownSync(getMessagesRequestSchema)({
      startDate: 'not-a-date',
    });
    expect(() => finalizeGetMessagesRequest(input)).toThrow(InvalidDateError);
  });

  it('should pass through non-date fields unchanged', () => {
    const input = Schema.decodeUnknownSync(getMessagesRequestSchema)({
      messageId: 'MSG123',
      groupId: 'GRP456',
      limit: 50,
      startKey: 'key123',
    });
    const result = finalizeGetMessagesRequest(input);
    expect(result.messageId).toBe('MSG123');
    expect(result.groupId).toBe('GRP456');
    expect(result.limit).toBe(50);
    expect(result.startKey).toBe('key123');
  });
});

describe('getMessagesRequestSchema advanced search (#183)', () => {
  const decode = Schema.decodeUnknownEither(getMessagesRequestSchema);

  it('should accept matching criteria, cond and value arrays', () => {
    const result = decode({
      criteria: ['type', 'statusCode'],
      cond: ['eq', 'eq'],
      value: ['SMS', '2000'],
    });
    expect(Either.isRight(result)).toBe(true);
  });

  it('should accept a single string for each field', () => {
    const result = decode({criteria: 'to', cond: 'eq', value: '01000000000'});
    expect(Either.isRight(result)).toBe(true);
  });

  const rejected: Array<[unknown, string]> = [
    [{criteria: ['type'], cond: ['eq']}, 'value 누락'],
    [{criteria: ['type'], cond: ['eq', 'ne'], value: ['SMS']}, '개수 불일치'],
    [
      {criteria: ['type'], cond: ['like'], value: ['SMS']},
      '허용되지 않는 cond',
    ],
    [
      {criteria: ['text'], cond: ['eq'], value: ['hi']},
      '허용되지 않는 criteria',
    ],
    [{criteria: ['to'], cond: ['eq'], value: ['010,020']}, 'value 에 쉼표'],
  ];
  it.each(rejected)('should reject %j (%s)', input => {
    expect(Either.isLeft(decode(input))).toBe(true);
  });

  it('should accept an empty criteria set', () => {
    expect(Either.isRight(decode({criteria: [], cond: [], value: []}))).toBe(
      true,
    );
  });
});

describe('finalizeGetMessagesRequest advanced search (#183)', () => {
  it('should join criteria, cond and value with commas', () => {
    const payload = finalizeGetMessagesRequest({
      limit: 5,
      criteria: ['type', 'dateCreated'],
      cond: ['eq', 'gte'],
      value: ['SMS', '2026-11-05'],
    });
    expect(payload.criteria).toBe('type,dateCreated');
    expect(payload.cond).toBe('eq,gte');
    expect(payload.value).toBe('SMS,2026-11-05');
    expect(payload.limit).toBe(5);
  });

  it('should pass single strings through unchanged', () => {
    const payload = finalizeGetMessagesRequest({
      criteria: 'groupId',
      cond: 'eq',
      value: 'G4V0',
    });
    expect(payload).toMatchObject({
      criteria: 'groupId',
      cond: 'eq',
      value: 'G4V0',
    });
  });

  it('should omit search keys when criteria is empty', () => {
    const payload = finalizeGetMessagesRequest({limit: 1});
    expect(payload).not.toHaveProperty('criteria');
    expect(payload).not.toHaveProperty('cond');
    expect(payload).not.toHaveProperty('value');
  });
});
