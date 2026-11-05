import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {Either, Schema} from 'effect';
import {describe, expect, it} from 'vitest';
import {getStatisticsResponseSchema} from '@/models/responses/messageResponses';

const fixture = JSON.parse(
  readFileSync(join(__dirname, '../../assets/statistics.json'), 'utf-8'),
);

describe('getStatisticsResponseSchema', () => {
  it('should decode a full statistics response unchanged', () => {
    const result = Schema.decodeUnknownSync(getStatisticsResponseSchema)(
      fixture,
    );

    expect(result.balance).toBe(fixture.balance);
    expect(result.monthPeriod).toHaveLength(fixture.monthPeriod.length);
    expect(result.total.total).toBe(fixture.total.total);
    expect(result.failed.sms).toBe(fixture.failed.sms);
  });

  it('should fill defaults when the server returns an empty object (#182)', () => {
    const result = Schema.decodeUnknownSync(getStatisticsResponseSchema)({});

    expect(result.balance).toBe(0);
    expect(result.point).toBe(0);
    expect(result.monthlyBalanceAvg).toBe(0);
    expect(result.monthlyPointAvg).toBe(0);
    expect(result.monthPeriod).toEqual([]);
    expect(result.total.total).toBe(0);
    expect(result.successed.sms).toBe(0);
    expect(result.failed.bms_free).toBe(0);
    expect(result.deposit).toBeUndefined();
  });

  it('should keep provided values when only some fields are present', () => {
    const result = Schema.decodeUnknownSync(getStatisticsResponseSchema)({
      balance: 1200,
      point: 30,
    });

    expect(result.balance).toBe(1200);
    expect(result.point).toBe(30);
    expect(result.monthPeriod).toEqual([]);
    expect(result.total.total).toBe(0);
  });

  it('should still reject wrong field types', () => {
    const result = Schema.decodeUnknownEither(getStatisticsResponseSchema)({
      balance: 'many',
    });

    expect(Either.isLeft(result)).toBe(true);
  });
});
