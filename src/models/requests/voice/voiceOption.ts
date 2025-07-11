import {Schema} from 'effect';

export const voiceOptionSchema = Schema.Struct({
  voiceType: Schema.Literal('FEMALE', 'MALE').pipe(
    Schema.optionalWith({default: () => 'FEMALE' as const}),
  ),
  headerMessage: Schema.optional(Schema.String),
  tailMessage: Schema.optional(Schema.String),
  replyRate: Schema.optional(Schema.Literal(1, 2, 3)),
  counselorNumber: Schema.optional(Schema.String),
});

export type VoiceOptionSchema = Schema.Schema.Type<typeof voiceOptionSchema>;
