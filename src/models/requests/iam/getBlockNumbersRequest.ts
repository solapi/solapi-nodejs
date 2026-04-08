import {Schema} from 'effect';
import {likeLiteralSchema} from '../common/datePayload';

export const getBlockNumbersRequestSchema = Schema.Struct({
  blockNumberId: Schema.optional(Schema.String),
  phoneNumber: Schema.optional(Schema.String),
  blockGroupId: Schema.optional(Schema.String),
  memo: Schema.optional(Schema.Union(Schema.String, likeLiteralSchema)),
  startKey: Schema.optional(Schema.String),
  limit: Schema.optional(Schema.Number),
});
export type GetBlockNumbersRequest = Schema.Schema.Type<
  typeof getBlockNumbersRequestSchema
>;

export type GetBlockNumbersFinalizedPayload = {
  blockNumberId?: string;
  phoneNumber?: string;
  blockGroupId?: string;
  memo?: {like: string} | string;
  startKey?: string;
  limit?: number;
};

export function finalizeGetBlockNumbersRequest(
  data?: GetBlockNumbersRequest,
): GetBlockNumbersFinalizedPayload {
  if (!data) return {};

  const payload: GetBlockNumbersFinalizedPayload = {
    blockNumberId: data.blockNumberId,
    phoneNumber: data.phoneNumber,
    blockGroupId: data.blockGroupId,
    startKey: data.startKey,
    limit: data.limit,
  };

  if (data.memo != null) {
    payload.memo =
      typeof data.memo === 'string' ? {like: data.memo} : data.memo;
  }

  return payload;
}
