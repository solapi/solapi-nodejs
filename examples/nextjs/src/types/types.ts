import {z} from 'zod';
import {variablesInputPattern} from '@/lib/formData';

export type ApiKeysType = {
  apiKey: string;
  apiSecret: string;
};

export const messageFormSchema = z.object({
  apiKey: z.string(),
  apiSecret: z.string(),
  from: z.string(),
  to: z.string(),
  text: z.string(),
});

export type MessageFormType = z.infer<typeof messageFormSchema>;

export const alimtalkFormSchema = z.record(z.string()).refine(
  data => {
    if (!data.from || data.from.trim() === '') return false;
    if (!data.to || data.to.trim() === '') return false;
    if (!data.channelId || data.channelId.trim() === '') return false;
    if (!data.templateId || data.templateId.trim() === '') return false;

    for (const [key, value] of Object.entries(data)) {
      if (variablesInputPattern.test(key)) {
        if (!value || value.trim() === '') {
          return false;
        }
      }
    }
    return true;
  },
  {
    message:
      '모든 필수 필드(발신번호, 수신번호, 채널, 알림톡 템플릿 필드 및 #{...} 필드)는 값을 입력해야 합니다.',
  },
);

export type AlimtalkFormType = z.infer<typeof alimtalkFormSchema>;
