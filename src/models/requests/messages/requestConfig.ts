import {z} from 'zod/v4';
import {formatWithTransfer} from '@lib/stringDateTrasnfer';

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
export const defaultAgentTypeSchema = z.object({
  sdkVersion: z.string().optional().default(sdkVersion),
  osPlatform: z.string().optional().default(osPlatform),
  appId: z.string().optional(),
});

// send 요청 시 사용되는 Config 스키마
export const sendRequestConfigSchema = z.object({
  scheduledDate: z
    .preprocess(
      val => {
        if (typeof val === 'string') {
          return formatWithTransfer(val);
        }
        return val;
      },
      z.union([z.string(), z.date()]),
    )
    .optional(),
  allowDuplicates: z.boolean().optional(),
  appId: z.string().optional(),
  showMessageList: z.boolean().optional(),
});

export type SendRequestConfigSchema = z.infer<typeof sendRequestConfigSchema>;

// 메시지 요청 시 공통으로 사용하는 기본 스키마
export const defaultMessageRequestSchema = z.object({
  allowDuplicates: z.boolean().optional().default(false),
  agent: defaultAgentTypeSchema.default({
    sdkVersion,
    osPlatform,
  }),
});
