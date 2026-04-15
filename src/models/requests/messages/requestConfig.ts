import {safeFormatWithTransfer} from '@lib/schemaUtils';
import {Effect, ParseResult, Schema} from 'effect';
import pkg from '../../../../package.json';

export const osPlatform = `${process.platform} | ${process.version}`;
export const sdkVersion = `nodejs/${pkg.version}`;

export type DefaultAgentType = {
  sdkVersion: string;
  osPlatform: string;
  appId?: string;
};

export const defaultAgentTypeSchema = Schema.Struct({
  sdkVersion: Schema.optional(Schema.String).pipe(
    Schema.withDecodingDefault(() => sdkVersion),
    Schema.withConstructorDefault(() => sdkVersion),
  ),
  osPlatform: Schema.optional(Schema.String).pipe(
    Schema.withDecodingDefault(() => osPlatform),
    Schema.withConstructorDefault(() => osPlatform),
  ),
  appId: Schema.optional(Schema.String),
});

export const sendRequestConfigSchema = Schema.Struct({
  scheduledDate: Schema.optional(
    Schema.Union(Schema.DateFromSelf, Schema.DateFromString).pipe(
      Schema.transformOrFail(Schema.String, {
        decode: (fromA, _, ast) =>
          safeFormatWithTransfer(fromA).pipe(
            Effect.mapError(
              err => new ParseResult.Type(ast, fromA, err.message),
            ),
          ),
        encode: toI => ParseResult.succeed(new Date(toI)),
      }),
    ),
  ),
  allowDuplicates: Schema.optional(Schema.Boolean),
  appId: Schema.optional(Schema.String),
  showMessageList: Schema.optional(Schema.Boolean),
});

export type SendRequestConfigSchema = Schema.Schema.Type<
  typeof sendRequestConfigSchema
>;

export const defaultMessageRequestSchema = Schema.Struct({
  allowDuplicates: Schema.optional(Schema.Boolean),
  agent: Schema.optional(defaultAgentTypeSchema),
});
