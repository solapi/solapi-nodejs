import {formatWithTransfer} from '@lib/stringDateTrasnfer';
import {
  type KakaoAlimtalkTemplateStatus,
  kakaoAlimtalkTemplateStatusSchema,
} from '@models/base/kakao/kakaoAlimtalkTemplate';
import {Schema} from 'effect';
import {type DatePayloadType} from '../common/datePayload';

const alimtalkTemplatesNameTypeSchema = Schema.Union(
  Schema.String,
  Schema.Struct({
    eq: Schema.optional(Schema.String),
    ne: Schema.optional(Schema.String),
    like: Schema.optional(Schema.String),
  }),
);

export const getKakaoAlimtalkTemplatesRequestSchema = Schema.Struct({
  name: Schema.optional(alimtalkTemplatesNameTypeSchema),
  channelId: Schema.optional(Schema.String),
  templateId: Schema.optional(Schema.String),
  isHidden: Schema.optional(Schema.Boolean),
  status: Schema.optional(kakaoAlimtalkTemplateStatusSchema),
  startKey: Schema.optional(Schema.String),
  limit: Schema.optional(Schema.Number),
  startDate: Schema.optional(Schema.Union(Schema.String, Schema.DateFromSelf)),
  endDate: Schema.optional(Schema.Union(Schema.String, Schema.DateFromSelf)),
});
export type GetKakaoAlimtalkTemplatesRequest = Schema.Schema.Type<
  typeof getKakaoAlimtalkTemplatesRequestSchema
>;

export type GetKakaoAlimtalkTemplatesFinalizedPayload = {
  channelId?: string;
  isHidden?: boolean;
  limit?: number;
  name?: {eq?: string; ne?: string; like?: string} | string;
  startKey?: string;
  status?: KakaoAlimtalkTemplateStatus;
  templateId?: string;
  dateCreated?: DatePayloadType;
};

export function finalizeGetKakaoAlimtalkTemplatesRequest(
  data?: GetKakaoAlimtalkTemplatesRequest,
): GetKakaoAlimtalkTemplatesFinalizedPayload {
  if (!data) return {};

  const payload: GetKakaoAlimtalkTemplatesFinalizedPayload = {
    channelId: data.channelId,
    isHidden: data.isHidden,
    templateId: data.templateId,
    startKey: data.startKey,
    status: data.status,
    limit: data.limit,
  };

  if (data.name != null) {
    payload.name =
      typeof data.name === 'string' ? {like: data.name} : data.name;
  }

  if (data.startDate != null) {
    payload.dateCreated = Object.assign(payload.dateCreated ?? {}, {
      gte: formatWithTransfer(data.startDate),
    });
  }
  if (data.endDate != null) {
    payload.dateCreated = Object.assign(payload.dateCreated ?? {}, {
      lte: formatWithTransfer(data.endDate),
    });
  }

  return payload;
}
