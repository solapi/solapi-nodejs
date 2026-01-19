/**
 * BMS Free Message E2E 테스트
 *
 * ## 환경변수 설정
 * 실제 테스트 실행을 위해서는 다음 환경 변수가 필요합니다:
 * - API_KEY: SOLAPI API 키
 * - API_SECRET: SOLAPI API 시크릿
 * - SENDER_NUMBER: SOLAPI에 등록된 발신번호 (fallback: 01000000000)
 *
 * ## 테스트 특징
 * - 8가지 BMS Free 타입 (TEXT, IMAGE, WIDE, WIDE_ITEM_LIST, COMMERCE, CAROUSEL_FEED, CAROUSEL_COMMERCE, PREMIUM_VIDEO)
 * - 카카오 채널이 없으면 테스트 자동 스킵
 * - targeting은 'I' 타입만 사용 (M/N은 인허가 채널 필요)
 *
 * ## 테스트 실행
 * ```bash
 * pnpm vitest run test/services/messages/bms-free.e2e.test.ts
 * pnpm test -- -t "TEXT 타입"
 * ```
 */
import {describe, expect, it} from '@effect/vitest';
import {
  createBmsButton,
  createBmsCommerce,
  createBmsCoupon,
  createBmsLinkButton,
  createBmsOption,
  createCarouselCommerceItem,
  createCarouselFeedItem,
  createMainWideItem,
  createSubWideItem,
  getTestImagePath,
  getTestImagePath2to1,
  uploadBmsImage,
  uploadBmsImageForType,
} from '@test/lib/bms-test-utils';
import {
  KakaoChannelServiceTag,
  MessageServiceTag,
  MessageTestServicesLive,
  StorageServiceTag,
} from '@test/lib/test-layers';
import {Config, Console, Effect} from 'effect';

describe('BMS Free Message E2E', () => {
  const testPhoneNumber = '01000000000';

  describe('TEXT 타입', () => {
    it.effect('최소 구조 (text만)', () =>
      Effect.gen(function* () {
        const messageService = yield* MessageServiceTag;
        const kakaoChannelService = yield* KakaoChannelServiceTag;
        const senderNumber = yield* Config.string('SENDER_NUMBER').pipe(
          Config.withDefault('01000000000'),
        );

        const channelsResponse = yield* Effect.tryPromise(() =>
          kakaoChannelService.getKakaoChannels({limit: 1}),
        );

        if (channelsResponse.channelList.length === 0) {
          yield* Console.log(
            '카카오 채널이 없어서 BMS TEXT 테스트를 건너뜁니다.',
          );
          return;
        }

        const channel = channelsResponse.channelList[0];

        const result = yield* Effect.tryPromise(() =>
          messageService.send({
            to: testPhoneNumber,
            from: senderNumber,
            text: 'BMS TEXT 최소 구조 테스트 메시지입니다.',
            type: 'BMS_FREE',
            kakaoOptions: {
              pfId: channel.channelId,
              bms: createBmsOption('TEXT'),
            },
          }),
        );

        expect(result).toBeDefined();
        expect(result.groupInfo).toBeDefined();
        expect(result.groupInfo.count.total).toBeGreaterThan(0);
      }).pipe(Effect.provide(MessageTestServicesLive)),
    );

    it.effect('전체 필드 (adult, content, buttons, coupon)', () =>
      Effect.gen(function* () {
        const messageService = yield* MessageServiceTag;
        const kakaoChannelService = yield* KakaoChannelServiceTag;
        const senderNumber = yield* Config.string('SENDER_NUMBER').pipe(
          Config.withDefault('01000000000'),
        );

        const channelsResponse = yield* Effect.tryPromise(() =>
          kakaoChannelService.getKakaoChannels({limit: 1}),
        );

        if (channelsResponse.channelList.length === 0) {
          yield* Console.log(
            '카카오 채널이 없어서 BMS TEXT 테스트를 건너뜁니다.',
          );
          return;
        }

        const channel = channelsResponse.channelList[0];

        const result = yield* Effect.tryPromise(() =>
          messageService.send({
            to: testPhoneNumber,
            from: senderNumber,
            text: 'BMS TEXT 전체 필드 테스트 메시지입니다.',
            type: 'BMS_FREE',
            kakaoOptions: {
              pfId: channel.channelId,
              bms: createBmsOption('TEXT', {
                adult: false,
                buttons: [
                  createBmsButton('WL'),
                  createBmsButton('AL'),
                  createBmsButton('AC'),
                  createBmsButton('BK'),
                ],
                coupon: createBmsCoupon('percent'),
              }),
            },
          }),
        );

        expect(result).toBeDefined();
        expect(result.groupInfo).toBeDefined();
        expect(result.groupInfo.count.total).toBeGreaterThan(0);
      }).pipe(Effect.provide(MessageTestServicesLive)),
    );
  });

  describe('IMAGE 타입', () => {
    it.effect('최소 구조 (text, imageId)', () =>
      Effect.gen(function* () {
        const messageService = yield* MessageServiceTag;
        const kakaoChannelService = yield* KakaoChannelServiceTag;
        const storageService = yield* StorageServiceTag;
        const senderNumber = yield* Config.string('SENDER_NUMBER').pipe(
          Config.withDefault('01000000000'),
        );

        const channelsResponse = yield* Effect.tryPromise(() =>
          kakaoChannelService.getKakaoChannels({limit: 1}),
        );

        if (channelsResponse.channelList.length === 0) {
          yield* Console.log(
            '카카오 채널이 없어서 BMS IMAGE 테스트를 건너뜁니다.',
          );
          return;
        }

        const channel = channelsResponse.channelList[0];

        const imagePath = getTestImagePath(__dirname);
        const imageId = yield* Effect.tryPromise(() =>
          uploadBmsImageForType.bms(storageService, imagePath),
        );

        const result = yield* Effect.tryPromise(() =>
          messageService.send({
            to: testPhoneNumber,
            from: senderNumber,
            text: 'BMS IMAGE 최소 구조 테스트',
            type: 'BMS_FREE',
            kakaoOptions: {
              pfId: channel.channelId,
              bms: createBmsOption('IMAGE', {
                imageId,
              }),
            },
          }),
        );

        expect(result).toBeDefined();
        expect(result.groupInfo).toBeDefined();
        expect(result.groupInfo.count.total).toBeGreaterThan(0);
      }).pipe(Effect.provide(MessageTestServicesLive)),
    );

    it.effect(
      '전체 필드 (adult, content, imageId, imageLink, buttons, coupon)',
      () =>
        Effect.gen(function* () {
          const messageService = yield* MessageServiceTag;
          const kakaoChannelService = yield* KakaoChannelServiceTag;
          const storageService = yield* StorageServiceTag;
          const senderNumber = yield* Config.string('SENDER_NUMBER').pipe(
            Config.withDefault('01000000000'),
          );

          const channelsResponse = yield* Effect.tryPromise(() =>
            kakaoChannelService.getKakaoChannels({limit: 1}),
          );

          if (channelsResponse.channelList.length === 0) {
            yield* Console.log(
              '카카오 채널이 없어서 BMS IMAGE 테스트를 건너뜁니다.',
            );
            return;
          }

          const channel = channelsResponse.channelList[0];

          const imagePath = getTestImagePath(__dirname);
          const imageId = yield* Effect.tryPromise(() =>
            uploadBmsImageForType.bms(storageService, imagePath),
          );

          const result = yield* Effect.tryPromise(() =>
            messageService.send({
              to: testPhoneNumber,
              from: senderNumber,
              text: 'BMS IMAGE 전체 필드 테스트',
              type: 'BMS_FREE',
              kakaoOptions: {
                pfId: channel.channelId,
                bms: createBmsOption('IMAGE', {
                  adult: false,
                  imageId,
                  imageLink: 'https://example.com/image',
                  buttons: [
                    createBmsButton('WL'),
                    createBmsButton('AL'),
                    createBmsButton('AC'),
                    createBmsButton('BK'),
                  ],
                  coupon: createBmsCoupon('won'),
                }),
              },
            }),
          );

          expect(result).toBeDefined();
          expect(result.groupInfo).toBeDefined();
          expect(result.groupInfo.count.total).toBeGreaterThan(0);
        }).pipe(Effect.provide(MessageTestServicesLive)),
    );
  });

  describe('WIDE 타입', () => {
    it.effect('최소 구조 (text, imageId)', () =>
      Effect.gen(function* () {
        const messageService = yield* MessageServiceTag;
        const kakaoChannelService = yield* KakaoChannelServiceTag;
        const storageService = yield* StorageServiceTag;
        const senderNumber = yield* Config.string('SENDER_NUMBER').pipe(
          Config.withDefault('01000000000'),
        );

        const channelsResponse = yield* Effect.tryPromise(() =>
          kakaoChannelService.getKakaoChannels({limit: 1}),
        );

        if (channelsResponse.channelList.length === 0) {
          yield* Console.log(
            '카카오 채널이 없어서 BMS WIDE 테스트를 건너뜁니다.',
          );
          return;
        }

        const channel = channelsResponse.channelList[0];

        const imagePath = getTestImagePath(__dirname);
        const imageId = yield* Effect.tryPromise(() =>
          uploadBmsImageForType.wide(storageService, imagePath),
        );

        const result = yield* Effect.tryPromise(() =>
          messageService.send({
            to: testPhoneNumber,
            from: senderNumber,
            text: 'BMS WIDE 최소 구조 테스트',
            type: 'BMS_FREE',
            kakaoOptions: {
              pfId: channel.channelId,
              bms: createBmsOption('WIDE', {
                imageId,
              }),
            },
          }),
        );

        expect(result).toBeDefined();
        expect(result.groupInfo).toBeDefined();
        expect(result.groupInfo.count.total).toBeGreaterThan(0);
      }).pipe(Effect.provide(MessageTestServicesLive)),
    );

    it.effect('전체 필드 (adult, content, imageId, buttons, coupon)', () =>
      Effect.gen(function* () {
        const messageService = yield* MessageServiceTag;
        const kakaoChannelService = yield* KakaoChannelServiceTag;
        const storageService = yield* StorageServiceTag;
        const senderNumber = yield* Config.string('SENDER_NUMBER').pipe(
          Config.withDefault('01000000000'),
        );

        const channelsResponse = yield* Effect.tryPromise(() =>
          kakaoChannelService.getKakaoChannels({limit: 1}),
        );

        if (channelsResponse.channelList.length === 0) {
          yield* Console.log(
            '카카오 채널이 없어서 BMS WIDE 테스트를 건너뜁니다.',
          );
          return;
        }

        const channel = channelsResponse.channelList[0];

        const imagePath = getTestImagePath(__dirname);
        const imageId = yield* Effect.tryPromise(() =>
          uploadBmsImageForType.wide(storageService, imagePath),
        );

        const result = yield* Effect.tryPromise(() =>
          messageService.send({
            to: testPhoneNumber,
            from: senderNumber,
            text: 'BMS WIDE 전체 필드 테스트',
            type: 'BMS_FREE',
            kakaoOptions: {
              pfId: channel.channelId,
              bms: createBmsOption('WIDE', {
                adult: false,
                imageId,
                buttons: [createBmsButton('WL'), createBmsButton('AL')],
                coupon: createBmsCoupon('shipping'),
              }),
            },
          }),
        );

        expect(result).toBeDefined();
        expect(result.groupInfo).toBeDefined();
        expect(result.groupInfo.count.total).toBeGreaterThan(0);
      }).pipe(Effect.provide(MessageTestServicesLive)),
    );
  });

  describe.skip('WIDE_ITEM_LIST 타입', () => {
    it.effect('최소 구조 (header, mainWideItem, subWideItemList 1개)', () =>
      Effect.gen(function* () {
        const messageService = yield* MessageServiceTag;
        const kakaoChannelService = yield* KakaoChannelServiceTag;
        const storageService = yield* StorageServiceTag;
        const senderNumber = yield* Config.string('SENDER_NUMBER').pipe(
          Config.withDefault('01000000000'),
        );

        const channelsResponse = yield* Effect.tryPromise(() =>
          kakaoChannelService.getKakaoChannels({limit: 1}),
        );

        if (channelsResponse.channelList.length === 0) {
          yield* Console.log(
            '카카오 채널이 없어서 BMS WIDE_ITEM_LIST 테스트를 건너뜁니다.',
          );
          return;
        }

        const channel = channelsResponse.channelList[0];

        const mainImageId = yield* Effect.tryPromise(() =>
          uploadBmsImageForType.wideMainItem(
            storageService,
            getTestImagePath2to1(__dirname),
          ),
        );
        const subImageId = yield* Effect.tryPromise(() =>
          uploadBmsImageForType.wideSubItem(
            storageService,
            getTestImagePath2to1(__dirname),
          ),
        );

        const result = yield* Effect.tryPromise(() =>
          messageService.send({
            to: testPhoneNumber,
            from: senderNumber,
            type: 'BMS_FREE',
            kakaoOptions: {
              pfId: channel.channelId,
              bms: createBmsOption('WIDE_ITEM_LIST', {
                header: '헤더 제목',
                mainWideItem: createMainWideItem(mainImageId),
                subWideItemList: [
                  createSubWideItem(subImageId, '서브 아이템 1'),
                ],
              }),
            },
          }),
        );

        expect(result).toBeDefined();
        expect(result.groupInfo).toBeDefined();
        expect(result.groupInfo.count.total).toBeGreaterThan(0);
      }).pipe(Effect.provide(MessageTestServicesLive)),
    );

    it.effect(
      '전체 필드 (adult, header, mainWideItem, subWideItemList, buttons, coupon)',
      () =>
        Effect.gen(function* () {
          const messageService = yield* MessageServiceTag;
          const kakaoChannelService = yield* KakaoChannelServiceTag;
          const storageService = yield* StorageServiceTag;
          const senderNumber = yield* Config.string('SENDER_NUMBER').pipe(
            Config.withDefault('01000000000'),
          );

          const channelsResponse = yield* Effect.tryPromise(() =>
            kakaoChannelService.getKakaoChannels({limit: 1}),
          );

          if (channelsResponse.channelList.length === 0) {
            yield* Console.log(
              '카카오 채널이 없어서 BMS WIDE_ITEM_LIST 테스트를 건너뜁니다.',
            );
            return;
          }

          const channel = channelsResponse.channelList[0];

          const mainImageId = yield* Effect.tryPromise(() =>
            uploadBmsImageForType.wideMainItem(
              storageService,
              getTestImagePath2to1(__dirname),
            ),
          );
          const subImageId = yield* Effect.tryPromise(() =>
            uploadBmsImageForType.wideSubItem(
              storageService,
              getTestImagePath2to1(__dirname),
            ),
          );

          const result = yield* Effect.tryPromise(() =>
            messageService.send({
              to: testPhoneNumber,
              from: senderNumber,
              type: 'BMS_FREE',
              kakaoOptions: {
                pfId: channel.channelId,
                bms: createBmsOption('WIDE_ITEM_LIST', {
                  adult: false,
                  header: '헤더 제목',
                  mainWideItem: createMainWideItem(mainImageId),
                  subWideItemList: [
                    createSubWideItem(subImageId, '서브 아이템 1'),
                    createSubWideItem(subImageId, '서브 아이템 2'),
                    createSubWideItem(subImageId, '서브 아이템 3'),
                  ],
                  buttons: [createBmsButton('WL'), createBmsButton('AL')],
                  coupon: createBmsCoupon('free'),
                }),
              },
            }),
          );

          expect(result).toBeDefined();
          expect(result.groupInfo).toBeDefined();
          expect(result.groupInfo.count.total).toBeGreaterThan(0);
        }).pipe(Effect.provide(MessageTestServicesLive)),
    );
  });

  describe('COMMERCE 타입', () => {
    it.effect('최소 구조 (imageId, commerce title만, buttons 1개)', () =>
      Effect.gen(function* () {
        const messageService = yield* MessageServiceTag;
        const kakaoChannelService = yield* KakaoChannelServiceTag;
        const storageService = yield* StorageServiceTag;
        const senderNumber = yield* Config.string('SENDER_NUMBER').pipe(
          Config.withDefault('01000000000'),
        );

        const channelsResponse = yield* Effect.tryPromise(() =>
          kakaoChannelService.getKakaoChannels({limit: 1}),
        );

        if (channelsResponse.channelList.length === 0) {
          yield* Console.log(
            '카카오 채널이 없어서 BMS COMMERCE 테스트를 건너뜁니다.',
          );
          return;
        }

        const channel = channelsResponse.channelList[0];

        const imagePath = getTestImagePath2to1(__dirname);
        const imageId = yield* Effect.tryPromise(() =>
          uploadBmsImageForType.bms(storageService, imagePath),
        );

        const result = yield* Effect.tryPromise(() =>
          messageService.send({
            to: testPhoneNumber,
            from: senderNumber,
            type: 'BMS_FREE',
            kakaoOptions: {
              pfId: channel.channelId,
              bms: {
                targeting: 'I',
                chatBubbleType: 'COMMERCE',
                imageId,
                commerce: createBmsCommerce(),
                buttons: [createBmsButton('WL')],
              },
            },
          }),
        );

        expect(result).toBeDefined();
        expect(result.groupInfo).toBeDefined();
        expect(result.groupInfo.count.total).toBeGreaterThan(0);
      }).pipe(Effect.provide(MessageTestServicesLive)),
    );

    it.effect(
      '전체 필드 (adult, additionalContent, imageId, commerce 전체, buttons, coupon)',
      () =>
        Effect.gen(function* () {
          const messageService = yield* MessageServiceTag;
          const kakaoChannelService = yield* KakaoChannelServiceTag;
          const storageService = yield* StorageServiceTag;
          const senderNumber = yield* Config.string('SENDER_NUMBER').pipe(
            Config.withDefault('01000000000'),
          );

          const channelsResponse = yield* Effect.tryPromise(() =>
            kakaoChannelService.getKakaoChannels({limit: 1}),
          );

          if (channelsResponse.channelList.length === 0) {
            yield* Console.log(
              '카카오 채널이 없어서 BMS COMMERCE 테스트를 건너뜁니다.',
            );
            return;
          }

          const channel = channelsResponse.channelList[0];

          const imagePath = getTestImagePath2to1(__dirname);
          const imageId = yield* Effect.tryPromise(() =>
            uploadBmsImageForType.bms(storageService, imagePath),
          );

          const result = yield* Effect.tryPromise(() =>
            messageService.send({
              to: testPhoneNumber,
              from: senderNumber,
              type: 'BMS_FREE',
              kakaoOptions: {
                pfId: channel.channelId,
                bms: {
                  targeting: 'I',
                  chatBubbleType: 'COMMERCE',
                  adult: false,
                  additionalContent: '추가 내용입니다.',
                  imageId,
                  commerce: createBmsCommerce({
                    title: '프리미엄 상품',
                    regularPrice: 50000,
                    discountPrice: 35000,
                    discountRate: 30,
                    discountFixed: 15000,
                  }),
                  buttons: [createBmsButton('WL'), createBmsButton('AL')],
                  coupon: createBmsCoupon('up'),
                },
              },
            }),
          );

          expect(result).toBeDefined();
          expect(result.groupInfo).toBeDefined();
          expect(result.groupInfo.count.total).toBeGreaterThan(0);
        }).pipe(Effect.provide(MessageTestServicesLive)),
    );
  });

  describe('CAROUSEL_FEED 타입', () => {
    it.effect('최소 구조 (carousel.list 2개)', () =>
      Effect.gen(function* () {
        const messageService = yield* MessageServiceTag;
        const kakaoChannelService = yield* KakaoChannelServiceTag;
        const storageService = yield* StorageServiceTag;
        const senderNumber = yield* Config.string('SENDER_NUMBER').pipe(
          Config.withDefault('01000000000'),
        );

        const channelsResponse = yield* Effect.tryPromise(() =>
          kakaoChannelService.getKakaoChannels({limit: 1}),
        );

        if (channelsResponse.channelList.length === 0) {
          yield* Console.log(
            '카카오 채널이 없어서 BMS CAROUSEL_FEED 테스트를 건너뜁니다.',
          );
          return;
        }

        const channel = channelsResponse.channelList[0];

        const imagePath = getTestImagePath2to1(__dirname);
        const imageId = yield* Effect.tryPromise(() =>
          uploadBmsImageForType.carouselFeed(storageService, imagePath),
        );

        const result = yield* Effect.tryPromise(() =>
          messageService.send({
            to: testPhoneNumber,
            from: senderNumber,
            type: 'BMS_FREE',
            kakaoOptions: {
              pfId: channel.channelId,
              bms: {
                targeting: 'I',
                chatBubbleType: 'CAROUSEL_FEED',
                carousel: {
                  list: [
                    createCarouselFeedItem(imageId, {header: '캐러셀 1'}),
                    createCarouselFeedItem(imageId, {header: '캐러셀 2'}),
                  ],
                },
              },
            },
          }),
        );

        expect(result).toBeDefined();
        expect(result.groupInfo).toBeDefined();
        expect(result.groupInfo.count.total).toBeGreaterThan(0);
      }).pipe(Effect.provide(MessageTestServicesLive)),
    );

    it.effect('전체 필드 (adult, carousel head/list 전체/tail)', () =>
      Effect.gen(function* () {
        const messageService = yield* MessageServiceTag;
        const kakaoChannelService = yield* KakaoChannelServiceTag;
        const storageService = yield* StorageServiceTag;
        const senderNumber = yield* Config.string('SENDER_NUMBER').pipe(
          Config.withDefault('01000000000'),
        );

        const channelsResponse = yield* Effect.tryPromise(() =>
          kakaoChannelService.getKakaoChannels({limit: 1}),
        );

        if (channelsResponse.channelList.length === 0) {
          yield* Console.log(
            '카카오 채널이 없어서 BMS CAROUSEL_FEED 테스트를 건너뜁니다.',
          );
          return;
        }

        const channel = channelsResponse.channelList[0];

        const imagePath = getTestImagePath2to1(__dirname);
        const imageId = yield* Effect.tryPromise(() =>
          uploadBmsImageForType.carouselFeed(storageService, imagePath),
        );

        const result = yield* Effect.tryPromise(() =>
          messageService.send({
            to: testPhoneNumber,
            from: senderNumber,
            type: 'BMS_FREE',
            kakaoOptions: {
              pfId: channel.channelId,
              bms: {
                targeting: 'I',
                chatBubbleType: 'CAROUSEL_FEED',
                adult: false,
                carousel: {
                  list: [
                    createCarouselFeedItem(imageId, {
                      header: '첫 번째 카드',
                      content: '첫 번째 카드 내용입니다.',
                      imageLink: 'https://example.com/1',
                      buttons: [
                        createBmsLinkButton('WL'),
                        createBmsLinkButton('AL'),
                      ],
                      coupon: createBmsCoupon('percent'),
                    }),
                    createCarouselFeedItem(imageId, {
                      header: '두 번째 카드',
                      content: '두 번째 카드 내용입니다.',
                      buttons: [createBmsLinkButton('WL')],
                    }),
                    createCarouselFeedItem(imageId, {
                      header: '세 번째 카드',
                      content: '세 번째 카드 내용입니다.',
                      buttons: [createBmsLinkButton('AL')],
                    }),
                  ],
                  tail: {
                    linkMobile: 'https://example.com/more',
                    linkPc: 'https://example.com/more',
                  },
                },
              },
            },
          }),
        );

        expect(result).toBeDefined();
        expect(result.groupInfo).toBeDefined();
        expect(result.groupInfo.count.total).toBeGreaterThan(0);
      }).pipe(Effect.provide(MessageTestServicesLive)),
    );
  });

  describe('CAROUSEL_COMMERCE 타입', () => {
    it.effect('최소 구조 (carousel.list 2개)', () =>
      Effect.gen(function* () {
        const messageService = yield* MessageServiceTag;
        const kakaoChannelService = yield* KakaoChannelServiceTag;
        const storageService = yield* StorageServiceTag;
        const senderNumber = yield* Config.string('SENDER_NUMBER').pipe(
          Config.withDefault('01000000000'),
        );

        const channelsResponse = yield* Effect.tryPromise(() =>
          kakaoChannelService.getKakaoChannels({limit: 1}),
        );

        if (channelsResponse.channelList.length === 0) {
          yield* Console.log(
            '카카오 채널이 없어서 BMS CAROUSEL_COMMERCE 테스트를 건너뜁니다.',
          );
          return;
        }

        const channel = channelsResponse.channelList[0];

        const imagePath = getTestImagePath2to1(__dirname);
        const imageId = yield* Effect.tryPromise(() =>
          uploadBmsImageForType.carouselCommerce(storageService, imagePath),
        );

        const result = yield* Effect.tryPromise(() =>
          messageService.send({
            to: testPhoneNumber,
            from: senderNumber,
            type: 'BMS_FREE',
            kakaoOptions: {
              pfId: channel.channelId,
              bms: {
                targeting: 'I',
                chatBubbleType: 'CAROUSEL_COMMERCE',
                carousel: {
                  list: [
                    createCarouselCommerceItem(imageId, {
                      commerce: createBmsCommerce({title: '상품 1'}),
                    }),
                    createCarouselCommerceItem(imageId, {
                      commerce: createBmsCommerce({title: '상품 2'}),
                    }),
                  ],
                },
              },
            },
          }),
        );

        expect(result).toBeDefined();
        expect(result.groupInfo).toBeDefined();
        expect(result.groupInfo.count.total).toBeGreaterThan(0);
      }).pipe(Effect.provide(MessageTestServicesLive)),
    );

    it.effect(
      '전체 필드 (adult, additionalContent, carousel head/list 전체/tail)',
      () =>
        Effect.gen(function* () {
          const messageService = yield* MessageServiceTag;
          const kakaoChannelService = yield* KakaoChannelServiceTag;
          const storageService = yield* StorageServiceTag;
          const senderNumber = yield* Config.string('SENDER_NUMBER').pipe(
            Config.withDefault('01000000000'),
          );

          const channelsResponse = yield* Effect.tryPromise(() =>
            kakaoChannelService.getKakaoChannels({limit: 1}),
          );

          if (channelsResponse.channelList.length === 0) {
            yield* Console.log(
              '카카오 채널이 없어서 BMS CAROUSEL_COMMERCE 테스트를 건너뜁니다.',
            );
            return;
          }

          const channel = channelsResponse.channelList[0];

          const imagePath = getTestImagePath2to1(__dirname);
          const imageId = yield* Effect.tryPromise(() =>
            uploadBmsImageForType.carouselCommerce(storageService, imagePath),
          );

          const result = yield* Effect.tryPromise(() =>
            messageService.send({
              to: testPhoneNumber,
              from: senderNumber,
              type: 'BMS_FREE',
              kakaoOptions: {
                pfId: channel.channelId,
                bms: createBmsOption('CAROUSEL_COMMERCE', {
                  adult: false,
                  additionalContent: '추가 안내',
                  carousel: {
                    head: {
                      header: '캐러셀 인트로',
                      content: '인트로 내용입니다.',
                      imageId,
                      linkMobile: 'https://example.com/head',
                    },
                    list: [
                      createCarouselCommerceItem(imageId, {
                        commerce: createBmsCommerce({
                          title: '프리미엄 상품 1',
                          regularPrice: 30000,
                          discountPrice: 25000,
                        }),
                        additionalContent: '추가 정보',
                        imageLink: 'https://example.com/product1',
                        buttons: [
                          createBmsLinkButton('WL'),
                          createBmsLinkButton('AL'),
                        ],
                        coupon: createBmsCoupon('won'),
                      }),
                      createCarouselCommerceItem(imageId, {
                        commerce: createBmsCommerce({
                          title: '프리미엄 상품 2',
                          regularPrice: 40000,
                          discountPrice: 35000,
                        }),
                        buttons: [createBmsLinkButton('WL')],
                      }),
                    ],
                    tail: {
                      linkMobile: 'https://example.com/all-products',
                    },
                  },
                }),
              },
            }),
          );

          expect(result).toBeDefined();
          expect(result.groupInfo).toBeDefined();
          expect(result.groupInfo.count.total).toBeGreaterThan(0);
        }).pipe(Effect.provide(MessageTestServicesLive)),
    );
  });

  describe('PREMIUM_VIDEO 타입', () => {
    it.effect('최소 구조 (video.videoUrl)', () =>
      Effect.gen(function* () {
        const messageService = yield* MessageServiceTag;
        const kakaoChannelService = yield* KakaoChannelServiceTag;
        const senderNumber = yield* Config.string('SENDER_NUMBER').pipe(
          Config.withDefault('01000000000'),
        );

        const channelsResponse = yield* Effect.tryPromise(() =>
          kakaoChannelService.getKakaoChannels({limit: 1}),
        );

        if (channelsResponse.channelList.length === 0) {
          yield* Console.log(
            '카카오 채널이 없어서 BMS PREMIUM_VIDEO 테스트를 건너뜁니다.',
          );
          return;
        }

        const channel = channelsResponse.channelList[0];

        const result = yield* Effect.tryPromise(() =>
          messageService.send({
            to: testPhoneNumber,
            from: senderNumber,
            text: 'BMS PREMIUM_VIDEO 테스트',
            type: 'BMS_FREE',
            kakaoOptions: {
              pfId: channel.channelId,
              bms: createBmsOption('PREMIUM_VIDEO', {
                video: {
                  videoUrl: 'https://tv.kakao.com/v/123456789',
                },
              }),
            },
          }),
        );

        expect(result).toBeDefined();
        expect(result.groupInfo).toBeDefined();
        expect(result.groupInfo.count.total).toBeGreaterThan(0);
      }).pipe(Effect.provide(MessageTestServicesLive)),
    );

    it.effect(
      '전체 필드 (adult, header, content, video 전체, buttons, coupon)',
      () =>
        Effect.gen(function* () {
          const messageService = yield* MessageServiceTag;
          const kakaoChannelService = yield* KakaoChannelServiceTag;
          const storageService = yield* StorageServiceTag;
          const senderNumber = yield* Config.string('SENDER_NUMBER').pipe(
            Config.withDefault('01000000000'),
          );

          const channelsResponse = yield* Effect.tryPromise(() =>
            kakaoChannelService.getKakaoChannels({limit: 1}),
          );

          if (channelsResponse.channelList.length === 0) {
            yield* Console.log(
              '카카오 채널이 없어서 BMS PREMIUM_VIDEO 테스트를 건너뜁니다.',
            );
            return;
          }

          const channel = channelsResponse.channelList[0];

          const imagePath = getTestImagePath(__dirname);
          const imageId = yield* Effect.tryPromise(() =>
            uploadBmsImage(storageService, imagePath),
          );

          const result = yield* Effect.tryPromise(() =>
            messageService.send({
              to: testPhoneNumber,
              from: senderNumber,
              text: 'BMS PREMIUM_VIDEO 전체 필드 테스트',
              type: 'BMS_FREE',
              kakaoOptions: {
                pfId: channel.channelId,
                bms: createBmsOption('PREMIUM_VIDEO', {
                  adult: false,
                  header: '비디오 헤더',
                  content: '비디오 내용입니다.',
                  video: {
                    videoUrl: 'https://tv.kakao.com/v/123456789',
                    imageId,
                    imageLink: 'https://example.com/video',
                  },
                  buttons: [createBmsButton('WL')],
                  coupon: createBmsCoupon('percent'),
                }),
              },
            }),
          );

          expect(result).toBeDefined();
          expect(result.groupInfo).toBeDefined();
          expect(result.groupInfo.count.total).toBeGreaterThan(0);
        }).pipe(Effect.provide(MessageTestServicesLive)),
    );
  });

  describe('Error Cases', () => {
    it.effect('IMAGE without imageId (필수 필드 누락)', () =>
      Effect.gen(function* () {
        const messageService = yield* MessageServiceTag;
        const kakaoChannelService = yield* KakaoChannelServiceTag;
        const senderNumber = yield* Config.string('SENDER_NUMBER').pipe(
          Config.withDefault('01000000000'),
        );

        const channelsResponse = yield* Effect.tryPromise(() =>
          kakaoChannelService.getKakaoChannels({limit: 1}),
        );

        if (channelsResponse.channelList.length === 0) {
          yield* Console.log('카카오 채널이 없어서 에러 테스트를 건너뜁니다.');
          return;
        }

        const channel = channelsResponse.channelList[0];

        const result = yield* Effect.either(
          Effect.tryPromise(() =>
            messageService.send({
              to: testPhoneNumber,
              from: senderNumber,
              text: 'BMS IMAGE 에러 테스트',
              type: 'BMS_FREE',
              kakaoOptions: {
                pfId: channel.channelId,
                bms: createBmsOption('IMAGE'),
              },
            }),
          ),
        );

        expect(result._tag).toBe('Left');
      }).pipe(Effect.provide(MessageTestServicesLive)),
    );

    it.effect('COMMERCE without buttons (필수 필드 누락)', () =>
      Effect.gen(function* () {
        const messageService = yield* MessageServiceTag;
        const kakaoChannelService = yield* KakaoChannelServiceTag;
        const storageService = yield* StorageServiceTag;
        const senderNumber = yield* Config.string('SENDER_NUMBER').pipe(
          Config.withDefault('01000000000'),
        );

        const channelsResponse = yield* Effect.tryPromise(() =>
          kakaoChannelService.getKakaoChannels({limit: 1}),
        );

        if (channelsResponse.channelList.length === 0) {
          yield* Console.log('카카오 채널이 없어서 에러 테스트를 건너뜁니다.');
          return;
        }

        const channel = channelsResponse.channelList[0];

        const imagePath = getTestImagePath(__dirname);
        const imageId = yield* Effect.tryPromise(() =>
          uploadBmsImageForType.bms(storageService, imagePath),
        );

        const result = yield* Effect.either(
          Effect.tryPromise(() =>
            messageService.send({
              to: testPhoneNumber,
              from: senderNumber,
              text: 'BMS COMMERCE 에러 테스트',
              type: 'BMS_FREE',
              kakaoOptions: {
                pfId: channel.channelId,
                bms: createBmsOption('COMMERCE', {
                  imageId,
                  commerce: createBmsCommerce(),
                  // buttons 누락
                }),
              },
            }),
          ),
        );

        expect(result._tag).toBe('Left');
      }).pipe(Effect.provide(MessageTestServicesLive)),
    );

    it.effect(
      'PREMIUM_VIDEO with invalid videoUrl (tv.kakao.com 아닌 URL)',
      () =>
        Effect.gen(function* () {
          const messageService = yield* MessageServiceTag;
          const kakaoChannelService = yield* KakaoChannelServiceTag;
          const senderNumber = yield* Config.string('SENDER_NUMBER').pipe(
            Config.withDefault('01000000000'),
          );

          const channelsResponse = yield* Effect.tryPromise(() =>
            kakaoChannelService.getKakaoChannels({limit: 1}),
          );

          if (channelsResponse.channelList.length === 0) {
            yield* Console.log(
              '카카오 채널이 없어서 에러 테스트를 건너뜁니다.',
            );
            return;
          }

          const channel = channelsResponse.channelList[0];

          const result = yield* Effect.either(
            Effect.tryPromise(() =>
              messageService.send({
                to: testPhoneNumber,
                from: senderNumber,
                text: 'BMS PREMIUM_VIDEO 에러 테스트',
                type: 'BMS_FREE',
                kakaoOptions: {
                  pfId: channel.channelId,
                  bms: createBmsOption('PREMIUM_VIDEO', {
                    video: {
                      videoUrl: 'https://youtube.com/watch?v=invalid', // 잘못된 URL
                    },
                  }),
                },
              }),
            ),
          );

          expect(result._tag).toBe('Left');
        }).pipe(Effect.provide(MessageTestServicesLive)),
    );

    it.effect('Invalid coupon title (쿠폰 제목 형식 오류)', () =>
      Effect.gen(function* () {
        const messageService = yield* MessageServiceTag;
        const kakaoChannelService = yield* KakaoChannelServiceTag;
        const senderNumber = yield* Config.string('SENDER_NUMBER').pipe(
          Config.withDefault('01000000000'),
        );

        const channelsResponse = yield* Effect.tryPromise(() =>
          kakaoChannelService.getKakaoChannels({limit: 1}),
        );

        if (channelsResponse.channelList.length === 0) {
          yield* Console.log('카카오 채널이 없어서 에러 테스트를 건너뜁니다.');
          return;
        }

        const channel = channelsResponse.channelList[0];

        const result = yield* Effect.either(
          Effect.tryPromise(() =>
            messageService.send({
              to: testPhoneNumber,
              from: senderNumber,
              text: 'BMS TEXT 쿠폰 에러 테스트',
              type: 'BMS_FREE',
              kakaoOptions: {
                pfId: channel.channelId,
                bms: createBmsOption('TEXT', {
                  coupon: {
                    title: '잘못된 쿠폰 제목', // 허용되지 않는 형식
                    description: '테스트',
                  },
                }),
              },
            }),
          ),
        );

        expect(result._tag).toBe('Left');
      }).pipe(Effect.provide(MessageTestServicesLive)),
    );

    it.effect('CAROUSEL_FEED without carousel (필수 필드 누락)', () =>
      Effect.gen(function* () {
        const messageService = yield* MessageServiceTag;
        const kakaoChannelService = yield* KakaoChannelServiceTag;
        const senderNumber = yield* Config.string('SENDER_NUMBER').pipe(
          Config.withDefault('01000000000'),
        );

        const channelsResponse = yield* Effect.tryPromise(() =>
          kakaoChannelService.getKakaoChannels({limit: 1}),
        );

        if (channelsResponse.channelList.length === 0) {
          yield* Console.log('카카오 채널이 없어서 에러 테스트를 건너뜁니다.');
          return;
        }

        const channel = channelsResponse.channelList[0];

        const result = yield* Effect.either(
          Effect.tryPromise(() =>
            messageService.send({
              to: testPhoneNumber,
              from: senderNumber,
              text: 'BMS CAROUSEL_FEED 에러 테스트',
              type: 'BMS_FREE',
              kakaoOptions: {
                pfId: channel.channelId,
                bms: createBmsOption('CAROUSEL_FEED'),
              },
            }),
          ),
        );

        expect(result._tag).toBe('Left');
      }).pipe(Effect.provide(MessageTestServicesLive)),
    );
  });
});
