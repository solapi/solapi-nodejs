import {runSafePromise} from '@lib/effectErrorHandler';
import {decodeWithBadRequest} from '@lib/schemaUtils';
import {
  finalizeGetMessagesRequest,
  type GetMessagesRequest,
  getMessagesRequestSchema,
} from '@models/requests/messages/getMessagesRequest';
import {
  finalizeGetStatisticsRequest,
  type GetStatisticsRequest,
  getStatisticsRequestSchema,
} from '@models/requests/messages/getStatisticsRequest';
import {
  SendRequestConfigSchema,
  sendRequestConfigSchema,
} from '@models/requests/messages/requestConfig';
import {
  type MultipleMessageSendingRequestSchema,
  multipleMessageSendingRequestSchema,
  type RequestSendMessagesSchema,
  requestSendMessageSchema,
} from '@models/requests/messages/sendMessage';
import {
  GetMessagesResponse,
  GetStatisticsResponse,
  getMessagesResponseSchema,
  getStatisticsResponseSchema,
} from '@models/responses/messageResponses';
import {DetailGroupMessageResponse} from '@models/responses/sendManyDetailResponse';
import * as Effect from 'effect/Effect';
import {
  BadRequestError,
  MessageNotReceivedError,
} from '../../errors/defaultError';
import DefaultService from '../defaultService';

export default class MessageService extends DefaultService {
  /**
   * 메시지 발송 기능, sendMany 함수보다 개선된 오류 표시 기능등을 제공합니다.
   * 한번의 요청으로 최대 10,000건까지 발송할 수 있습니다.
   * @param messages 발송 요청할 메시지 파라미터(문자, 알림톡 등)
   * @param requestConfigParameter request시 필요한 파라미터 오브젝트
   * @throws MessageNotReceivedError 모든 메시지 접수건이 실패건으로 진행되는 경우 반환되는 에러
   * @throws BadRequestError 잘못된 파라미터를 기입했거나, 데이터가 아예 없는 경우 반환되는 에러
   */
  async send(
    messages: RequestSendMessagesSchema,
    requestConfigParameter?: SendRequestConfigSchema,
  ): Promise<DetailGroupMessageResponse> {
    const reqEffect = this.requestEffect.bind(this);

    return runSafePromise(
      Effect.gen(function* () {
        const messageSchema = yield* decodeWithBadRequest(
          requestSendMessageSchema,
          messages,
        );

        const messageParameters = Array.isArray(messageSchema)
          ? messageSchema
          : [messageSchema];

        if (messageParameters.length === 0) {
          return yield* new BadRequestError({
            message: '데이터가 반드시 1건 이상 기입되어 있어야 합니다.',
          });
        }

        const decodedConfig = yield* decodeWithBadRequest(
          sendRequestConfigSchema,
          requestConfigParameter ?? {},
        );

        const parameterObject = {
          messages: messageParameters,
          allowDuplicates: decodedConfig.allowDuplicates,
          ...(decodedConfig.appId ? {agent: {appId: decodedConfig.appId}} : {}),
          scheduledDate: decodedConfig.scheduledDate,
          showMessageList: decodedConfig.showMessageList,
        };

        const parameter = yield* decodeWithBadRequest(
          multipleMessageSendingRequestSchema,
          parameterObject,
        );

        const response = yield* reqEffect<
          MultipleMessageSendingRequestSchema,
          DetailGroupMessageResponse
        >({
          httpMethod: 'POST',
          url: 'messages/v4/send-many/detail',
          body: parameter,
        });

        const {count} = response.groupInfo;
        const failedAll =
          response.failedMessageList.length > 0 &&
          count.total === count.registeredFailed;

        if (failedAll) {
          return yield* new MessageNotReceivedError({
            failedMessageList: response.failedMessageList,
            totalCount: response.failedMessageList.length,
          });
        }

        return response;
      }),
    );
  }

  /**
   * 메시지 목록 조회
   * @param data 목록 조회 상세조건 파라미터
   */
  async getMessages(
    data?: Readonly<GetMessagesRequest>,
  ): Promise<GetMessagesResponse> {
    return runSafePromise(
      this.getWithQuery({
        schema: getMessagesRequestSchema,
        finalize: finalizeGetMessagesRequest,
        url: 'messages/v4/list',
        data,
        responseSchema: getMessagesResponseSchema,
      }),
    );
  }

  /**
   * 통계 조회
   * @param data 통계 상세 조건 파라미터
   * @returns GetStatisticsResponse 통계 결과
   */
  async getStatistics(
    data?: Readonly<GetStatisticsRequest>,
  ): Promise<GetStatisticsResponse> {
    return runSafePromise(
      this.getWithQuery({
        schema: getStatisticsRequestSchema,
        finalize: finalizeGetStatisticsRequest,
        url: 'messages/v4/statistics',
        data,
        responseSchema: getStatisticsResponseSchema,
      }),
    );
  }
}
