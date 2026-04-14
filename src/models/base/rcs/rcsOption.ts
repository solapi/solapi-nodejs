import {Schema} from 'effect';
import {rcsButtonSchema} from './rcsButton';

export const additionalBodySchema = Schema.Struct({
  title: Schema.String,
  description: Schema.String,
  imaggeId: Schema.optional(Schema.String),
  buttons: Schema.optional(Schema.Array(rcsButtonSchema)),
});

export type AdditionalBody = Schema.Schema.Type<typeof additionalBodySchema>;

export const rcsOptionRequestSchema = Schema.Struct({
  brandId: Schema.String,
  templateId: Schema.optional(Schema.String),
  copyAllowed: Schema.optional(Schema.Boolean),
  variables: Schema.optional(
    Schema.Record({key: Schema.String, value: Schema.String}),
  ),
  mmsType: Schema.optional(
    Schema.Literal('M3', 'S3', 'M4', 'S4', 'M5', 'S5', 'M6', 'S6'),
  ),
  commercialType: Schema.optional(Schema.Boolean),
  disableSms: Schema.optional(Schema.Boolean),
  additionalBody: Schema.optional(additionalBodySchema),
  buttons: Schema.optional(Schema.Array(rcsButtonSchema)),
});

export const rcsOptionSchema = rcsOptionRequestSchema;

export type RcsOptionRequest = Schema.Schema.Type<
  typeof rcsOptionRequestSchema
>;
export type RcsOptionSchema = Schema.Schema.Type<typeof rcsOptionSchema>;
