import {
  BadRequestError,
  MessageNotReceivedError,
} from '../../errors/defaultError';
import stringifyQuery from '../../lib/stringifyQuery';
import {Message} from '../../models/message';
import {
  MessageParameter,
  MultipleDetailMessageSendingRequest,
  SingleMessageSendingRequest,
} from '../../models/requests/messageRequest';
import {
  GetMessagesFinalizeRequest,
  GetMessagesRequest,
} from '../../models/requests/messages/getMessagesRequest';
import {
  GetStatisticsFinalizeRequest,
  GetStatisticsRequest,
} from '../../models/requests/messages/statistics/getStatisticsRequest';
import {SendRequestConfig} from '../../models/requests/sendRequestConfig';
import {
  GetMessagesResponse,
  GetStatisticsResponse,
  SingleMessageSentResponse,
} from '../../models/responses/messageResponses';
import {DetailGroupMessageResponse} from '../../models/responses/sendManyDetailResponse';
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
    message: Message,
    appId?: string,
  ): Promise<SingleMessageSentResponse> {
    const parameter = new SingleMessageSendingRequest(message, false, appId);
    return this.request<SingleMessageSendingRequest, SingleMessageSentResponse>(
      {
        httpMethod: 'POST',
        url: 'messages/v4/send',
        body: parameter,
      },
    );
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
    messages: MessageParameter | Array<MessageParameter>,
    requestConfigParameter?: SendRequestConfig,
  ): Promise<DetailGroupMessageResponse> {
    const payload: Array<Message> = [];
    if (Array.isArray(messages)) {
      messages.forEach(value => {
        payload.push(new Message(value));
      });
    } else if (!Array.isArray(messages)) {
      payload.push(new Message(messages));
    } else {
      throw new BadRequestError('잘못된 값이 입력되었습니다.');
    }
    if (payload.length === 0) {
      throw new BadRequestError(
        '데이터가 반드시 1건 이상 기입되어 있어야 합니다.',
      );
    }
    const parameter = new MultipleDetailMessageSendingRequest(
      payload,
      requestConfigParameter?.allowDuplicates,
      requestConfigParameter?.appId,
      requestConfigParameter?.scheduledDate,
      requestConfigParameter?.showMessageList,
    );
    return this.request<
      MultipleDetailMessageSendingRequest,
      DetailGroupMessageResponse
    >({
      httpMethod: 'POST',
      url: 'messages/v4/send-many/detail',
      body: parameter,
    }).then((res: DetailGroupMessageResponse) => {
      const count = res.groupInfo.count;
      if (
        res.failedMessageList.length > 0 &&
        count.total === count.registeredFailed
      ) {
        throw new MessageNotReceivedError(res.failedMessageList);
      }
      return res;
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
