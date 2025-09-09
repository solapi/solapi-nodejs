import {Schema} from 'effect';
import {describe, expect, it} from 'vitest';
import {
  multipleMessageSendingRequestSchema,
  phoneNumberSchema,
  requestSendMessageSchema,
  requestSendOneMessageSchema,
  singleMessageSendingRequestSchema,
} from '@/models/requests/messages/sendMessage';

describe('phoneNumberSchema', () => {
  it('should decode phone number by removing hyphens', () => {
    const phoneWithHyphens = '010-1234-5678';
    const result =
      Schema.decodeUnknownSync(phoneNumberSchema)(phoneWithHyphens);

    expect(result).toBe('01012345678');
  });

  it('should leave phone number unchanged when no hyphens present', () => {
    const phoneWithoutHyphens = '01012345678';
    const result =
      Schema.decodeUnknownSync(phoneNumberSchema)(phoneWithoutHyphens);

    expect(result).toBe('01012345678');
  });

  it('should handle multiple hyphens in phone number', () => {
    const phoneWithMultipleHyphens = '0-1-0-1-2-3-4-5-6-7-8';
    const result = Schema.decodeUnknownSync(phoneNumberSchema)(
      phoneWithMultipleHyphens,
    );

    expect(result).toBe('01012345678');
  });

  it('should fail for non-string input', () => {
    expect(() => {
      Schema.decodeUnknownSync(phoneNumberSchema)(12345);
    }).toThrow();
  });

  it('should encode phone number as-is', () => {
    const phoneNumber = '01012345678';
    const result = Schema.encodeSync(phoneNumberSchema)(phoneNumber);

    expect(result).toBe('01012345678');
  });
});

describe('requestSendOneMessageSchema', () => {
  it('should validate single phone number in to field with hyphens removed', () => {
    const messageData = {
      to: '010-1234-5678',
      from: '010-9876-5432',
      text: 'Hello, world!',
    };

    const result = Schema.decodeUnknownSync(requestSendOneMessageSchema)(
      messageData,
    );

    expect(result.to).toBe('01012345678');
    expect(result.from).toBe('01098765432');
    expect(result.text).toBe('Hello, world!');
  });

  it('should validate array of phone numbers in to field', () => {
    const messageData = {
      to: ['010-1234-5678', '010-9999-8888'],
      from: '010-9876-5432',
      text: 'Hello, world!',
    };

    const result = Schema.decodeUnknownSync(requestSendOneMessageSchema)(
      messageData,
    );

    expect(result.to).toEqual(['01012345678', '01099998888']);
    expect(result.from).toBe('01098765432');
  });

  it('should accept message without from field', () => {
    const messageData = {
      to: '010-1234-5678',
      text: 'Hello, world!',
    };

    const result = Schema.decodeUnknownSync(requestSendOneMessageSchema)(
      messageData,
    );

    expect(result.to).toBe('01012345678');
    expect(result.from).toBeUndefined();
    expect(result.text).toBe('Hello, world!');
  });

  it('should fail when to field is missing', () => {
    const messageData = {
      from: '010-9876-5432',
      text: 'Hello, world!',
    };

    expect(() => {
      Schema.decodeUnknownSync(requestSendOneMessageSchema)(messageData);
    }).toThrow();
  });

  it('should validate message with all optional fields', () => {
    const messageData = {
      to: '010-1234-5678',
      from: '010-9876-5432',
      text: 'Hello, world!',
      type: 'SMS' as const,
      subject: 'Test Subject',
      autoTypeDetect: false,
    };

    const result = Schema.decodeUnknownSync(requestSendOneMessageSchema)(
      messageData,
    );

    expect(result.to).toBe('01012345678');
    expect(result.from).toBe('01098765432');
    expect(result.text).toBe('Hello, world!');
    expect(result.type).toBe('SMS');
    expect(result.subject).toBe('Test Subject');
    expect(result.autoTypeDetect).toBe(false);
  });
});

describe('requestSendMessageSchema', () => {
  it('should accept single message object', () => {
    const singleMessage = {
      to: '010-1234-5678',
      from: '010-9876-5432',
      text: 'Single message',
    };

    const result = Schema.decodeUnknownSync(requestSendMessageSchema)(
      singleMessage,
    );

    expect(Array.isArray(result)).toBe(false);
    if (!Array.isArray(result) && 'to' in result) {
      expect(result.to).toBe('01012345678');
      expect(result.from).toBe('01098765432');
      expect(result.text).toBe('Single message');
    }
  });

  it('should accept array of message objects', () => {
    const messageArray = [
      {
        to: '010-1234-5678',
        from: '010-9876-5432',
        text: 'First message',
      },
      {
        to: ['010-1111-2222', '010-3333-4444'],
        from: '010-9876-5432',
        text: 'Second message',
        type: 'SMS' as const,
      },
    ];

    const result = Schema.decodeUnknownSync(requestSendMessageSchema)(
      messageArray,
    );

    expect(Array.isArray(result)).toBe(true);
    if (Array.isArray(result)) {
      expect(result).toHaveLength(2);
      expect(result[0].to).toBe('01012345678');
      expect(result[0].text).toBe('First message');
      expect(result[1].to).toEqual(['01011112222', '01033334444']);
      expect(result[1].text).toBe('Second message');
      expect(result[1].type).toBe('SMS');
    }
  });

  it('should fail for empty array', () => {
    const emptyArray: unknown[] = [];

    expect(() => {
      Schema.decodeUnknownSync(requestSendMessageSchema)(emptyArray);
    }).toThrow();
  });

  it('should handle mixed message types in array', () => {
    const mixedMessages = [
      {
        to: '010-1234-5678',
        text: 'SMS message',
        type: 'SMS' as const,
      },
      {
        to: '010-2222-3333',
        text: 'LMS message with longer text content',
        type: 'LMS' as const,
        subject: 'LMS Subject',
      },
    ];

    const result = Schema.decodeUnknownSync(requestSendMessageSchema)(
      mixedMessages,
    );

    expect(Array.isArray(result)).toBe(true);
    if (Array.isArray(result)) {
      expect(result[0].type).toBe('SMS');
      expect(result[1].type).toBe('LMS');
      expect(result[1].subject).toBe('LMS Subject');
    }
  });
});

describe('singleMessageSendingRequestSchema', () => {
  it('should validate single message sending request with default agent', () => {
    const requestData = {
      message: {
        to: '010-1234-5678',
        from: '010-9876-5432',
        text: 'Hello, world!',
      },
    };

    const result = Schema.decodeUnknownSync(singleMessageSendingRequestSchema)(
      requestData,
    );

    expect(result.message.to).toBe('01012345678');
    expect(result.message.from).toBe('01098765432');
    expect(result.message.text).toBe('Hello, world!');
    expect(result.agent).toBeDefined();
    expect(result.agent.sdkVersion).toBeDefined();
    expect(result.agent.osPlatform).toBeDefined();
  });

  it('should validate single message sending request with custom agent', () => {
    const requestData = {
      message: {
        to: '010-1234-5678',
        text: 'Hello, world!',
      },
      agent: {
        sdkVersion: 'custom/1.0.0',
        osPlatform: 'custom platform',
        appId: 'my-app-id',
      },
    };

    const result = Schema.decodeUnknownSync(singleMessageSendingRequestSchema)(
      requestData,
    );

    expect(result.agent.sdkVersion).toBe('custom/1.0.0');
    expect(result.agent.osPlatform).toBe('custom platform');
    expect(result.agent.appId).toBe('my-app-id');
  });

  it('should fail when message field is missing', () => {
    const requestData = {
      agent: {
        sdkVersion: 'custom/1.0.0',
        osPlatform: 'custom platform',
      },
    };

    expect(() => {
      Schema.decodeUnknownSync(singleMessageSendingRequestSchema)(requestData);
    }).toThrow();
  });
});

describe('multipleMessageSendingRequestSchema', () => {
  it('should validate multiple message sending request with default values', () => {
    const requestData = {
      messages: [
        {
          to: '010-1234-5678',
          from: '010-9876-5432',
          text: 'First message',
        },
        {
          to: '010-1111-2222',
          from: '010-9876-5432',
          text: 'Second message',
        },
      ],
    };

    const result = Schema.decodeUnknownSync(
      multipleMessageSendingRequestSchema,
    )(requestData);

    expect(result.messages).toHaveLength(2);
    expect(result.messages[0].to).toBe('01012345678');
    expect(result.messages[1].to).toBe('01011112222');
    expect(result.agent).toBeDefined();
    expect(result.agent.sdkVersion).toBeDefined();
    expect(result.agent.osPlatform).toBeDefined();
  });

  it('should validate multiple message sending request with all optional fields', () => {
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 1);

    const requestData = {
      messages: [
        {
          to: '010-1234-5678',
          text: 'Scheduled message',
        },
      ],
      allowDuplicates: true,
      scheduledDate: futureDate,
      showMessageList: false,
      agent: {
        sdkVersion: 'custom/2.0.0',
        appId: 'scheduled-app',
      },
    };

    const result = Schema.decodeUnknownSync(
      multipleMessageSendingRequestSchema,
    )(requestData);

    expect(result.allowDuplicates).toBe(true);
    expect(result.scheduledDate).toBeInstanceOf(Date);
    expect(result.showMessageList).toBe(false);
    expect(result.agent.sdkVersion).toBe('custom/2.0.0');
    expect(result.agent.appId).toBe('scheduled-app');
  });

  it('should handle scheduledDate as string', () => {
    const dateString = '2024-12-31T23:59:59.000Z';
    const requestData = {
      messages: [
        {
          to: '010-1234-5678',
          text: 'New Year message',
        },
      ],
      scheduledDate: dateString,
    };

    const result = Schema.decodeUnknownSync(
      multipleMessageSendingRequestSchema,
    )(requestData);

    expect(result.scheduledDate).toBeInstanceOf(Date);
    expect(result.scheduledDate?.toISOString()).toBe(dateString);
  });

  it('should fail when messages array is empty', () => {
    const requestData = {
      messages: [],
    };

    expect(() => {
      Schema.decodeUnknownSync(multipleMessageSendingRequestSchema)(
        requestData,
      );
    }).toThrow();
  });

  it('should fail when messages field is missing', () => {
    const requestData = {
      allowDuplicates: true,
    };

    expect(() => {
      Schema.decodeUnknownSync(multipleMessageSendingRequestSchema)(
        requestData,
      );
    }).toThrow();
  });
});

describe('Effect Schema Integration Tests', () => {
  describe('phoneNumberSchema with Effect Either', () => {
    it('should return Right for valid phone number transformation', () => {
      const phoneWithHyphens = '010-1234-5678';
      const result =
        Schema.decodeUnknownEither(phoneNumberSchema)(phoneWithHyphens);

      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.right).toBe('01012345678');
      }
    });

    it('should return Left for invalid phone number input', () => {
      const invalidInput = 12345;
      const result =
        Schema.decodeUnknownEither(phoneNumberSchema)(invalidInput);

      expect(result._tag).toBe('Left');
      if (result._tag === 'Left') {
        expect(result.left).toBeDefined();
      }
    });
  });

  describe('requestSendOneMessageSchema with Effect Either', () => {
    it('should return Right for valid message data', () => {
      const messageData = {
        to: ['010-1234-5678', '010-9999-8888'],
        from: '010-9876-5432',
        text: 'Valid message',
        type: 'SMS' as const,
      };

      const result = Schema.decodeUnknownEither(requestSendOneMessageSchema)(
        messageData,
      );

      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.right.to).toEqual(['01012345678', '01099998888']);
        expect(result.right.from).toBe('01098765432');
        expect(result.right.type).toBe('SMS');
      }
    });

    it('should return Left when required to field is missing', () => {
      const invalidData = {
        from: '010-9876-5432',
        text: 'Message without to field',
      };

      const result = Schema.decodeUnknownEither(requestSendOneMessageSchema)(
        invalidData,
      );

      expect(result._tag).toBe('Left');
      if (result._tag === 'Left') {
        expect(result.left).toBeDefined();
      }
    });
  });

  describe('multipleMessageSendingRequestSchema with Effect Either', () => {
    it('should return Right for valid multiple message request', () => {
      const requestData = {
        messages: [
          {
            to: '010-1234-5678',
            text: 'First message',
          },
          {
            to: ['010-1111-2222', '010-3333-4444'],
            text: 'Second message',
            type: 'LMS' as const,
            subject: 'Important Notice',
          },
        ],
        allowDuplicates: false,
        showMessageList: true,
      };

      const result = Schema.decodeUnknownEither(
        multipleMessageSendingRequestSchema,
      )(requestData);

      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.right.messages).toHaveLength(2);
        expect(result.right.messages[0].to).toBe('01012345678');
        expect(result.right.messages[1].to).toEqual([
          '01011112222',
          '01033334444',
        ]);
        expect(result.right.allowDuplicates).toBe(false);
        expect(result.right.showMessageList).toBe(true);
        expect(result.right.agent).toBeDefined();
      }
    });

    it('should return Left for empty messages array', () => {
      const invalidData = {
        messages: [],
        allowDuplicates: true,
      };

      const result = Schema.decodeUnknownEither(
        multipleMessageSendingRequestSchema,
      )(invalidData);

      expect(result._tag).toBe('Left');
      if (result._tag === 'Left') {
        expect(result.left).toBeDefined();
      }
    });

    it('should return Left when messages field is missing', () => {
      const invalidData = {
        allowDuplicates: true,
        showMessageList: false,
      };

      const result = Schema.decodeUnknownEither(
        multipleMessageSendingRequestSchema,
      )(invalidData);

      expect(result._tag).toBe('Left');
      if (result._tag === 'Left') {
        expect(result.left).toBeDefined();
      }
    });
  });

  describe('Complex validation scenarios', () => {
    it('should handle deeply nested phone number transformations', () => {
      const complexMessage = {
        to: ['010-1234-5678', '02-1234-5678', '031-123-4567', '010-9999-8888'],
        from: '070-1234-5678',
        text: 'Complex phone number test',
        type: 'SMS' as const,
        customFields: {
          campaign: 'test-campaign',
          source: 'unit-test',
        },
      };

      const result = Schema.decodeUnknownEither(requestSendOneMessageSchema)(
        complexMessage,
      );

      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.right.to).toEqual([
          '01012345678',
          '0212345678',
          '0311234567',
          '01099998888',
        ]);
        expect(result.right.from).toBe('07012345678');
        expect(result.right.customFields).toEqual({
          campaign: 'test-campaign',
          source: 'unit-test',
        });
      }
    });

    it('should validate scheduled message with proper date handling', () => {
      const futureDate = new Date('2025-12-25T10:00:00.000Z');
      const scheduledRequest = {
        messages: [
          {
            to: '010-1234-5678',
            text: 'Merry Christmas!',
            type: 'SMS' as const,
          },
        ],
        scheduledDate: futureDate,
        allowDuplicates: false,
        agent: {
          sdkVersion: 'test/1.0.0',
          osPlatform: 'test-platform',
          appId: 'christmas-app',
        },
      };

      const result = Schema.decodeUnknownEither(
        multipleMessageSendingRequestSchema,
      )(scheduledRequest);

      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.right.scheduledDate).toBeInstanceOf(Date);
        expect(result.right.scheduledDate?.getTime()).toBe(
          futureDate.getTime(),
        );
        expect(result.right.agent.appId).toBe('christmas-app');
      }
    });
  });
});
