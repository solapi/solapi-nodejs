import {formatWithTransfer} from '@lib/stringDateTrasnfer';
import {GroupId} from '@internal-types/commonTypes';
import {MessageType} from '../../base/messages/message';

export type DateType = 'CREATED' | 'UPDATED';

type BaseGetMessagesRequest = {
  startKey?: string;
  limit?: number;
  messageId?: string;
  messageIds?: Array<string>;
  groupId?: GroupId;
  to?: string;
  from?: string;
  type?: MessageType;
  statusCode?: string;
};

type GetMessagesRequestWithoutDate = BaseGetMessagesRequest & {
  dateType?: never;
  startDate?: never;
  endDate?: never;
};

type GetMessagesRequestWithStartDate = BaseGetMessagesRequest & {
  dateType?: DateType;
  startDate: string | Date;
  endDate?: string | Date;
};

type GetMessagesRequestWithEndDate = BaseGetMessagesRequest & {
  dateType?: DateType;
  startDate?: string | Date;
  endDate: string | Date;
};

export type GetMessagesRequest =
  | GetMessagesRequestWithoutDate
  | GetMessagesRequestWithStartDate
  | GetMessagesRequestWithEndDate;

export class GetMessagesFinalizeRequest {
  startKey?: string;
  limit?: number;
  dateType?: DateType = 'CREATED';
  messageId?: string;
  messageIds?: Array<string>;
  groupId?: GroupId;
  to?: string;
  from?: string;
  type?: MessageType;
  statusCode?: string;
  startDate?: string;
  endDate?: string;

  constructor(parameter: GetMessagesRequest) {
    this.startKey = parameter.startKey;
    this.limit = parameter.limit;
    if (parameter.dateType) {
      this.dateType = parameter.dateType;
    }
    if (parameter.startDate) {
      this.startDate = formatWithTransfer(parameter.startDate);
    }
    if (parameter.endDate) {
      this.endDate = formatWithTransfer(parameter.endDate);
    }
    this.messageId = parameter.messageId;
    this.messageIds = parameter.messageIds;
    this.groupId = parameter.groupId;
    this.to = parameter.to;
    this.from = parameter.from;
    this.type = parameter.type;
    this.statusCode = parameter.statusCode;
  }
}
