import {blockGroupSchema} from '@internal-types/commonTypes';
import {Schema} from 'effect';

export const getBlockGroupsResponseSchema = Schema.Struct({
  startKey: Schema.NullishOr(Schema.String),
  limit: Schema.Number,
  nextKey: Schema.NullishOr(Schema.String),
  blockGroups: Schema.Array(blockGroupSchema),
});
export type GetBlockGroupsResponse = Schema.Schema.Type<
  typeof getBlockGroupsResponseSchema
>;
