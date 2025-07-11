import stringifyQuery from '@lib/stringifyQuery';
import {
  KakaoAlimtalkTemplate,
  KakaoAlimtalkTemplateCategory,
  KakaoAlimtalkTemplateInterface,
  kakaoAlimtalkTemplateSchema,
} from '@models/base/kakao/kakaoAlimtalkTemplate';
import {CreateKakaoAlimtalkTemplateRequest} from '@models/requests/kakao/createKakaoAlimtalkTemplateRequest';
import {
  GetKakaoAlimtalkTemplatesFinalizeRequest,
  GetKakaoAlimtalkTemplatesRequest,
} from '@models/requests/kakao/getKakaoAlimtalkTemplatesRequest';
import {UpdateKakaoAlimtalkTemplateRequest} from '@models/requests/kakao/updateKakaoAlimtalkTemplateRequest';
import {
  GetKakaoAlimtalkTemplatesFinalizeResponse,
  GetKakaoAlimtalkTemplatesResponseSchema,
} from '@models/responses/kakao/getKakaoAlimtalkTemplatesResponse';
import {GetKakaoTemplateResponse} from '@models/responses/kakao/getKakaoTemplateResponse';
import {Effect, Schema, pipe} from 'effect';
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
    return this.request<never, Array<KakaoAlimtalkTemplateCategory>>({
      httpMethod: 'GET',
      url: 'kakao/v2/templates/categories',
    });
  }

  /**
   * @description 카카오 알림톡 템플릿 생성
   * 반드시 getKakaoAlimtalkTemplateCategories를 먼저 호출하여 카테고리 값을 확인해야 합니다!
   * @param data 알림톡 템플릿 생성을 위한 파라미터
   */
  async createKakaoAlimtalkTemplate(
    data: CreateKakaoAlimtalkTemplateRequest,
  ): Promise<KakaoAlimtalkTemplate> {
    const response = await this.request<
      CreateKakaoAlimtalkTemplateRequest,
      KakaoAlimtalkTemplateInterface
    >({
      httpMethod: 'POST',
      url: 'kakao/v2/templates',
      body: data,
    });

    return new KakaoAlimtalkTemplate(response);
  }

  /**
   * 카카오 템플릿 목록 조회
   * @param data 카카오 템플릿 목록을 더 자세하게 조회할 때 필요한 파라미터
   */
  async getKakaoAlimtalkTemplates(
    data?: GetKakaoAlimtalkTemplatesRequest,
  ): Promise<GetKakaoAlimtalkTemplatesFinalizeResponse> {
    let payload: GetKakaoAlimtalkTemplatesFinalizeRequest = {};
    if (data) {
      payload = new GetKakaoAlimtalkTemplatesFinalizeRequest(data);
    }

    const parameter = stringifyQuery(payload, {
      indices: false,
      addQueryPrefix: true,
    });
    const response = await this.request<
      never,
      GetKakaoAlimtalkTemplatesResponseSchema
    >({
      httpMethod: 'GET',
      url: `kakao/v2/templates${parameter}`,
    });

    const processTemplate = (template: unknown) =>
      Schema.decodeUnknown(kakaoAlimtalkTemplateSchema)(template);

    const processAllTemplates = pipe(
      Effect.all(response.templateList.map(processTemplate)),
      Effect.runPromise,
    );

    const templateList = await processAllTemplates;

    return {
      limit: response.limit,
      nextKey: response.nextKey,
      startKey: response.startKey,
      templateList,
    };
  }

  /**
   * 카카오 템플릿 상세 조회
   * @param templateId 카카오 알림톡 템플릿 ID
   */
  async getKakaoAlimtalkTemplate(
    templateId: string,
  ): Promise<KakaoAlimtalkTemplate> {
    const response = await this.request<never, GetKakaoTemplateResponse>({
      httpMethod: 'GET',
      url: `kakao/v2/templates/${templateId}`,
    });
    return new KakaoAlimtalkTemplate(response);
  }

  /**
   * 카카오 알림톡 템플릿 검수 취소 요청
   * @param templateId 카카오 알림톡 템플릿 ID
   */
  async cancelInspectionKakaoAlimtalkTemplate(
    templateId: string,
  ): Promise<KakaoAlimtalkTemplate> {
    const response = await this.request<never, KakaoAlimtalkTemplateInterface>({
      httpMethod: 'PUT',
      url: `kakao/v2/templates/${templateId}/inspection/cancel`,
    });
    return new KakaoAlimtalkTemplate(response);
  }

  /**
   * 카카오 알림톡 템플릿 수정(검수 X)
   * @param templateId 카카오 알림톡 템플릿 ID
   * @param data 카카오 알림톡 템플릿 수정을 위한 파라미터
   */
  async updateKakaoAlimtalkTemplate(
    templateId: string,
    data: UpdateKakaoAlimtalkTemplateRequest,
  ): Promise<KakaoAlimtalkTemplate> {
    const response = await this.request<
      UpdateKakaoAlimtalkTemplateRequest,
      KakaoAlimtalkTemplateInterface
    >({
      httpMethod: 'PUT',
      url: `kakao/v2/templates/${templateId}`,
      body: data,
    });
    return new KakaoAlimtalkTemplate(response);
  }

  /**
   * 카카오 알림톡 템플릿 이름 수정(검수 상태 상관없이 변경가능)
   * @param templateId 카카오 알림톡 템플릿 ID
   * @param name 카카오 알림톡 템플릿 이름 변경을 위한 파라미터
   */
  async updateKakaoAlimtalkTemplateName(
    templateId: string,
    name: string,
  ): Promise<KakaoAlimtalkTemplate> {
    const response = await this.request<
      {
        name: string;
      },
      KakaoAlimtalkTemplateInterface
    >({
      httpMethod: 'PUT',
      url: `kakao/v2/templates/${templateId}/name`,
      body: {name},
    });
    return new KakaoAlimtalkTemplate(response);
  }

  /**
   * 카카오 알림톡 템플릿 삭제(대기, 반려 상태일 때만 삭제가능)
   * @param templateId 카카오 알림톡 템플릿 ID
   */
  async removeKakaoAlimtalkTemplate(
    templateId: string,
  ): Promise<KakaoAlimtalkTemplate> {
    const response = await this.request<never, KakaoAlimtalkTemplateInterface>({
      httpMethod: 'DELETE',
      url: `kakao/v2/templates/${templateId}`,
    });
    return new KakaoAlimtalkTemplate(response);
  }
}
