import {z} from 'zod/v4';

// 네이버 스마트 알림 naverOptions 버튼 스키마
const naverOptionButtonSchema = z.object({
  buttonName: z.string().describe('버튼 이름'),
  buttonType: z.string().describe('버튼 타입'),
  linkMo: z.string().optional().describe('모바일 링크'),
  linkPc: z.string().optional().describe('웹 링크'),
  linkAnd: z.string().optional().describe('안드로이드 앱 링크'),
  linkIos: z.string().optional().describe('아이폰 앱 링크'),
});

// naverOptions 최상위 스키마
export const naverOptionSchema = z.object({
  talkId: z.string().describe('네이버 톡톡 연동 아이디'),
  templateId: z.string().describe('네이버 스마트 알림 템플릿 아이디'),
  disableSms: z.boolean().optional().describe('대체발송여부'),
  variables: z
    .record(z.string(), z.string())
    .optional()
    .describe('템플릿 변수 치환 값'),
  buttons: z
    .array(naverOptionButtonSchema)
    .optional()
    .describe('네이버 스마트 알림 템플릿 버튼 목록'),
});

export type NaverOptionSchema = z.infer<typeof naverOptionSchema>;
