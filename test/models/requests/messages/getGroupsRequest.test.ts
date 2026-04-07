import {Schema} from 'effect';
import {describe, expect, it} from 'vitest';
import {InvalidDateError} from '@/errors/defaultError';
import {
  finalizeGetGroupsRequest,
  getGroupsRequestSchema,
} from '@/models/requests/messages/getGroupsRequest';

describe('getGroupsRequestSchema', () => {
  it('should accept empty request', () => {
    const result = Schema.decodeUnknownSync(getGroupsRequestSchema)({});
    expect(result).toBeDefined();
  });

  it('should accept request with groupId', () => {
    const result = Schema.decodeUnknownSync(getGroupsRequestSchema)({
      groupId: 'GRP123',
    });
    expect(result.groupId).toBe('GRP123');
  });

  it('should accept request with date range', () => {
    const result = Schema.decodeUnknownSync(getGroupsRequestSchema)({
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    });
    expect(result.startDate).toBe('2024-01-01');
    expect(result.endDate).toBe('2024-12-31');
  });

  it('should accept Date objects', () => {
    const date = new Date('2024-06-15');
    const result = Schema.decodeUnknownSync(getGroupsRequestSchema)({
      startDate: date,
    });
    expect(result.startDate).toBe(date);
  });
});

describe('finalizeGetGroupsRequest', () => {
  it('should return empty object for undefined input', () => {
    expect(finalizeGetGroupsRequest(undefined)).toEqual({});
  });

  it('should transform groupId into criteria/cond/value triplet', () => {
    const input = Schema.decodeUnknownSync(getGroupsRequestSchema)({
      groupId: 'GRP123',
    });
    const result = finalizeGetGroupsRequest(input);
    expect(result.criteria).toBe('groupId');
    expect(result.cond).toBe('eq');
    expect(result.value).toBe('GRP123');
  });

  it('should format dates as ISO strings', () => {
    const input = Schema.decodeUnknownSync(getGroupsRequestSchema)({
      startDate: '2024-01-15',
      endDate: '2024-02-15',
    });
    const result = finalizeGetGroupsRequest(input);
    expect(result.startDate).toContain('2024-01-15');
    expect(result.endDate).toContain('2024-02-15');
  });

  it('should throw InvalidDateError for invalid date string', () => {
    const input = Schema.decodeUnknownSync(getGroupsRequestSchema)({
      startDate: 'not-a-date',
    });
    expect(() => finalizeGetGroupsRequest(input)).toThrow(InvalidDateError);
  });

  it('should pass through limit and startKey', () => {
    const input = Schema.decodeUnknownSync(getGroupsRequestSchema)({
      limit: 25,
      startKey: 'key999',
    });
    const result = finalizeGetGroupsRequest(input);
    expect(result.limit).toBe(25);
    expect(result.startKey).toBe('key999');
  });
});
