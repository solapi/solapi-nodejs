import {Schema} from 'effect';

export const countSchema = Schema.Struct({
  total: Schema.Number,
  sentTotal: Schema.Number,
  sentFailed: Schema.Number,
  sentSuccess: Schema.Number,
  sentPending: Schema.Number,
  sentReplacement: Schema.Number,
  refund: Schema.Number,
  registeredFailed: Schema.Number,
  registeredSuccess: Schema.Number,
});
export type Count = Schema.Schema.Type<typeof countSchema>;

const countryChargeStatusSchema = Schema.Record({
  key: Schema.String,
  value: Schema.Number,
});

export const countForChargeSchema = Schema.Struct({
  sms: countryChargeStatusSchema,
  lms: countryChargeStatusSchema,
  mms: countryChargeStatusSchema,
  ata: countryChargeStatusSchema,
  cta: countryChargeStatusSchema,
  cti: countryChargeStatusSchema,
  nsa: countryChargeStatusSchema,
  rcs_sms: countryChargeStatusSchema,
  rcs_lms: countryChargeStatusSchema,
  rcs_mms: countryChargeStatusSchema,
  rcs_tpl: countryChargeStatusSchema,
});
export type CountForCharge = Schema.Schema.Type<typeof countForChargeSchema>;

export const commonCashResponseSchema = Schema.Struct({
  requested: Schema.Number,
  replacement: Schema.Number,
  refund: Schema.Number,
  sum: Schema.Number,
});
export type CommonCashResponse = Schema.Schema.Type<
  typeof commonCashResponseSchema
>;

export const messageTypeRecordSchema = Schema.Struct({
  sms: Schema.Number,
  lms: Schema.Number,
  mms: Schema.Number,
  ata: Schema.Number,
  cta: Schema.Number,
  cti: Schema.Number,
  nsa: Schema.Number,
  rcs_sms: Schema.Number,
  rcs_lms: Schema.Number,
  rcs_mms: Schema.Number,
  rcs_tpl: Schema.Number,
  rcs_itpl: Schema.optional(Schema.Number),
  rcs_ltpl: Schema.optional(Schema.Number),
  fax: Schema.optional(Schema.Number),
  voice: Schema.optional(Schema.Number),
  bms_text: Schema.optional(Schema.Number),
  bms_image: Schema.optional(Schema.Number),
  bms_wide: Schema.optional(Schema.Number),
  bms_wide_item_list: Schema.optional(Schema.Number),
  bms_carousel_feed: Schema.optional(Schema.Number),
  bms_premium_video: Schema.optional(Schema.Number),
  bms_commerce: Schema.optional(Schema.Number),
  bms_carousel_commerce: Schema.optional(Schema.Number),
  bms_free: Schema.optional(Schema.Number),
});
export type MessageTypeRecord = Schema.Schema.Type<
  typeof messageTypeRecordSchema
>;

export const appSchema = Schema.Struct({
  profit: messageTypeRecordSchema,
  appId: Schema.NullishOr(Schema.String),
});
export type App = Schema.Schema.Type<typeof appSchema>;

export const logSchema = Schema.Array(
  Schema.Record({key: Schema.String, value: Schema.Unknown}),
);
export type Log = Schema.Schema.Type<typeof logSchema>;

export const groupIdSchema = Schema.String;
export type GroupId = Schema.Schema.Type<typeof groupIdSchema>;

export const groupSchema = Schema.Struct({
  count: countSchema,
  balance: commonCashResponseSchema,
  point: commonCashResponseSchema,
  app: appSchema,
  sdkVersion: Schema.NullishOr(Schema.String),
  osPlatform: Schema.NullishOr(Schema.String),
  log: logSchema,
  status: Schema.String,
  scheduledDate: Schema.NullishOr(Schema.String),
  dateSent: Schema.NullishOr(Schema.String),
  dateCompleted: Schema.NullishOr(Schema.String),
  isRefunded: Schema.Boolean,
  groupId: groupIdSchema,
  accountId: Schema.String,
  countForCharge: countForChargeSchema,
  dateCreated: Schema.String,
  dateUpdated: Schema.String,
});
export type Group = Schema.Schema.Type<typeof groupSchema>;

export const handleKeySchema = Schema.String;
export type HandleKey = Schema.Schema.Type<typeof handleKeySchema>;

export const blackSchema = Schema.Struct({
  handleKey: handleKeySchema,
  type: Schema.Literal('DENIAL'),
  senderNumber: Schema.String,
  recipientNumber: Schema.String,
  dateCreated: Schema.String,
  dateUpdated: Schema.String,
});
export type Black = Schema.Schema.Type<typeof blackSchema>;

export const blockGroupSchema = Schema.Struct({
  blockGroupId: Schema.String,
  accountId: Schema.String,
  status: Schema.Literal('INACTIVE', 'ACTIVE'),
  name: Schema.NullishOr(Schema.String),
  useAll: Schema.Boolean,
  senderNumbers: Schema.Array(Schema.String),
  dateCreated: Schema.String,
  dateUpdated: Schema.String,
});
export type BlockGroup = Schema.Schema.Type<typeof blockGroupSchema>;

export const blockNumberSchema = Schema.Struct({
  blockNumberId: Schema.String,
  accountId: Schema.String,
  memo: Schema.String,
  phoneNumber: Schema.String,
  blockGroupIds: Schema.Array(Schema.String),
  dateCreated: Schema.String,
  dateUpdated: Schema.String,
});
export type BlockNumber = Schema.Schema.Type<typeof blockNumberSchema>;
