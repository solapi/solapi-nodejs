/**
 * MessageService E2E 테스트
 *
 * ## 환경변수 설정
 * 실제 테스트 실행을 위해서는 다음 환경 변수가 필요합니다:
 * - API_KEY: SOLAPI API 키
 * - API_SECRET: SOLAPI API 시크릿
 * - SENDER_NUMBER: SOLAPI에 등록된 발신번호 (fallback: 01000000000)
 *
 * ## .env 파일 예시
 * ```
 * API_KEY=your_solapi_api_key_here
 * API_SECRET=your_solapi_api_secret_here
 * SENDER_NUMBER=01012345678
 * ```
 *
 * ## 테스트 특징
 * - 수신번호는 테스트용으로 01000000000 고정
 * - 발신번호는 환경변수에서 자동 로드 (fallback: 01000000000)
 * - 카카오 관련 테스트는 실제 등록된 채널과 승인된 템플릿을 자동 조회하여 사용
 * - 카카오 채널이나 템플릿이 없으면 해당 테스트는 자동으로 건너뜀
 *
 * ## 테스트 실행
 * ```bash
 * # 모든 메시지 서비스 테스트 실행
 * yarn test test/services/messages/messageService.e2e.test.ts
 *
 * # 특정 테스트만 실행 (예: SMS 테스트)
 * yarn test test/services/messages/messageService.e2e.test.ts -t "should send SMS message"
 * ```
 *
 * ## 주의사항
 * - 이 테스트들은 실제 메시지 발송을 수행하므로 비용이 발생할 수 있습니다
 * - 카카오 관련 테스트는 실제 비즈니스 채널과 승인된 템플릿이 필요합니다
 */
import {KakaoAlimtalkTemplateSchema} from '@/models/base/kakao/kakaoAlimtalkTemplate';
import KakaoChannelService from '@/services/kakao/channels/kakaoChannelService';
import KakaoTemplateService from '@/services/kakao/templates/kakaoTemplateService';
import MessageService from '@/services/messages/messageService';
import StorageService from '@/services/storage/storageService';
import {describe, expect, it} from '@effect/vitest';
import {Config, Console, Context, Effect, Layer} from 'effect';
import path from 'path';

const MessageServiceTag = Context.GenericTag<MessageService>('MessageService');
const KakaoChannelServiceTag = Context.GenericTag<KakaoChannelService>(
  'KakaoChannelService',
);
const KakaoTemplateServiceTag = Context.GenericTag<KakaoTemplateService>(
  'KakaoTemplateService',
);
const StorageServiceTag = Context.GenericTag<StorageService>('StorageService');

const MessageServiceLive = Layer.effect(
  MessageServiceTag,
  Effect.gen(function* () {
    const apiKey = yield* Config.string('API_KEY');
    const apiSecret = yield* Config.string('API_SECRET');
    return new MessageService(apiKey, apiSecret);
  }),
);

const KakaoChannelServiceLive = Layer.effect(
  KakaoChannelServiceTag,
  Effect.gen(function* () {
    const apiKey = yield* Config.string('API_KEY');
    const apiSecret = yield* Config.string('API_SECRET');
    return new KakaoChannelService(apiKey, apiSecret);
  }),
);

const KakaoTemplateServiceLive = Layer.effect(
  KakaoTemplateServiceTag,
  Effect.gen(function* () {
    const apiKey = yield* Config.string('API_KEY');
    const apiSecret = yield* Config.string('API_SECRET');
    return new KakaoTemplateService(apiKey, apiSecret);
  }),
);

const StorageServiceLive = Layer.effect(
  StorageServiceTag,
  Effect.gen(function* () {
    const apiKey = yield* Config.string('API_KEY');
    const apiSecret = yield* Config.string('API_SECRET');
    return new StorageService(apiKey, apiSecret);
  }),
);

const AllServicesLive = Layer.merge(
  MessageServiceLive,
  Layer.merge(
    KakaoChannelServiceLive,
    Layer.merge(KakaoTemplateServiceLive, StorageServiceLive),
  ),
);

/**
 * 카카오 템플릿 변수명에 따른 랜덤 값 생성 함수
 */
const generateRandomValueForVariable = (variableName: string): string => {
  const name = variableName.toLowerCase();

  // 변수명에 따른 적절한 더미 데이터 생성
  if (
    name.includes('이름') ||
    name.includes('name') ||
    name.includes('고객명')
  ) {
    const names = ['김철수', '이영희', '박민수', '정수진', '최영호'];
    return names[Math.floor(Math.random() * names.length)];
  }

  if (name.includes('날짜') || name.includes('date') || name.includes('일자')) {
    const today = new Date();
    today.setDate(today.getDate() + Math.floor(Math.random() * 30));
    return today.toLocaleDateString('ko-KR');
  }

  if (name.includes('시간') || name.includes('time')) {
    const hour = Math.floor(Math.random() * 24);
    const minute = Math.floor(Math.random() * 60);
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }

  if (
    name.includes('금액') ||
    name.includes('price') ||
    name.includes('amount')
  ) {
    const amount = Math.floor(Math.random() * 1000000) + 1000;
    return amount.toLocaleString('ko-KR') + '원';
  }

  if (name.includes('번호') || name.includes('number') || name.includes('no')) {
    return Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
  }

  if (
    name.includes('등급') ||
    name.includes('grade') ||
    name.includes('level')
  ) {
    const grades = [
      '일반',
      '우수',
      'VIP',
      'VVIP',
      'Bronze',
      'Silver',
      'Gold',
      'Platinum',
    ];
    return grades[Math.floor(Math.random() * grades.length)];
  }

  if (
    name.includes('장소') ||
    name.includes('여행지') ||
    name.includes('location')
  ) {
    const places = [
      '서울',
      '부산',
      '제주도',
      '강릉',
      '경주',
      '전주',
      '대전',
      '광주',
    ];
    return places[Math.floor(Math.random() * places.length)];
  }

  // 기본값: 랜덤 문자열
  const defaultValues = [
    '테스트값',
    '샘플데이터',
    '예시내용',
    'Sample',
    'Test',
  ];
  return defaultValues[Math.floor(Math.random() * defaultValues.length)];
};

/**
 * 카카오 알림톡 템플릿의 variables 배열에서 변수명을 추출하여
 * 랜덤 값으로 채워진 변수 객체를 생성합니다.
 */
const generateTemplateVariables = (
  template: KakaoAlimtalkTemplateSchema,
): Record<string, string> => {
  if (!template.variables || template.variables.length === 0) {
    return {};
  }

  return template.variables.reduce(
    (acc, variable) => {
      acc[variable.name] = generateRandomValueForVariable(variable.name);
      return acc;
    },
    {} as Record<string, string>,
  );
};

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

  describe('Message Sending Tests', () => {
    const testPhoneNumber = '01000000000'; // 테스트용 수신번호 (고정)

    it.live('should send SMS message', () =>
      Effect.gen(function* () {
        const messageService = yield* MessageServiceTag;
        const senderNumber = yield* Config.string('SENDER_NUMBER').pipe(
          Config.withDefault('01000000000'),
        );

        const result = yield* Effect.tryPromise(() =>
          messageService.send({
            to: testPhoneNumber,
            from: senderNumber,
            text: '안녕하세요. SMS 테스트 메시지입니다.',
            type: 'SMS',
          }),
        );

        expect(result).toBeDefined();
        expect(result.groupInfo).toBeDefined();
        expect(result.groupInfo.count.total).toBeGreaterThan(0);
      }).pipe(Effect.provide(AllServicesLive)),
    );

    it.live('should send LMS message', () =>
      Effect.gen(function* () {
        const messageService = yield* MessageServiceTag;
        const senderNumber = yield* Config.string('SENDER_NUMBER').pipe(
          Config.withDefault('01000000000'),
        );
        const longText =
          '안녕하세요. 이것은 장문 메시지(LMS) 테스트입니다. '.repeat(10);

        const result = yield* Effect.tryPromise(() =>
          messageService.send({
            to: testPhoneNumber,
            from: senderNumber,
            text: longText,
            subject: 'LMS 테스트 제목',
            type: 'LMS',
          }),
        );

        expect(result).toBeDefined();
        expect(result.groupInfo).toBeDefined();
        expect(result.groupInfo.count.total).toBeGreaterThan(0);
      }).pipe(Effect.provide(AllServicesLive)),
    );

    it.live('should send MMS message', () =>
      Effect.gen(function* () {
        const messageService = yield* MessageServiceTag;
        const storageService = yield* StorageServiceTag;
        const senderNumber = yield* Config.string('SENDER_NUMBER').pipe(
          Config.withDefault('01000000000'),
        );

        // 실제 이미지 파일 업로드
        const imagePath = path.resolve(
          __dirname,
          '../../../examples/javascript/common/images/example.jpg',
        );
        const uploadResult = yield* Effect.tryPromise(() =>
          storageService.uploadFile(imagePath, 'MMS'),
        );

        const result = yield* Effect.tryPromise(() =>
          messageService.send({
            to: testPhoneNumber,
            from: senderNumber,
            text: '안녕하세요. MMS 테스트 메시지입니다.',
            subject: 'MMS 테스트 제목',
            imageId: uploadResult.fileId,
            type: 'MMS',
          }),
        );

        expect(result).toBeDefined();
        expect(result.groupInfo).toBeDefined();
        expect(result.groupInfo.count.total).toBeGreaterThan(0);
      }).pipe(Effect.provide(AllServicesLive)),
    );

    it.live(
      'should send ATA (알림톡) message with real channel and template',
      () =>
        Effect.gen(function* () {
          const messageService = yield* MessageServiceTag;
          const kakaoChannelService = yield* KakaoChannelServiceTag;
          const kakaoTemplateService = yield* KakaoTemplateServiceTag;
          const senderNumber = yield* Config.string('SENDER_NUMBER').pipe(
            Config.withDefault('01000000000'),
          );

          // 실제 카카오 채널 조회
          const channelsResponse = yield* Effect.tryPromise(() =>
            kakaoChannelService.getKakaoChannels({limit: 1}),
          );

          if (channelsResponse.channelList.length === 0) {
            Console.log('카카오 채널이 없어서 ATA 테스트를 건너뜁니다.');
            return;
          }

          const channel = channelsResponse.channelList[0];

          // 해당 채널의 승인된 템플릿 조회
          const templatesResponse = yield* Effect.tryPromise(() =>
            kakaoTemplateService.getKakaoAlimtalkTemplates({
              channelId: channel.channelId,
              status: 'APPROVED',
              limit: 1,
            }),
          );

          if (templatesResponse.templateList.length === 0) {
            Console.log(
              '승인된 알림톡 템플릿이 없어서 ATA 테스트를 건너뜁니다.',
            );
            return;
          }

          const template = templatesResponse.templateList[0];

          const result = yield* Effect.tryPromise(() =>
            messageService.send({
              to: testPhoneNumber,
              from: senderNumber,
              type: 'ATA',
              kakaoOptions: {
                pfId: channel.channelId,
                templateId: template.templateId,
                variables: generateTemplateVariables(template),
                disableSms: false, // 알림톡 실패 시 SMS로 대체 발송
              },
            }),
          );

          expect(result).toBeDefined();
          expect(result.groupInfo).toBeDefined();
          expect(result.groupInfo.count.total).toBeGreaterThan(0);
        }).pipe(Effect.provide(AllServicesLive)),
    );

    it.live('should send CTA (친구톡) message with real channel', () =>
      Effect.gen(function* () {
        const messageService = yield* MessageServiceTag;
        const kakaoChannelService = yield* KakaoChannelServiceTag;
        const senderNumber = yield* Config.string('SENDER_NUMBER').pipe(
          Config.withDefault('01000000000'),
        );

        // 실제 카카오 채널 조회
        const channelsResponse = yield* Effect.tryPromise(() =>
          kakaoChannelService.getKakaoChannels({limit: 1}),
        );

        if (channelsResponse.channelList.length === 0) {
          Console.log('카카오 채널이 없어서 CTA 테스트를 건너뜁니다.');
          return;
        }

        const channel = channelsResponse.channelList[0];

        const result = yield* Effect.tryPromise(() =>
          messageService.send({
            to: testPhoneNumber,
            from: senderNumber,
            text: '안녕하세요! 친구톡 테스트 메시지입니다.',
            type: 'CTA',
            kakaoOptions: {
              pfId: channel.channelId,
              disableSms: false, // 친구톡 실패 시 SMS로 대체 발송
              buttons: [
                {
                  buttonName: '웹사이트 방문',
                  buttonType: 'WL',
                  linkMo: 'https://example.com',
                  linkPc: 'https://example.com',
                },
                {
                  buttonName: '앱 다운로드',
                  buttonType: 'AL',
                  linkAnd:
                    'https://play.google.com/store/apps/details?id=com.example',
                  linkIos: 'https://apps.apple.com/app/example/id123456789',
                },
              ],
            },
          }),
        );

        expect(result).toBeDefined();
        expect(result.groupInfo).toBeDefined();
        expect(result.groupInfo.count.total).toBeGreaterThan(0);
      }).pipe(Effect.provide(AllServicesLive)),
    );

    it.live('should send CTI (친구톡 이미지) message with real channel', () =>
      Effect.gen(function* () {
        const messageService = yield* MessageServiceTag;
        const kakaoChannelService = yield* KakaoChannelServiceTag;
        const storageService = yield* StorageServiceTag;
        const senderNumber = yield* Config.string('SENDER_NUMBER').pipe(
          Config.withDefault('01000000000'),
        );

        // 실제 카카오 채널 조회
        const channelsResponse = yield* Effect.tryPromise(() =>
          kakaoChannelService.getKakaoChannels({limit: 1}),
        );

        if (channelsResponse.channelList.length === 0) {
          Console.log('카카오 채널이 없어서 CTI 테스트를 건너뜁니다.');
          return;
        }

        const channel = channelsResponse.channelList[0];

        // 실제 이미지 파일 업로드 (카카오용)
        const imagePath = path.resolve(
          __dirname,
          '../../../examples/javascript/common/images/example.jpg',
        );
        const uploadResult = yield* Effect.tryPromise(() =>
          storageService.uploadFile(imagePath, 'KAKAO'),
        );

        const result = yield* Effect.tryPromise(() =>
          messageService.send({
            to: testPhoneNumber,
            from: senderNumber,
            text: '안녕하세요! 이미지가 포함된 친구톡 테스트 메시지입니다.',
            type: 'CTI',
            kakaoOptions: {
              pfId: channel.channelId,
              imageId: uploadResult.fileId,
              disableSms: false, // 친구톡 실패 시 SMS로 대체 발송
              buttons: [
                {
                  buttonName: '자세히 보기',
                  buttonType: 'WL',
                  linkMo: 'https://example.com/detail',
                },
              ],
            },
          }),
        );

        expect(result).toBeDefined();
        expect(result.groupInfo).toBeDefined();
        expect(result.groupInfo.count.total).toBeGreaterThan(0);
      }).pipe(Effect.provide(AllServicesLive)),
    );

    it.live('should send multiple messages with different types', () =>
      Effect.gen(function* () {
        const messageService = yield* MessageServiceTag;
        const kakaoChannelService = yield* KakaoChannelServiceTag;
        const kakaoTemplateService = yield* KakaoTemplateServiceTag;
        const senderNumber = yield* Config.string('SENDER_NUMBER').pipe(
          Config.withDefault('01000000000'),
        );

        // 기본 메시지들
        const messages: Array<{
          to: string;
          from: string;
          text?: string;
          type: 'SMS' | 'LMS' | 'ATA';
          subject?: string;
          kakaoOptions?: {
            pfId: string;
            templateId: string;
            variables: Record<string, string>;
            disableSms: boolean;
          };
        }> = [
          {
            to: testPhoneNumber,
            from: senderNumber,
            text: 'SMS 테스트',
            type: 'SMS',
          },
          {
            to: testPhoneNumber,
            from: senderNumber,
            text: 'LMS 테스트 메시지입니다. '.repeat(10),
            subject: 'LMS 제목',
            type: 'LMS',
          },
        ];

        // 카카오 채널이 있으면 알림톡도 추가
        const channelsResponse = yield* Effect.tryPromise(() =>
          kakaoChannelService.getKakaoChannels({limit: 1}),
        );

        if (channelsResponse.channelList.length > 0) {
          const channel = channelsResponse.channelList[0];

          // 승인된 템플릿 조회
          const templatesResponse = yield* Effect.tryPromise(() =>
            kakaoTemplateService.getKakaoAlimtalkTemplates({
              channelId: channel.channelId,
              status: 'APPROVED',
              limit: 1,
            }),
          );

          if (templatesResponse.templateList.length > 0) {
            const template = templatesResponse.templateList[0];
            messages.push({
              to: testPhoneNumber,
              from: senderNumber,
              type: 'ATA',
              kakaoOptions: {
                pfId: channel.channelId,
                templateId: template.templateId,
                variables: generateTemplateVariables(template),
                disableSms: false,
              },
            });
          }
        }

        const result = yield* Effect.tryPromise(() =>
          messageService.send(messages),
        );

        expect(result).toBeDefined();
        expect(result.groupInfo).toBeDefined();
        expect(result.groupInfo.count.total).toBe(messages.length);
      }).pipe(Effect.provide(AllServicesLive)),
    );

    it.live('should handle scheduled message sending', () =>
      Effect.gen(function* () {
        const messageService = yield* MessageServiceTag;
        const senderNumber = yield* Config.string('SENDER_NUMBER').pipe(
          Config.withDefault('01000000000'),
        );
        const futureDate = new Date();
        futureDate.setMinutes(futureDate.getMinutes() + 10); // 10분 후 발송 예약

        const result = yield* Effect.tryPromise(() =>
          messageService.send(
            {
              to: testPhoneNumber,
              from: senderNumber,
              text: '예약 발송 테스트 메시지입니다.',
              type: 'SMS',
            },
            {
              scheduledDate: futureDate.toISOString(),
            },
          ),
        );

        expect(result).toBeDefined();
        expect(result.groupInfo).toBeDefined();
        expect(result.groupInfo.count.total).toBeGreaterThan(0);
      }).pipe(Effect.provide(AllServicesLive)),
    );

    it.live('should handle invalid message data gracefully', () =>
      Effect.gen(function* () {
        const messageService = yield* MessageServiceTag;

        // 빈 메시지 배열로 테스트 - BadRequestError 발생 예상
        const result = yield* Effect.either(
          Effect.tryPromise(() => messageService.send([])),
        );

        expect(result._tag).toBe('Left');
        if (result._tag === 'Left') {
          expect(String(result.left.error)).toContain(
            '데이터가 반드시 1건 이상 기입되어 있어야 합니다.',
          );
        }
      }).pipe(Effect.provide(AllServicesLive)),
    );

    it.live('should handle message validation errors', () =>
      Effect.gen(function* () {
        const messageService = yield* MessageServiceTag;
        const senderNumber = yield* Config.string('SENDER_NUMBER').pipe(
          Config.withDefault('01000000000'),
        );

        // 필수 필드 누락 테스트 (to 필드 누락)
        const invalidMessage = {
          from: senderNumber,
          text: '테스트 메시지',
          type: 'SMS' as const,
        };

        const result = yield* Effect.either(
          Effect.tryPromise(() =>
            // @ts-expect-error - 의도적으로 잘못된 타입을 전달하여 에러 테스트
            messageService.send(invalidMessage),
          ),
        );

        expect(result._tag).toBe('Left');
      }).pipe(Effect.provide(AllServicesLive)),
    );

    it.live('should handle sendOne method for single message', () =>
      Effect.gen(function* () {
        const messageService = yield* MessageServiceTag;
        const senderNumber = yield* Config.string('SENDER_NUMBER').pipe(
          Config.withDefault('01000000000'),
        );

        const result = yield* Effect.tryPromise(() =>
          messageService.sendOne({
            to: testPhoneNumber,
            from: senderNumber,
            text: 'sendOne 테스트 메시지입니다.',
            type: 'SMS',
          }),
        );

        expect(result).toBeDefined();
        expect(result.messageId).toBeDefined();
        expect(typeof result.messageId).toBe('string');
      }).pipe(Effect.provide(AllServicesLive)),
    );
  });
});
