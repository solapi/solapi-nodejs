import {Schema} from 'effect';

export const createKakaoChannelTokenRequestSchema = Schema.Struct({
  searchId: Schema.String,
  phoneNumber: Schema.String,
});
export type CreateKakaoChannelTokenRequest = Schema.Schema.Type<
  typeof createKakaoChannelTokenRequestSchema
>;

export const createKakaoChannelRequestSchema = Schema.Struct({
  searchId: Schema.String,
  phoneNumber: Schema.String,
  categoryCode: Schema.String,
  token: Schema.String,
});
export type CreateKakaoChannelRequest = Schema.Schema.Type<
  typeof createKakaoChannelRequestSchema
>;
