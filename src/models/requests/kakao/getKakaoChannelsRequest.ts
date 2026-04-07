import {formatWithTransfer} from '@lib/stringDateTrasnfer';
import {Schema} from 'effect';
import {type DatePayloadType} from '../common/datePayload';

export const getKakaoChannelsRequestSchema = Schema.Struct({
  channelId: Schema.optional(Schema.String),
  searchId: Schema.optional(Schema.String),
  phoneNumber: Schema.optional(Schema.String),
  categoryCode: Schema.optional(Schema.String),
  startKey: Schema.optional(Schema.String),
  limit: Schema.optional(Schema.Number),
  isMine: Schema.optional(Schema.Boolean),
  startDate: Schema.optional(Schema.Union(Schema.String, Schema.DateFromSelf)),
  endDate: Schema.optional(Schema.Union(Schema.String, Schema.DateFromSelf)),
});
export type GetKakaoChannelsRequest = Schema.Schema.Type<
  typeof getKakaoChannelsRequestSchema
>;

export type GetKakaoChannelsFinalizedPayload = {
  channelId?: string;
  searchId?: string;
  phoneNumber?: string;
  categoryCode?: string;
  startKey?: string;
  limit?: number;
  isMine?: boolean;
  dateCreated?: DatePayloadType;
};

export function finalizeGetKakaoChannelsRequest(
  data?: GetKakaoChannelsRequest,
): GetKakaoChannelsFinalizedPayload {
  if (!data) return {};

  const payload: GetKakaoChannelsFinalizedPayload = {
    channelId: data.channelId,
    searchId: data.searchId,
    phoneNumber: data.phoneNumber,
    categoryCode: data.categoryCode,
    startKey: data.startKey,
    limit: data.limit,
    isMine: data.isMine,
  };

  if (data.startDate != null) {
    payload.dateCreated = Object.assign(payload.dateCreated ?? {}, {
      gte: formatWithTransfer(data.startDate),
    });
  }
  if (data.endDate != null) {
    payload.dateCreated = Object.assign(payload.dateCreated ?? {}, {
      lte: formatWithTransfer(data.endDate),
    });
  }

  return payload;
}
