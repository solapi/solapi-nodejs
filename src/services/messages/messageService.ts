import {toCompatibleError} from '@lib/effectErrorHandler';
import stringifyQuery from '@lib/stringifyQuery';
import {
  GetMessagesFinalizeRequest,
  GetMessagesRequest,
} from '@models/requests/messages/getMessagesRequest';
import {
  GetStatisticsFinalizeRequest,
  GetStatisticsRequest,
} from '@models/requests/messages/getStatisticsRequest';
import {
  SendRequestConfigSchema,
  sendRequestConfigSchema,
} from '@models/requests/messages/requestConfig';
import {
  MultipleMessageSendingRequestSchema,
  multipleMessageSendingRequestSchema,
  RequestSendMessagesSchema,
  RequestSendOneMessageSchema,
  requestSendMessageSchema,
  requestSendOneMessageSchema,
  SingleMessageSendingRequestSchema,
} from '@models/requests/messages/sendMessage';
import {
  GetMessagesResponse,
  GetStatisticsResponse,
  SingleMessageSentResponse,
} from '@models/responses/messageResponses';
import {DetailGroupMessageResponse} from '@models/responses/sendManyDetailResponse';
import {Cause, Chunk, Exit, Schema} from 'effect';
import * as Effect from 'effect/Effect';
import {
  BadRequestError,
  MessageNotReceivedError,
} from '../../errors/defaultError';
import DefaultService from '../defaultService';

export default class MessageService extends DefaultService {
  constructor(apiKey: string, apiSecret: string) {
    super(apiKey, apiSecret);
  }

  /**
   * 단일 메시지 발송 기능
   * @param message 메시지(문자, 알림톡 등)
   * @param appId appstore용 app id
   */
  async sendOne(
    message: RequestSendOneMessageSchema,
    appId?: string,
  ): Promise<SingleMessageSentResponse> {
    const decodedMessage = Schema.decodeUnknownSync(
      requestSendOneMessageSchema,
    )(message);

    const parameter = {
      message: decodedMessage,
      ...(appId ? {agent: {appId}} : {}),
    } as SingleMessageSendingRequestSchema;

    return this.request<
      SingleMessageSendingRequestSchema,
      SingleMessageSentResponse
    >({
      httpMethod: 'POST',
      url: 'messages/v4/send',
      body: parameter,
    });
  }

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
    const request = this.request.bind(this);

    const effect = Effect.gen(function* (_) {
      /**
       * 1. 스키마 검증 - Effect 내부에서 실행하여 에러를 안전하게 처리
       */
      const messageSchema = yield* _(
        Effect.try({
          try: () =>
            Schema.decodeUnknownSync(requestSendMessageSchema)(messages),
          catch: error =>
            new BadRequestError({
              message: error instanceof Error ? error.message : String(error),
            }),
        }),
      );

      /**
       * 2. MessageParameter → Message 변환 및 기본 검증
       */
      const messageParameters = Array.isArray(messageSchema)
        ? messageSchema
        : [messageSchema];

      if (messageParameters.length === 0) {
        return yield* _(
          Effect.fail(
            new BadRequestError({
              message: '데이터가 반드시 1건 이상 기입되어 있어야 합니다.',
            }),
          ),
        );
      }

      const decodedConfig = yield* _(
        Effect.try({
          try: () =>
            Schema.decodeUnknownSync(sendRequestConfigSchema)(
              requestConfigParameter ?? {},
            ),
          catch: error =>
            new BadRequestError({
              message: error instanceof Error ? error.message : String(error),
            }),
        }),
      );

      const parameterObject = {
        messages: messageParameters,
        allowDuplicates: decodedConfig.allowDuplicates,
        ...(decodedConfig.appId ? {agent: {appId: decodedConfig.appId}} : {}),
        scheduledDate: decodedConfig.scheduledDate,
        showMessageList: decodedConfig.showMessageList,
      };

      // 스키마 검증 및 파라미터 확정
      const parameter = yield* _(
        Effect.try({
          try: () =>
            Schema.decodeSync(multipleMessageSendingRequestSchema)(
              parameterObject,
            ),
          catch: error =>
            new BadRequestError({
              message: error instanceof Error ? error.message : String(error),
            }),
        }),
      );

      /**
       * 3. API 호출 (this.request) – Promise → Effect 변환
       */
      const response: DetailGroupMessageResponse = yield* _(
        Effect.promise(() =>
          request<
            MultipleMessageSendingRequestSchema,
            DetailGroupMessageResponse
          >({
            httpMethod: 'POST',
            url: 'messages/v4/send-many/detail',
            body: parameter,
          }),
        ),
      );

      /**
       * 4. 모든 메시지 발송건이 실패인 경우 MessageNotReceivedError 반환
       */
      const {count} = response.groupInfo;
      const failedAll =
        response.failedMessageList.length > 0 &&
        count.total === count.registeredFailed;

      if (failedAll) {
        return yield* _(
          Effect.fail(
            new MessageNotReceivedError({
              failedMessageList: response.failedMessageList,
              totalCount: response.failedMessageList.length,
            }),
          ),
        );
      }

      return response;
    });

    // Effect를 Promise로 변환하되 에러를 표준 Error 객체로 변환
    const exit = await Effect.runPromiseExit(effect);

    return Exit.match(exit, {
      onFailure: cause => {
        // Effect 에러를 표준 JavaScript Error로 변환
        const failure = Cause.failureOption(cause);
        if (failure._tag === 'Some') {
          throw toCompatibleError(failure.value);
        }
        // Defect 처리
        const defects = Cause.defects(cause);
        if (defects.length > 0) {
          const firstDefect = Chunk.unsafeGet(defects, 0);
          if (firstDefect instanceof Error) {
            throw firstDefect;
          }
          const isProduction = process.env.NODE_ENV === 'production';
          const message = isProduction
            ? `Unexpected error: ${String(firstDefect)}`
            : `Unexpected error: ${String(firstDefect)}\nCause: ${Cause.pretty(cause)}`;
          throw new Error(message);
        }
        throw new Error(`Unhandled Exit: ${Cause.pretty(cause)}`);
      },
      onSuccess: value => value,
    });
  }

  /**
   * 메시지 목록 조회
   * @param data 목록 조회 상세조건 파라미터
   */
  async getMessages(
    data?: Readonly<GetMessagesRequest>,
  ): Promise<GetMessagesResponse> {
    let payload: GetMessagesFinalizeRequest = {};
    if (data) {
      payload = new GetMessagesFinalizeRequest(data);
    }
    const parameter = stringifyQuery(payload, {
      indices: false,
      addQueryPrefix: true,
    });
    return this.request<never, GetMessagesResponse>({
      httpMethod: 'GET',
      url: `messages/v4/list${parameter}`,
    });
  }

  /**
   * 통계 조회
   * @param data 통계 상세 조건 파라미터
   * @returns GetStatisticsResponse 통계 결과
   */
  async getStatistics(
    data?: Readonly<GetStatisticsRequest>,
  ): Promise<GetStatisticsResponse> {
    let payload: GetStatisticsFinalizeRequest = {};
    if (data) {
      payload = new GetStatisticsFinalizeRequest(data);
    }
    const parameter = stringifyQuery(payload, {
      indices: false,
      addQueryPrefix: true,
    });
    return this.request<never, GetStatisticsResponse>({
      httpMethod: 'GET',
      url: `messages/v4/statistics${parameter}`,
    });
  }
}
