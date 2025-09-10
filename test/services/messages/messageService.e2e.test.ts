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
import {describe, expect, it} from '@effect/vitest';
import {generateTemplateVariables} from '@test/lib/kakao-test-utils';
import {
  GroupServiceTag,
  KakaoChannelServiceTag,
  KakaoTemplateServiceTag,
  MessageServiceTag,
  MessageTestServicesLive,
  StorageServiceTag,
} from '@test/lib/test-layers';
import {Config, Console, Effect} from 'effect';
import path from 'path';

describe('MessageService E2E', () => {
  it.effect('should return messages', () =>
    Effect.gen(function* () {
      const messageService = yield* MessageServiceTag;
      const result = yield* Effect.tryPromise(() =>
        messageService.getMessages(),
      );

      expect(result.messageList).toBeDefined();
      expect(result.messageList).toBeInstanceOf(Object);
    }).pipe(Effect.provide(MessageTestServicesLive)),
  );

  it.effect('should return statistics', () =>
    Effect.gen(function* () {
      const messageService = yield* MessageServiceTag;
      const result = yield* Effect.tryPromise(() =>
        messageService.getStatistics(),
      );

      expect(result).toBeInstanceOf(Object);
      expect(result.total).toBeInstanceOf(Object);
    }).pipe(Effect.provide(MessageTestServicesLive)),
  );

  describe('Message Sending Tests', () => {
    const testPhoneNumber = '01000000000'; // 테스트용 수신번호 (고정)

    it.effect('should send SMS message', () =>
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
      }).pipe(Effect.provide(MessageTestServicesLive)),
    );

    it.effect('should send LMS message', () =>
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
      }).pipe(Effect.provide(MessageTestServicesLive)),
    );

    it.effect('should send MMS message', () =>
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
      }).pipe(Effect.provide(MessageTestServicesLive)),
    );

    it.effect(
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
            yield* Console.log('카카오 채널이 없어서 ATA 테스트를 건너뜁니다.');
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
            yield* Console.log(
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
        }).pipe(Effect.provide(MessageTestServicesLive)),
    );

    it.effect('should send CTA (친구톡) message with real channel', () =>
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
          yield* Console.log('카카오 채널이 없어서 CTA 테스트를 건너뜁니다.');
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
      }).pipe(Effect.provide(MessageTestServicesLive)),
    );

    it.effect('should send CTI (친구톡 이미지) message with real channel', () =>
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
          yield* Console.log('카카오 채널이 없어서 CTI 테스트를 건너뜁니다.');
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
      }).pipe(Effect.provide(MessageTestServicesLive)),
    );

    it.effect('should send multiple messages with different types', () =>
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
      }).pipe(Effect.provide(MessageTestServicesLive)),
    );

    it.effect('should handle scheduled message sending', () =>
      Effect.gen(function* () {
        const messageService = yield* MessageServiceTag;
        const groupService = yield* GroupServiceTag;
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

        // 예약 직후 취소 처리
        const groupId = result.groupInfo.groupId;
        const cancelResult = yield* Effect.tryPromise(() =>
          groupService.removeReservationToGroup(groupId),
        );
        expect(cancelResult).toBeDefined();
      }).pipe(Effect.provide(MessageTestServicesLive)),
    );

    it.effect('should handle invalid message data gracefully', () =>
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
      }).pipe(Effect.provide(MessageTestServicesLive)),
    );

    it.effect('should handle message validation errors', () =>
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
      }).pipe(Effect.provide(MessageTestServicesLive)),
    );
  });
});
