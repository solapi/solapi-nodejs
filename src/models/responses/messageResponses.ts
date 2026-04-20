import {
  appSchema,
  commonCashResponseSchema,
  countForChargeSchema,
  countSchema,
  groupIdSchema,
  groupSchema,
  logSchema,
  partialMessageTypeRecordSchema,
} from '@internal-types/commonTypes';
import {Schema} from 'effect';
import {storedMessageSchema} from '../base/messages/storedMessage';

export const groupMessageResponseSchema = Schema.Struct({
  count: countSchema,
  countForCharge: countForChargeSchema,
  balance: commonCashResponseSchema,
  point: commonCashResponseSchema,
  app: appSchema,
  log: logSchema,
  status: Schema.String,
  allowDuplicates: Schema.Boolean,
  isRefunded: Schema.Boolean,
  accountId: Schema.String,
  masterAccountId: Schema.NullOr(Schema.String),
  apiVersion: Schema.String,
  groupId: Schema.String,
  price: Schema.Record({key: Schema.String, value: Schema.Unknown}),
  dateCreated: Schema.String,
  dateUpdated: Schema.String,
  scheduledDate: Schema.NullishOr(Schema.String),
  dateSent: Schema.NullishOr(Schema.String),
  dateCompleted: Schema.NullishOr(Schema.String),
});
export type GroupMessageResponse = Schema.Schema.Type<
  typeof groupMessageResponseSchema
>;

export const addMessageResultSchema = Schema.Struct({
  to: Schema.String,
  from: Schema.String,
  type: Schema.String,
  country: Schema.String,
  messageId: Schema.String,
  statusCode: Schema.String,
  statusMessage: Schema.String,
  accountId: Schema.String,
  customFields: Schema.optional(
    Schema.Record({key: Schema.String, value: Schema.String}),
  ),
});
export type AddMessageResult = Schema.Schema.Type<
  typeof addMessageResultSchema
>;

export const addMessageResponseSchema = Schema.Struct({
  errorCount: Schema.String,
  resultList: Schema.Array(addMessageResultSchema),
});
export type AddMessageResponse = Schema.Schema.Type<
  typeof addMessageResponseSchema
>;

export const getMessagesResponseSchema = Schema.Struct({
  startKey: Schema.optional(Schema.NullOr(Schema.String)),
  nextKey: Schema.optional(Schema.NullOr(Schema.String)),
  limit: Schema.Number,
  messageList: Schema.Record({key: Schema.String, value: storedMessageSchema}),
});
export type GetMessagesResponse = Schema.Schema.Type<
  typeof getMessagesResponseSchema
>;

export const removeGroupMessagesResponseSchema = Schema.Struct({
  groupId: groupIdSchema,
  errorCount: Schema.Number,
  resultList: Schema.Array(
    Schema.Struct({
      messageId: Schema.String,
      resultCode: Schema.String,
    }),
  ),
});
export type RemoveGroupMessagesResponse = Schema.Schema.Type<
  typeof removeGroupMessagesResponseSchema
>;

export const getGroupsResponseSchema = Schema.Struct({
  startKey: Schema.NullishOr(Schema.String),
  limit: Schema.Number,
  nextKey: Schema.NullishOr(Schema.String),
  groupList: Schema.Record({key: groupIdSchema, value: groupSchema}),
});
export type GetGroupsResponse = Schema.Schema.Type<
  typeof getGroupsResponseSchema
>;

const statisticsPeriodResultSchema = Schema.Struct({
  total: Schema.Number,
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

const refundSchema = Schema.Struct({
  balance: Schema.Number,
  point: Schema.Number,
  deposit: Schema.optional(Schema.Number),
});

const dayPeriodSchema = Schema.Struct({
  _id: Schema.String,
  month: Schema.String,
  date: Schema.optional(Schema.String),
  balance: Schema.Number,
  point: Schema.Number,
  deposit: Schema.optional(Schema.Number),
  statusCode: Schema.Record({
    key: Schema.String,
    value: partialMessageTypeRecordSchema,
  }),
  refund: refundSchema,
  total: statisticsPeriodResultSchema,
  successed: statisticsPeriodResultSchema,
  failed: statisticsPeriodResultSchema,
});

const monthPeriodRefundSchema = Schema.Struct({
  balance: Schema.Number,
  balanceAvg: Schema.Number,
  point: Schema.Number,
  pointAvg: Schema.Number,
  deposit: Schema.optional(Schema.Number),
  depositAvg: Schema.optional(Schema.Number),
});

const monthPeriodSchema = Schema.Struct({
  date: Schema.String,
  balance: Schema.Number,
  balanceAvg: Schema.Number,
  point: Schema.Number,
  pointAvg: Schema.Number,
  deposit: Schema.optional(Schema.Number),
  depositAvg: Schema.optional(Schema.Number),
  dayPeriod: Schema.Array(dayPeriodSchema),
  refund: Schema.optional(monthPeriodRefundSchema),
  total: statisticsPeriodResultSchema,
  successed: statisticsPeriodResultSchema,
  failed: statisticsPeriodResultSchema,
});

export const getStatisticsResponseSchema = Schema.Struct({
  balance: Schema.Number,
  point: Schema.Number,
  deposit: Schema.optional(Schema.Number),
  monthlyBalanceAvg: Schema.Number,
  monthlyPointAvg: Schema.Number,
  monthlyDepositAvg: Schema.optional(Schema.Number),
  monthPeriod: Schema.Array(monthPeriodSchema),
  total: statisticsPeriodResultSchema,
  successed: statisticsPeriodResultSchema,
  failed: statisticsPeriodResultSchema,
  dailyBalanceAvg: Schema.optional(Schema.Number),
  dailyPointAvg: Schema.optional(Schema.Number),
  dailyTotalCountAvg: Schema.optional(Schema.Number),
  dailyFailedCountAvg: Schema.optional(Schema.Number),
  dailySuccessedCountAvg: Schema.optional(Schema.Number),
});
export type GetStatisticsResponse = Schema.Schema.Type<
  typeof getStatisticsResponseSchema
>;

const lowBalanceAlertSchema = Schema.Struct({
  notificationBalance: Schema.String,
  currentBalance: Schema.String,
  balances: Schema.Array(Schema.Number),
  channels: Schema.Array(Schema.String),
  enabled: Schema.Boolean,
});
export type LowBalanceAlert = Schema.Schema.Type<typeof lowBalanceAlertSchema>;

export const getBalanceResponseSchema = Schema.Struct({
  lowBalanceAlert: Schema.optional(lowBalanceAlertSchema),
  point: Schema.Number,
  minimumCash: Schema.optional(Schema.Number),
  rechargeTo: Schema.optional(Schema.Number),
  rechargeTryCount: Schema.optional(Schema.Number),
  autoRecharge: Schema.optional(Schema.Number),
  accountId: Schema.optional(Schema.String),
  balance: Schema.Number,
  deposit: Schema.optional(Schema.Number),
  balanceOnly: Schema.optional(Schema.Number),
});
export type GetBalanceResponse = Schema.Schema.Type<
  typeof getBalanceResponseSchema
>;

export const fileUploadResponseSchema = Schema.Struct({
  fileId: Schema.String,
  type: Schema.String,
  link: Schema.NullishOr(Schema.String),
});
export type FileUploadResponse = Schema.Schema.Type<
  typeof fileUploadResponseSchema
>;

export const requestKakaoChannelTokenResponseSchema = Schema.Struct({
  success: Schema.Boolean,
});
export type RequestKakaoChannelTokenResponse = Schema.Schema.Type<
  typeof requestKakaoChannelTokenResponseSchema
>;

export const createKakaoChannelResponseSchema = Schema.Struct({
  accountId: Schema.String,
  phoneNumber: Schema.String,
  searchId: Schema.String,
  dateCreated: Schema.String,
  dateUpdated: Schema.String,
  channelId: Schema.String,
});
export type CreateKakaoChannelResponse = Schema.Schema.Type<
  typeof createKakaoChannelResponseSchema
>;
