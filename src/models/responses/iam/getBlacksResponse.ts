import {blackSchema, handleKeySchema} from '@internal-types/commonTypes';
import {Schema} from 'effect';

export const getBlacksResponseSchema = Schema.Struct({
  startKey: Schema.NullishOr(Schema.String),
  limit: Schema.Number,
  nextKey: Schema.NullishOr(Schema.String),
  blackList: Schema.Record({key: handleKeySchema, value: blackSchema}),
});
export type GetBlacksResponse = Schema.Schema.Type<
  typeof getBlacksResponseSchema
>;
