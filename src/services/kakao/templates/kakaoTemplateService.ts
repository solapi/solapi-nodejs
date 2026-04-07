import {runSafePromise} from '@lib/effectErrorHandler';
import stringifyQuery from '@lib/stringifyQuery';
import {
  decodeKakaoAlimtalkTemplate,
  type KakaoAlimtalkTemplate,
  type KakaoAlimtalkTemplateCategory,
  type KakaoAlimtalkTemplateSchema,
} from '@models/base/kakao/kakaoAlimtalkTemplate';
import {type CreateKakaoAlimtalkTemplateRequest} from '@models/requests/kakao/createKakaoAlimtalkTemplateRequest';
import {
  finalizeGetKakaoAlimtalkTemplatesRequest,
  type GetKakaoAlimtalkTemplatesRequest,
} from '@models/requests/kakao/getKakaoAlimtalkTemplatesRequest';
import {type UpdateKakaoAlimtalkTemplateRequest} from '@models/requests/kakao/updateKakaoAlimtalkTemplateRequest';
import {
  type GetKakaoAlimtalkTemplatesFinalizeResponse,
  type GetKakaoAlimtalkTemplatesResponseSchema,
} from '@models/responses/kakao/getKakaoAlimtalkTemplatesResponse';
import {type GetKakaoTemplateResponse} from '@models/responses/kakao/getKakaoTemplateResponse';
import * as Effect from 'effect/Effect';
import DefaultService from '../../defaultService';

export default class KakaoTemplateService extends DefaultService {
  constructor(apiKey: string, apiSecret: string) {
    super(apiKey, apiSecret);
  }

  /**
   * 카카오 템플릿 카테고리 조회
   */
  async getKakaoAlimtalkTemplateCategories(): Promise<
    Array<KakaoAlimtalkTemplateCategory>
  > {
    const reqEffect = this.requestEffect.bind(this);
    return runSafePromise(
      Effect.gen(function* () {
        return yield* reqEffect<never, Array<KakaoAlimtalkTemplateCategory>>({
          httpMethod: 'GET',
          url: 'kakao/v2/templates/categories',
        });
      }),
    );
  }

  /**
   * @description 카카오 알림톡 템플릿 생성
   */
  async createKakaoAlimtalkTemplate(
    data: CreateKakaoAlimtalkTemplateRequest,
  ): Promise<KakaoAlimtalkTemplate> {
    const reqEffect = this.requestEffect.bind(this);
    return runSafePromise(
      Effect.gen(function* () {
        const response = yield* reqEffect<
          CreateKakaoAlimtalkTemplateRequest,
          KakaoAlimtalkTemplateSchema
        >({
          httpMethod: 'POST',
          url: 'kakao/v2/templates',
          body: data,
        });
        return yield* decodeKakaoAlimtalkTemplate(response);
      }),
    );
  }

  /**
   * 카카오 템플릿 목록 조회
   */
  async getKakaoAlimtalkTemplates(
    data?: GetKakaoAlimtalkTemplatesRequest,
  ): Promise<GetKakaoAlimtalkTemplatesFinalizeResponse> {
    const reqEffect = this.requestEffect.bind(this);
    return runSafePromise(
      Effect.gen(function* () {
        const payload = finalizeGetKakaoAlimtalkTemplatesRequest(data);
        const parameter = stringifyQuery(payload, {
          indices: false,
          addQueryPrefix: true,
        });
        const response = yield* reqEffect<
          never,
          GetKakaoAlimtalkTemplatesResponseSchema
        >({
          httpMethod: 'GET',
          url: `kakao/v2/templates${parameter}`,
        });

        const templateList = yield* Effect.all(
          response.templateList.map(decodeKakaoAlimtalkTemplate),
        );

        return {
          limit: response.limit,
          nextKey: response.nextKey,
          startKey: response.startKey,
          templateList,
        };
      }),
    );
  }

  /**
   * 카카오 템플릿 상세 조회
   */
  async getKakaoAlimtalkTemplate(
    templateId: string,
  ): Promise<KakaoAlimtalkTemplate> {
    const reqEffect = this.requestEffect.bind(this);
    return runSafePromise(
      Effect.gen(function* () {
        const response = yield* reqEffect<never, GetKakaoTemplateResponse>({
          httpMethod: 'GET',
          url: `kakao/v2/templates/${templateId}`,
        });
        return yield* decodeKakaoAlimtalkTemplate(response);
      }),
    );
  }

  /**
   * 카카오 알림톡 템플릿 검수 취소 요청
   */
  async cancelInspectionKakaoAlimtalkTemplate(
    templateId: string,
  ): Promise<KakaoAlimtalkTemplate> {
    const reqEffect = this.requestEffect.bind(this);
    return runSafePromise(
      Effect.gen(function* () {
        const response = yield* reqEffect<never, KakaoAlimtalkTemplateSchema>({
          httpMethod: 'PUT',
          url: `kakao/v2/templates/${templateId}/inspection/cancel`,
        });
        return yield* decodeKakaoAlimtalkTemplate(response);
      }),
    );
  }

  /**
   * 카카오 알림톡 템플릿 수정(검수 X)
   */
  async updateKakaoAlimtalkTemplate(
    templateId: string,
    data: UpdateKakaoAlimtalkTemplateRequest,
  ): Promise<KakaoAlimtalkTemplate> {
    const reqEffect = this.requestEffect.bind(this);
    return runSafePromise(
      Effect.gen(function* () {
        const response = yield* reqEffect<
          UpdateKakaoAlimtalkTemplateRequest,
          KakaoAlimtalkTemplateSchema
        >({
          httpMethod: 'PUT',
          url: `kakao/v2/templates/${templateId}`,
          body: data,
        });
        return yield* decodeKakaoAlimtalkTemplate(response);
      }),
    );
  }

  /**
   * 카카오 알림톡 템플릿 이름 수정(검수 상태 상관없이 변경가능)
   */
  async updateKakaoAlimtalkTemplateName(
    templateId: string,
    name: string,
  ): Promise<KakaoAlimtalkTemplate> {
    const reqEffect = this.requestEffect.bind(this);
    return runSafePromise(
      Effect.gen(function* () {
        const response = yield* reqEffect<
          {name: string},
          KakaoAlimtalkTemplateSchema
        >({
          httpMethod: 'PUT',
          url: `kakao/v2/templates/${templateId}/name`,
          body: {name},
        });
        return yield* decodeKakaoAlimtalkTemplate(response);
      }),
    );
  }

  /**
   * 카카오 알림톡 템플릿 삭제(대기, 반려 상태일 때만 삭제가능)
   */
  async removeKakaoAlimtalkTemplate(
    templateId: string,
  ): Promise<KakaoAlimtalkTemplate> {
    const reqEffect = this.requestEffect.bind(this);
    return runSafePromise(
      Effect.gen(function* () {
        const response = yield* reqEffect<never, KakaoAlimtalkTemplateSchema>({
          httpMethod: 'DELETE',
          url: `kakao/v2/templates/${templateId}`,
        });
        return yield* decodeKakaoAlimtalkTemplate(response);
      }),
    );
  }
}
