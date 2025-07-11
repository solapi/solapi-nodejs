import {Schema} from 'effect';

export const voiceOptionSchema = Schema.Struct({
  voiceType: Schema.Literal('FEMALE', 'MALE'),
  headerMessage: Schema.optional(Schema.String),
  tailMessage: Schema.optional(Schema.String),
  replyRange: Schema.optional(Schema.Literal(1, 2, 3, 4, 5, 6, 7, 8, 9)),
  counselorNumber: Schema.optional(Schema.String),
});

export type VoiceOptionSchema = Schema.Schema.Type<typeof voiceOptionSchema>;
