import {blockNumberSchema} from '@internal-types/commonTypes';
import {Schema} from 'effect';

export const getBlockNumbersResponseSchema = Schema.Struct({
  startKey: Schema.NullishOr(Schema.String),
  limit: Schema.Number,
  nextKey: Schema.NullishOr(Schema.String),
  blockNumbers: Schema.Array(blockNumberSchema),
});
export type GetBlockNumbersResponse = Schema.Schema.Type<
  typeof getBlockNumbersResponseSchema
>;
