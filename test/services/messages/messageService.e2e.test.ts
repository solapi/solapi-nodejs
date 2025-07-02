import MessageService from '@/services/messages/messageService';
import {describe, expect, it} from '@effect/vitest';
import {Config, Context, Effect, Layer} from 'effect';

const MessageServiceTag = Context.GenericTag<MessageService>('MessageService');

const MessageServiceLive = Layer.effect(
  MessageServiceTag,
  Effect.gen(function* () {
    const apiKey = yield* Config.string('API_KEY');
    const apiSecret = yield* Config.string('API_SECRET');
    return new MessageService(apiKey, apiSecret);
  }),
);

describe('MessageService E2E', () => {
  it.live('should return messages', () =>
    Effect.gen(function* () {
      const messageService = yield* MessageServiceTag;
      const result = yield* Effect.tryPromise(() =>
        messageService.getMessages(),
      );

      expect(result.messageList).toBeDefined();
      expect(result.messageList).toBeInstanceOf(Object);
    }).pipe(Effect.provide(MessageServiceLive)),
  );

  it.live('should return statistics', () =>
    Effect.gen(function* () {
      const messageService = yield* MessageServiceTag;
      const result = yield* Effect.tryPromise(() =>
        messageService.getStatistics(),
      );

      expect(result).toBeInstanceOf(Object);
      expect(result.total).toBeInstanceOf(Object);
    }).pipe(Effect.provide(MessageServiceLive)),
  );
});
