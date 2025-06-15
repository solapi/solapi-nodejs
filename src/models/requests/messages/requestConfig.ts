import {Schema} from 'effect';

// SDK 및 OS 정보
const osPlatform = `${process.platform} | ${process.version}`;
// NOTE: 라이브러리 배포 시 반드시 업데이트해야 합니다.
const sdkVersion = 'nodejs/5.5.0';

// Agent 정보 타입
export type DefaultAgentType = {
  sdkVersion: string;
  osPlatform: string;
  appId?: string;
};

// Agent 정보 Zod 스키마
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

// send 요청 시 사용되는 Config 스키마
export const sendRequestConfigSchema = Schema.Struct({
  scheduledDate: Schema.optional(Schema.Union(Schema.String, Schema.Date)),
  allowDuplicates: Schema.optional(Schema.Boolean),
  appId: Schema.optional(Schema.String),
  showMessageList: Schema.optional(Schema.Boolean),
});

export type SendRequestConfigSchema = Schema.Schema.Type<
  typeof sendRequestConfigSchema
>;

// 메시지 요청 시 공통으로 사용하는 기본 스키마
export const defaultMessageRequestSchema = Schema.Struct({
  allowDuplicates: Schema.optional(Schema.Boolean),
  agent: Schema.optional(defaultAgentTypeSchema),
});
