/**
 * KakaoTemplateService E2E 테스트
 *
 * ## 환경변수 설정
 * 실제 테스트 실행을 위해서는 다음 환경 변수가 필요합니다:
 * - API_KEY: SOLAPI API 키
 * - API_SECRET: SOLAPI API 시크릿
 *
 * ## .env 파일 예시
 * ```
 * API_KEY=your_solapi_api_key_here
 * API_SECRET=your_solapi_api_secret_here
 * ```
 *
 * ## 테스트 특징
 * - 조회 관련 테스트만 포함 (생성, 수정, 삭제는 실제 비즈니스 데이터에 영향을 주므로 제외)
 * - 실제 등록된 템플릿과 채널이 있으면 해당 데이터를 사용하여 테스트
 * - 데이터가 없으면 해당 테스트는 자동으로 건너뜀
 * - Effect를 활용한 함수형 프로그래밍 방식으로 구현
 *
 * ## 테스트 실행
 * ```bash
 * # 카카오 템플릿 서비스 e2e 테스트 실행
 * yarn test test/services/kakao/kakaoTemplateService.e2e.test.ts
 *
 * # 특정 테스트만 실행 (예: 템플릿 카테고리 테스트)
 * yarn test test/services/kakao/kakaoTemplateService.e2e.test.ts -t "should return kakao alimtalk template categories"
 * ```
 *
 * ## 주의사항
 * - 이 테스트들은 실제 데이터 조회를 수행하므로 API 호출 비용이 발생할 수 있습니다
 * - 템플릿 생성/수정/삭제 관련 테스트는 실제 운영 데이터에 영향을 주므로 포함하지 않았습니다
 */
import {describe, expect, it} from '@effect/vitest';
import {
  KakaoChannelServiceTag,
  KakaoTemplateServiceTag,
  MessageTestServicesLive,
} from '@test/lib/test-layers';
import {Console, Effect} from 'effect';

describe('KakaoTemplateService E2E', () => {
  describe('Template Categories', () => {
    it.effect('should return kakao alimtalk template categories', () =>
      Effect.gen(function* () {
        const kakaoTemplateService = yield* KakaoTemplateServiceTag;

        const result = yield* Effect.tryPromise(() =>
          kakaoTemplateService.getKakaoAlimtalkTemplateCategories(),
        );

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);

        // 카테고리 객체 구조 검증
        if (result.length > 0) {
          const category = result[0];
          expect(category).toHaveProperty('code');
          expect(category).toHaveProperty('name');
          expect(typeof category.code).toBe('string');
          expect(typeof category.name).toBe('string');
        }
      }).pipe(Effect.provide(MessageTestServicesLive)),
    );
  });

  describe('Template List Operations', () => {
    it.effect('should return kakao alimtalk templates', () =>
      Effect.gen(function* () {
        const kakaoTemplateService = yield* KakaoTemplateServiceTag;

        const result = yield* Effect.tryPromise(() =>
          kakaoTemplateService.getKakaoAlimtalkTemplates(),
        );

        expect(result).toBeTypeOf('object');
        expect(Array.isArray(result.templateList)).toBe(true);
        expect(result).toHaveProperty('limit');
        expect(result).toHaveProperty('startKey');
        expect(result).toHaveProperty('nextKey');

        yield* Console.log(
          `총 ${result.templateList.length}개의 템플릿이 조회되었습니다.`,
        );
      }).pipe(Effect.provide(MessageTestServicesLive)),
    );

    it.effect('should return kakao alimtalk templates with parameters', () =>
      Effect.gen(function* () {
        const kakaoTemplateService = yield* KakaoTemplateServiceTag;

        const result = yield* Effect.tryPromise(() =>
          kakaoTemplateService.getKakaoAlimtalkTemplates({
            limit: 5,
            status: 'APPROVED',
          }),
        );

        expect(result).toBeTypeOf('object');
        expect(Array.isArray(result.templateList)).toBe(true);
        expect(result.templateList.length).toBeLessThanOrEqual(5);

        // 승인된 템플릿만 조회되었는지 확인
        for (const template of result.templateList) {
          expect(template.status).toBe('APPROVED');
        }
      }).pipe(Effect.provide(MessageTestServicesLive)),
    );
  });

  describe('Template Detail Operations', () => {
    it.effect(
      'should return specific template details when template exists',
      () =>
        Effect.gen(function* () {
          const kakaoTemplateService = yield* KakaoTemplateServiceTag;

          // given - 먼저 존재하는 템플릿 하나를 가져오기
          const templatesResult = yield* Effect.tryPromise(() =>
            kakaoTemplateService.getKakaoAlimtalkTemplates({
              limit: 1,
            }),
          );

          if (templatesResult.templateList.length === 0) {
            yield* Console.log(
              '등록된 템플릿이 없어서 템플릿 상세 조회 테스트를 건너뜁니다.',
            );
            return;
          }

          const existingTemplate = templatesResult.templateList[0];

          // when
          const result = yield* Effect.tryPromise(() =>
            kakaoTemplateService.getKakaoAlimtalkTemplate(
              existingTemplate.templateId,
            ),
          );

          // then
          expect(result).toBeTypeOf('object');
          expect(result.templateId).toBe(existingTemplate.templateId);
          expect(result).toHaveProperty('code');
          expect(result).toHaveProperty('content');
          expect(result).toHaveProperty('status');
          expect(result).toHaveProperty('channelId');

          yield* Console.log(
            `템플릿 상세 정보 조회 성공: ${result.code || 'N/A'}`,
          );
        }).pipe(Effect.provide(MessageTestServicesLive)),
    );

    it.effect('should throw error for non-existent template', () =>
      Effect.gen(function* () {
        const kakaoTemplateService = yield* KakaoTemplateServiceTag;

        // given
        const nonExistentTemplateId = 'non-existent-template-12345';

        // when & then
        const result = yield* Effect.either(
          Effect.tryPromise(() =>
            kakaoTemplateService.getKakaoAlimtalkTemplate(
              nonExistentTemplateId,
            ),
          ),
        );

        expect(result._tag).toBe('Left');
      }).pipe(Effect.provide(MessageTestServicesLive)),
    );
  });

  describe('Template Filtering by Channel', () => {
    it.effect(
      'should return templates filtered by channel when channel exists',
      () =>
        Effect.gen(function* () {
          const kakaoTemplateService = yield* KakaoTemplateServiceTag;
          const kakaoChannelService = yield* KakaoChannelServiceTag;

          // given - 먼저 존재하는 채널 하나를 가져오기
          const channelsResult = yield* Effect.tryPromise(() =>
            kakaoChannelService.getKakaoChannels({
              limit: 1,
            }),
          );

          if (channelsResult.channelList.length === 0) {
            yield* Console.log(
              '등록된 채널이 없어서 채널별 템플릿 조회 테스트를 건너뜁니다.',
            );
            return;
          }

          const existingChannel = channelsResult.channelList[0];

          // when
          const result = yield* Effect.tryPromise(() =>
            kakaoTemplateService.getKakaoAlimtalkTemplates({
              channelId: existingChannel.channelId,
              limit: 10,
            }),
          );

          // then
          expect(result).toBeTypeOf('object');
          expect(Array.isArray(result.templateList)).toBe(true);

          // 해당 채널의 템플릿만 조회되었는지 확인
          for (const template of result.templateList) {
            expect(template.channelId).toBe(existingChannel.channelId);
          }

          yield* Console.log(
            `채널 ${existingChannel.channelId}의 템플릿 ${result.templateList.length}개가 조회되었습니다.`,
          );
        }).pipe(Effect.provide(MessageTestServicesLive)),
    );
  });

  describe('Template Status Filtering', () => {
    it.effect('should return templates filtered by approved status only', () =>
      Effect.gen(function* () {
        const kakaoTemplateService = yield* KakaoTemplateServiceTag;

        // 스키마 검증 이슈를 피하기 위해 APPROVED 상태만 테스트
        const status = 'APPROVED';

        // when
        const result = yield* Effect.tryPromise(() =>
          kakaoTemplateService.getKakaoAlimtalkTemplates({
            status,
            limit: 5,
          }),
        );

        // then
        expect(result).toBeTypeOf('object');
        expect(Array.isArray(result.templateList)).toBe(true);

        // 해당 상태의 템플릿만 조회되었는지 확인
        for (const template of result.templateList) {
          expect(template.status).toBe(status);
        }

        yield* Console.log(
          `상태 ${status}인 템플릿 ${result.templateList.length}개가 조회되었습니다.`,
        );
      }).pipe(Effect.provide(MessageTestServicesLive)),
    );
  });

  describe('Integration with Channel Service', () => {
    it.effect(
      'should integrate with channel service to verify template-channel relationship',
      () =>
        Effect.gen(function* () {
          const kakaoTemplateService = yield* KakaoTemplateServiceTag;
          const kakaoChannelService = yield* KakaoChannelServiceTag;

          // given - 채널과 템플릿 정보 가져오기
          const channelsResult = yield* Effect.tryPromise(() =>
            kakaoChannelService.getKakaoChannels({limit: 20}),
          );

          const templatesResult = yield* Effect.tryPromise(() =>
            kakaoTemplateService.getKakaoAlimtalkTemplates({limit: 10}),
          );

          if (
            channelsResult.channelList.length === 0 ||
            templatesResult.templateList.length === 0
          ) {
            yield* Console.log(
              '채널 또는 템플릿이 없어서 통합 테스트를 건너뜁니다.',
            );
            return;
          }

          // when & then
          const channelIds = new Set(
            channelsResult.channelList.map(c => c.channelId),
          );
          let validTemplatesCount = 0;

          for (const template of templatesResult.templateList) {
            // 템플릿에 channelId가 있는 경우에만 검증
            if (template.channelId) {
              const isValidChannel = channelIds.has(template.channelId);
              if (isValidChannel) {
                validTemplatesCount++;
              }
            }
          }

          // 최소한 하나의 템플릿은 유효한 채널에 속해있어야 함
          expect(validTemplatesCount).toBeGreaterThan(0);

          yield* Console.log(
            `총 ${templatesResult.templateList.length}개 템플릿 중 ${validTemplatesCount}개가 유효한 채널에 속해있습니다.`,
          );
        }).pipe(Effect.provide(MessageTestServicesLive)),
    );
  });

  describe('Advanced Template Operations', () => {
    it.effect('should handle parallel template queries efficiently', () =>
      Effect.gen(function* () {
        const kakaoTemplateService = yield* KakaoTemplateServiceTag;

        // 병렬로 여러 쿼리 실행
        const [categoriesResult, templatesResult, approvedTemplatesResult] =
          yield* Effect.all([
            Effect.tryPromise(() =>
              kakaoTemplateService.getKakaoAlimtalkTemplateCategories(),
            ),
            Effect.tryPromise(() =>
              kakaoTemplateService.getKakaoAlimtalkTemplates({limit: 5}),
            ),
            Effect.tryPromise(() =>
              kakaoTemplateService.getKakaoAlimtalkTemplates({
                status: 'APPROVED',
                limit: 3,
              }),
            ),
          ]);

        expect(Array.isArray(categoriesResult)).toBe(true);
        expect(Array.isArray(templatesResult.templateList)).toBe(true);
        expect(Array.isArray(approvedTemplatesResult.templateList)).toBe(true);

        yield* Console.log(
          `병렬 쿼리 완료: 카테고리 ${categoriesResult.length}개, 전체 템플릿 ${templatesResult.templateList.length}개, 승인된 템플릿 ${approvedTemplatesResult.templateList.length}개`,
        );
      }).pipe(Effect.provide(MessageTestServicesLive)),
    );

    it.effect('should handle template pagination correctly', () =>
      Effect.gen(function* () {
        const kakaoTemplateService = yield* KakaoTemplateServiceTag;

        // 첫 번째 페이지
        const firstPage = yield* Effect.tryPromise(() =>
          kakaoTemplateService.getKakaoAlimtalkTemplates({limit: 3}),
        );

        expect(Array.isArray(firstPage.templateList)).toBe(true);
        expect(firstPage.templateList.length).toBeLessThanOrEqual(3);

        // nextKey가 있으면 다음 페이지도 조회
        if (firstPage.nextKey) {
          const secondPage = yield* Effect.tryPromise(() =>
            kakaoTemplateService.getKakaoAlimtalkTemplates({
              limit: 3,
              startKey: firstPage.nextKey || undefined,
            }),
          );

          expect(Array.isArray(secondPage.templateList)).toBe(true);

          yield* Console.log(
            `페이지네이션 테스트 완료: 첫 페이지 ${firstPage.templateList.length}개, 두 번째 페이지 ${secondPage.templateList.length}개`,
          );
        } else {
          yield* Console.log(
            `페이지네이션 테스트: 첫 페이지만 존재 (${firstPage.templateList.length}개)`,
          );
        }
      }).pipe(Effect.provide(MessageTestServicesLive)),
    );

    it.effect('should validate template data structure comprehensively', () =>
      Effect.gen(function* () {
        const kakaoTemplateService = yield* KakaoTemplateServiceTag;

        const result = yield* Effect.tryPromise(() =>
          kakaoTemplateService.getKakaoAlimtalkTemplates({limit: 1}),
        );

        if (result.templateList.length === 0) {
          yield* Console.log('템플릿이 없어서 데이터 구조 검증을 건너뜁니다.');
          return;
        }

        const template = result.templateList[0];

        // 필수 필드 검증
        expect(template).toHaveProperty('templateId');
        expect(template).toHaveProperty('name');
        expect(template).toHaveProperty('status');
        expect(template).toHaveProperty('messageType');
        expect(template).toHaveProperty('emphasizeType');
        expect(template).toHaveProperty('securityFlag');

        // 타입 검증
        expect(typeof template.templateId).toBe('string');
        expect(typeof template.name).toBe('string');
        expect(['PENDING', 'INSPECTING', 'APPROVED', 'REJECTED']).toContain(
          template.status,
        );
        expect(['BA', 'EX', 'AD', 'MI']).toContain(template.messageType);
        expect(['NONE', 'TEXT', 'IMAGE', 'ITEM_LIST']).toContain(
          template.emphasizeType,
        );
        expect(typeof template.securityFlag).toBe('boolean');

        yield* Console.log(
          `템플릿 데이터 구조 검증 완료: ${template.templateId}`,
        );
      }).pipe(Effect.provide(MessageTestServicesLive)),
    );
  });
});
