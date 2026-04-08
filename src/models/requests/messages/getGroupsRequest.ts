import {formatWithTransfer} from '@lib/stringDateTrasnfer';
import {Schema} from 'effect';

export const getGroupsRequestSchema = Schema.Struct({
  groupId: Schema.optional(Schema.String),
  startKey: Schema.optional(Schema.String),
  limit: Schema.optional(Schema.Number),
  startDate: Schema.optional(Schema.Union(Schema.String, Schema.DateFromSelf)),
  endDate: Schema.optional(Schema.Union(Schema.String, Schema.DateFromSelf)),
});
export type GetGroupsRequest = Schema.Schema.Type<
  typeof getGroupsRequestSchema
>;

export type GetGroupsFinalizedPayload = {
  criteria?: string;
  cond?: string;
  value?: string;
  startKey?: string;
  limit?: number;
  startDate?: string;
  endDate?: string;
};

export function finalizeGetGroupsRequest(
  data?: GetGroupsRequest,
): GetGroupsFinalizedPayload {
  if (!data) return {};

  const payload: GetGroupsFinalizedPayload = {
    startKey: data.startKey,
    limit: data.limit,
  };

  if (data.groupId) {
    payload.criteria = 'groupId';
    payload.cond = 'eq';
    payload.value = data.groupId;
  }
  if (data.startDate != null) {
    payload.startDate = formatWithTransfer(data.startDate);
  }
  if (data.endDate != null) {
    payload.endDate = formatWithTransfer(data.endDate);
  }

  return payload;
}
