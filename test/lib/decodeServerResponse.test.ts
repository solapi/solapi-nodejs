import {Schema} from 'effect';
import * as Effect from 'effect/Effect';
import {describe, expect, it} from 'vitest';
import {ResponseSchemaMismatchError} from '@/errors/defaultError';
import {decodeServerResponse} from '@/lib/schemaUtils';
import {storedMessageSchema} from '@/models/base/messages/storedMessage';
import {getBalanceResponseSchema} from '@/models/responses/messageResponses';

const balanceFixture = {
  lowBalanceAlert: {
    notificationBalance: '200',
    currentBalance: '196.00000000001592',
    balances: [200, 1000000, 30000000],
    channels: ['EMAIL', 'ATA'],
    enabled: true,
  },
  point: 0,
  minimumCash: 3000,
  rechargeTo: 50000,
  rechargeTryCount: 0,
  autoRecharge: 0,
  accountId: '486',
  balance: 0,
  deposit: 0,
  balanceOnly: 0,
};

describe('decodeServerResponse', () => {
  it('실제 getBalance 응답을 성공적으로 디코딩한다', () => {
    const result = Effect.runSync(
      decodeServerResponse(getBalanceResponseSchema, balanceFixture),
    );
    expect(result.balance).toBe(0);
    expect(result.lowBalanceAlert?.enabled).toBe(true);
    expect(result.lowBalanceAlert?.channels).toEqual(['EMAIL', 'ATA']);
  });

  it('타입이 맞지 않으면 ResponseSchemaMismatchError로 실패하고 path 정보를 보존한다', () => {
    const invalid = {...balanceFixture, balance: 'not a number'};
    const result = Effect.runSync(
      Effect.either(decodeServerResponse(getBalanceResponseSchema, invalid)),
    );

    expect(result._tag).toBe('Left');
    if (result._tag !== 'Left') return;
    const err = result.left;
    expect(err).toBeInstanceOf(ResponseSchemaMismatchError);
    expect(err.validationErrors.length).toBeGreaterThan(0);
    expect(err.validationErrors.some(m => m.includes('balance'))).toBe(true);
  });

  it('실패 시 responseBody에 원본 JSON을 보존한다', () => {
    const result = Effect.runSync(
      Effect.either(
        decodeServerResponse(getBalanceResponseSchema, {bogus: 'data'}),
      ),
    );
    expect(result._tag).toBe('Left');
    if (result._tag !== 'Left') return;
    const body = result.left.responseBody;
    expect(body).toBeDefined();
    expect(body).toContain('bogus');
  });

  it('context.url이 있으면 에러에 반영된다', () => {
    const result = Effect.runSync(
      Effect.either(
        decodeServerResponse(getBalanceResponseSchema, null, {
          url: 'https://api.example.com/foo',
        }),
      ),
    );
    expect(result._tag).toBe('Left');
    if (result._tag !== 'Left') return;
    expect(result.left.url).toBe('https://api.example.com/foo');
  });

  it('onExcessProperty: preserve로 미선언 필드를 strip 하지 않는다', () => {
    const schema = Schema.Struct({a: Schema.Number});
    const result = Effect.runSync(
      decodeServerResponse(schema, {a: 1, b: 'kept', nested: {x: 'also'}}),
    );
    expect(result).toEqual({a: 1, b: 'kept', nested: {x: 'also'}});
  });
});

describe('storedMessageSchema boolean|number 정규화', () => {
  it('autoTypeDetect/replacement/voiceReplied/unavailableSenderNumber가 0/1로 와도 boolean으로 정규화된다', () => {
    const result = Effect.runSync(
      decodeServerResponse(storedMessageSchema, {
        autoTypeDetect: 0,
        replacement: 1,
        voiceReplied: 0,
        unavailableSenderNumber: 1,
      }),
    );
    expect(result.autoTypeDetect).toBe(false);
    expect(result.replacement).toBe(true);
    expect(result.voiceReplied).toBe(false);
    expect(result.unavailableSenderNumber).toBe(true);
  });

  it('boolean 값은 그대로 통과한다', () => {
    const result = Effect.runSync(
      decodeServerResponse(storedMessageSchema, {
        autoTypeDetect: true,
        replacement: false,
      }),
    );
    expect(result.autoTypeDetect).toBe(true);
    expect(result.replacement).toBe(false);
  });

  it('미선언 필드(dateReceived 등)를 응답에서 strip 하지 않는다', () => {
    const raw = {
      messageId: 'M123',
      foo: 'bar',
      nested: {x: 1},
    };
    const result = Effect.runSync(
      decodeServerResponse(storedMessageSchema, raw),
    );
    expect((result as Record<string, unknown>).foo).toBe('bar');
    expect((result as Record<string, unknown>).nested).toEqual({x: 1});
  });
});
