import {formatWithTransfer} from '@lib/stringDateTrasnfer';
import {Schema} from 'effect';
import {type DatePayloadType} from '../common/datePayload';

export const getBlacksRequestSchema = Schema.Struct({
  senderNumber: Schema.optional(Schema.String),
  startKey: Schema.optional(Schema.String),
  limit: Schema.optional(Schema.Number),
  startDate: Schema.optional(Schema.Union(Schema.String, Schema.DateFromSelf)),
  endDate: Schema.optional(Schema.Union(Schema.String, Schema.DateFromSelf)),
});
export type GetBlacksRequest = Schema.Schema.Type<
  typeof getBlacksRequestSchema
>;

export type GetBlacksFinalizedPayload = {
  type: 'DENIAL';
  senderNumber?: string;
  startKey?: string;
  limit?: number;
  dateCreated?: DatePayloadType;
};

export function finalizeGetBlacksRequest(
  data?: GetBlacksRequest,
): GetBlacksFinalizedPayload {
  if (!data) return {type: 'DENIAL'};

  const payload: GetBlacksFinalizedPayload = {type: 'DENIAL'};
  payload.senderNumber = data.senderNumber;
  payload.startKey = data.startKey;
  payload.limit = data.limit;

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
