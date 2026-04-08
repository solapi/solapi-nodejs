import {Schema} from 'effect';
import {likeLiteralSchema} from '../common/datePayload';

export const getBlockGroupsRequestSchema = Schema.Struct({
  blockGroupId: Schema.optional(Schema.String),
  useAll: Schema.optional(Schema.Boolean),
  senderNumber: Schema.optional(Schema.String),
  name: Schema.optional(Schema.Union(Schema.String, likeLiteralSchema)),
  status: Schema.optional(Schema.Literal('ACTIVE', 'INACTIVE')),
  startKey: Schema.optional(Schema.String),
  limit: Schema.optional(Schema.Number),
});
export type GetBlockGroupsRequest = Schema.Schema.Type<
  typeof getBlockGroupsRequestSchema
>;

export type GetBlockGroupsFinalizedPayload = {
  blockGroupId?: string;
  useAll?: boolean;
  senderNumber?: string;
  name?: {like: string} | string;
  status?: 'ACTIVE' | 'INACTIVE';
  startKey?: string;
  limit?: number;
};

export function finalizeGetBlockGroupsRequest(
  data?: GetBlockGroupsRequest,
): GetBlockGroupsFinalizedPayload {
  if (!data) return {};

  const payload: GetBlockGroupsFinalizedPayload = {
    blockGroupId: data.blockGroupId,
    useAll: data.useAll,
    senderNumber: data.senderNumber,
    status: data.status,
    startKey: data.startKey,
    limit: data.limit,
  };

  if (data.name != null) {
    payload.name =
      typeof data.name === 'string' ? {like: data.name} : data.name;
  }

  return payload;
}
