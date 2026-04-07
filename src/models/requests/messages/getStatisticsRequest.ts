import {formatWithTransfer} from '@lib/stringDateTrasnfer';
import {Schema} from 'effect';

export const getStatisticsRequestSchema = Schema.Struct({
  masterAccountId: Schema.optional(Schema.String),
  startDate: Schema.optional(Schema.Union(Schema.String, Schema.DateFromSelf)),
  endDate: Schema.optional(Schema.Union(Schema.String, Schema.DateFromSelf)),
});
export type GetStatisticsRequest = Schema.Schema.Type<
  typeof getStatisticsRequestSchema
>;

export type GetStatisticsFinalizedPayload = {
  startDate?: string;
  endDate?: string;
  masterAccountId?: string;
};

export function finalizeGetStatisticsRequest(
  data?: GetStatisticsRequest,
): GetStatisticsFinalizedPayload {
  if (!data) return {};

  const payload: GetStatisticsFinalizedPayload = {
    masterAccountId: data.masterAccountId,
  };

  if (data.startDate != null) {
    payload.startDate = formatWithTransfer(data.startDate);
  }
  if (data.endDate != null) {
    payload.endDate = formatWithTransfer(data.endDate);
  }

  return payload;
}
